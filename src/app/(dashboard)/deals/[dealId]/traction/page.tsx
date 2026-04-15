"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { useDeal } from "@/hooks/use-deal"

export default function TractionPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const traction = deal?.analysis?.traction

  if (!traction) return <p className="text-sm text-muted-foreground">No traction analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Traction & Unit Economics" score={traction.score} verdict={traction.verdict} dataCompleteness={traction.dataCompleteness} />

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue & Growth</CardTitle></CardHeader>
        <CardContent><MetricTable rows={traction.revenueMetrics} /></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Unit Economics</CardTitle></CardHeader>
        <CardContent><MetricTable rows={traction.unitEconomics} /></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Retention & Engagement</CardTitle></CardHeader>
        <CardContent><MetricTable rows={traction.retention} showBenchmark={false} /></CardContent>
      </Card>

      <RedFlagsList items={traction.redFlags} />
    </div>
  )
}
