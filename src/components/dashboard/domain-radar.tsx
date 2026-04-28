"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { ScorecardRow } from "@/lib/types/analysis"

/**
 * Radar chart of the 6 scorecard domains. Instantly shows deal shape:
 * balanced circle = well-rounded, spiky = lopsided.
 */
export function DomainRadar({ scorecard, height = 280 }: { scorecard: ScorecardRow[]; height?: number }) {
  const data = scorecard.map((r) => ({ domain: r.domain, score: r.score, fullMark: 100 }))
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#E7E5E4" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fontSize: 11, fill: "#78716C", fontFamily: "var(--font-jetbrains-mono), monospace" }}
          />
          <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={{ fontSize: 9, fill: "#A8A29E" }} axisLine={false} />
          <Radar
            dataKey="score"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.18}
            strokeWidth={2}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E7E5E4", fontFamily: "var(--font-jetbrains-mono), monospace" }}
            formatter={(v) => [`${v} / 100`, "Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
