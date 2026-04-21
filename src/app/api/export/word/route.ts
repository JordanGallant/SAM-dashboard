import { NextResponse } from "next/server"
import { generateExecutiveSummaryDocx } from "@/lib/generate-docx"
import { createClient } from "@/lib/supabase/server"
import type { DealAnalysis } from "@/lib/types/analysis"

export async function POST(request: Request) {
  try {
    const { dealId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: deal } = await supabase
      .from("deals")
      .select("company_name")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single()

    const { data: analysis } = await supabase
      .from("analyses")
      .select("result")
      .eq("deal_id", dealId)
      .eq("status", "completed")
      .maybeSingle()

    if (!deal || !analysis?.result) {
      return NextResponse.json({ error: "Deal or analysis not found" }, { status: 404 })
    }

    const es = (analysis.result as DealAnalysis).executiveSummary
    const buffer = await generateExecutiveSummaryDocx(es)
    const filename = `SAM_${deal.company_name.replace(/\s+/g, "_")}_Executive_Summary.docx`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Word export error:", error)
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 })
  }
}
