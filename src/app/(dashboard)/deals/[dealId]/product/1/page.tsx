"use client"

/** Product · V1 Terminal. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"

function scoreHue(score: number) {
  return score >= 70 ? "text-emerald-600" : score >= 40 ? "text-primary" : "text-red-600"
}

const STATUS_CHAR: Record<string, { ch: string; cls: string }> = {
  check: { ch: "✓", cls: "text-emerald-600" },
  warning: { ch: "!", cls: "text-primary" },
  critical: { ch: "✕", cls: "text-red-600" },
  gap: { ch: "∅", cls: "text-muted-foreground" },
}

export default function ProductV1Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const p = deal?.analysis?.product
  if (!p) return <p className="text-sm text-muted-foreground">No product analysis.</p>

  return (
    <div className="font-mono text-[13px] leading-[1.55] space-y-5">
      <div className="border-y-2 border-foreground py-1.5 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-[0.1em]">Product Analysis</span>
        <span>
          <span className={`text-xl font-bold tabular-nums ${scoreHue(p.score)}`}>{p.score}</span>
          <span className="text-muted-foreground">/100 · {p.verdict.toUpperCase()} · DATA {p.dataCompleteness}%</span>
        </span>
      </div>

      <section className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; PROBLEM TYPE</p>
          <p className="text-[12.5px]">{p.problemType}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; PAIN SCORE</p>
          <p className="text-[12.5px]">{p.painScore}</p>
        </div>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; EVIDENCE OF PAIN</p>
        <p className="text-[12.5px] leading-[1.7] text-foreground/85 max-w-prose whitespace-pre-wrap">{p.evidenceOfPain}</p>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; CURRENT SOLUTIONS</p>
        <p className="text-[12.5px] leading-[1.7] text-foreground/85 max-w-prose whitespace-pre-wrap">{p.currentSolutions}</p>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">
          &gt; SOLUTION COMPARISON ({p.solutionComparison.length})
        </p>
        <div className="border-y border-border divide-y divide-border">
          <div className="grid grid-cols-[2rem_1.5fr_1fr_1fr_1fr_2fr] gap-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span></span><span>Metric</span><span>Value</span><span>Benchmark</span><span>Growth</span><span>Note</span>
          </div>
          {p.solutionComparison.map((row, i) => {
            const s = STATUS_CHAR[row.status]
            return (
              <div key={i} className="grid grid-cols-[2rem_1.5fr_1fr_1fr_1fr_2fr] gap-3 py-1.5 items-start">
                <span className={`font-bold ${s.cls}`}>{s.ch}</span>
                <span className="font-bold">{row.metric}</span>
                <span>{row.value}</span>
                <span className="text-foreground/70">{row.benchmark ?? "—"}</span>
                <span className="text-foreground/70">{row.growth ?? "—"}</span>
                <span className="text-foreground/70">{row.statusNote ?? ""}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; PMF · {p.pmfStatus.toUpperCase()}</p>
        <p className="text-[12.5px] leading-[1.7] text-foreground/85 max-w-prose whitespace-pre-wrap">{p.pmfDetails}</p>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">&gt; MOAT MATRIX</p>
        <div className="border-y border-border divide-y divide-border">
          <div className="grid grid-cols-[1.5fr_1fr_3rem_3fr] gap-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Type</span><span>Present</span><span>1-10</span><span>Evidence</span>
          </div>
          {p.moat.map((row, i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1fr_3rem_3fr] gap-3 py-1.5 items-start">
              <span className="font-bold">{row.type}</span>
              <span className={row.present ? "text-emerald-600" : "text-red-600"}>
                [{row.present ? "YES" : "NO "}]
              </span>
              <span className={`tabular-nums font-bold ${row.strength >= 7 ? "text-emerald-600" : row.strength >= 4 ? "text-primary" : "text-red-600"}`}>
                {row.strength}
              </span>
              <span className="text-foreground/70">{row.evidence}</span>
            </div>
          ))}
        </div>
      </section>

      {p.redFlags.length > 0 && (
        <section>
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-700 mb-1">&gt; RED FLAGS ({p.redFlags.length})</p>
          <ul className="divide-y divide-border border-y border-border">
            {p.redFlags.map((f) => (
              <li key={f.id} className="py-2 text-[12.5px]">
                <span className="text-red-700 font-bold">[{f.severity.toUpperCase().slice(0, 4)}]</span> {f.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
