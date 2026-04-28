"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { useDeal } from "@/hooks/use-deal"
import { CheckCircle2, XCircle } from "lucide-react"
import { TierGate } from "@/components/dashboard/tier-gate"
import { useTier } from "@/lib/tier-context"

export default function FundFitPage() {
  const params = useParams()
  const { config } = useTier()
  const { deal } = useDeal(params.dealId as string)
  const fit = deal?.analysis?.fundFit

  if (!config.fundFit) {
    return (
      <TierGate feature="Fund Fit Scoring" requiredTier="professional">
        <div />
      </TierGate>
    )
  }

  if (!fit) return <p className="text-sm text-muted-foreground">No fund fit analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Fund Fit" score={fit.score} verdict={fit.verdict} dataCompleteness={fit.dataCompleteness} />

      <Card>
        <CardHeader><SectionLabel>Criteria match</SectionLabel></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead>Fund profile</TableHead>
                <TableHead>This deal</TableHead>
                <TableHead className="w-[80px] text-center">Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fit.criteria.map((c) => (
                <TableRow key={c.criterion}>
                  <TableCell className="font-medium">{c.criterion}</TableCell>
                  <TableCell className="text-muted-foreground">{c.fundProfile}</TableCell>
                  <TableCell className="text-muted-foreground">{c.deal}</TableCell>
                  <TableCell className="text-center">
                    {c.match
                      ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                      : <XCircle className="mx-auto h-4 w-4 text-red-500" />
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionLabel>Thesis alignment</SectionLabel>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-primary leading-none">{fit.thesisAlignment}</span>
            <span className="text-xs font-mono text-muted-foreground">/100</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {fit.thesisAlignment >= 70
              ? "Strong alignment with fund thesis."
              : fit.thesisAlignment >= 40
                ? "Partial alignment with fund thesis. Some criteria do not match."
                : "Weak alignment with fund thesis."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><SectionLabel>Portfolio conflict check</SectionLabel></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{fit.portfolioConflict}</p></CardContent>
      </Card>
    </div>
  )
}
