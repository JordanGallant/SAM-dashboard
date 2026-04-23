import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SeverityBadge } from "./severity-badge"
import { AlertTriangle } from "lucide-react"
import type { FindingItem } from "@/lib/types/analysis"

export function RedFlagsList({ items }: { items: FindingItem[] }) {
  if (items.length === 0) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          Red Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-2 text-sm">
              <span className="shrink-0 text-muted-foreground">{item.id}.</span>
              <div>
                <SeverityBadge severity={item.severity} />
                <p className="mt-1 text-muted-foreground">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
