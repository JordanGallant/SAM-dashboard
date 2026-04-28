"use client"

/** Market · V3 Visual — TAM/SAM/SOM rings, threat bar chart, gauge. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"

const THREAT_WIDTH: Record<string, { pct: number; bg: string; text: string }> = {
  "Very High": { pct: 100, bg: "bg-red-700", text: "text-red-700" },
  High: { pct: 75, bg: "bg-red-500", text: "text-red-700" },
  Medium: { pct: 50, bg: "bg-primary/100", text: "text-primary" },
  Low: { pct: 25, bg: "bg-emerald-500", text: "text-emerald-700" },
}

export default function MarketV3Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const m = deal?.analysis?.market
  if (!m) return <p className="text-sm text-muted-foreground">No market analysis.</p>

  return (
    <div className="space-y-6">
      {/* Hero: score + TAM/SAM/SOM concentric rings */}
      <section className="grid gap-6 md:grid-cols-[auto_1fr] items-center bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        <div className="flex flex-col items-center gap-2">
          <ScoreGauge score={m.score} size={140} />
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">{m.verdict}</p>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Why-now · {m.whyNowScore}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary mb-3">Market Size</p>
          <div className="relative h-[180px] flex items-center justify-center">
            <svg viewBox="0 0 300 180" width="100%" height="180">
              {/* Concentric rings — TAM outermost, SOM innermost */}
              <circle cx="150" cy="90" r="85" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" opacity="0.55" />
              <circle cx="150" cy="90" r="58" fill="#FDE68A" stroke="#D97706" strokeWidth="2" opacity="0.7" />
              <circle cx="150" cy="90" r="30" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <text x="150" y="30" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#B45309">TAM</text>
              <text x="150" y="58" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#B45309">SAM</text>
              <text x="150" y="94" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#fff">SOM</text>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2 text-center">
            {m.marketSize.map((row) => (
              <div key={row.metric}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">{row.metric}</p>
                <p className="text-sm font-semibold mt-0.5 leading-tight">{row.validatedEstimate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor threat bars */}
      <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary mb-4">
          Competitive threat map · {m.competitors.length}
        </p>
        <div className="space-y-2.5">
          {m.competitors.map((c) => {
            const t = THREAT_WIDTH[c.threatLevel]
            return (
              <div key={c.name} className="grid grid-cols-[7rem_1fr_auto] gap-3 items-center">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">{c.name}</p>
                  {c.funding && <p className="text-[10px] font-mono text-muted-foreground">{c.funding}</p>}
                </div>
                <div className="h-5 bg-muted rounded-md overflow-hidden">
                  <div className={`h-full ${t.bg} transition-all`} style={{ width: `${t.pct}%` }} />
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${t.text}`}>
                  {c.threatLevel}
                </span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Bar length = threat severity · colour-coded
        </p>
      </section>

      {/* Why now / dynamics — side by side text blocks */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary mb-3">Why Now</p>
          <p className="text-[13px] leading-[1.7] text-foreground/80">{m.whyNow}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary mb-3">Market Dynamics</p>
          <p className="text-[13px] leading-[1.7] text-foreground/80">{m.marketDynamics}</p>
        </div>
      </section>

      {m.redFlags.length > 0 && (
        <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-3">
            Red Flags · {m.redFlags.length}
          </p>
          <ul className="space-y-2">
            {m.redFlags.map((f) => (
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
