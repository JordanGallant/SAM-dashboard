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
    const { analysis_id, job_id, status, result, flat_result, error } = body
    const analysisId = analysis_id || job_id

    if (!analysisId) {
      return NextResponse.json({ error: "analysis_id or job_id required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

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

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
