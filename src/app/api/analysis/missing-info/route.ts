// On-demand trigger for Sam - Flow 11 (Jordan) Missing Info. Lets the analyst
// regenerate the missing-info block for an existing deal without re-running
// the full pipeline. Posts the deal's persisted DealAnalysis to Flow 11; the
// flow's callback writes back to analyses.missing_info_result and patches the
// embedded result.missingInfo.

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { DealAnalysis } from "@/lib/types/analysis"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers)
    const rl = checkRateLimit(`missing-info:${ip}`, { limit: 10, windowMs: 60_000 })
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
    const { dealId, analysisId: bodyAnalysisId } = await request.json()
    if (!dealId && !bodyAnalysisId) {
      return NextResponse.json(
        { error: "dealId or analysisId required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the latest completed analysis for this deal (or use the explicit id).
    let analysisRow: { id: string; deal_id: string; result: DealAnalysis | null } | null = null
    if (bodyAnalysisId) {
      const { data } = await supabase
        .from("analyses")
        .select("id, deal_id, result")
        .eq("id", bodyAnalysisId)
        .maybeSingle()
      analysisRow = data
    } else {
      const { data } = await supabase
        .from("analyses")
        .select("id, deal_id, result")
        .eq("deal_id", dealId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      analysisRow = data
    }
    if (!analysisRow || !analysisRow.result) {
      return NextResponse.json(
        { error: "No completed analysis found for this deal" },
        { status: 404 }
      )
    }

    // Confirm the deal belongs to this user (RLS-style check).
    const { data: deal } = await supabase
      .from("deals")
      .select("user_id")
      .eq("id", analysisRow.deal_id)
      .maybeSingle()
    if (!deal || deal.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://test.jgsleepy.xyz"
    const n8nToken = process.env.N8N_WEBHOOK_TOKEN
    const callbackToken = process.env.ANALYSIS_CALLBACK_TOKEN
    const missingInfoWebhookUrl =
      process.env.N8N_MISSING_INFO_WEBHOOK_URL ||
      "https://n8n.green-whale.nl/webhook/analyze-missing-info"
    if (!n8nToken || !callbackToken) {
      return NextResponse.json({ error: "n8n not configured" }, { status: 500 })
    }

    const resp = await fetch(missingInfoWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${n8nToken}`,
      },
      body: JSON.stringify({
        job_id: analysisRow.id,
        deal_id: analysisRow.deal_id,
        deal_analysis: analysisRow.result,
        callback_url: `${appUrl}/api/analysis/callback`,
        callback_token: callbackToken,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text().catch(() => "Unknown error")
      return NextResponse.json(
        { error: `n8n returned ${resp.status}`, details: text },
        { status: 502 }
      )
    }

    return NextResponse.json({
      status: "queued",
      analysisId: analysisRow.id,
      message: "Missing-info generation queued. Result writes back via callback.",
    })
  } catch (err) {
    console.error("Missing-info trigger error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
