import { VERDICT_COLORS } from "@/lib/constants"
import type { Verdict } from "@/lib/types/analysis"

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const colors = VERDICT_COLORS[verdict]
  return (
    <div className={`inline-flex items-center rounded-lg px-4 py-2 text-2xl font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
      {verdict.toUpperCase()}
    </div>
  )
}
