import { NextResponse } from "next/server"
import { generateExecutiveSummaryDocx } from "@/lib/generate-docx"
import { mockDeals } from "@/lib/mock-data/deals"

export async function POST(request: Request) {
  try {
    const { dealId } = await request.json()

    const deal = mockDeals.find((d) => d.id === dealId)
    if (!deal?.analysis) {
      return NextResponse.json({ error: "Deal or analysis not found" }, { status: 404 })
    }

    const buffer = await generateExecutiveSummaryDocx(deal.analysis.executiveSummary)

    const filename = `SAM_${deal.companyName.replace(/\s+/g, "_")}_Executive_Summary.docx`

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
