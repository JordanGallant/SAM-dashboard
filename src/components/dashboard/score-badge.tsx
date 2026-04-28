import { getScoreColor } from "@/lib/constants"

export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const colors = getScoreColor(score)
  return (
    <span
      className={`inline-flex items-baseline gap-1 rounded-full ring-1 ring-black/5 px-2.5 py-0.5 text-xs font-mono font-semibold ${colors.bg} ${colors.text}`}
    >
      {label && <span className="font-sans text-[10px] uppercase tracking-widest opacity-70">{label}</span>}
      <span className="tabular-nums">{score}</span>
      <span className="opacity-60 text-[10px]">/ 100</span>
    </span>
  )
}
