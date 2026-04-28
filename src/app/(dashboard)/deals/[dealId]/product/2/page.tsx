"use client"

/** Product · V2 Editorial. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"

export default function ProductV2Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const p = deal?.analysis?.product
  if (!p) return <p className="text-sm text-muted-foreground">No product analysis.</p>

  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b pb-6 mb-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">Domain · Product</p>
        <h1 className="mt-3 font-heading font-bold leading-[1.05] text-4xl">Product Analysis</h1>
        <p className="mt-3 text-sm text-muted-foreground italic">
          {p.verdict} · PMF: {p.pmfStatus} · Data {p.dataCompleteness}%
        </p>
      </header>

      <div className="md:grid md:grid-cols-[1fr_auto] md:gap-8">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">The problem</p>
          <blockquote className="border-l-4 border-primary pl-5 py-1 italic text-[18px] leading-[1.55] text-foreground/85">
            {p.problemType}
          </blockquote>
          <p className="mt-5 text-[15px] leading-[1.75] text-foreground/85">
            <span className="font-semibold">Pain:</span> {p.painScore}
          </p>
          <p className="mt-3 text-[15px] leading-[1.75] text-foreground/85">{p.evidenceOfPain}</p>
        </div>
        <aside className="hidden md:block w-[160px] shrink-0">
          <div className="sticky top-4 flex flex-col items-center gap-2 border-l pl-6 pt-2">
            <ScoreGauge score={p.score} size={120} />
            <p className="text-[11px] font-mono uppercase tracking-wider font-bold text-red-700">{p.verdict}</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">PMF · {p.pmfStatus}</p>
          </div>
        </aside>
      </div>

      <div className="my-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">II · Current Solutions</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <p className="text-[15px] leading-[1.75] text-foreground/85 max-w-prose">{p.currentSolutions}</p>

      <div className="my-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">III · Moat</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <ol className="space-y-4 list-none">
        {p.moat.map((m, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr_auto] gap-3 items-baseline">
            <span className="font-mono text-primary tabular-nums text-sm">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[15px]">{m.type}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${m.present ? "text-emerald-700" : "text-red-700"}`}>
                  {m.present ? "present" : "absent"}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-[1.6] text-foreground/75">{m.evidence}</p>
            </div>
            <span className={`font-mono text-2xl font-bold tabular-nums ${m.strength >= 7 ? "text-emerald-700" : m.strength >= 4 ? "text-primary" : "text-red-700"}`}>
              {m.strength}
            </span>
          </li>
        ))}
      </ol>

      <div className="my-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">IV · Product-Market Fit</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <p className="text-[15px] leading-[1.75] text-foreground/85 max-w-prose">{p.pmfDetails}</p>

      {p.redFlags.length > 0 && (
        <>
          <div className="my-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">V · Red Flags</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ol className="space-y-3 list-none">
            {p.redFlags.map((f) => (
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
