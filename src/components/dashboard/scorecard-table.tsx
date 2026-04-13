"use client"

import { useEffect, useRef, useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DOMAIN_VERDICT_COLORS, getScoreColor } from "@/lib/constants"
import type { ScorecardRow } from "@/lib/types/analysis"

function getBarFill(score: number) {
  if (score >= 70) return "hsl(152, 69%, 40%)"
  if (score >= 40) return "hsl(38, 92%, 50%)"
  return "hsl(0, 72%, 51%)"
}

function ScorecardChart({ scorecard }: { scorecard: ScorecardRow[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const data = scorecard.map((row) => ({
    domain: row.domain,
    score: row.score,
  }))
  const avgScore = Math.round(scorecard.reduce((a, b) => a + b.score, 0) / scorecard.length)

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && (
        <BarChart
          width={width}
          height={180}
          data={data}
          layout="vertical"
          margin={{ left: 5, right: 15, top: 5, bottom: 5 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" domain={[0, 100]} tickCount={6} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="domain" width={55} tick={{ fontSize: 11, fontWeight: 500 }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(0 0% 90%)" }}
          />
          <ReferenceLine x={avgScore} stroke="hsl(0, 0%, 70%)" strokeDasharray="4 4" strokeWidth={1} label={{ value: `avg ${avgScore}`, position: "top", fontSize: 9, fill: "hsl(0,0%,55%)" }} />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarFill(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      )}
    </div>
  )
}

export function ScorecardTable({ scorecard }: { scorecard: ScorecardRow[] }) {
  return (
    <div className="space-y-4">
      <ScorecardChart scorecard={scorecard} />

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead className="w-[70px] text-center">Score</TableHead>
            <TableHead className="w-[100px]">Verdict</TableHead>
            <TableHead>Key Finding</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scorecard.map((row) => {
            const scoreColor = getScoreColor(row.score)
            const verdictColor = DOMAIN_VERDICT_COLORS[row.verdict]
            return (
              <TableRow key={row.domain}>
                <TableCell className="font-medium">{row.domain}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className={`${scoreColor.bg} ${scoreColor.text} font-mono`}>
                    {row.score}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${verdictColor.bg} ${verdictColor.text}`}>
                    {row.verdict}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md text-sm text-muted-foreground">{row.keyFinding}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
