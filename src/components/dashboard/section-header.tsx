import { DataCompleteness } from "./data-completeness"
import { DOMAIN_VERDICT_COLORS, getScoreColor } from "@/lib/constants"
import type { DomainVerdict } from "@/lib/types/analysis"

export function SectionHeader({
  title,
  score,
  verdict,
  dataCompleteness,
}: {
  title: string
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
}) {
  const verdictColor = DOMAIN_VERDICT_COLORS[verdict]
  const scoreColor = getScoreColor(score)
  return (
    <div className="space-y-4 pb-5 border-b border-[#0F3D2E]/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
              Analysis
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold font-heading tracking-[-0.02em] text-[#0A2E22]">
              {title}
            </h2>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest ring-1 ring-black/5 ${verdictColor.bg} ${verdictColor.text}`}
          >
            {verdict}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-mono font-bold leading-none tabular-nums ${scoreColor.text}`}>
            {score}
          </span>
          <span className="text-xs font-mono text-muted-foreground">/100</span>
        </div>
      </div>
      <DataCompleteness percentage={dataCompleteness} />
    </div>
  )
}
