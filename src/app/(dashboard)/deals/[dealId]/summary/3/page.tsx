"use client"

/**
 * Variant 3 — Signal Dashboard.
 * Visual-first. Large score gauge as hero, radar + per-domain rings, tinted
 * strengths/risks callouts with icons. Everything the eye wants before any
 * prose. Polished version of the original "visual dashboard" direction.
 */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import { DomainRadar } from "@/components/dashboard/domain-radar"
import { SectionLabel } from "@/components/dashboard/section-label"
import { DOMAIN_VERDICT_COLORS } from "@/lib/constants"
import type { DomainName, DomainVerdict } from "@/lib/types/analysis"
import {
  Users,
  Target,
  Rocket,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Clock,
  type LucideIcon,
} from "lucide-react"

const DOMAIN_ICON: Record<DomainName, LucideIcon> = {
  Team: Users,
  Market: Target,
  Product: Rocket,
  Traction: TrendingUp,
  Finance: Wallet,
}

const SEV_WEIGHT: Record<string, number> = { Critical: 3, Warning: 2, Info: 1 }

function bandColor(score: number) {
  if (score >= 70) return { text: "text-emerald-700", bg: "bg-emerald-600", ring: "#059669" }
  if (score >= 40) return { text: "text-amber-700", bg: "bg-amber-600", ring: "#D97706" }
  return { text: "text-red-700", bg: "bg-red-600", ring: "#DC2626" }
}

function DomainRing({
  score,
  size = 76,
}: {
  score: number
  size?: number
}) {
  const stroke = 7
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c
  const color = bandColor(score).ring
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E7E5E4" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-mono text-base font-bold tabular-nums"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  )
}

export default function SummaryV3Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!deal?.analysis) return <p className="text-sm text-muted-foreground">No analysis yet.</p>
  const es = deal.analysis.executiveSummary

  const topStrengths = [...es.strengths]
    .sort((a, b) => (SEV_WEIGHT[b.severity] ?? 0) - (SEV_WEIGHT[a.severity] ?? 0))
    .slice(0, 5)
  const topRisks = [...es.risks]
    .sort((a, b) => (SEV_WEIGHT[b.severity] ?? 0) - (SEV_WEIGHT[a.severity] ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Hero — score + verdict + meta, radar on the right */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 grid gap-6 md:grid-cols-[auto_1fr_auto] items-center">
        <div className="flex flex-col items-center">
          <ScoreGauge score={es.overallScore} size={180} />
          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 font-mono text-[11px] uppercase tracking-widest font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            {es.verdict}
          </span>
        </div>

        <div className="min-w-0">
          <SectionLabel>Deal Brief</SectionLabel>
          <h1 className="mt-1 font-heading text-[28px] font-bold leading-tight truncate">
            {es.companyName}
          </h1>
          <p className="mt-1.5 text-[12px] font-mono uppercase tracking-wider text-muted-foreground">
            {es.stage} · {es.sector} · {es.geography}
            {es.raising && <> · Raising {es.raising}</>}
          </p>
          <p className="mt-4 text-[14px] leading-[1.7] text-foreground/85 max-w-prose">
            {es.thesis}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex px-2.5 py-1 rounded-full bg-muted text-foreground/75 font-mono text-[11px] uppercase tracking-wider">
              {es.confidence} confidence
            </span>
            <span className="inline-flex px-2.5 py-1 rounded-full bg-muted text-foreground/75 font-mono text-[11px] uppercase tracking-wider">
              Data {es.dataCompleteness}%
            </span>
            {es.mrr && (
              <span className="inline-flex px-2.5 py-1 rounded-full bg-muted text-foreground/75 font-mono text-[11px] uppercase tracking-wider">
                MRR {es.mrr}
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 text-muted-foreground self-start">
          <Clock className="h-4 w-4" />
          <span className="text-[10px] font-mono uppercase tracking-wider">2-min read</span>
        </div>
      </section>

      {/* Domain rings row — 6 rings, icon above, score inside, key finding below */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionLabel>Domain Breakdown</SectionLabel>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {es.scorecard.length} domains
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {es.scorecard.map((row) => {
            const Icon = DOMAIN_ICON[row.domain] ?? Target
            const dv = DOMAIN_VERDICT_COLORS[row.verdict as DomainVerdict]
            return (
              <div key={row.domain} className="flex gap-4">
                <DomainRing score={row.score} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                    <h3 className="font-heading text-[13.5px] font-bold truncate">{row.domain}</h3>
                  </div>
                  <span
                    className={`mt-1 inline-flex rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${dv.bg} ${dv.text}`}
                  >
                    {row.verdict}
                  </span>
                  {row.keyFinding && (
                    <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground line-clamp-3">
                      {row.keyFinding}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Radar + Scorecard Bars — shape summary */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 grid gap-6 lg:grid-cols-[1fr_1fr] items-center">
        <div>
          <SectionLabel>Shape of the Deal</SectionLabel>
          <DomainRadar scorecard={es.scorecard} height={260} />
        </div>
        <div>
          <SectionLabel>Scorecard</SectionLabel>
          <div className="mt-3 space-y-3">
            {es.scorecard.map((row) => {
              const c = bandColor(row.score)
              return (
                <div key={row.domain} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3">
                  <span className="text-[12.5px] font-medium text-foreground truncate">
                    {row.domain}
                  </span>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${c.bg}`}
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                  <span className={`font-mono text-[13px] font-bold tabular-nums text-right ${c.text}`}>
                    {row.score}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Strengths + Risks — tinted callouts with icon heads */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid place-items-center h-8 w-8 rounded-full bg-emerald-100">
              <Lightbulb className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="font-heading font-bold text-[15px] text-emerald-900">Key Strengths</p>
          </div>
          <ul className="space-y-2.5">
            {topStrengths.map((s) => (
              <li key={s.id} className="flex items-start gap-2 text-[13.5px] leading-[1.55]">
                <span className="mt-1 text-emerald-700 font-bold shrink-0">✓</span>
                <span className="text-foreground/85">{s.text}</span>
              </li>
            ))}
            {topStrengths.length === 0 && (
              <li className="text-sm italic text-muted-foreground">None reported.</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid place-items-center h-8 w-8 rounded-full bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-700" />
            </div>
            <p className="font-heading font-bold text-[15px] text-red-900">Risk Factors</p>
          </div>
          <ul className="space-y-2.5">
            {topRisks.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-[13.5px] leading-[1.55]">
                <span className="mt-1 text-red-700 font-bold shrink-0">⚠</span>
                <span className="text-foreground/85">{r.text}</span>
              </li>
            ))}
            {topRisks.length === 0 && (
              <li className="text-sm italic text-muted-foreground">None reported.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Next Steps — amber callout */}
      {es.recommendedNextSteps.length > 0 && (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid place-items-center h-8 w-8 rounded-full bg-primary/15">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <p className="font-heading font-bold text-[15px] text-primary">
              Recommended Next Steps
            </p>
          </div>
          <ol className="space-y-2.5">
            {es.recommendedNextSteps.map((step, i) => (
              <li
                key={i}
                className="grid grid-cols-[2.25rem_1fr] gap-3 items-baseline text-[13.5px] leading-[1.55]"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground/85">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
