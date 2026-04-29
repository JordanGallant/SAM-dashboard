"use client"


import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import { DomainRadar } from "@/components/dashboard/domain-radar"
import { SectionLabel } from "@/components/dashboard/section-label"
import { DealUpload } from "@/components/deals/deal-upload"
import { DOMAIN_VERDICT_COLORS } from "@/lib/constants"
import type { DomainName, DomainVerdict } from "@/lib/types/analysis"
import {
  Users,
  Target,
  Rocket,
  TrendingUp,
  Wallet,
  Building2,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  FileUp,
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

function scoreText(score: number) {
  if (score >= 70) return "text-emerald-700"
  if (score >= 40) return "text-amber-700"
  return "text-red-700"
}

export default function SummaryPage() {
  const params = useParams()
  const { deal, loading, refetch, analysisStatus, analysisError } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!deal) return <p className="text-sm text-muted-foreground">Deal not found.</p>
  if (!deal.analysis) {
    const isAnalyzing = analysisStatus === "pending" || analysisStatus === "processing"
    const isFailed = analysisStatus === "failed"
    return (
      <div className="max-w-4xl space-y-5">
        {isFailed ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center">
            <AlertCircle className="mx-auto h-6 w-6 text-red-700" />
            <h2 className="mt-3 font-heading text-lg font-bold text-red-900">
              Analysis failed
            </h2>
            <p className="mt-1 text-sm text-red-900/80 max-w-md mx-auto">
              {analysisError || "The pipeline reported a failure but didn't include details."}
            </p>
            <p className="mt-3 text-xs text-red-900/70 max-w-md mx-auto">
              Re-upload the pitch deck (or swap in a different one), then click &quot;Retry analysis&quot; at the top.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-muted/30 p-8 text-center">
            <FileUp className="mx-auto h-6 w-6 text-muted-foreground/60" />
            <h2 className="mt-3 font-heading text-lg font-bold">
              {isAnalyzing ? "Analysis in progress" : "Awaiting analysis"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              {isAnalyzing
                ? "Your pitch deck is being analyzed. This page will update automatically when results are ready (~30 min)."
                : "Upload a pitch deck below, then click \"Analyze pitch deck\" at the top of the page."}
            </p>
          </div>
        )}
        <DealUpload dealId={deal.id} documents={deal.documents} onChange={refetch} />
      </div>
    )
  }
  const es = deal.analysis.executiveSummary

  // Distribute findings across domains by ID modulo (so every domain card feels
  // populated without inventing associations). Fallback: skip per-domain section.
  const findingsForDomain = (domainIdx: number, kind: "strength" | "risk") => {
    const list = kind === "strength" ? es.strengths : es.risks
    return list.filter((_, i) => i % es.scorecard.length === domainIdx).slice(0, 2)
  }

  const topStrengths = [...es.strengths]
    .sort((a, b) => (SEV_WEIGHT[b.severity] ?? 0) - (SEV_WEIGHT[a.severity] ?? 0))
    .slice(0, 4)
  const topRisks = [...es.risks]
    .sort((a, b) => (SEV_WEIGHT[b.severity] ?? 0) - (SEV_WEIGHT[a.severity] ?? 0))
    .slice(0, 4)

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Left rail — sticky company card + gauge + radar + scorecard list */}
      <aside className="lg:sticky lg:top-4 self-start space-y-5">
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5">
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-primary/10 ring-1 ring-primary/30">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <h1 className="font-heading text-lg font-bold leading-tight truncate">
              {es.companyName}
            </h1>
          </div>
          <p className="mt-2.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground leading-relaxed">
            {es.stage} · {es.sector}
            <br />
            {es.geography}
            {es.raising && <> · Raising {es.raising}</>}
          </p>
        </div>

        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5">
          <div className="flex flex-col items-center">
            <ScoreGauge score={es.overallScore} size={150} />
            <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-mono text-[10px] uppercase tracking-widest font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              {es.verdict}
            </span>
            <p className="mt-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {es.confidence} confidence · Data {es.dataCompleteness}%
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5">
          <SectionLabel>Performance Overview</SectionLabel>
          <div className="mt-2">
            <DomainRadar scorecard={es.scorecard} height={220} />
          </div>
          <ul className="mt-3 space-y-1.5 text-[12px]">
            {es.scorecard.map((row) => (
              <li key={row.domain} className="flex items-center justify-between">
                <span className="text-muted-foreground">{row.domain}</span>
                <span className={`font-mono font-bold tabular-nums ${scoreText(row.score)}`}>
                  {row.score}
                  <span className="text-muted-foreground font-normal">/100</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right pane — thesis prose, then domain cards, then callouts */}
      <div className="space-y-5">
        <ThesisCard thesis={es.thesis} />


        {/* Domain cards — one per scorecard row */}
        {es.scorecard.map((row, i) => {
          const Icon = DOMAIN_ICON[row.domain] ?? Building2
          const dv = DOMAIN_VERDICT_COLORS[row.verdict as DomainVerdict]
          const strengths = findingsForDomain(i, "strength")
          const risks = findingsForDomain(i, "risk")
          return (
            <section
              key={row.domain}
              className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid place-items-center h-9 w-9 rounded-full bg-primary/10 ring-1 ring-primary/30">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-[17px] font-bold leading-tight">
                      {row.domain}
                    </h2>
                    <span
                      className={`mt-0.5 inline-flex rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${dv.bg} ${dv.text}`}
                    >
                      {row.verdict}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-2xl font-bold tabular-nums ${scoreText(row.score)}`}>
                    {row.score}
                    <span className="text-muted-foreground font-normal text-sm">/100</span>
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Data {row.dataCompleteness}%
                  </p>
                </div>
              </div>
              {row.keyFinding && (
                <p className="mt-4 text-[13.5px] leading-[1.6] text-foreground/80">
                  {row.keyFinding}
                </p>
              )}
              {(strengths.length > 0 || risks.length > 0) && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {strengths.length > 0 && (
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1.5">
                        Strengths
                      </p>
                      <ul className="space-y-1.5">
                        {strengths.map((s) => (
                          <li key={s.id} className="flex items-start gap-2 text-[12.5px] leading-snug">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                            <span className="text-foreground/80">{s.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {risks.length > 0 && (
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-red-700 font-bold mb-1.5">
                        Risks
                      </p>
                      <ul className="space-y-1.5">
                        {risks.map((r) => (
                          <li key={r.id} className="flex items-start gap-2 text-[12.5px] leading-snug">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                            <span className="text-foreground/80">{r.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })}

        {/* Callout strip — Highlights / Risk Factors / Next Steps */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-emerald-700" />
              <p className="font-mono text-[11px] uppercase tracking-widest font-bold text-emerald-700">
                Highlights
              </p>
            </div>
            <ul className="space-y-2">
              {topStrengths.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-[13px] leading-[1.55]">
                  <span className="mt-1 text-emerald-700 font-bold">✓</span>
                  <span className="text-foreground/85">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-700" />
              <p className="font-mono text-[11px] uppercase tracking-widest font-bold text-red-700">
                Risk Factors
              </p>
            </div>
            <ul className="space-y-2">
              {topRisks.map((r) => (
                <li key={r.id} className="flex items-start gap-2 text-[13px] leading-[1.55]">
                  <span className="mt-1 text-red-700 font-bold">⚠</span>
                  <span className="text-foreground/85">{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {es.recommendedNextSteps.length > 0 && (
          <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="h-4 w-4 text-primary" />
              <p className="font-mono text-[11px] uppercase tracking-widest font-bold text-primary">
                Recommended Next Steps
              </p>
            </div>
            <ol className="space-y-2">
              {es.recommendedNextSteps.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2rem_1fr] gap-2 items-baseline text-[13px] leading-[1.55]"
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
    </div>
  )
}

// --- Thesis card ---------------------------------------------------------
// Splits the thesis into (a) a lead sentence rendered as a "deck" line,
// (b) a body in a comfortable measure with subtle emphasis on numbers,
// percentages, currency amounts, and stage/year mentions so the eye lands
// on the load-bearing claims first.
function ThesisCard({ thesis }: { thesis: string }) {
  const trimmed = (thesis ?? "").trim()
  // Split on the first sentence terminator followed by whitespace
  const splitIdx = trimmed.search(/[.!?](?=\s+\S)/)
  const lead = splitIdx === -1 ? trimmed : trimmed.slice(0, splitIdx + 1)
  const rest = splitIdx === -1 ? "" : trimmed.slice(splitIdx + 1).trim()

  // Highlight numbers, percentages, currency, and stage/year tokens.
  // Keeps everything else as plain text — small visual rhythm, not a wall.
  const HIGHLIGHT_RE =
    /(\b(?:USD|EUR|GBP|CHF)\s?\d[\d,.]*\s?(?:[KMB]|trillion|billion|million)?\b|[\$€£]\s?\d[\d,.]*\s?(?:[KMB]|trillion|billion|million)?\b|\b\d+(?:\.\d+)?%\b|\b\d{4}\b|\b\d+(?:\.\d+)?[KMB]?\s?(?:CAGR|ARR|MRR|TAM|SAM|SOM)\b)/g

  function emphasize(text: string) {
    if (!text) return null
    const parts = text.split(HIGHLIGHT_RE)
    return parts.map((part, i) =>
      i % 2 === 0 ? (
        <span key={i}>{part}</span>
      ) : (
        <span
          key={i}
          className="font-semibold text-foreground bg-primary/8 rounded px-0.5"
        >
          {part}
        </span>
      )
    )
  }

  return (
    <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 md:p-7">
      <SectionLabel className="mb-4">Investment Thesis</SectionLabel>

      {/* Lead sentence — newspaper deck */}
      <p className="text-[17px] md:text-[18px] leading-[1.45] font-medium text-foreground tracking-[-0.005em] max-w-[58ch]">
        {emphasize(lead)}
      </p>

      {/* Body — comfortable measure, lighter weight */}
      {rest && (
        <p className="mt-4 text-[14px] leading-[1.7] text-foreground/75 max-w-[68ch]">
          {emphasize(rest)}
        </p>
      )}
    </section>
  )
}
