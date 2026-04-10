import { Badge } from "@/components/ui/badge"
import { SEVERITY_COLORS } from "@/lib/constants"
import type { Severity } from "@/lib/types/analysis"

export function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = SEVERITY_COLORS[severity]
  return (
    <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border} text-[10px]`}>
      {severity}
    </Badge>
  )
}
