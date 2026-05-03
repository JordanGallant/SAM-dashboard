import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers)
    const rl = checkRateLimit(`trigger:${ip}`, { limit: 10, windowMs: 60_000 })
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

    const { dealId } = await request.json()

    if (!dealId) {
      return NextResponse.json({ error: "dealId is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Demo accounts must not fire n8n — same loop-prevention logic as /api/upload-deck.
    const demoEmails = (process.env.DEMO_EMAILS || "admin@sam.com")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    if (user.email && demoEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json(
        { error: "Demo accounts can't run real analyses." },
        { status: 403 }
      )
    }

    const { data: deal, error: dealErr } = await supabase
      .from("deals")
      .select("id, company_name, stage, user_id")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single()

    if (dealErr || !deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Idempotency: if an analysis is already in flight for this deal, return that one
    // instead of firing another (avoids duplicate n8n runs / wasted LLM spend).
    const { data: inFlight } = await supabase
      .from("analyses")
      .select("id, status")
      .eq("deal_id", dealId)
      .in("status", ["pending", "processing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (inFlight) {
      return NextResponse.json({
        status: inFlight.status,
        analysisId: inFlight.id,
        message: "Analysis already in progress for this deal",
      })
    }

    const { data: documents } = await supabase
      .from("documents")
      .select("id, filename, doc_type, storage_path")
      .eq("deal_id", dealId)

    if (!documents || documents.length === 0) {
      return NextResponse.json({ error: "No documents to analyze" }, { status: 400 })
    }

    const signedDocs = await Promise.all(
      documents.map(async (doc) => {
        const { data: signed, error: signErr } = await supabase.storage
          .from("pitch-decks")
          .createSignedUrl(doc.storage_path, 60 * 60)

        if (signErr || !signed?.signedUrl) {
          throw new Error(`Failed to sign URL for ${doc.filename}`)
        }

        return {
          type: doc.doc_type,
          filename: doc.filename,
          url: signed.signedUrl,
        }
      })
    )

    const { data: analysis, error: analysisErr } = await supabase
      .from("analyses")
      .insert({
        deal_id: dealId,
        status: "pending",
      })
      .select()
      .single()

    if (analysisErr || !analysis) {
      return NextResponse.json({ error: "Failed to create analysis record" }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://test.jgsleepy.xyz"
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const n8nToken = process.env.N8N_WEBHOOK_TOKEN
    const callbackToken = process.env.ANALYSIS_CALLBACK_TOKEN

    if (!n8nWebhookUrl || !n8nToken || !callbackToken) {
      await supabase
        .from("analyses")
        .update({ status: "failed", error: "n8n not configured" })
        .eq("id", analysis.id)
      return NextResponse.json({ error: "n8n not configured" }, { status: 500 })
    }

    const { data: fund } = await supabase
      .from("funds")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
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
    const n8nPayload = {
      job_id: analysis.id,
      deal_id: dealId,
      company_name: deal.company_name,
      company_stage: deal.stage,
      sender: user.email,
      documents: signedDocs,
      pdf_url: signedDocs[0]?.url,
      filename: signedDocs[0]?.filename,
      callback_url: `${appUrl}/api/analysis/callback`,
      callback_token: callbackToken,
      fund_profile: fundProfileForN8n,
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${n8nToken}`,
      },
      body: JSON.stringify(n8nPayload),
    })

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text().catch(() => "Unknown error")
      await supabase
        .from("analyses")
        .update({ status: "failed", error: `n8n returned ${n8nResponse.status}: ${errText}` })
        .eq("id", analysis.id)

      return NextResponse.json(
        { error: `n8n webhook failed (${n8nResponse.status})`, details: errText },
        { status: 502 }
      )
    }

    await supabase
      .from("analyses")
      .update({ status: "processing" })
      .eq("id", analysis.id)

    return NextResponse.json({
      status: "queued",
      analysisId: analysis.id,
      message: "Analysis triggered. Results in ~30-45 minutes.",
    })
  } catch (error) {
    console.error("Trigger error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
