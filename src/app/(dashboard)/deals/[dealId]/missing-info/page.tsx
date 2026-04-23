"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DataCompleteness } from "@/components/dashboard/data-completeness"
import { SectionLabel } from "@/components/dashboard/section-label"
import { useDeal } from "@/hooks/use-deal"
import { CircleDot, MessageSquareText, Info } from "lucide-react"

export default function MissingInfoPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const missing = deal?.analysis?.missingInfo

  if (!missing) return <p className="text-sm text-muted-foreground">No missing info analysis available.</p>

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Analysis</SectionLabel>
        <h2 className="mt-1 text-lg font-semibold font-heading">Missing Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Data gaps identified in the materials provided. Use these as follow-up questions before the first call.
        </p>
        <div className="mt-4">
          <DataCompleteness percentage={missing.overallCompleteness} />
        </div>
      </div>

      {/* Explicit rule from the project plan */}
      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="pt-5 flex gap-3">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Missing information does not affect scores.</p>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              Data gaps are reported separately from domain scoring. &quot;Not found&quot; is never treated as a negative signal — sections with insufficient data are flagged as such, not marked weak.
            </p>
          </div>
        </CardContent>
      </Card>

      {missing.sections.map((section) => (
        <Card key={section.section}>
          <CardHeader>
            <SectionLabel>{section.section}</SectionLabel>
            <p className="mt-1 text-xs text-muted-foreground">{section.impact}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <CircleDot className="h-3 w-3" /> Data gaps
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <MessageSquareText className="h-3 w-3" /> Suggested follow-up questions
              </p>
              <ol className="space-y-1.5">
                {section.followUpQuestions.map((q, j) => (
                  <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-amber-600 shrink-0">0{j + 1}</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
