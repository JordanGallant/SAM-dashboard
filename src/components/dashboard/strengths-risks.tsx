import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SeverityBadge } from "./severity-badge"
import type { FindingItem } from "@/lib/types/analysis"
import { ShieldCheck, AlertTriangle } from "lucide-react"

export function StrengthsRisks({ strengths, risks }: { strengths: FindingItem[]; risks: FindingItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {strengths.map((item) => (
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Key Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {risks.map((item) => (
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
    </div>
  )
}
