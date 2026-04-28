import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react"
import type { MetricRow } from "@/lib/types/analysis"

const statusIcons = {
  check: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  critical: <XCircle className="h-4 w-4 text-red-600" />,
  gap: <HelpCircle className="h-4 w-4 text-gray-400" />,
}

export function MetricTable({
  rows,
  showBenchmark = true,
  showGrowth = false,
}: {
  rows: MetricRow[]
  showBenchmark?: boolean
  showGrowth?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#0F3D2E]/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#0F3D2E]/10 bg-[#F4FAF6]/50">
            <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Metric
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Value
            </th>
            {showGrowth && (
              <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Growth
              </th>
            )}
            {showBenchmark && (
              <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Benchmark
              </th>
            )}
            <th className="w-[40px] px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`${i !== rows.length - 1 ? "border-b border-[#0F3D2E]/5" : ""} ${i % 2 === 1 ? "bg-[#F4FAF6]/30" : ""}`}
            >
              <td className="px-4 py-3 font-heading font-semibold text-[#0A2E22]">{row.metric}</td>
              <td className="px-4 py-3 font-mono text-[13px] text-[#0A2E22] tabular-nums">{row.value}</td>
              {showGrowth && (
                <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground tabular-nums">
                  {row.growth ?? "—"}
                </td>
              )}
              {showBenchmark && (
                <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground tabular-nums">
                  {row.benchmark ?? "—"}
                </td>
              )}
              <td className="px-3 py-3">{statusIcons[row.status]}</td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground leading-relaxed">{row.statusNote ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
