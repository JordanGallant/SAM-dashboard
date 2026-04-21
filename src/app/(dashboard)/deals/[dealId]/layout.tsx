"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Loader2, ArrowLeft, Lock } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import { useDeal } from "@/hooks/use-deal"
import { ANALYSIS_TABS, STAGE_BADGE_COLORS, STATUS_BADGE_COLORS, PIPELINE_STAGES } from "@/lib/constants"
import { getScoreColor } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { updateDealStatus } from "@/app/actions/deals"
import type { PipelineStatus } from "@/lib/types/deal"

export default function DealDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const dealId = params.dealId as string
  const { deal, loading, refetch } = useDeal(dealId)
  const { config: tierConfig } = useTier()
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")

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
  const activeTab = pathname.split("/").pop() || "summary"

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
    setAnalyzeError("")
    try {
      const res = await fetch("/api/analysis/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAnalyzeError(data.error || "Failed to start analysis")
      } else {
        refetch()
      }
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Network error")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Deal header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/deals" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold">{deal.companyName}</h1>
        <Badge className={STAGE_BADGE_COLORS[deal.stage]}>{deal.stage}</Badge>
        <Select defaultValue={deal.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-7 w-auto gap-1 text-xs">
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
        {!analysis && (
          <Button
            size="sm"
            onClick={handleRunAnalysis}
            disabled={analyzing || deal.documents.length === 0}
            title={deal.documents.length === 0 ? "Upload a pitch deck first" : undefined}
          >
            {analyzing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
            {analyzing ? "Starting..." : "Analyze Pitch Deck"}
          </Button>
        )}
      </div>

      {analyzeError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {analyzeError}
        </div>
      )}

      {/* Tab navigation (only when analysis exists) */}
      {analysis && (
        <nav className="flex gap-1 overflow-x-auto border-b pb-px">
          {ANALYSIS_TABS.map(({ key, label }) => {
            const score = getTabScore(key)
            const isActive = activeTab === key
            const isGated = gatedTabs[key] ?? false
            return (
              <Link
                key={key}
                href={`/deals/${dealId}/${key}`}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                  isGated && "opacity-60"
                )}
              >
                {isGated && <Lock className="h-3 w-3" />}
                {label}
                {score !== undefined && !isGated && (
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getScoreColor(score).bg} ${getScoreColor(score).text}`}>
                    {score}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      )}

      {/* Tab content */}
      <div>{children}</div>
    </div>
  )
}
