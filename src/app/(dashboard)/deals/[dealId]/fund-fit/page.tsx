"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/dashboard/section-header"
import { ScoreBadge } from "@/components/dashboard/score-badge"
import { mockDeals } from "@/lib/mock-data/deals"
import { CheckCircle2, XCircle } from "lucide-react"
import { TierGate } from "@/components/dashboard/tier-gate"
import { useTier } from "@/lib/tier-context"

export default function FundFitPage() {
  const params = useParams()
  const { config } = useTier()
  const deal = mockDeals.find((d) => d.id === params.dealId)
  const fit = deal?.analysis?.fundFit

  if (!config.fundFit) {
    return <TierGate feature="Fund Fit Scoring" requiredTier="professional">
      <div />
    </TierGate>
  }

  if (!fit) return <p className="text-sm text-muted-foreground">No fund fit analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Fund Fit" score={fit.score} verdict={fit.verdict} dataCompleteness={fit.dataCompleteness} />

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Criteria Match</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead>Fund Profile</TableHead>
                <TableHead>This Deal</TableHead>
                <TableHead className="w-[80px] text-center">Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fit.criteria.map((c) => (
                <TableRow key={c.criterion}>
                  <TableCell className="font-medium">{c.criterion}</TableCell>
                  <TableCell>{c.fundProfile}</TableCell>
                  <TableCell>{c.deal}</TableCell>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            Thesis Alignment
            <ScoreBadge score={fit.thesisAlignment} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {fit.thesisAlignment >= 70
              ? "Strong alignment with fund thesis."
              : fit.thesisAlignment >= 40
                ? "Partial alignment with fund thesis. Some criteria do not match."
                : "Weak alignment with fund thesis."
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Portfolio Conflict Check</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{fit.portfolioConflict}</p></CardContent>
      </Card>
    </div>
  )
}
