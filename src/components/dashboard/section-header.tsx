import { DataCompleteness } from "./data-completeness"
import { Badge } from "@/components/ui/badge"
import { DOMAIN_VERDICT_COLORS } from "@/lib/constants"
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
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600">Analysis</p>
            <h2 className="text-lg font-semibold font-heading mt-0.5">{title}</h2>
          </div>
          <Badge variant="outline" className={`${verdictColor.bg} ${verdictColor.text} font-mono uppercase tracking-wider`}>
            {verdict}
          </Badge>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-mono font-bold text-amber-600 leading-none">{score}</span>
          <span className="text-xs font-mono text-muted-foreground">/100</span>
        </div>
      </div>
      <DataCompleteness percentage={dataCompleteness} />
    </div>
  )
}
