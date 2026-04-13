"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { ScorecardRow } from "@/lib/types/analysis"

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(221, 83%, 53%)",
  },
  completeness: {
    label: "Data Available",
    color: "hsl(160, 60%, 45%)",
  },
} satisfies ChartConfig

function getBarColor(score: number) {
  if (score >= 70) return "hsl(152, 69%, 40%)"
  if (score >= 40) return "hsl(38, 92%, 50%)"
  return "hsl(0, 72%, 51%)"
}

export function DomainRadarChart({ scorecard }: { scorecard: ScorecardRow[] }) {
  const data = scorecard.map((row) => ({
    domain: row.domain,
    score: row.score,
    completeness: row.dataCompleteness,
  }))

  const avgScore = Math.round(scorecard.reduce((a, b) => a + b.score, 0) / scorecard.length)

  return (
    <Card>
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Domain Scores</CardTitle>
          <span className="text-xs text-muted-foreground">avg {avgScore}/100</span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 15, top: 5, bottom: 5 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" domain={[0, 100]} tickCount={6} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="domain" width={60} tick={{ fontSize: 11, fontWeight: 500 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine x={avgScore} stroke="hsl(0, 0%, 60%)" strokeDasharray="3 3" strokeWidth={1} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={18} name="Score">
              {data.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Data completeness mini-bars */}
        <div className="mt-3 border-t pt-3">
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Data Completeness</p>
          <div className="flex gap-2">
            {scorecard.map((row) => (
              <div key={row.domain} className="flex-1 text-center">
                <div className="mx-auto h-12 w-full max-w-[32px] rounded-t-sm bg-muted relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm bg-emerald-400/70 transition-all"
                    style={{ height: `${row.dataCompleteness}%` }}
                  />
                </div>
                <p className="mt-1 text-[9px] font-medium text-muted-foreground leading-tight">{row.domain.slice(0, 4)}</p>
                <p className="text-[9px] tabular-nums text-muted-foreground">{row.dataCompleteness}%</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
