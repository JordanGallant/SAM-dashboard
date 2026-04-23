"use client"

/** Traction · V1 Terminal. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import type { MetricRow } from "@/lib/types/analysis"

const STATUS_CHAR: Record<string, { ch: string; cls: string }> = {
  check: { ch: "✓", cls: "text-emerald-600" },
  warning: { ch: "!", cls: "text-amber-600" },
  critical: { ch: "✕", cls: "text-red-600" },
  gap: { ch: "∅", cls: "text-muted-foreground" },
}

function scoreHue(score: number) {
  return score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-red-600"
}

function MetricTable({ title, rows }: { title: string; rows: MetricRow[] }) {
  if (rows.length === 0) return null
  return (
    <section>
      <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700 mb-1">&gt; {title}</p>
      <div className="border-y border-border divide-y divide-border">
        <div className="grid grid-cols-[2rem_1.5fr_1fr_1fr_1fr_2fr] gap-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span></span><span>Metric</span><span>Value</span><span>Benchmark</span><span>Growth</span><span>Note</span>
        </div>
        {rows.map((row, i) => {
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
  )
}

export default function TractionV1Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const t = deal?.analysis?.traction
  if (!t) return <p className="text-sm text-muted-foreground">No traction analysis.</p>

  return (
    <div className="font-mono text-[13px] leading-[1.55] space-y-5">
      <div className="border-y-2 border-foreground py-1.5 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-[0.1em]">Traction Analysis</span>
        <span>
          <span className={`text-xl font-bold tabular-nums ${scoreHue(t.score)}`}>{t.score}</span>
          <span className="text-muted-foreground">/100 · {t.verdict.toUpperCase()} · DATA {t.dataCompleteness}%</span>
        </span>
      </div>

      <MetricTable title="REVENUE METRICS" rows={t.revenueMetrics} />
      <MetricTable title="UNIT ECONOMICS" rows={t.unitEconomics} />
      <MetricTable title="RETENTION" rows={t.retention} />

      {t.redFlags.length > 0 && (
        <section>
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-700 mb-1">&gt; RED FLAGS ({t.redFlags.length})</p>
          <ul className="divide-y divide-border border-y border-border">
            {t.redFlags.map((f) => (
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
