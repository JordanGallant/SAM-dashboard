"use client"

import { useParams } from "next/navigation"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { EditorialCard, emphasize } from "@/components/dashboard/editorial"
import { DomainSources } from "@/components/dashboard/domain-sources"
import { useDeal } from "@/hooks/use-deal"
import { TrendingUp, Calendar, Building2 } from "lucide-react"

export default function ExitPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const exit = deal?.analysis?.exitPotential

  if (!exit) return <p className="text-sm text-muted-foreground">No exit analysis available.</p>

  return (
    <div className="space-y-7">
      <SectionHeader title="Exit Potential" score={exit.score} verdict={exit.verdict} dataCompleteness={exit.dataCompleteness} />

      {exit.comparableExits.length > 0 && (
        <EditorialCard label="Comparable exits" icon={<TrendingUp className="h-3.5 w-3.5" />}>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-2.5 md:p-3">
            <MetricTable rows={exit.comparableExits} />
          </div>
        </EditorialCard>
      )}

      {exit.exitRange && (
        <EditorialCard label="Realistic exit range">
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <p className="text-[14px] leading-[1.65] text-foreground/80 max-w-[60ch]">
              {emphasize(exit.exitRange)}
            </p>
          </div>
        </EditorialCard>
      )}

      {exit.exitTimeline && (
        <EditorialCard label="Exit timeline" icon={<Calendar className="h-3.5 w-3.5" />}>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <p className="text-[14px] leading-[1.65] text-foreground/80 max-w-[60ch]">
              {emphasize(exit.exitTimeline)}
            </p>
          </div>
        </EditorialCard>
      )}

      {exit.acquirerLandscape && (
        <EditorialCard label="Acquirer landscape" icon={<Building2 className="h-3.5 w-3.5" />}>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <p className="text-[14px] leading-[1.65] text-foreground/80 max-w-[60ch]">
              {emphasize(exit.acquirerLandscape)}
            </p>
          </div>
        </EditorialCard>
      )}

      <RedFlagsList items={exit.redFlags} />

      <DomainSources documents={deal?.documents} generatedAt={deal?.analysis?.createdAt} />
    </div>
  )
}
