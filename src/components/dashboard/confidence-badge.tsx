import { Badge } from "@/components/ui/badge"
import type { Confidence } from "@/lib/types/analysis"

const colors: Record<Confidence, string> = {
  High: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-red-100 text-red-700",
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <Badge variant="outline" className={colors[confidence]}>
      Confidence: {confidence}
    </Badge>
  )
}
