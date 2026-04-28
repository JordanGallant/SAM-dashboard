"use client"

/** Market · V1 Terminal — Bloomberg-style monospace tables. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"

const threatColor: Record<string, string> = {
  "Very High": "text-red-700 font-bold",
  High: "text-red-600",
  Medium: "text-primary",
  Low: "text-emerald-600",
}

function scoreHue(score: number) {
  return score >= 70 ? "text-emerald-600" : score >= 40 ? "text-primary" : "text-red-600"
}

export default function MarketV1Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const m = deal?.analysis?.market
  if (!m) return <p className="text-sm text-muted-foreground">No market analysis.</p>

  return (
    <div className="font-mono text-[13px] leading-[1.55] space-y-5">
      <div className="border-y-2 border-foreground py-1.5 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-[0.1em]">Market Analysis</span>
        <span>
          <span className={`text-xl font-bold tabular-nums ${scoreHue(m.score)}`}>{m.score}</span>
          <span className="text-muted-foreground">/100 · {m.verdict.toUpperCase()} · DATA {m.dataCompleteness}%</span>
        </span>
      </div>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; MARKET SIZE</p>
        <div className="border-y border-border divide-y divide-border">
          <div className="grid grid-cols-[4rem_1fr_1fr_1fr_2fr] gap-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Metric</span><span>Founder Claim</span><span>Validated</span><span>Variance</span><span>Assessment</span>
          </div>
          {m.marketSize.map((row) => (
            <div key={row.metric} className="grid grid-cols-[4rem_1fr_1fr_1fr_2fr] gap-3 py-1.5 items-start">
              <span className="font-bold text-primary">{row.metric}</span>
              <span className="text-foreground/85">{row.founderClaim}</span>
              <span className="text-foreground/85">{row.validatedEstimate}</span>
              <span className="text-foreground/70">{row.variance}</span>
              <span className="text-foreground/70">{row.assessment}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; WHY NOW</p>
        <p className="text-[12.5px] leading-[1.7] max-w-prose whitespace-pre-wrap">
          <span className="text-red-700 font-bold mr-2">[{m.whyNowScore.toUpperCase()}]</span>
          {m.whyNow}
        </p>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; MARKET DYNAMICS</p>
        <p className="text-[12.5px] leading-[1.7] max-w-prose whitespace-pre-wrap text-foreground/85">{m.marketDynamics}</p>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; COMPETITORS ({m.competitors.length})</p>
        <div className="border-y border-border divide-y divide-border">
          <div className="grid grid-cols-[1fr_1fr_1fr_3fr] gap-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Name</span><span>Funding</span><span>Threat</span><span>Differentiation</span>
          </div>
          {m.competitors.map((c) => (
            <div key={c.name} className="grid grid-cols-[1fr_1fr_1fr_3fr] gap-3 py-1.5 items-start">
              <span className="font-bold">{c.name}</span>
              <span className="text-foreground/70">{c.funding ?? "—"}</span>
              <span className={`uppercase ${threatColor[c.threatLevel]}`}>{c.threatLevel}</span>
              <span className="text-foreground/70">{c.differentiation}</span>
            </div>
          ))}
        </div>
      </section>

      {m.redFlags.length > 0 && (
        <section>
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-700 mb-1">&gt; RED FLAGS ({m.redFlags.length})</p>
          <ul className="divide-y divide-border border-y border-border">
            {m.redFlags.map((f) => (
              <li key={f.id} className="py-2 text-[12.5px]">
                <span className="text-red-700 font-bold">[{f.severity.toUpperCase().slice(0, 4)}]</span>{" "}
                {f.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
