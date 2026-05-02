"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { DomainSources } from "@/components/dashboard/domain-sources"
import { useDeal } from "@/hooks/use-deal"

export default function ExitPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const exit = deal?.analysis?.exitPotential

  if (!exit) return <p className="text-sm text-muted-foreground">No exit analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Exit Potential" score={exit.score} verdict={exit.verdict} dataCompleteness={exit.dataCompleteness} />

      <Card>
        <CardHeader><SectionLabel>Comparable exits</SectionLabel></CardHeader>
        <CardContent><MetricTable rows={exit.comparableExits} /></CardContent>
      </Card>

      <Card>
        <CardHeader><SectionLabel>Realistic exit range</SectionLabel></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{exit.exitRange}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><SectionLabel>Exit timeline</SectionLabel></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{exit.exitTimeline}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><SectionLabel>Acquirer landscape</SectionLabel></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{exit.acquirerLandscape}</p></CardContent>
      </Card>

      <RedFlagsList items={exit.redFlags} />

      <DomainSources documents={deal?.documents} generatedAt={deal?.analysis?.createdAt} />
    </div>
  )
}
