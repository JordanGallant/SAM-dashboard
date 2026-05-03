"use client"

import { useState, Suspense, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, Search, Trash2, X, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { DeckUploader } from "@/components/deals/deck-uploader"
import { FundProfileBanner } from "@/components/dashboard/fund-profile-banner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDeals } from "@/hooks/use-deals"
import {
  getScoreColor,
  VERDICT_COLORS,
  PIPELINE_STAGES,
  DEAL_STAGES,
  STATUS_BADGE_COLORS,
  STAGE_BADGE_COLORS,
} from "@/lib/constants"
import { deleteDeal } from "@/app/actions/deals"
import { verdictLabel } from "@/lib/verdict-label"
import type { Deal, DealStage, PipelineStatus } from "@/lib/types/deal"

type ScoreBucket = "all" | "high" | "mid" | "low"

function DealsContent() {
  const { deals, loading, refetch } = useDeals()

  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<DealStage | "all">("all")
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | "all">("all")
  const [scoreBucket, setScoreBucket] = useState<ScoreBucket>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [retryingId, setRetryingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Deal | null>(null)

  function requestDelete(e: React.MouseEvent, deal: Deal) {
    e.preventDefault()
    e.stopPropagation()
    setConfirmDelete(deal)
  }

  async function confirmDeleteAction() {
    if (!confirmDelete) return
    const deal = confirmDelete
    setDeletingId(deal.id)
    const res = await deleteDeal(deal.id)
    setDeletingId(null)
    setConfirmDelete(null)
    if (res.error) {
      window.alert(`Failed to delete: ${res.error}`)
      return
    }
    refetch()
  }

  async function handleRetry(e: React.MouseEvent, deal: Deal) {
    e.preventDefault()
    e.stopPropagation()
    if (retryingId) return
    setRetryingId(deal.id)
    try {
      const res = await fetch("/api/analysis/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        window.alert(`Couldn't start analysis: ${data.error || res.statusText}`)
      } else {
        refetch()
      }
    } catch (err) {
      window.alert(`Couldn't start analysis: ${err instanceof Error ? err.message : "network error"}`)
    } finally {
      setRetryingId(null)
    }
  }

  const failedDeals = useMemo(
    () => deals.filter((d) => d.latestAnalysisStatus === "failed"),
    [deals]
  )

  const [retryingAll, setRetryingAll] = useState(false)
  async function retryAllFailed() {
    if (retryingAll || failedDeals.length === 0) return
    setRetryingAll(true)
    try {
      // Fire sequentially to be polite to the n8n queue. Errors are silently ignored
      // — the per-row status will reflect the outcome once Realtime fires.
      for (const d of failedDeals) {
        await fetch("/api/analysis/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dealId: d.id }),
        }).catch(() => {})
      }
      refetch()
    } finally {
      setRetryingAll(false)
    }
  }

  const filtered = useMemo(() => {
    return deals.filter((d) => {
      if (search && !d.companyName.toLowerCase().includes(search.toLowerCase())) return false
      if (stageFilter !== "all" && d.stage !== stageFilter) return false
      if (statusFilter !== "all" && d.status !== statusFilter) return false
      if (scoreBucket !== "all") {
        const score = d.analysis?.executiveSummary.overallScore
        if (score === undefined) return false
        if (scoreBucket === "high" && score < 70) return false
        if (scoreBucket === "mid" && (score < 40 || score >= 70)) return false
        if (scoreBucket === "low" && score >= 40) return false
      }
      return true
    })
  }, [deals, search, stageFilter, statusFilter, scoreBucket])

  // Sort newest-first, then split into two sections:
  // - Needs attention: failed (or stalled) — needs the user to reanalyse
  // - Analysed: everything else (completed, in-flight, or never started)
  const { needsAttention, analysed } = useMemo(() => {
    const sortedAll = [...filtered].sort((a, b) => {
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return tb - ta
    })
    const attn: Deal[] = []
    const ok: Deal[] = []
    for (const d of sortedAll) {
      if (d.latestAnalysisStatus === "failed") attn.push(d)
      else ok.push(d)
    }
    return { needsAttention: attn, analysed: ok }
  }, [filtered])

  const stats = useMemo(() => {
    const analyzed = deals.filter((d) => d.analysis).length
    return { analyzed, awaiting: deals.length - analyzed }
  }, [deals])

  const hasFilters =
    search.length > 0 || stageFilter !== "all" || statusFilter !== "all" || scoreBucket !== "all"

  function clearFilters() {
    setSearch("")
    setStageFilter("all")
    setStatusFilter("all")
    setScoreBucket("all")
  }

  return (
    <div className="space-y-6">
      <FundProfileBanner />

      <div className="relative overflow-hidden rounded-3xl border border-[#0F3D2E]/10 bg-gradient-to-br from-white via-[#F4FAF6] to-white p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_100%_0%,rgba(212,255,107,0.15),transparent_70%)]" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
              <Briefcase className="h-3 w-3" />
              Your deals
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-[-0.025em] text-[#0A2E22]">
              Dealroom
            </h1>
            <p className="mt-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              {loading
                ? "Loading…"
                : deals.length === 0
                ? "No deals tracked"
                : `${deals.length} total · ${stats.analyzed} analysed · ${stats.awaiting} awaiting`}
            </p>
          </div>

          <DeckUploader variant="compact" onCreated={() => refetch()} />
        </div>
      </div>

      {!loading && deals.length === 0 && (
        <DeckUploader onCreated={() => refetch()} />
      )}

      {!loading && failedDeals.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 ring-1 ring-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-700" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-900">
              {failedDeals.length === 1 ? "1 analysis failed" : `${failedDeals.length} analyses failed`}
            </p>
            <p className="mt-0.5 text-[12.5px] text-red-900/80 leading-snug">
              {failedDeals.length === 1
                ? "Click below or use the per-deal Reanalyse button to retry."
                : "Retry all at once or use the per-deal Reanalyse buttons below."}
            </p>
          </div>
          <button
            onClick={retryAllFailed}
            disabled={retryingAll}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-700 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-white transition-colors disabled:opacity-60"
          >
            {retryingAll ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Retrying…</>
            ) : (
              <><RefreshCw className="h-3 w-3" /> Retry all</>
            )}
          </button>
        </div>
      )}

      {!loading && deals.length > 0 && (
        <>
          {/* Filter bar */}
          <div className="rounded-2xl border border-[#0F3D2E]/10 bg-white p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by company name…"
                  className="w-full rounded-full border border-[#0F3D2E]/10 bg-[#F4FAF6]/40 pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as DealStage | "all")}>
                <SelectTrigger
                  className={`w-full sm:w-[140px] ${stageFilter !== "all" ? "ring-1 ring-primary/40 bg-primary/5 text-foreground" : "text-muted-foreground"}`}
                >
                  {stageFilter === "all" ? "Stage" : <span className="font-medium text-foreground">{stageFilter}</span>}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  {DEAL_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PipelineStatus | "all")}>
                <SelectTrigger
                  className={`w-full sm:w-[140px] ${statusFilter !== "all" ? "ring-1 ring-primary/40 bg-primary/5 text-foreground" : "text-muted-foreground"}`}
                >
                  {statusFilter === "all" ? "Status" : <span className="font-medium text-foreground">{statusFilter}</span>}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {PIPELINE_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={scoreBucket} onValueChange={(v) => setScoreBucket(v as ScoreBucket)}>
                <SelectTrigger
                  className={`w-full sm:w-[140px] ${scoreBucket !== "all" ? "ring-1 ring-primary/40 bg-primary/5 text-foreground" : "text-muted-foreground"}`}
                >
                  {scoreBucket === "all" ? "Score" : (
                    <span className="font-medium text-foreground">
                      {scoreBucket === "high" ? "70+" : scoreBucket === "mid" ? "40–69" : "Below 40"}
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any score</SelectItem>
                  <SelectItem value="high">70+</SelectItem>
                  <SelectItem value="mid">40–69</SelectItem>
                  <SelectItem value="low">Below 40</SelectItem>
                </SelectContent>
              </Select>

              {hasFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-2"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              ) : (
                <span aria-hidden />
              )}
            </div>
          </div>

          {needsAttention.length === 0 && analysed.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#0F3D2E]/15 bg-white p-10 text-center">
              <p className="text-sm text-muted-foreground">No deals match the filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-[11px] font-mono uppercase tracking-widest text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {analysed.length > 0 && (
                <DealSection title="Analysed" subtitle={analysed.length === 1 ? "1 deal" : `${analysed.length} deals`} deals={analysed} retryingId={retryingId} deletingId={deletingId} onRetry={handleRetry} onDelete={requestDelete} />
              )}
              {needsAttention.length > 0 && (
                <DealSection title="Failed" subtitle="Reanalyse these to recover their reports" deals={needsAttention} retryingId={retryingId} deletingId={deletingId} onRetry={handleRetry} onDelete={requestDelete} />
              )}
            </div>
          )}
        </>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => deletingId === null && setConfirmDelete(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && deletingId === null) setConfirmDelete(null)
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-[#0F3D2E]/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-confirm-title" className="font-heading text-lg font-bold text-[#0A2E22]">
              Delete this deal?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-[#0A2E22]">{confirmDelete.companyName}</span> and its analysis, documents, and history will be permanently removed. This cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deletingId !== null}
                className="rounded-full border border-[#0F3D2E]/15 bg-white px-4 py-2 text-sm font-medium text-[#0A2E22] hover:bg-[#F4FAF6] transition-colors disabled:opacity-50"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                disabled={deletingId !== null}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId !== null ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete deal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type RowHandlers = {
  retryingId: string | null
  deletingId: string | null
  onRetry: (e: React.MouseEvent, deal: Deal) => void
  onDelete: (e: React.MouseEvent, deal: Deal) => void
}

function DealSection({
  title,
  subtitle,
  deals,
  retryingId,
  deletingId,
  onRetry,
  onDelete,
}: {
  title: string
  subtitle: string
  deals: Deal[]
} & RowHandlers) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-2 px-1">
        <h2 className="font-heading text-[13px] font-bold uppercase tracking-widest text-[#0A2E22]">
          {title}
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground tabular-nums">
          {subtitle}
        </span>
        <div className="flex-1 h-px bg-[#0F3D2E]/10" />
      </div>
      <ul className="overflow-hidden rounded-2xl border border-[#0F3D2E]/10 bg-white divide-y divide-[#0F3D2E]/5">
        {deals.map((deal) => (
          <DealRow
            key={deal.id}
            deal={deal}
            retryingId={retryingId}
            deletingId={deletingId}
            onRetry={onRetry}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  )
}

function DealRow({
  deal,
  retryingId,
  deletingId,
  onRetry,
  onDelete,
}: { deal: Deal } & RowHandlers) {
  const exec = deal.analysis?.executiveSummary
  const verdict = exec?.verdict
  const score = exec?.overallScore
  const scoreColor = score !== undefined ? getScoreColor(score) : null
  const isDeleting = deletingId === deal.id
  const isFailed = deal.latestAnalysisStatus === "failed"
  const isRunning = deal.latestAnalysisStatus === "pending" || deal.latestAnalysisStatus === "processing"

  return (
    <li className="group relative flex items-stretch hover:bg-[#F4FAF6]/40 transition-colors">
      <Link href={`/deals/${deal.id}/summary`} className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
          <span className="text-[11px] font-mono font-bold text-[#0F3D2E]">
            {deal.companyName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-bold text-[14px] text-[#0A2E22] truncate">
              {deal.companyName}
            </h3>
            <span className={`hidden sm:inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest shrink-0 ${STAGE_BADGE_COLORS[deal.stage] ?? "bg-gray-100 text-gray-700"}`}>
              {deal.stage}
            </span>
            <span className={`hidden sm:inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest shrink-0 ${STATUS_BADGE_COLORS[deal.status] ?? "bg-gray-100 text-gray-700"}`}>
              {deal.status}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground truncate">
            {[exec?.sector, exec?.geography].filter(Boolean).join(" · ") ||
              (isFailed ? "Analysis failed" : isRunning ? "Analysing…" : "Awaiting analysis")}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isRunning && !verdict && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
              <Loader2 className="h-3 w-3 animate-spin" />
              Analysing
            </span>
          )}
          {verdict && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ring-1 ring-black/5 ${VERDICT_COLORS[verdict].bg} ${VERDICT_COLORS[verdict].text}`}>
              {verdictLabel(verdict)}
            </span>
          )}
          {score !== undefined && scoreColor && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-mono font-bold tabular-nums ring-1 ring-black/5 ${scoreColor.bg} ${scoreColor.text}`}>
              {score} / 100
            </span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-[#0F3D2E]/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
      {isFailed && (
        <button
          onClick={(e) => onRetry(e, deal)}
          disabled={retryingId === deal.id}
          className="self-center mr-2 inline-flex items-center gap-1.5 shrink-0 rounded-full bg-red-50 hover:bg-red-100 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-red-700 ring-1 ring-red-200 transition-colors disabled:opacity-60"
          aria-label={`Reanalyse ${deal.companyName}`}
        >
          {retryingId === deal.id ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Starting</>
          ) : (
            <><RefreshCw className="h-3 w-3" /> Reanalyse</>
          )}
        </button>
      )}
      <button
        onClick={(e) => onDelete(e, deal)}
        disabled={isDeleting}
        className="self-center mr-3 grid place-items-center h-8 w-8 shrink-0 rounded-full text-muted-foreground bg-white ring-1 ring-[#0F3D2E]/10 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
        aria-label={`Delete ${deal.companyName}`}
      >
        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    </li>
  )
}

export default function DealsPage() {
  return (
    <Suspense>
      <DealsContent />
    </Suspense>
  )
}
