"use client"

/**
 * Variant 2 — Signal Matrix.
 * Decision-framework view. A 2×2 matrix plots every finding by severity × type
 * (strength/risk). KPI tile row shows the numbers that matter. A stacked bar
 * shows how each domain contributed to the overall score. Built for analysts
 * who want to stress-test the call.
 */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"

const SEV_Y: Record<string, number> = { Critical: 85, Warning: 55, Info: 25 }

function scoreHue(score: number) {
  if (score >= 70) return { text: "text-emerald-700", bar: "bg-emerald-500", fill: "#10B981" }
  if (score >= 40) return { text: "text-amber-700", bar: "bg-amber-500", fill: "#F59E0B" }
  return { text: "text-red-700", bar: "bg-red-500", fill: "#EF4444" }
}

export default function SummaryV2Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!deal?.analysis) return <p className="text-sm text-muted-foreground">No analysis yet.</p>
  const es = deal.analysis.executiveSummary

  // Distribute findings across the matrix: strengths on the left (x ~ 25–35%), risks on the right (~65–75%)
  const allFindings = [
    ...es.strengths.map((s, i) => ({ ...s, kind: "strength" as const, x: 18 + (i * 8) % 20 })),
    ...es.risks.map((r, i) => ({ ...r, kind: "risk" as const, x: 62 + (i * 8) % 20 })),
  ]

  // Domain composition — bar for each domain, width weighted by score
  const totalScore = es.scorecard.reduce((s, r) => s + r.score, 0) || 1
  const domainSegments = es.scorecard.map((row) => ({
    ...row,
    pct: (row.score / totalScore) * 100,
  }))

  // KPIs — score, verdict, confidence, data. No strength/risk counts (those are
  // implied by the matrix below; don't restate).
  const kpis = [
    { label: "Overall", value: `${es.overallScore}/100`, hue: scoreHue(es.overallScore).text },
    { label: "Verdict", value: es.verdict, hue: "text-red-700" },
    { label: "Confidence", value: es.confidence, hue: "text-foreground" },
    { label: "Data", value: `${es.dataCompleteness}%`, hue: scoreHue(es.dataCompleteness).text },
  ]

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl bg-card ring-1 ring-foreground/10 px-3 py-2.5">
            <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">{k.label}</p>
            <p className={`mt-1 font-mono text-lg font-bold tabular-nums leading-tight ${k.hue}`}>{k.value}</p>
          </div>
        ))}
      </section>

      {/* Signal matrix — the centerpiece */}
      <section className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700">Signal Matrix</p>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {es.strengths.length + es.risks.length} findings
          </p>
        </div>
        <svg viewBox="0 0 600 360" width="100%" height="360" className="overflow-visible">
          {/* Axes */}
          <line x1="50" y1="320" x2="580" y2="320" stroke="#78716C" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="320" stroke="#78716C" strokeWidth="1" />
          {/* Center guides */}
          <line x1="315" y1="20" x2="315" y2="320" stroke="#E7E5E4" strokeDasharray="4 4" />
          <line x1="50" y1="170" x2="580" y2="170" stroke="#E7E5E4" strokeDasharray="4 4" />
          {/* Axis labels */}
          <text x="50" y="340" fontFamily="monospace" fontSize="10" fill="#78716C">Strengths ←</text>
          <text x="580" y="340" fontFamily="monospace" fontSize="10" fill="#78716C" textAnchor="end">→ Risks</text>
          <text x="30" y="320" fontFamily="monospace" fontSize="10" fill="#78716C" transform="rotate(-90 30 320)">low</text>
          <text x="30" y="40" fontFamily="monospace" fontSize="10" fill="#78716C" transform="rotate(-90 30 40)">critical ↑</text>
          <text x="182" y="14" fontFamily="monospace" fontSize="9" fill="#059669" textAnchor="middle" fontWeight="700">CORE STRENGTHS</text>
          <text x="448" y="14" fontFamily="monospace" fontSize="9" fill="#B91C1C" textAnchor="middle" fontWeight="700">DEAL-BREAKERS</text>
          <text x="182" y="354" fontFamily="monospace" fontSize="9" fill="#78716C" textAnchor="middle">minor positives</text>
          <text x="448" y="354" fontFamily="monospace" fontSize="9" fill="#78716C" textAnchor="middle">minor concerns</text>

          {/* Points */}
          {allFindings.map((f, i) => {
            const cx = 50 + (f.x / 100) * 530
            const cy = 320 - ((SEV_Y[f.severity] ?? 30) / 100) * 300
            const color = f.kind === "strength" ? "#059669" : "#DC2626"
            const r = f.severity === "Critical" ? 10 : f.severity === "Warning" ? 8 : 6
            return (
              <g key={`${f.kind}-${f.id}-${i}`}>
                <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
                <text x={cx} y={cy + 3} fontFamily="monospace" fontSize="10" fill={color} textAnchor="middle" fontWeight="700">
                  {f.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend — ID → text. Severity is encoded by dot size in the chart, not restated. */}
        <div className="mt-4 grid gap-6 md:grid-cols-2 text-[12.5px] leading-snug">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 mb-2">Strengths</p>
            <ul className="space-y-1.5">
              {es.strengths.map((s) => (
                <li key={s.id} className="grid grid-cols-[1.25rem_1fr] gap-2">
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">{s.id}</span>
                  <span className="text-foreground/85">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-red-700 mb-2">Risks</p>
            <ul className="space-y-1.5">
              {es.risks.map((r) => (
                <li key={r.id} className="grid grid-cols-[1.25rem_1fr] gap-2">
                  <span className="font-mono font-bold text-red-700 tabular-nums">{r.id}</span>
                  <span className="text-foreground/85">{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Domain composition — where the score came from */}
      <section className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-3">
          Score Composition · where {es.overallScore}/100 came from
        </p>
        <div className="flex h-10 rounded-md overflow-hidden ring-1 ring-border">
          {domainSegments.map((seg) => {
            const hue = scoreHue(seg.score)
            return (
              <div
                key={seg.domain}
                className={`flex items-center justify-center text-white font-mono text-[10px] font-bold uppercase tracking-wider ${hue.bar}`}
                style={{ width: `${seg.pct}%` }}
                title={`${seg.domain}: ${seg.score}`}
              >
                {seg.pct > 10 && `${seg.domain.slice(0, 4).toUpperCase()} ${seg.score}`}
              </div>
            )
          })}
        </div>
      </section>

      {/* Thesis + next-step — compact closer */}
      <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 mb-2">Thesis</p>
          <p className="text-[13.5px] leading-[1.7] text-foreground/85">{es.thesis}</p>
        </div>
        <div className="rounded-2xl bg-stone-900 text-stone-100 p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-400 mb-2">Next Step</p>
          <p className="text-[13.5px] leading-[1.6]">{es.recommendedNextSteps[0] ?? "—"}</p>
          {es.recommendedNextSteps.length > 1 && (
            <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-stone-400">
              +{es.recommendedNextSteps.length - 1} more in the full memo
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
