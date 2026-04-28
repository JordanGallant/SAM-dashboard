"use client"

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { EditorialCard } from "@/components/dashboard/editorial"
import { TrendingUp, Coins, RefreshCcw } from "lucide-react"

export default function TractionPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const traction = deal?.analysis?.traction

  if (!traction)
    return <p className="text-sm text-muted-foreground">No traction analysis available.</p>

  return (
    <div className="space-y-7 max-w-4xl">
      <SectionHeader
        title="Traction & Unit Economics"
        score={traction.score}
        verdict={traction.verdict}
        dataCompleteness={traction.dataCompleteness}
      />

      <EditorialCard label="Revenue & growth" icon={<TrendingUp className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-2.5 md:p-3">
          <MetricTable rows={traction.revenueMetrics} />
        </div>
      </EditorialCard>

      <EditorialCard label="Unit economics" icon={<Coins className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-2.5 md:p-3">
          <MetricTable rows={traction.unitEconomics} />
        </div>
      </EditorialCard>

      <EditorialCard label="Retention & engagement" icon={<RefreshCcw className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-2.5 md:p-3">
          <MetricTable rows={traction.retention} showBenchmark={false} />
        </div>
      </EditorialCard>

      <RedFlagsList items={traction.redFlags} />
    </div>
  )
}
