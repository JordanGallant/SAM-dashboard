import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { extractText, getDocumentProxy } from "unpdf"
import OpenAI from "openai"
import { DEAL_STAGES } from "@/lib/constants"
import type { DealStage } from "@/lib/types/deal"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const MAX_TEXT_CHARS = 8000

async function extractFirstPagesText(buffer: Buffer): Promise<string> {
  // unpdf is pure-JS — runs on Vercel serverless without binaries.
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: false })
  const pages = Array.isArray(text) ? text : [String(text)]
  return pages.slice(0, 3).join("\n").slice(0, MAX_TEXT_CHARS)
}

async function extractDealMeta(deckText: string): Promise<{ companyName: string; stage: DealStage }> {
  const key = process.env.AZURE_AI_KEY
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const model = process.env.AZURE_AI_MODEL || "gpt-4o"
  if (!key || !endpoint) throw new Error("Azure AI not configured")

  const client = new OpenAI({ baseURL: endpoint, apiKey: key })
  const completion = await client.chat.completions.create({
    model,
    temperature: 0,
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Extract pitch-deck metadata. Return JSON: {\"companyName\": string, \"stage\": one of [\"Pre-seed\",\"Seed\",\"Series A\",\"Series B+\"]}. " +
          "Pick the stage that best matches the deck's funding ask, traction, and language. " +
          "If the deck doesn't say, infer from cues: pre-revenue/MVP=Pre-seed, early revenue/<1M ARR=Seed, " +
          "$1-10M ARR=Series A, $10M+ ARR=Series B+. Use the company's actual brand name, not 'pitch deck'.",
      },
      { role: "user", content: deckText },
    ],
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error("LLM returned empty response")

  let parsed: { companyName?: unknown; stage?: unknown }
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("LLM returned invalid JSON")
  }

  const companyName = typeof parsed.companyName === "string" ? parsed.companyName.trim() : ""
  const stage = typeof parsed.stage === "string" ? parsed.stage.trim() : ""

  if (!companyName) throw new Error("Could not extract company name from deck")

  const validStage: DealStage = (DEAL_STAGES as readonly string[]).includes(stage)
    ? (stage as DealStage)
    : "Seed"

  return { companyName, stage: validStage }
}

