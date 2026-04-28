"use client"

/** Traction · V2 Editorial. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import type { MetricRow } from "@/lib/types/analysis"

function MetricList({ rows }: { rows: MetricRow[] }) {
  if (rows.length === 0) return <p className="text-sm italic text-muted-foreground">No data reported.</p>
  return (
    <ol className="space-y-3 list-none">
      {rows.map((row, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr_auto] gap-3 items-baseline border-b pb-2 last:border-0">
          <span className="font-mono text-primary tabular-nums text-sm">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <span className="font-semibold text-[14px]">{row.metric}</span>
            {row.statusNote && <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{row.statusNote}</p>}
          </div>
          <span className="font-mono text-sm tabular-nums">{row.value}</span>
        </li>
      ))}
    </ol>
  )
}

export default function TractionV2Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const t = deal?.analysis?.traction
  if (!t) return <p className="text-sm text-muted-foreground">No traction analysis.</p>

  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b pb-6 mb-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">Domain · Traction</p>
        <h1 className="mt-3 font-heading font-bold leading-[1.05] text-4xl">Traction Analysis</h1>
        <p className="mt-3 text-sm text-muted-foreground italic">
          {t.verdict} · Data {t.dataCompleteness}% complete
        </p>
      </header>

      <div className="md:grid md:grid-cols-[1fr_auto] md:gap-8 mb-8">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Reading</p>
          <p className="text-[16px] leading-[1.75] text-foreground">
            Numbers tell the story here. Each metric below carries a status: a reported value, how it
            stacks against the benchmark, and what it implies for the underwriting.
          </p>
        </div>
        <aside className="hidden md:block w-[160px] shrink-0">
          <div className="sticky top-4 flex flex-col items-center gap-2 border-l pl-6 pt-2">
            <ScoreGauge score={t.score} size={120} />
            <p className="text-[11px] font-mono uppercase tracking-wider font-bold text-red-700">{t.verdict}</p>
          </div>
        </aside>
      </div>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">II · Revenue</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <MetricList rows={t.revenueMetrics} />

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">III · Unit Economics</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <MetricList rows={t.unitEconomics} />

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">IV · Retention</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <MetricList rows={t.retention} />

      {t.redFlags.length > 0 && (
        <>
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">V · Red Flags</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ol className="space-y-3 list-none">
            {t.redFlags.map((f) => (
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
