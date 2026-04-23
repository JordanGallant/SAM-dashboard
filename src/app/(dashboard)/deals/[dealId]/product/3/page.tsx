"use client"

/** Product · V3 Visual — moat radar, PMF gauge, solution comparison bars. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"

export default function ProductV3Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const p = deal?.analysis?.product
  if (!p) return <p className="text-sm text-muted-foreground">No product analysis.</p>

  const moatData = p.moat.map((m) => ({
    type: m.type,
    strength: m.present ? m.strength : 0,
    fullMark: 10,
  }))

  return (
    <div className="space-y-6">
      {/* Hero — score + problem + pain */}
      <section className="grid gap-6 md:grid-cols-[auto_1fr] items-center bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        <div className="flex flex-col items-center gap-2">
          <ScoreGauge score={p.score} size={140} />
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">{p.verdict}</p>
          <div className="mt-1 px-2.5 py-1 rounded-full bg-muted">
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold">PMF · {p.pmfStatus}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-2">Problem</p>
          <p className="text-[15px] leading-[1.6] text-foreground/85 mb-4">{p.problemType}</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-1">Pain</p>
          <p className="text-[13px] leading-[1.55] text-foreground/75">{p.painScore}</p>
        </div>
      </section>

      {/* Moat radar */}
      {p.moat.length > 0 && (
        <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-2">Moat Profile</p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <RadarChart data={moatData} outerRadius="72%">
                <PolarGrid stroke="#E7E5E4" />
                <PolarAngleAxis dataKey="type" tick={{ fontSize: 10, fill: "#78716C", fontFamily: "monospace" }} />
                <Radar
                  dataKey="strength"
                  stroke="#D97706"
                  fill="#D97706"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  animationDuration={700}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center">
            0 = absent · 10 = category-defining moat
          </p>
        </section>
      )}

      {/* Solution comparison bars */}
      {p.solutionComparison.length > 0 && (
        <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-4">Solution Comparison</p>
          <div className="space-y-3">
            {p.solutionComparison.map((row, i) => {
              const statusColor =
                row.status === "check"
                  ? "bg-emerald-500"
                  : row.status === "warning"
                  ? "bg-amber-500"
                  : row.status === "critical"
                  ? "bg-red-500"
                  : "bg-stone-400"
              return (
                <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium truncate">{row.metric}</p>
                    {row.statusNote && <p className="text-[11px] text-muted-foreground truncate">{row.statusNote}</p>}
                  </div>
                  <span className={`h-3 w-3 rounded-full ${statusColor}`} />
                  <span className="font-mono text-sm tabular-nums text-right min-w-[5rem]">{row.value}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* PMF details + current solutions as side-by-side text */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-3">PMF Details</p>
          <p className="text-[13px] leading-[1.7] text-foreground/80">{p.pmfDetails}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-3">Current Solutions</p>
          <p className="text-[13px] leading-[1.7] text-foreground/80">{p.currentSolutions}</p>
        </div>
      </section>

      {p.redFlags.length > 0 && (
        <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-3">Red Flags · {p.redFlags.length}</p>
          <ul className="space-y-2">
            {p.redFlags.map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-[12.5px] leading-snug">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${f.severity === "Critical" ? "bg-red-700" : f.severity === "Warning" ? "bg-red-500" : "bg-red-300"}`} />
                <span className="text-foreground/80">{f.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
