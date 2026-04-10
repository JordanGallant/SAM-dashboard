import { Badge } from "@/components/ui/badge"
import { getScoreColor } from "@/lib/constants"

export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const colors = getScoreColor(score)
  return (
    <Badge variant="outline" className={`${colors.bg} ${colors.text} font-mono`}>
      {label && <span className="mr-1 font-sans">{label}:</span>}
      {score}/100
    </Badge>
  )
}
