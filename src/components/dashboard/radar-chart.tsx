"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { getScoreColor, DOMAIN_VERDICT_COLORS } from "@/lib/constants"
import type { ScorecardRow } from "@/lib/types/analysis"

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(221, 83%, 53%)",
  },
  completeness: {
    label: "Data Completeness",
    color: "hsl(160, 60%, 45%)",
  },
} satisfies ChartConfig

export function DomainRadarChart({ scorecard }: { scorecard: ScorecardRow[] }) {
  const data = scorecard.map((row) => ({
    domain: row.domain,
    score: row.score,
    completeness: row.dataCompleteness,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Domain Scores</CardTitle>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[hsl(221,83%,53%)]" />
            Score
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[hsl(160,60%,45%)]" />
            Data Available
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} tickCount={6} />
            <Radar
              name="Data Completeness"
              dataKey="completeness"
              stroke="hsl(160, 60%, 45%)"
              fill="hsl(160, 60%, 45%)"
              fillOpacity={0.15}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(221, 83%, 53%)"
              fill="hsl(221, 83%, 53%)"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>

        {/* Domain breakdown bars */}
        <div className="mt-4 space-y-2">
          {scorecard.map((row) => {
            const scoreColor = getScoreColor(row.score)
            const verdictColor = DOMAIN_VERDICT_COLORS[row.verdict]
            return (
              <div key={row.domain} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{row.domain}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${verdictColor.bg} ${verdictColor.text} text-[10px] px-1.5 py-0`}>
                      {row.verdict}
                    </Badge>
                    <span className={`font-mono text-[11px] font-semibold ${scoreColor.text}`}>{row.score}</span>
                  </div>
                </div>
                <div className="flex gap-0.5 h-1.5">
                  <div
                    className={`rounded-l-full ${scoreColor.bg.replace('100', '400')}`}
                    style={{ width: `${row.score}%` }}
                    title={`Score: ${row.score}%`}
                  />
                  <div
                    className="rounded-r-full bg-muted"
                    style={{ width: `${100 - row.score}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span>{row.dataCompleteness}% data available</span>
                  {row.dataCompleteness < 40 && (
                    <span className="text-amber-600">— low confidence</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
