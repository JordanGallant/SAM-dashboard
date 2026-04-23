"use client"

/** Traction · V3 Visual — KPI tile grid with status dot + mini trend arrow. */

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import type { MetricRow } from "@/lib/types/analysis"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

function statusColor(status: MetricRow["status"]) {
  switch (status) {
    case "check": return { dot: "bg-emerald-500", text: "text-emerald-700" }
    case "warning": return { dot: "bg-amber-500", text: "text-amber-700" }
    case "critical": return { dot: "bg-red-500", text: "text-red-700" }
    case "gap": return { dot: "bg-stone-400", text: "text-muted-foreground" }
  }
}

function growthIcon(growth?: string) {
  if (!growth) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
  const up = /\+|up|growth|increase/i.test(growth)
  const down = /-|down|decline|decrease/i.test(growth)
  if (up && !down) return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
  if (down) return <TrendingDown className="h-3.5 w-3.5 text-red-600" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

function KpiGrid({ title, rows, accent }: { title: string; rows: MetricRow[]; accent: string }) {
  if (rows.length === 0) return null
  return (
    <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
      <p className={`text-[10px] font-mono uppercase tracking-[0.15em] mb-4 ${accent}`}>{title}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, i) => {
          const c = statusColor(row.status)
          return (
            <div key={i} className="rounded-lg border bg-background px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
                  {row.metric}
                </p>
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-lg font-mono font-bold tabular-nums">{row.value}</span>
                {row.growth && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-mono text-muted-foreground">
                    {growthIcon(row.growth)}
                    {row.growth}
                  </span>
                )}
              </div>
              {row.benchmark && (
                <p className="text-[10px] font-mono text-muted-foreground mt-1">vs {row.benchmark}</p>
              )}
              {row.statusNote && (
                <p className={`text-[11px] leading-snug mt-1.5 ${c.text}`}>{row.statusNote}</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function TractionV3Page() {
  const params = useParams()
  const { deal, loading } = useDeal(params.dealId as string)
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const t = deal?.analysis?.traction
  if (!t) return <p className="text-sm text-muted-foreground">No traction analysis.</p>

  return (
    <div className="space-y-6">
      {/* Hero score */}
      <section className="grid gap-6 md:grid-cols-[auto_1fr] items-center bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
        <div className="flex flex-col items-center gap-2">
          <ScoreGauge score={t.score} size={140} />
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">{t.verdict}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-2">Traction</p>
          <p className="text-[14px] leading-[1.6] text-foreground/80 max-w-prose">
            {t.revenueMetrics.length + t.unitEconomics.length + t.retention.length === 0
              ? "No traction metrics reported."
              : `${t.revenueMetrics.length} revenue · ${t.unitEconomics.length} unit-econ · ${t.retention.length} retention metrics tracked.`}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${t.dataCompleteness}%` }} />
            </div>
            <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
              DATA {t.dataCompleteness}%
            </span>
          </div>
        </div>
      </section>

      <KpiGrid title="Revenue" rows={t.revenueMetrics} accent="text-amber-700" />
      <KpiGrid title="Unit Economics" rows={t.unitEconomics} accent="text-amber-700" />
      <KpiGrid title="Retention" rows={t.retention} accent="text-amber-700" />

      {t.redFlags.length > 0 && (
        <section className="bg-card rounded-2xl p-6 ring-1 ring-foreground/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-3">Red Flags · {t.redFlags.length}</p>
          <ul className="space-y-2">
            {t.redFlags.map((f) => (
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
