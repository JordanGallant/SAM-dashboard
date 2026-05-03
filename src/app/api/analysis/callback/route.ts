import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { DealAnalysis } from "@/lib/types/analysis"
import { reshapeFlatToDealAnalysis } from "@/lib/n8n-reshape"

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.ANALYSIS_CALLBACK_TOKEN
    if (!expectedToken) {
      return NextResponse.json({ error: "Callback not configured" }, { status: 500 })
    }
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const {
      analysis_id,
      job_id,
      status,
      result,
      flat_result,
      error,
      kind,
      fund_fit,
      missing_info,
      exit_potential,
    } = body
    const analysisId = analysis_id || job_id

    if (!analysisId) {
      return NextResponse.json({ error: "analysis_id or job_id required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Fund-fit callback (separate flow). Persists to fund_fit_result column AND, if the
    // main analysis row already has result, patches result.fundFit so the UI sees it
    // without waiting for a re-fetch.
    if (kind === "fund-fit") {
      if (!fund_fit || typeof fund_fit !== "object") {
        return NextResponse.json({ error: "fund_fit object required" }, { status: 400 })
      }
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      const patch: Record<string, unknown> = { fund_fit_result: fund_fit }
      if (existing.result && typeof existing.result === "object") {
        patch.result = { ...(existing.result as Record<string, unknown>), fundFit: fund_fit }
      }
      const { error: updErr } = await supabase
        .from("analyses")
        .update(patch)
        .eq("id", analysisId)
      if (updErr) {
        console.error("Fund-fit callback update error:", updErr)
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }
      return NextResponse.json({ received: true, kind: "fund-fit" })
    }

    // Missing-info callback (Flow 11). Persists to missing_info_result and patches
    // result.missingInfo so the existing UI sees it without read changes.
    if (kind === "missing-info") {
      if (!missing_info || typeof missing_info !== "object") {
        return NextResponse.json({ error: "missing_info object required" }, { status: 400 })
      }
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      const patch: Record<string, unknown> = { missing_info_result: missing_info }
      if (existing.result && typeof existing.result === "object") {
        patch.result = { ...(existing.result as Record<string, unknown>), missingInfo: missing_info }
      }
      const { error: updErr } = await supabase
        .from("analyses")
        .update(patch)
        .eq("id", analysisId)
      if (updErr) {
        console.error("Missing-info callback update error:", updErr)
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }
      return NextResponse.json({ received: true, kind: "missing-info" })
    }

    // Exit Potential callback (Flow 12). Same merge pattern: persist to the
    // exit_potential_result column AND patch result.exitPotential so the UI
    // sees it instantly via Realtime.
    if (kind === "exit-potential") {
      if (!exit_potential || typeof exit_potential !== "object") {
        return NextResponse.json({ error: "exit_potential object required" }, { status: 400 })
      }
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      const patch: Record<string, unknown> = { exit_potential_result: exit_potential }
      if (existing.result && typeof existing.result === "object") {
        patch.result = {
          ...(existing.result as Record<string, unknown>),
          exitPotential: exit_potential,
        }
      }
      const { error: updErr } = await supabase
        .from("analyses")
        .update(patch)
        .eq("id", analysisId)
      if (updErr) {
        console.error("Exit-potential callback update error:", updErr)
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }
      return NextResponse.json({ received: true, kind: "exit-potential" })
    }

    if (status === "failed" || error) {
      await supabase
        .from("analyses")
        .update({
          status: "failed",
          error: error || "n8n reported failure",
          completed_at: new Date().toISOString(),
        })
        .eq("id", analysisId)
      return NextResponse.json({ received: true })
    }

    if (status !== "completed") {
      return NextResponse.json(
        { error: "status must be 'completed' or 'failed'" },
        { status: 400 }
      )
    }

    // Resolve final DealAnalysis: prefer pre-shaped `result`, else reshape `flat_result`
    let finalResult: DealAnalysis | null = null
    if (result && typeof result === "object") {
      finalResult = result as DealAnalysis
    } else if (flat_result && typeof flat_result === "object") {
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, deal_id, created_at")
        .eq("id", analysisId)
        .single()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      finalResult = reshapeFlatToDealAnalysis(flat_result as Record<string, string | undefined>, {
        dealId: existing.deal_id,
        analysisId: existing.id,
        createdAt: existing.created_at,
      })
    } else {
      return NextResponse.json(
        { error: "either 'result' (DealAnalysis) or 'flat_result' (n8n flat object) must be provided" },
        { status: 400 }
      )
    }

    const { error: updateErr } = await supabase
      .from("analyses")
      .update({
        status: "completed",
        result: finalResult,
        completed_at: new Date().toISOString(),
      })
      .eq("id", analysisId)

    if (updateErr) {
      console.error("Callback update error:", updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // Fund-fit and missing-info are triggered from n8n Flow 0 (Trigger Fund Fit
    // and Trigger Missing Info nodes that run after Trigger Report). They post
    // back here with `kind: "fund-fit"` / `kind: "missing-info"` payloads above.

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
