"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowRight, Briefcase, Building2, FileText, Layers, AlertCircle, TrendingUp, Sparkles } from "lucide-react"
import { useDeals } from "@/hooks/use-deals"
import { useFundProfile } from "@/hooks/use-fund-profile"
import { useTier } from "@/lib/tier-context"
import { useTrialUsage } from "@/hooks/use-trial-usage"
import { TrialChip } from "@/components/billing/trial-chip"
import { PIPELINE_STAGES, STATUS_BADGE_COLORS, getScoreColor } from "@/lib/constants"
import type { PipelineStatus } from "@/lib/types/deal"
import { DeckUploader } from "@/components/deals/deck-uploader"

export default function DashboardLanding() {
  const { deals, loading, refetch } = useDeals()
  const { fund } = useFundProfile()
  const { config, isTrialing, trialDaysLeft } = useTier()
  const trialUsage = useTrialUsage()

  // Phase distribution.
  const phaseCounts = useMemo(() => {
    const map = new Map<PipelineStatus, number>()
    for (const s of PIPELINE_STAGES) map.set(s as PipelineStatus, 0)
    for (const d of deals) {
      map.set(d.status as PipelineStatus, (map.get(d.status as PipelineStatus) ?? 0) + 1)
    }
    return PIPELINE_STAGES.map((s) => ({
      stage: s as PipelineStatus,
      count: map.get(s as PipelineStatus) ?? 0,
    }))
  }, [deals])

  // Memo usage this month.
  const memosThisMonth = useMemo(() => {
    const start = new Date()
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    return deals.filter((d) => new Date(d.createdAt) >= start).length
  }, [deals])

  const memoCap = config.dealsPerMonth
  const memoPct = memoCap === -1 || memoCap === 0
    ? 0
    : Math.min(100, Math.round((memosThisMonth / memoCap) * 100))

  // Recent — last 5 deals.
  const recent = useMemo(() => {
    return [...deals]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [deals])

  const failed = deals.filter((d) => d.latestAnalysisStatus === "failed").length

  // Highest-scoring completed deal.
  const topDeal = useMemo(() => {
    return [...deals]
      .filter((d) => d.analysis?.executiveSummary?.overallScore !== undefined)
      .sort((a, b) => (b.analysis!.executiveSummary.overallScore - a.analysis!.executiveSummary.overallScore))
      .slice(0, 1)[0]
  }, [deals])

  // Fund profile completeness check.
  const fundFieldsFilled = useMemo(() => {
    if (!fund) return 0
    let n = 0
    if (fund.name) n++
    if (fund.thesis) n++
    if (fund.stageFocus?.length) n++
    if (fund.sectorFocus?.length) n++
    if (fund.geoFocus?.length) n++
    if (fund.ticketSizeMin && fund.ticketSizeMax) n++
    return n
  }, [fund])
  const fundFieldsTotal = 6
  const fundComplete = fundFieldsFilled === fundFieldsTotal

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold font-heading tracking-[-0.025em] text-[#0A0A0A]">
            Your dealroom at a glance.
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {fund?.name ? `${fund.name} · ` : ""}
            {loading
              ? "Loading…"
              : `${deals.length} deal${deals.length === 1 ? "" : "s"} tracked`}
          </p>
        </div>
        <DeckUploader variant="compact" onCreated={() => refetch()} />
      </div>

      {/* KPI strip — 4 tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI
          icon={Briefcase}
          label="Total deals"
          value={String(deals.length)}
          sub={loading ? "Loading…" : `${deals.filter((d) => d.analysis).length} analysed`}
        />
        <KPI
          icon={Layers}
          label="Active phases"
          value={String(phaseCounts.filter((p) => p.count > 0).length)}
          sub={`of ${PIPELINE_STAGES.length} pipeline stages`}
        />
        <KPI
          icon={FileText}
          label="Memos this month"
          value={memoCap === -1 ? String(memosThisMonth) : `${memosThisMonth} / ${memoCap}`}
          sub={memoCap === -1 ? "Unlimited tier" : `${memoPct}% of cap`}
          progress={memoCap === -1 ? null : memoPct}
        />
        <KPI
          icon={failed > 0 ? AlertCircle : Sparkles}
          label={failed > 0 ? "Need attention" : "Status"}
          value={failed > 0 ? String(failed) : "All clear"}
          sub={failed > 0 ? `${failed} failed analyses to retry` : "No failed runs"}
          tone={failed > 0 ? "warn" : "ok"}
        />
      </div>

      {/* Trial banner — shows days countdown AND deal-cap counter side by side.
          Tone shifts amber/red as the cap approaches; pulls the same source
          of truth as the sidebar so they always match. */}
      {isTrialing && (
        <div
          className={`flex items-center gap-3 rounded-2xl ring-1 px-4 py-3 ${
            trialUsage.atLimit
              ? "bg-red-50 ring-red-200"
              : trialUsage.remaining === 1
                ? "bg-amber-50 ring-amber-200"
                : "bg-primary/5 ring-primary/30"
          }`}
        >
          <Sparkles
            className={`h-4 w-4 shrink-0 ${
              trialUsage.atLimit ? "text-red-700" : trialUsage.remaining === 1 ? "text-amber-700" : "text-primary"
            }`}
          />
          <p className={`text-[13px] flex-1 ${
            trialUsage.atLimit ? "text-red-900" : trialUsage.remaining === 1 ? "text-amber-900" : "text-primary/85"
          }`}>
            Trial — {trialDaysLeft} {trialDaysLeft === 1 ? "day" : "days"} left ·{" "}
            {trialUsage.atLimit
              ? `${trialUsage.cap} of ${trialUsage.cap} free decks used`
              : `${trialUsage.used} of ${trialUsage.cap} free decks used`}
          </p>
          <TrialChip size="sm" />
        </div>
      )}

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Pipeline distribution */}
        <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-heading text-[14px] font-bold uppercase tracking-widest text-[#0F3D2E]">
              Pipeline distribution
            </h2>
            <Link
              href="/deals"
              className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              View dealroom →
            </Link>
          </div>
          {deals.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              No deals yet. Upload your first pitch deck to get started.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {phaseCounts.map(({ stage, count }) => {
                const pct = deals.length > 0 ? Math.round((count / deals.length) * 100) : 0
                return (
                  <li key={stage} className="flex items-center gap-3 text-[13px]">
                    <span
                      className={`shrink-0 w-[100px] inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-widest ${STATUS_BADGE_COLORS[stage] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {stage}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0F3D2E] to-[#00A86B] transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono tabular-nums text-[12px] w-8 text-right">{count}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Fund profile health */}
        <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-heading text-[14px] font-bold uppercase tracking-widest text-[#0F3D2E]">
              Fund profile
            </h2>
            <Link
              href="/settings/fund-profile"
              className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Edit →
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
              <Building2 className="h-5 w-5 text-[#0F3D2E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-[15px] truncate">
                {fund?.name || "Set up your fund"}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                {fundFieldsFilled} / {fundFieldsTotal} fields complete
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${fundComplete ? "bg-emerald-500" : "bg-gradient-to-r from-[#0F3D2E] to-[#00A86B]"}`}
              style={{ width: `${(fundFieldsFilled / fundFieldsTotal) * 100}%` }}
            />
          </div>
          {!fundComplete && (
            <p className="mt-3 text-[12.5px] text-muted-foreground leading-relaxed">
              Filling out your fund profile improves Fund Fit scoring and Ask Sam answers.
            </p>
          )}
          {topDeal && (
            <div className="mt-5 pt-4 border-t border-foreground/10">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Top-scoring deal
              </p>
              <Link
                href={`/deals/${topDeal.id}/summary`}
                className="mt-1 flex items-baseline justify-between gap-2 hover:opacity-70 transition"
              >
                <span className="font-heading font-bold text-[14px] truncate">{topDeal.companyName}</span>
                <span className={`font-mono font-bold tabular-nums text-[18px] ${getScoreColor(topDeal.analysis!.executiveSummary.overallScore).text}`}>
                  {topDeal.analysis!.executiveSummary.overallScore}
                  <span className="text-muted-foreground font-normal text-[11px]">/100</span>
                </span>
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Recent activity */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-heading text-[14px] font-bold uppercase tracking-widest text-[#0F3D2E]">
            Recent activity
          </h2>
          <Link
            href="/deals"
            className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            All deals →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">
            Nothing yet. Upload a pitch deck to populate your dealroom.
          </p>
        ) : (
          <ul className="divide-y divide-foreground/5">
            {recent.map((d) => {
              const score = d.analysis?.executiveSummary?.overallScore
              const sc = score !== undefined ? getScoreColor(score) : null
              return (
                <li key={d.id}>
                  <Link
                    href={`/deals/${d.id}/summary`}
                    className="flex items-center gap-3 py-3 hover:opacity-70 transition"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
                      <span className="text-[10px] font-mono font-bold text-[#0F3D2E]">
                        {d.companyName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-[14px] text-[#0F3D2E] truncate">
                        {d.companyName}
                      </p>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                        {d.latestAnalysisStatus === "pending" || d.latestAnalysisStatus === "processing"
                          ? "Analysing…"
                          : d.latestAnalysisStatus === "failed"
                            ? "Analysis failed"
                            : score !== undefined
                              ? d.analysis?.executiveSummary?.verdict
                              : "Awaiting analysis"}
                      </p>
                    </div>
                    {score !== undefined && sc && (
                      <span className={`font-mono font-bold tabular-nums text-[14px] ${sc.text}`}>
                        {score}
                        <span className="text-muted-foreground font-normal text-[10px]">/100</span>
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function KPI({
  icon: Icon,
  label,
  value,
  sub,
  progress,
  tone,
}: {
  icon: typeof TrendingUp
  label: string
  value: string
  sub?: string
  progress?: number | null
  tone?: "ok" | "warn"
}) {
  const toneClass =
    tone === "warn" ? "ring-amber-200 bg-amber-50/40" : "ring-foreground/10 bg-card"
  return (
    <div className={`rounded-2xl ring-1 p-4 md:p-5 ${toneClass}`}>
      <div className="flex items-center gap-2.5">
        <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
          <Icon className="h-4 w-4 text-[#0F3D2E]" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-3 font-heading font-bold text-[22px] md:text-[26px] tabular-nums tracking-[-0.01em] text-[#0F3D2E]">
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          {sub}
        </p>
      )}
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0F3D2E] to-[#00A86B]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
