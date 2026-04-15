"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DataCompleteness } from "@/components/dashboard/data-completeness"
import { useDeal } from "@/hooks/use-deal"
import { CircleDot, MessageSquareText } from "lucide-react"

export default function MissingInfoPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const missing = deal?.analysis?.missingInfo

  if (!missing) return <p className="text-sm text-muted-foreground">No missing info analysis available.</p>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Missing Information</h2>
        <DataCompleteness percentage={missing.overallCompleteness} />
      </div>

      {missing.sections.map((section, i) => (
        <Card key={section.section}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{section.section}</CardTitle>
            <p className="text-xs text-muted-foreground">{section.impact}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <CircleDot className="h-3 w-3" /> Data Gaps
              </p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="h-4 w-4 rounded-full bg-red-100 border-red-200 p-0 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <MessageSquareText className="h-3 w-3" /> Suggested Follow-Up Questions
              </p>
              <ol className="list-decimal list-inside space-y-1">
                {section.followUpQuestions.map((q, j) => (
                  <li key={j} className="text-sm text-muted-foreground">{q}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
