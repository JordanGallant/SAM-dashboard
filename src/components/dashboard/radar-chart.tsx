"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getScoreColor, DOMAIN_VERDICT_COLORS } from "@/lib/constants"
import type { ScorecardRow } from "@/lib/types/analysis"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

function getBarColor(score: number) {
  if (score >= 70) return "bg-emerald-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function getBarBg(score: number) {
  if (score >= 70) return "bg-emerald-100"
  if (score >= 40) return "bg-amber-100"
  return "bg-red-100"
}

export function DomainRadarChart({ scorecard }: { scorecard: ScorecardRow[] }) {
  const avgScore = Math.round(scorecard.reduce((a, b) => a + b.score, 0) / scorecard.length)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Domain Scores</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg</span>
            <Badge variant="outline" className={`font-mono text-xs ${getScoreColor(avgScore).bg} ${getScoreColor(avgScore).text}`}>
              {avgScore}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Horizontal bar chart */}
        {scorecard.map((row) => {
          const verdictColor = DOMAIN_VERDICT_COLORS[row.verdict]
          return (
            <div key={row.domain} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium w-16">{row.domain}</span>
                  <Badge variant="outline" className={`${verdictColor.bg} ${verdictColor.text} text-[10px] px-1.5 py-0`}>
                    {row.verdict}
                  </Badge>
                </div>
                <span className={`font-mono text-sm font-semibold ${getScoreColor(row.score).text}`}>
                  {row.score}
                </span>
              </div>

              {/* Score bar */}
              <div className={`h-3 w-full rounded-full ${getBarBg(row.score)} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${getBarColor(row.score)} transition-all duration-500`}
                  style={{ width: `${row.score}%` }}
                />
              </div>

              {/* Data completeness indicator */}
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${row.dataCompleteness}%` }}
                  />
                </div>
                <span className="text-[10px] tabular-nums text-muted-foreground w-20 text-right">
                  {row.dataCompleteness}% data
                  {row.dataCompleteness < 40 && <span className="text-amber-600"> !</span>}
                </span>
              </div>
            </div>
          )
        })}

        {/* Legend */}
        <div className="flex gap-4 pt-1 border-t text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded-full bg-red-500" /> Score
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-1 w-4 rounded-full bg-emerald-400" /> Data available
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