export async function POST(request: Request) {
  try {
    // Burst / brute-force protection. Applied BEFORE auth so unauthenticated
    // floods (token brute force, scrapers) are throttled at the network edge
    // of the app, not after we've done the auth round-trip.
    const ip = getClientIp(request.headers)
    const rl = checkRateLimit(`upload:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rl.retryAfter}s.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfter),
            "X-RateLimit-Limit": String(rl.limit),
            "X-RateLimit-Window": "60",
          },
        }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const storagePath = typeof body?.storagePath === "string" ? body.storagePath : ""
    const filename = typeof body?.filename === "string" ? body.filename : ""
    const sizeBytes = typeof body?.size === "number" ? body.size : 0

    if (!storagePath || !filename) {
      return NextResponse.json(
        { error: "storagePath and filename are required" },
        { status: 400 }
      )
    }

    // Defence in depth: ensure the path the client gave us actually belongs to this user.
    if (!storagePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Pull the PDF down from Supabase Storage. The body never came through our function,
    // so we don't hit Vercel's serverless body size limit.
    const { data: blob, error: dlErr } = await supabase.storage
      .from("pitch-decks")
      .download(storagePath)

    if (dlErr || !blob) {
      return NextResponse.json(
        { error: dlErr?.message || "Could not read uploaded file" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await blob.arrayBuffer())

    let deckText: string
    try {
      deckText = await extractFirstPagesText(buffer)
    } catch (err) {
      console.error("PDF extract failed", err)
      return NextResponse.json(
        { error: "Failed to read PDF. The file may be corrupted or password-protected." },
        { status: 400 }
      )
    }

    if (deckText.trim().length < 30) {
      return NextResponse.json(
        { error: "Could not read text from this PDF. It may be image-only or scanned — try a text-based deck." },
        { status: 400 }
      )
    }

    let meta: { companyName: string; stage: DealStage }
    try {
      meta = await extractDealMeta(deckText)
    } catch (err) {
      console.error("extractDealMeta failed", err)
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Failed to extract deck metadata" },
        { status: 502 }
      )
    }

    const { data: fund } = await supabase
      .from("funds")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    const { data: deal, error: dealErr } = await supabase
      .from("deals")
      .insert({
        user_id: user.id,
        fund_id: fund?.id ?? null,
        company_name: meta.companyName,
        stage: meta.stage,
        status: "New",
        source: "pitch deck upload",
        tags: [],
      })
      .select()
      .single()

    if (dealErr || !deal) {
      // Clean up the orphaned upload — no deal row to attach it to.
      await supabase.storage.from("pitch-decks").remove([storagePath]).catch(() => {})
      return NextResponse.json(
        { error: dealErr?.message || "Failed to create deal" },
        { status: 500 }
      )
    }

    const { error: docErr } = await supabase.from("documents").insert({
      deal_id: deal.id,
      filename,
      doc_type: "pitch-deck",
      storage_path: storagePath,
      size_bytes: sizeBytes || buffer.length,
    })

    if (docErr) {
      console.error("documents insert failed", docErr)
      // Non-fatal: deal exists, file uploaded. User can re-trigger from deal page.
    }

    // Demo accounts skip the n8n pipeline entirely — they still get a deal row + file in storage,
    // but no LLM spend and (critically) no Flow 8 report email that would loop back into the
    // Gmail inbox n8n is polling.
    const demoEmails = (process.env.DEMO_EMAILS || "admin@sam.com")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isDemo = user.email ? demoEmails.includes(user.email.toLowerCase()) : false

    // Trigger analysis. Reuse the same shape as /api/analysis/trigger so n8n side is unchanged.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://test.jgsleepy.xyz"
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const n8nToken = process.env.N8N_WEBHOOK_TOKEN
    const callbackToken = process.env.ANALYSIS_CALLBACK_TOKEN

    if (!isDemo && n8nWebhookUrl && n8nToken && callbackToken) {
      const { data: analysis } = await supabase
        .from("analyses")
        .insert({ deal_id: deal.id, status: "pending" })
        .select()
        .single()

      if (analysis) {
        const { data: signed } = await supabase.storage
          .from("pitch-decks")
          .createSignedUrl(storagePath, 60 * 60)

        const signedUrl = signed?.signedUrl
        if (signedUrl) {
          try {
            const fundProfileForN8n = fund
              ? {
                  name: fund.name,
                  thesis: fund.thesis,
                  stageFocus: fund.stage_focus,
                  sectorFocus: fund.sector_focus,
                  geoFocus: fund.geo_focus,
                  ticketSizeMin: fund.ticket_size_min,
                  ticketSizeMax: fund.ticket_size_max,
                  additional: fund.additional,
                  onePagerText: fund.one_pager_text,
                  onePagerFilename: fund.one_pager_filename,
                }
              : null
            const n8nResp = await fetch(n8nWebhookUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${n8nToken}`,
              },
              body: JSON.stringify({
                job_id: analysis.id,
                deal_id: deal.id,
                company_name: deal.company_name,
                company_stage: deal.stage,
                sender: user.email,
                documents: [{ type: "pitch-deck", filename, url: signedUrl }],
                pdf_url: signedUrl,
                filename,
                callback_url: `${appUrl}/api/analysis/callback`,
                callback_token: callbackToken,
                fund_profile: fundProfileForN8n,
              }),
            })

            if (n8nResp.ok) {
              await supabase
                .from("analyses")
                .update({ status: "processing" })
                .eq("id", analysis.id)
            } else {
              const errText = await n8nResp.text().catch(() => "Unknown error")
              await supabase
                .from("analyses")
                .update({ status: "failed", error: `n8n returned ${n8nResp.status}: ${errText}` })
                .eq("id", analysis.id)
            }
          } catch (err) {
            await supabase
              .from("analyses")
              .update({
                status: "failed",
                error: err instanceof Error ? err.message : "n8n trigger failed",
              })
              .eq("id", analysis.id)
          }
        }
      }
    }

    return NextResponse.json({
      dealId: deal.id,
      companyName: deal.company_name,
      stage: deal.stage,
    })
  } catch (err) {
    console.error("Upload deck finalize error", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Finalize failed" },
      { status: 500 }
    )
  }
}
