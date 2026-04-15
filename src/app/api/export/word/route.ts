import { NextResponse } from "next/server"
import { generateExecutiveSummaryDocx } from "@/lib/generate-docx"
import { createClient } from "@/lib/supabase/server"
import { mockDeals } from "@/lib/mock-data/deals"
import type { DealAnalysis, ExecutiveSummary } from "@/lib/types/analysis"

export async function POST(request: Request) {
  try {
    const { dealId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let es: ExecutiveSummary | null = null
    let companyName = ""

    // Admin account uses mock data
    if (user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      const deal = mockDeals.find((d) => d.id === dealId)
      if (deal?.analysis) {
        es = deal.analysis.executiveSummary
        companyName = deal.companyName
      }
    } else {
      // Real users: fetch from Supabase
      const { data: deal } = await supabase.from("deals").select("company_name").eq("id", dealId).single()
      const { data: analysis } = await supabase
        .from("analyses")
        .select("result")
        .eq("deal_id", dealId)
        .eq("status", "completed")
        .maybeSingle()

      if (deal && analysis?.result) {
        const result = analysis.result as DealAnalysis
        es = result.executiveSummary
        companyName = deal.company_name
      }
    }

    if (!es) {
      return NextResponse.json({ error: "Deal or analysis not found" }, { status: 404 })
    }

    const buffer = await generateExecutiveSummaryDocx(es)
    const filename = `SAM_${companyName.replace(/\s+/g, "_")}_Executive_Summary.docx`

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
