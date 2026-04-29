"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Loader2, ArrowLeft, Lock } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import { useDeal } from "@/hooks/use-deal"
import { STATUS_BADGE_COLORS, PIPELINE_STAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { updateDealStatus } from "@/app/actions/deals"
import { friendlyError, type FriendlyError } from "@/lib/errors"
import type { PipelineStatus } from "@/lib/types/deal"
import { DealBottomSheet } from "@/components/layout/deal-bottom-sheet"

export default function DealDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const dealId = params.dealId as string
  const { deal, loading, refetch, analysisStatus } = useDeal(dealId)
  const { config: tierConfig } = useTier()
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<FriendlyError | null>(null)

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading deal...</p>
  }

  if (!deal) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground">Deal not found.</p>
        <Link href="/deals" className="text-sm text-primary hover:underline mt-2 inline-block">Back to Dealroom</Link>
      </div>
    )
  }

  const analysis = deal.analysis
  const tabKeys = new Set(["summary", "team", "market", "product", "traction", "finance", "exit", "fund-fit", "missing-info"])
  const activeTab = pathname.split("/").filter(Boolean).reverse().find((s) => tabKeys.has(s)) || "summary"

  const gatedTabs: Record<string, boolean> = {
    "fund-fit": !tierConfig.fundFit,
  }

  function getTabScore(tabKey: string): number | undefined {
    if (!analysis) return undefined
    const map: Record<string, number | undefined> = {
      summary: analysis.executiveSummary.overallScore,
      team: analysis.team.score,
      market: analysis.market.score,
      product: analysis.product.score,
      traction: analysis.traction.score,
      finance: analysis.finance.score,
      exit: analysis.exitPotential.score,
      "fund-fit": analysis.fundFit.score,
    }
    return map[tabKey]
  }

  async function handleStatusChange(status: string | null) {
    if (!status) return
    await updateDealStatus(dealId, status as PipelineStatus)
  }

  async function handleRunAnalysis() {
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      const res = await fetch("/api/analysis/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAnalyzeError(friendlyError(data.error || "Failed to start analysis", "trigger"))
      } else {
        refetch()
      }
    } catch (err) {
      setAnalyzeError(friendlyError(err, "trigger"))
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Deal header — editorial, single line */}
      <div className="space-y-2">
        <Link href="/deals" className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" />
          Dealroom
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-heading font-bold leading-none">{deal.companyName}</h1>
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {deal.stage}
          </span>
          <Select defaultValue={deal.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-7 w-auto gap-1 text-[11px] font-mono uppercase tracking-wider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PIPELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  <Badge variant="outline" className={`${STATUS_BADGE_COLORS[s]} border-0`}>{s}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!analysis && (analysisStatus === "pending" || analysisStatus === "processing") && (
            <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[12px] font-medium text-primary">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Analysing… ~30 min</span>
            </div>
          )}
          {!analysis && analysisStatus !== "pending" && analysisStatus !== "processing" && (
            <Button
              size="sm"
              onClick={handleRunAnalysis}
              disabled={analyzing || deal.documents.length === 0}
              title={deal.documents.length === 0 ? "Upload a pitch deck first" : undefined}
              className="ml-auto"
            >
              {analyzing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
              {analyzing ? "Starting..." : analysisStatus === "failed" ? "Retry analysis" : "Analyze pitch deck"}
            </Button>
          )}
        </div>
      </div>

      {analyzeError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <p className="font-medium">{analyzeError.title}</p>
          {analyzeError.hint && (
            <p className="mt-0.5 text-[12.5px] text-red-700/85">{analyzeError.hint}</p>
          )}
        </div>
      )}

      {/* Body: content on left · right sub-nav */}
      <div className="flex items-start gap-6">
        {/* Content fills available width */}
        <div className="flex-1 min-w-0">{children}</div>

        {analysis && (
          <nav className="w-56 shrink-0 hidden md:block sticky top-4 self-start">
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={group.label} className={cn(groupIdx > 0 && "mt-5")}>
                <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/80">
                  {group.label}
                </p>
                <ul>
                  {group.items.map(({ key, label }) => {
                    const score = getTabScore(key)
                    const isActive = activeTab === key
                    const isGated = gatedTabs[key] ?? false
                    const dotColor =
                      score === undefined
                        ? "bg-muted-foreground/25"
                        : score >= 70
                        ? "bg-emerald-500"
                        : score >= 40
                        ? "bg-primary/100"
                        : "bg-red-500"
                    return (
                      <li key={key}>
                        <Link
                          href={`/deals/${dealId}/${key}`}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                            isActive
                              ? "text-foreground bg-muted/70"
                              : "text-foreground/55 hover:text-foreground hover:bg-muted/40",
                            isGated && "opacity-60"
                          )}
                        >
                          {/* Fixed-size dot wrapper — ring never pushes siblings */}
                          <span aria-hidden className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                            <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
                            {isActive && (
                              <span className="absolute inset-0 rounded-full ring-2 ring-current opacity-30" />
                            )}
                          </span>
                          {isGated && <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />}
                          <span className="truncate">{label}</span>
                          {!isGated && (
                            <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground group-hover:text-foreground">
                              {score ?? "—"}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>
      <DealBottomSheet />
    </div>
  )
}

const NAV_GROUPS: { label: string; items: { key: string; label: string }[] }[] = [
  { label: "Overview", items: [{ key: "summary", label: "Executive Summary" }] },
  {
    label: "Domains",
    items: [
      { key: "team", label: "Team" },
      { key: "market", label: "Market" },
      { key: "product", label: "Product" },
      { key: "traction", label: "Traction" },
      { key: "finance", label: "Finance" },
      { key: "exit", label: "Exit Potential" },
    ],
  },
  {
    label: "Review",
    items: [
      { key: "fund-fit", label: "Fund Fit" },
      { key: "missing-info", label: "Missing Info" },
    ],
  },
]
