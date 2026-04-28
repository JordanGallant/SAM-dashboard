"use client"

import { useEffect, useRef, useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine, Tooltip } from "recharts"
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

  const data = scorecard.map((row) => ({ domain: row.domain, score: row.score }))
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
          <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.25} />
          <XAxis type="number" domain={[0, 100]} tickCount={6} tick={{ fontSize: 10, fontFamily: "var(--font-jetbrains-mono, monospace)" }} />
          <YAxis
            type="category"
            dataKey="domain"
            width={60}
            tick={{ fontSize: 11, fontWeight: 600, fill: "#0A2E22" }}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 12,
              border: "1px solid rgba(15,61,46,0.12)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          />
          <ReferenceLine
            x={avgScore}
            stroke="rgba(15,61,46,0.35)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: `avg ${avgScore}`, position: "top", fontSize: 9, fill: "rgba(15,61,46,0.6)" }}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={20}>
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
    <div className="space-y-5">
      <ScorecardChart scorecard={scorecard} />

      <div className="border-t border-[#0F3D2E]/10" />

      <div className="overflow-hidden rounded-2xl border border-[#0F3D2E]/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#0F3D2E]/10 bg-[#F4FAF6]/50">
              <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Domain
              </th>
              <th className="w-[80px] text-center px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Score
              </th>
              <th className="w-[130px] text-left px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Verdict
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Key finding
              </th>
            </tr>
          </thead>
          <tbody>
            {scorecard.map((row, i) => {
              const scoreColor = getScoreColor(row.score)
              const verdictColor = DOMAIN_VERDICT_COLORS[row.verdict]
              return (
                <tr
                  key={row.domain}
                  className={`${i !== scorecard.length - 1 ? "border-b border-[#0F3D2E]/5" : ""} ${i % 2 === 1 ? "bg-[#F4FAF6]/30" : ""}`}
                >
                  <td className="px-4 py-3.5 font-heading font-semibold text-[#0A2E22]">{row.domain}</td>
                  <td className="px-3 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-mono font-bold tabular-nums ring-1 ring-black/5 ${scoreColor.bg} ${scoreColor.text}`}
                    >
                      {row.score}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest ring-1 ring-black/5 ${verdictColor.bg} ${verdictColor.text}`}
                    >
                      {row.verdict}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 max-w-md text-[13px] text-muted-foreground leading-relaxed">
                    {row.keyFinding}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
