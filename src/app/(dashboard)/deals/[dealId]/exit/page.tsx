"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { mockDeals } from "@/lib/mock-data/deals"

export default function ExitPage() {
  const params = useParams()
  const deal = mockDeals.find((d) => d.id === params.dealId)
  const exit = deal?.analysis?.exitPotential

  if (!exit) return <p className="text-sm text-muted-foreground">No exit analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Exit Potential" score={exit.score} verdict={exit.verdict} dataCompleteness={exit.dataCompleteness} />

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Comparable Exits</CardTitle></CardHeader>
        <CardContent><MetricTable rows={exit.comparableExits} /></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Realistic Exit Range</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{exit.exitRange}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Exit Timeline</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{exit.exitTimeline}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Acquirer Landscape</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{exit.acquirerLandscape}</p></CardContent>
      </Card>

      <RedFlagsList items={exit.redFlags} />
    </div>
  )
}
