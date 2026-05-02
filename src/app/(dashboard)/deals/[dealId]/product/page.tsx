"use client"

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { InsightBlock, EditorialCard, leadSplit, emphasize } from "@/components/dashboard/editorial"
import { DomainSources } from "@/components/dashboard/domain-sources"
import { Sparkles, Shield, Target, Check, X, Hourglass } from "lucide-react"

const PROBLEM_TYPE_TONE: Record<string, { dot: string; chip: string }> = {
  "Hair on Fire": { dot: "bg-red-500", chip: "bg-red-50 text-red-700 ring-red-200" },
  Vitamin: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 ring-amber-200" },
  "Nice-to-Have": { dot: "bg-zinc-400", chip: "bg-zinc-50 text-zinc-700 ring-zinc-200" },
}

function problemTypeKey(t: string) {
  if (/hair/i.test(t)) return "Hair on Fire"
  if (/vitamin/i.test(t)) return "Vitamin"
  return "Nice-to-Have"
}

export default function ProductPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const product = deal?.analysis?.product

  if (!product)
    return <p className="text-sm text-muted-foreground">No product analysis available.</p>

  const pmf = leadSplit(product.pmfDetails)
  const ptKey = problemTypeKey(product.problemType)
  const ptTone = PROBLEM_TYPE_TONE[ptKey]

  return (
    <div className="space-y-7 max-w-4xl">
      <SectionHeader
        title="Product Analysis"
        score={product.score}
        verdict={product.verdict}
        dataCompleteness={product.dataCompleteness}
      />

      {/* Problem Assessment — compact stat row + prose block */}
      <EditorialCard label="Problem Assessment" icon={<Target className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider ring-1 ${ptTone.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${ptTone.dot}`} />
              {product.problemType || "Not classified"}
            </span>
            {product.painScore && (
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider text-foreground/70">
                Pain · <span className="tabular-nums">{product.painScore}</span>
              </span>
            )}
          </div>

          {product.evidenceOfPain && (
            <div className="mt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/55 mb-1.5">
                Evidence of pain
              </p>
              <p className="text-[14px] leading-[1.65] text-foreground/85">
                {emphasize(product.evidenceOfPain)}
              </p>
            </div>
          )}

          {product.currentSolutions && (
            <div className="mt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/55 mb-1.5">
                Current solutions
              </p>
              <p className="text-[13.5px] leading-[1.65] text-foreground/75">
                {emphasize(product.currentSolutions)}
              </p>
            </div>
          )}
        </div>
      </EditorialCard>

      {/* Solution comparison — keep MetricTable */}
      {product.solutionComparison.length > 0 && (
        <EditorialCard label='Solution & "10x" test'>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-2.5 md:p-3">
            <MetricTable rows={product.solutionComparison} />
          </div>
        </EditorialCard>
      )}

      {/* PMF as InsightBlock */}
      {pmf.lead && (
        <InsightBlock
          icon={<Sparkles className="h-4 w-4" />}
          label="Product–market fit"
          lead={pmf.lead}
          rest={pmf.rest}
          pill={
            product.pmfStatus
              ? { text: product.pmfStatus, bg: "bg-foreground/5", fg: "text-foreground/70" }
              : undefined
          }
        />
      )}

      {/* Moat — card grid (4 archetypes) */}
      {product.moat.length > 0 && (
        <EditorialCard label="Moat assessment" icon={<Shield className="h-3.5 w-3.5" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.moat.map((m) => {
              const StatusIcon = m.present ? Check : m.strength > 0 ? Hourglass : X
              const strengthPct = Math.max(0, Math.min(10, m.strength)) * 10
              return (
                <div
                  key={m.type}
                  className="flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 p-4"
                >
                  <div className="flex items-center justify-between gap-2 min-h-[24px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`shrink-0 grid place-items-center h-6 w-6 rounded-md ${
                          m.present
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : m.strength > 0
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            : "bg-zinc-50 text-zinc-500 ring-1 ring-zinc-200"
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" />
                      </span>
                      <span className="text-[13.5px] font-heading font-bold leading-tight truncate">
                        {m.type}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-foreground/70">
                      {m.strength}/10
                    </span>
                  </div>
                  {/* Strength bar */}
                  <div className="mt-2.5 h-1 rounded-full bg-foreground/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        m.present
                          ? "bg-emerald-500"
                          : m.strength > 0
                          ? "bg-amber-500"
                          : "bg-zinc-300"
                      }`}
                      style={{ width: `${strengthPct}%` }}
                    />
                  </div>
                  {m.evidence && (
                    <p className="mt-3 text-[12.5px] leading-snug text-foreground/70">
                      {m.evidence}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </EditorialCard>
      )}

      <RedFlagsList items={product.redFlags} />

      <DomainSources documents={deal?.documents} generatedAt={deal?.analysis?.createdAt} />
    </div>
  )
}
