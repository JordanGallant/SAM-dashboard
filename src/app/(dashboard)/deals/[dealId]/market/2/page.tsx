"use client"

/** Market · V2 Editorial — FT-style memo. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"

export default function MarketV2Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const m = deal?.analysis?.market
  if (!m) return <p className="text-sm text-muted-foreground">No market analysis.</p>

  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b pb-6 mb-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
          Domain · Market
        </p>
        <h1 className="mt-3 font-heading font-bold leading-[1.05] text-4xl">Market Analysis</h1>
        <p className="mt-3 text-sm text-muted-foreground italic">
          {m.verdict} · Data {m.dataCompleteness}% complete
        </p>
      </header>

      <div className="md:grid md:grid-cols-[1fr_auto] md:gap-8">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Why now
          </p>
          <p className="text-[17px] leading-[1.7] text-foreground">
            <span className="float-left mr-2 mt-1 font-heading text-[64px] leading-[0.8] font-bold text-primary">
              {(m.whyNow.trim().charAt(0) || "—")}
            </span>
            {m.whyNow.trim().slice(1)}
          </p>
        </div>
        <aside className="hidden md:block w-[160px] shrink-0">
          <div className="sticky top-4 flex flex-col items-center gap-2 border-l pl-6 pt-2">
            <ScoreGauge score={m.score} size={120} />
            <p className="text-[11px] font-mono uppercase tracking-wider font-bold text-red-700">
              {m.verdict}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Why-now · {m.whyNowScore}
            </p>
          </div>
        </aside>
      </div>

      <div className="my-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">II · Market Size</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <section className="grid grid-cols-3 gap-6">
        {m.marketSize.map((row) => (
          <div key={row.metric} className="border-l-2 border-primary pl-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">{row.metric}</p>
            <p className="mt-1 text-lg font-semibold leading-tight">{row.validatedEstimate}</p>
            <p className="mt-2 text-[12px] leading-[1.5] text-muted-foreground italic">
              Founder: {row.founderClaim}
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-foreground/70">{row.assessment}</p>
          </div>
        ))}
      </section>

      <div className="my-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">III · Dynamics</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-[15px] leading-[1.75] text-foreground/85 max-w-prose">{m.marketDynamics}</p>

      <div className="my-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">IV · Competitive Field</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <ol className="space-y-5 list-none">
        {m.competitors.map((c, i) => (
          <li key={c.name} className="grid grid-cols-[2rem_1fr] gap-3">
            <span className="font-mono text-primary tabular-nums text-sm pt-1">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-[15px]">{c.name}</span>
                {c.funding && <span className="text-[11px] font-mono text-muted-foreground">{c.funding}</span>}
                <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-red-700">
                  {c.threatLevel} threat
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-[1.6] text-foreground/75">{c.differentiation}</p>
            </div>
          </li>
        ))}
      </ol>

      {m.redFlags.length > 0 && (
        <>
          <div className="my-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">V · Red Flags</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ol className="space-y-3 list-none">
            {m.redFlags.map((f) => (
              <li key={f.id} className="grid grid-cols-[1.5rem_1fr] gap-2 text-[14px] leading-[1.6]">
                <span className="font-mono text-red-700 tabular-nums">{String(f.id).padStart(2, "0")}</span>
                <span className="text-foreground/85">{f.text}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </article>
  )
}
