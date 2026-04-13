"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileDown, Mail } from "lucide-react"
import { VerdictBadge } from "@/components/dashboard/verdict-badge"
import { ConfidenceBadge } from "@/components/dashboard/confidence-badge"
import { DomainRadarChart } from "@/components/dashboard/radar-chart"
import { ScorecardTable } from "@/components/dashboard/scorecard-table"
import { StrengthsRisks } from "@/components/dashboard/strengths-risks"
import { DataCompleteness } from "@/components/dashboard/data-completeness"
import { ScoreBadge } from "@/components/dashboard/score-badge"
import { mockDeals } from "@/lib/mock-data/deals"

export default function SummaryPage() {
  const params = useParams()
  const deal = mockDeals.find((d) => d.id === params.dealId)
  const analysis = deal?.analysis

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold">No Analysis Yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload documents and run analysis to see results here.</p>
      </div>
    )
  }

  const es = analysis.executiveSummary

  return (
    <div className="space-y-6">
      {/* Verdict + Score row */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <VerdictBadge verdict={es.verdict} />
          <ConfidenceBadge confidence={es.confidence} />
          <ScoreBadge score={es.overallScore} label="Overall" />
          <div className="ml-auto flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{es.stage}</Badge>
            <Badge variant="outline">{es.geography}</Badge>
            <Badge variant="outline">Raising: {es.raising}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Radar + Scorecard */}
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        <DomainRadarChart scorecard={es.scorecard} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Investment Scorecard</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ScorecardTable scorecard={es.scorecard} />
          </CardContent>
        </Card>
      </div>

      {/* Thesis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Investment Thesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{es.thesis}</p>
        </CardContent>
      </Card>

      {/* Strengths + Risks */}
      <StrengthsRisks strengths={es.strengths} risks={es.risks} />

      {/* Next Steps */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {es.recommendedNextSteps.map((step, i) => (
              <li key={i} className="text-sm text-muted-foreground">{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Data completeness + Export */}
      <div className="space-y-4">
        <DataCompleteness percentage={es.dataCompleteness} />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Generate Word Doc
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email Summary
          </Button>
        </div>
      </div>
    </div>
  )
}
