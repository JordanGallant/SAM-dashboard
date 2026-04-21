import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { DealAnalysis } from "@/lib/types/analysis"

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  try {
    // Validate bearer token
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.ANALYSIS_CALLBACK_TOKEN
    if (!expectedToken) {
      return NextResponse.json({ error: "Callback not configured" }, { status: 500 })
    }
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { analysis_id, job_id, status, result, error } = body
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

    if (status !== "completed" || !result) {
      return NextResponse.json(
        { error: "status must be 'completed' and result must be provided" },
        { status: 400 }
      )
    }

    // Store the full DealAnalysis result as JSONB
    const { error: updateErr } = await supabase
      .from("analyses")
      .update({
        status: "completed",
        result: result as DealAnalysis,
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
