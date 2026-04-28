"use client"

/**
 * Variant 1 — Partner Brief.
 * A single "read before the IC meeting" scan. Hero card with score + verdict,
 * the 3 most important findings, compact domain strip, and the recommended
 * decision as a highlighted block. No tables, no walls of text.
 */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ArrowRight, TrendingUp, AlertTriangle, Clock } from "lucide-react"

const SEV_WEIGHT: Record<string, number> = { Critical: 3, Warning: 2, Info: 1 }
function scoreHue(score: number) {
  if (score >= 70) return { text: "text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" }
  if (score >= 40) return { text: "text-amber-700", dot: "bg-primary/100", bar: "bg-primary/100" }
  return { text: "text-red-700", dot: "bg-red-500", bar: "bg-red-500" }
}

export default function SummaryV1Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!deal?.analysis) return <p className="text-sm text-muted-foreground">No analysis yet.</p>
  const es = deal.analysis.executiveSummary
  const h = scoreHue(es.overallScore)

  // Top 3 by weight — these are the "must know" findings
  const topRisks = [...es.risks].sort((a, b) => (SEV_WEIGHT[b.severity] ?? 0) - (SEV_WEIGHT[a.severity] ?? 0)).slice(0, 3)
  const topStrengths = [...es.strengths].sort((a, b) => (SEV_WEIGHT[b.severity] ?? 0) - (SEV_WEIGHT[a.severity] ?? 0)).slice(0, 3)
  const firstStep = es.recommendedNextSteps[0]

  return (
    <div className="space-y-5">
      {/* Hero card — the one thing a partner needs at a glance */}
      <section className="relative overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 p-7">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${h.bar}`} />
        <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] items-center">
          {/* Score */}
          <div className="flex items-baseline gap-1">
            <span className={`font-mono font-bold tabular-nums leading-none ${h.text}`} style={{ fontSize: 84 }}>
              {es.overallScore}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">/100</span>
          </div>
          {/* Meta + verdict */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-mono text-[11px] uppercase tracking-wider font-bold`}>
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                {es.verdict}
              </span>
              <span className="inline-flex px-2.5 py-1 rounded-full bg-muted text-foreground/75 font-mono text-[11px] uppercase tracking-wider">
                {es.confidence} confidence
              </span>
              <span className="inline-flex px-2.5 py-1 rounded-full bg-muted text-foreground/75 font-mono text-[11px] uppercase tracking-wider">
                Data {es.dataCompleteness}%
              </span>
            </div>
            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight truncate">{es.companyName}</h1>
            <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {es.stage} · {es.sector} · {es.geography} · raising {es.raising || "—"}
            </p>
          </div>
          {/* Read time */}
          <div className="hidden md:flex flex-col items-end gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider">30-sec brief</span>
          </div>
        </div>
        <p className="mt-6 text-[15px] leading-[1.7] text-foreground/85 max-w-[68ch]">{es.thesis}</p>
      </section>

      {/* Three-takeaway strip — strengths & risks merged by importance */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-700" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-bold">Top Strengths</p>
          </div>
          <ol className="space-y-2.5">
            {topStrengths.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[1.25rem_1fr] gap-2 text-[13.5px] leading-[1.5]">
                <span className="font-mono text-emerald-700 tabular-nums font-bold">{i + 1}</span>
                <span className="text-foreground/85">{s.text}</span>
              </li>
            ))}
            {topStrengths.length === 0 && <p className="text-sm italic text-muted-foreground">None reported.</p>}
          </ol>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-700" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-red-700 font-bold">Top Risks</p>
          </div>
          <ol className="space-y-2.5">
            {topRisks.map((r, i) => (
              <li key={r.id} className="grid grid-cols-[1.25rem_1fr] gap-2 text-[13.5px] leading-[1.5]">
                <span className="font-mono text-red-700 tabular-nums font-bold">{i + 1}</span>
                <span className="text-foreground/85">{r.text}</span>
              </li>
            ))}
            {topRisks.length === 0 && <p className="text-sm italic text-muted-foreground">None reported.</p>}
          </ol>
        </div>
      </section>

      {/* Compact domain strip */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary mb-4">Domain Read</p>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${es.scorecard.length}, minmax(0, 1fr))` }}>
          {es.scorecard.map((row) => {
            const rh = scoreHue(row.score)
            return (
              <div key={row.domain} className="text-center">
                <div className="mx-auto mb-2 flex items-center justify-center h-10 w-10 rounded-full" style={{ background: `conic-gradient(${row.score >= 70 ? "#10B981" : row.score >= 40 ? "#F59E0B" : "#EF4444"} ${row.score * 3.6}deg, #E7E5E4 0deg)` }}>
                  <div className={`h-7 w-7 rounded-full bg-background flex items-center justify-center`}>
                    <span className={`font-mono text-[11px] font-bold tabular-nums ${rh.text}`}>{row.score}</span>
                  </div>
                </div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground truncate">{row.domain}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* The decision block — highlighted, what happens next */}
      {firstStep && (
        <section className="relative overflow-hidden rounded-2xl bg-primary/5 border-2 border-primary/30 p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary">
              <ArrowRight className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-bold">The Call</p>
              <p className="mt-1 text-[15px] leading-[1.6] text-foreground">{firstStep}</p>
              {es.recommendedNextSteps.length > 1 && (
                <p className="mt-2 text-[11px] font-mono uppercase tracking-wider text-primary/70">
                  {es.recommendedNextSteps.length - 1} further step{es.recommendedNextSteps.length - 1 === 1 ? "" : "s"} on full review
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
