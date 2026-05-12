import { NextResponse } from "next/server"
import { generateFullReportDocx } from "@/lib/generate-docx"
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

    const buffer = await generateFullReportDocx(
      deal.company_name,
      analysis.result as DealAnalysis
    )
    const filename = `SAM_${deal.company_name.replace(/\s+/g, "_")}_Investment_Memo.docx`

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
