import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exec as execCb } from "node:child_process"
import { promisify } from "node:util"
import { writeFile, unlink, mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import OpenAI from "openai"
import { DEAL_STAGES } from "@/lib/constants"
import type { DealStage } from "@/lib/types/deal"

const exec = promisify(execCb)
const MAX_BYTES = 50 * 1024 * 1024
const MAX_TEXT_CHARS = 8000

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
}

async function extractFirstPagesText(pdfPath: string): Promise<string> {
  const { stdout } = await exec(`pdftotext -l 3 -layout ${JSON.stringify(pdfPath)} -`, {
    maxBuffer: 2 * 1024 * 1024,
  })
  return stdout.slice(0, MAX_TEXT_CHARS)
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
  let tempDir: string | null = null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 400 })
    }
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    tempDir = await mkdtemp(path.join(tmpdir(), "deck-"))
    const tempPath = path.join(tempDir, "deck.pdf")
    await writeFile(tempPath, buffer)

    let deckText: string
    try {
      deckText = await extractFirstPagesText(tempPath)
    } catch (err) {
      console.error("pdftotext failed", err)
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

    // Upload PDF to Storage. Path uses user id; deal id is added after deal insert.
    const { data: fund } = await supabase
      .from("funds")
      .select("id")
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
      return NextResponse.json(
        { error: dealErr?.message || "Failed to create deal" },
        { status: 500 }
      )
    }

    const storagePath = `${user.id}/${deal.id}/${Date.now()}_${safeName(file.name)}`
    const { error: uploadErr } = await supabase.storage
      .from("pitch-decks")
      .upload(storagePath, buffer, { contentType: "application/pdf", upsert: false })

    if (uploadErr) {
      await supabase.from("deals").delete().eq("id", deal.id)
      return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 })
    }

    const { error: docErr } = await supabase.from("documents").insert({
      deal_id: deal.id,
      filename: file.name,
      doc_type: "pitch-deck",
      storage_path: storagePath,
      size_bytes: file.size,
    })

    if (docErr) {
      console.error("documents insert failed", docErr)
      // Non-fatal: deal exists, file uploaded. User can re-trigger from deal page.
    }

    // Trigger analysis. Reuse the same shape as /api/analysis/trigger so n8n side is unchanged.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://test.jgsleepy.xyz"
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const n8nToken = process.env.N8N_WEBHOOK_TOKEN
    const callbackToken = process.env.ANALYSIS_CALLBACK_TOKEN

    if (n8nWebhookUrl && n8nToken && callbackToken) {
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
                documents: [{ type: "pitch-deck", filename: file.name, url: signedUrl }],
                pdf_url: signedUrl,
                filename: file.name,
                callback_url: `${appUrl}/api/analysis/callback`,
                callback_token: callbackToken,
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
    console.error("Upload deck error", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  } finally {
    if (tempDir) {
      try {
        await unlink(path.join(tempDir, "deck.pdf"))
      } catch {}
    }
  }
}
