"use client"

/**
 * Variant 3 — Visual Dashboard.
 * All graphs, minimal text. Hero radar, domain donut rings, inline severity
 * stacks, score/confidence scatter. For the reader who wants data-ink.
 */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { DomainRadar } from "@/components/dashboard/domain-radar"

function ringColor(score: number) {
  if (score >= 70) return "#059669"
  if (score >= 40) return "#D97706"
  return "#DC2626"
}

function Ring({ score, size = 88, label }: { score: number; size?: number; label: string }) {
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#E7E5E4" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={ringColor(score)}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-bold tabular-nums" style={{ color: ringColor(score) }}>
            {score}
          </span>
        </div>
      </div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}

export default function SummaryV3Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!deal?.analysis) return <p className="text-sm text-muted-foreground">No analysis yet.</p>
  const es = deal.analysis.executiveSummary

  const sevCount = (arr: typeof es.strengths) => ({
    Critical: arr.filter((x) => x.severity === "Critical").length,
    Warning: arr.filter((x) => x.severity === "Warning").length,
    Info: arr.filter((x) => x.severity === "Info").length,
  })
  const strSev = sevCount(es.strengths)
  const riskSev = sevCount(es.risks)
  const strTotal = es.strengths.length || 1
  const riskTotal = es.risks.length || 1

  return (
    <div className="space-y-6">
      {/* Hero — giant radar on the left, big score on the right */}
      <section className="grid gap-6 md:grid-cols-[1.35fr_1fr] items-center bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700">Domain shape</p>
          <DomainRadar scorecard={es.scorecard} height={300} />
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className="font-mono font-bold leading-none tabular-nums"
            style={{ fontSize: 112, color: ringColor(es.overallScore) }}
          >
            {es.overallScore}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground -mt-2">
            / 100
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-mono text-[10px] uppercase tracking-wider font-bold">
              {es.verdict}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-muted text-foreground/80 font-mono text-[10px] uppercase tracking-wider">
              {es.confidence} conf
            </span>
          </div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mt-2 text-center">
            {es.companyName} · {es.stage} · {es.sector} · {es.geography}
          </p>
        </div>
      </section>

      {/* Domain rings — one per domain */}
      <section className="grid grid-cols-5 gap-4 bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        {es.scorecard.slice(0, 5).map((row) => (
          <Ring key={row.domain} score={row.score} label={row.domain} />
        ))}
      </section>

      {/* Strengths vs Risks — stacked severity bars */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-emerald-700 mb-4">
            Strengths by severity
          </p>
          <div className="flex h-10 rounded-md overflow-hidden ring-1 ring-border">
            {strSev.Critical > 0 && (
              <div className="flex items-center justify-center bg-emerald-700 text-white font-mono text-xs font-bold" style={{ width: `${(strSev.Critical / strTotal) * 100}%` }}>
                {strSev.Critical} C
              </div>
            )}
            {strSev.Warning > 0 && (
              <div className="flex items-center justify-center bg-emerald-500 text-white font-mono text-xs font-bold" style={{ width: `${(strSev.Warning / strTotal) * 100}%` }}>
                {strSev.Warning} W
              </div>
            )}
            {strSev.Info > 0 && (
              <div className="flex items-center justify-center bg-emerald-300 text-emerald-900 font-mono text-xs font-bold" style={{ width: `${(strSev.Info / strTotal) * 100}%` }}>
                {strSev.Info} I
              </div>
            )}
          </div>
          <ul className="mt-4 space-y-2">
            {es.strengths.map((s) => (
              <li key={s.id} className="flex items-start gap-2 text-[12.5px] leading-snug">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                    s.severity === "Critical" ? "bg-emerald-700" : s.severity === "Warning" ? "bg-emerald-500" : "bg-emerald-300"
                  }`}
                />
                <span className="text-foreground/80">{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-4">
            Risks by severity
          </p>
          <div className="flex h-10 rounded-md overflow-hidden ring-1 ring-border">
            {riskSev.Critical > 0 && (
              <div className="flex items-center justify-center bg-red-700 text-white font-mono text-xs font-bold" style={{ width: `${(riskSev.Critical / riskTotal) * 100}%` }}>
                {riskSev.Critical} C
              </div>
            )}
            {riskSev.Warning > 0 && (
              <div className="flex items-center justify-center bg-red-500 text-white font-mono text-xs font-bold" style={{ width: `${(riskSev.Warning / riskTotal) * 100}%` }}>
                {riskSev.Warning} W
              </div>
            )}
            {riskSev.Info > 0 && (
              <div className="flex items-center justify-center bg-red-300 text-red-900 font-mono text-xs font-bold" style={{ width: `${(riskSev.Info / riskTotal) * 100}%` }}>
                {riskSev.Info} I
              </div>
            )}
          </div>
          <ul className="mt-4 space-y-2">
            {es.risks.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-[12.5px] leading-snug">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                    r.severity === "Critical" ? "bg-red-700" : r.severity === "Warning" ? "bg-red-500" : "bg-red-300"
                  }`}
                />
                <span className="text-foreground/80">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Completeness bars — one horizontal stack per domain */}
      <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-4">
          Score vs data coverage
        </p>
        <div className="space-y-3">
          {es.scorecard.map((row) => (
            <div key={row.domain} className="grid grid-cols-[6rem_1fr_3rem] gap-3 items-center">
              <span className="text-[12px] font-medium">{row.domain}</span>
              <div className="relative h-6 bg-muted rounded-md overflow-hidden">
                {/* score bar */}
                <div
                  className="absolute left-0 top-0 h-full opacity-90"
                  style={{ width: `${row.score}%`, backgroundColor: ringColor(row.score) }}
                />
                {/* data completeness overlay (diagonal stripe indicator) */}
                <div
                  className="absolute left-0 top-0 h-full border-r-2 border-foreground/40"
                  style={{ width: `${row.dataCompleteness}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white drop-shadow">
                  SCORE {row.score}
                </span>
              </div>
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                {row.dataCompleteness}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Filled bar = score · vertical line = data coverage boundary
        </p>
      </section>
    </div>
  )
}
