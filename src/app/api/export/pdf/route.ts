import { NextResponse } from "next/server"
import { generateFullReportPdf } from "@/lib/generate-pdf"
import { createClient } from "@/lib/supabase/server"
import type { DealAnalysis } from "@/lib/types/analysis"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { dealId } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
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

    const buffer = await generateFullReportPdf(
      deal.company_name,
      analysis.result as DealAnalysis
    )
    const filename = `SAM_${deal.company_name.replace(/\s+/g, "_")}_Investment_Memo.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 })
  }
}
