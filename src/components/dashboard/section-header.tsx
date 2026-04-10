import { ScoreBadge } from "./score-badge"
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
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <ScoreBadge score={score} />
        <Badge variant="outline" className={`${verdictColor.bg} ${verdictColor.text}`}>
          {verdict}
        </Badge>
      </div>
      <DataCompleteness percentage={dataCompleteness} />
    </div>
  )
}
