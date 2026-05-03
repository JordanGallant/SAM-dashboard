import { VERDICT_COLORS } from "@/lib/constants"
import type { Verdict } from "@/lib/types/analysis"
import { verdictLabel } from "@/lib/verdict-label"

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const colors = VERDICT_COLORS[verdict]
  return (
    <div
      className={`inline-flex items-center rounded-full px-5 py-2 text-xl md:text-2xl font-bold font-heading tracking-[-0.02em] ring-1 ring-black/5 shadow-sm ${colors.bg} ${colors.text}`}
    >
      {verdictLabel(verdict).toUpperCase()}
    </div>
  )
}
