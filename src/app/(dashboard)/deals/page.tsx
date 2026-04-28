"use client"

import { useState, Suspense, useMemo } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Upload, BarChart3, ArrowRight, Briefcase } from "lucide-react"
import { DealCreateDialog } from "@/components/deals/deal-create-dialog"
import { FundProfileBanner } from "@/components/dashboard/fund-profile-banner"
import { useDeals } from "@/hooks/use-deals"
import { getScoreColor, VERDICT_COLORS } from "@/lib/constants"

function DealsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(searchParams.get("new") === "true")
  const { deals, loading, refetch } = useDeals()

  function handleDealCreated(dealId: string) {
    refetch()
    setDialogOpen(false)
    router.push(`/deals/${dealId}/summary`)
  }

  const stats = useMemo(() => {
    const analyzed = deals.filter((d) => d.analysis).length
    const awaiting = deals.length - analyzed
    const avgScore =
      analyzed > 0
        ? Math.round(
            deals
              .filter((d) => d.analysis?.executiveSummary.overallScore !== undefined)
              .reduce((acc, d) => acc + (d.analysis?.executiveSummary.overallScore ?? 0), 0) /
              analyzed
          )
        : 0
    return { analyzed, awaiting, avgScore }
  }, [deals])

  return (
    <div className="space-y-6">
      <FundProfileBanner />

      {/* Header */}
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

          <div className="flex items-center gap-3">
            {/* Avg score mini-card */}
            {stats.analyzed > 0 && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-[#0F3D2E]/10 bg-white px-4 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B]">
                  <BarChart3 className="h-4 w-4 text-[#D4FF6B]" />
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                    Avg score
                  </p>
                  <p className="text-base font-mono font-bold text-[#0A2E22] tabular-nums leading-none">
                    {stats.avgScore}
                    <span className="text-[10px] font-mono text-muted-foreground ml-0.5">/ 100</span>
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setDialogOpen(true)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="h-4 w-4" />
              New deal
            </button>
          </div>
        </div>
      </div>

      {!loading && deals.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#0F3D2E]/15 bg-white py-20 px-6 text-center">
          <div className="mb-5 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
            <BarChart3 className="h-6 w-6 text-[#0F3D2E]" />
          </div>
          <h3 className="text-xl font-heading font-bold text-[#0A2E22]">No deals yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Create a deal for each startup, then upload their pitch deck to get an AI-generated investment analysis.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Create your first deal
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => {
            const exec = deal.analysis?.executiveSummary
            const verdict = exec?.verdict
            const score = exec?.overallScore
            const thesis = exec?.thesis
            const metaBits = [deal.stage, exec?.sector, exec?.geography].filter(Boolean) as string[]
            const scoreColor = score !== undefined ? getScoreColor(score) : null
            return (
              <Link key={deal.id} href={`/deals/${deal.id}/summary`} className="group">
                <div className="relative h-full rounded-2xl border border-[#0F3D2E]/10 bg-white p-5 md:p-6 shadow-sm hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
                          <span className="text-[11px] font-mono font-bold text-[#0F3D2E]">
                            {deal.companyName
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading font-bold text-[15px] text-[#0A2E22] leading-tight truncate">
                            {deal.companyName}
                          </h3>
                          {metaBits.length > 0 && (
                            <p className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground truncate">
                              {metaBits.join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {verdict && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ring-1 ring-black/5 shrink-0 ${VERDICT_COLORS[verdict].bg} ${VERDICT_COLORS[verdict].text}`}
                      >
                        {verdict}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  {thesis ? (
                    <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                      {thesis}
                    </p>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-6 rounded-xl border-2 border-dashed border-[#0F3D2E]/15 bg-[#F4FAF6]/50">
                      <span className="flex items-center gap-2 text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
                        <Upload className="h-3.5 w-3.5" />
                        Awaiting analysis
                      </span>
                    </div>
                  )}

                  {/* Footer score + arrow */}
                  {score !== undefined && scoreColor && (
                    <div className="mt-4 pt-4 border-t border-[#0F3D2E]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                          Score
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-mono font-bold tabular-nums ring-1 ring-black/5 ${scoreColor.bg} ${scoreColor.text}`}
                        >
                          {score} / 100
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#0F3D2E]/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <DealCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={handleDealCreated} />
    </div>
  )
}

export default function DealsPage() {
  return (
    <Suspense>
      <DealsContent />
    </Suspense>
  )
}
