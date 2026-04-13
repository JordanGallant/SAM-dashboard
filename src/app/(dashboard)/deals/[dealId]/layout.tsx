"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Loader2, ArrowLeft, Lock } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import { mockDeals } from "@/lib/mock-data/deals"
import { ANALYSIS_TABS, STAGE_BADGE_COLORS, STATUS_BADGE_COLORS, PIPELINE_STAGES } from "@/lib/constants"
import { getScoreColor } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function DealDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const dealId = params.dealId as string
  const deal = mockDeals.find((d) => d.id === dealId)
  const [analyzing, setAnalyzing] = useState(false)

  if (!deal) {
    return <div className="p-6 text-center text-muted-foreground">Deal not found</div>
  }

  const { config: tierConfig } = useTier()
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

  return (
    <div className="space-y-4">
      {/* Deal header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/deals" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold">{deal.companyName}</h1>
        <Badge className={STAGE_BADGE_COLORS[deal.stage]}>{deal.stage}</Badge>
        <Select defaultValue={deal.status}>
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
            onClick={() => { setAnalyzing(true); setTimeout(() => setAnalyzing(false), 3000) }}
            disabled={analyzing}
          >
            {analyzing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
            {analyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        )}
      </div>

      {/* Tab navigation */}
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
