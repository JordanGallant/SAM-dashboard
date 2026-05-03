"use client"

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { InsightBlock, EditorialCard, leadSplit, emphasize } from "@/components/dashboard/editorial"
import { DomainSources } from "@/components/dashboard/domain-sources"
import { Coins, Banknote, Users, Calculator, Handshake } from "lucide-react"

const VALUATION_TONE: Record<string, { dot: string; chip: string }> = {
  Conservative: { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Moderate: { dot: "bg-primary", chip: "bg-primary/10 text-primary ring-primary/20" },
  Aggressive: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 ring-amber-200" },
}

export default function FinancePage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const finance = deal?.analysis?.finance

  if (!finance)
    return <p className="text-sm text-muted-foreground">No financial analysis available.</p>

  const cap = leadSplit(finance.capitalEfficiency)
  const deal_terms = leadSplit(finance.dealTerms)

  return (
    <div className="space-y-7">
      <SectionHeader
        title="Financial Analysis"
        score={finance.score}
        verdict={finance.verdict}
        dataCompleteness={finance.dataCompleteness}
      />

      {/* Financial health table */}
      <EditorialCard label="Financial health" icon={<Banknote className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-2.5 md:p-3">
          <MetricTable rows={finance.financialHealth} showBenchmark={false} />
        </div>
      </EditorialCard>

      {/* Capital efficiency */}
      {cap.lead && (
        <InsightBlock
          icon={<Calculator className="h-4 w-4" />}
          label="Capital efficiency"
          lead={cap.lead}
          rest={cap.rest}
        />
      )}

      {/* Investor signals */}
      {finance.investorSignals && (
        <EditorialCard label="Investor signals" icon={<Users className="h-3.5 w-3.5" />}>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            {finance.investorSignals
              .split(/\n+/)
              .filter((l) => l.trim())
              .map((line, i) => (
                <p key={i} className="text-[13.5px] leading-[1.6] text-foreground/80">
                  {emphasize(line.trim())}
                </p>
              ))}
          </div>
        </EditorialCard>
      )}

      {/* Valuation methods as cards */}
      {finance.valuation.length > 0 && (
        <EditorialCard label="Valuation assessment" icon={<Coins className="h-3.5 w-3.5" />}>
          <div className="grid gap-3 sm:grid-cols-3">
            {finance.valuation.map((v) => {
              const tone = VALUATION_TONE[v.method] ?? VALUATION_TONE.Moderate
              return (
                <div
                  key={v.method}
                  className="rounded-2xl bg-card ring-1 ring-foreground/10 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/60">
                      {v.method}
                    </span>
                  </div>
                  <p className="mt-2 font-heading text-[20px] font-bold tracking-tight tabular-nums">
                    {v.impliedValue || "—"}
                  </p>
                  {v.basis && (
                    <p className="mt-2 text-[12.5px] leading-snug text-foreground/70 max-w-[40ch]">
                      {emphasize(v.basis)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </EditorialCard>
      )}

      {/* Deal terms */}
      {deal_terms.lead && (
        <InsightBlock
          icon={<Handshake className="h-4 w-4" />}
          label="Deal terms & cap table"
          lead={deal_terms.lead}
          rest={deal_terms.rest}
        />
      )}

      <RedFlagsList items={finance.redFlags} />

      <DomainSources documents={deal?.documents} generatedAt={deal?.analysis?.createdAt} />
    </div>
  )
}
