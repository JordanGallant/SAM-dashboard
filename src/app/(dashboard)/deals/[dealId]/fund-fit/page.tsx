"use client"

import { useParams } from "next/navigation"
import { SectionHeader } from "@/components/dashboard/section-header"
import { EditorialCard } from "@/components/dashboard/editorial"
import { DomainSources } from "@/components/dashboard/domain-sources"
import { useDeal } from "@/hooks/use-deal"
import { Check, X, Compass, Target, ShieldAlert } from "lucide-react"
import { TierGate } from "@/components/dashboard/tier-gate"
import { useTier } from "@/lib/tier-context"

export default function FundFitPage() {
  const params = useParams()
  const { config } = useTier()
  const { deal } = useDeal(params.dealId as string)
  const fit = deal?.analysis?.fundFit

  if (!config.fundFit) {
    return (
      <TierGate feature="Fund Fit Scoring" requiredTier="professional">
        <div />
      </TierGate>
    )
  }

  if (!fit) return <p className="text-sm text-muted-foreground">No fund fit analysis available.</p>

  const matched = fit.criteria.filter((c) => c.match).length
  const total = fit.criteria.length

  return (
    <div className="space-y-7 max-w-5xl">
      <SectionHeader title="Fund Fit" score={fit.score} verdict={fit.verdict} dataCompleteness={fit.dataCompleteness} />

      <EditorialCard
        label="Criteria match"
        icon={<Target className="h-3.5 w-3.5" />}
        rightSlot={
          total > 0 ? (
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground tabular-nums">
              {matched} / {total} match
            </span>
          ) : undefined
        }
      >
        <div className="overflow-hidden rounded-2xl border border-[#0F3D2E]/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#0F3D2E]/10 bg-[#F4FAF6]/50">
                <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Criterion
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Fund profile
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  This deal
                </th>
                <th className="w-[80px] px-3 py-3 text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Match
                </th>
              </tr>
            </thead>
            <tbody>
              {fit.criteria.map((c, i) => (
                <tr
                  key={c.criterion}
                  className={`${i !== fit.criteria.length - 1 ? "border-b border-[#0F3D2E]/5" : ""}`}
                >
                  <td className="px-4 py-3 font-heading font-semibold text-[#0A2E22]">{c.criterion}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground leading-relaxed">
                    {c.fundProfile || <span className="text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground leading-relaxed">
                    {c.deal || <span className="text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`mx-auto inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ${
                        c.match
                          ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                          : "bg-red-100 text-red-700 ring-red-200"
                      }`}
                      aria-label={c.match ? "Match" : "No match"}
                    >
                      {c.match ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <X className="h-4 w-4 stroke-[3]" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialCard>

      <EditorialCard label="Thesis alignment" icon={<Compass className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-primary leading-none tabular-nums">{fit.thesisAlignment}</span>
            <span className="text-xs font-mono text-muted-foreground">/100</span>
          </div>
          <p className="mt-3 text-sm text-foreground/75 leading-relaxed">
            {fit.thesisAlignment >= 70
              ? "Strong alignment with fund thesis."
              : fit.thesisAlignment >= 40
                ? "Partial alignment with fund thesis. Some criteria do not match."
                : "Weak alignment with fund thesis."}
          </p>
        </div>
      </EditorialCard>

      <EditorialCard label="Portfolio conflict check" icon={<ShieldAlert className="h-3.5 w-3.5" />}>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
          <p className="text-sm text-foreground/75 leading-relaxed">{fit.portfolioConflict}</p>
        </div>
      </EditorialCard>

      <DomainSources documents={deal?.documents} generatedAt={deal?.analysis?.createdAt} />
    </div>
  )
}
