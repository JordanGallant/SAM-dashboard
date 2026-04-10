"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/dashboard/section-header"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { mockDeals } from "@/lib/mock-data/deals"
import { THREAT_COLORS, DOMAIN_VERDICT_COLORS } from "@/lib/constants"

export default function MarketPage() {
  const params = useParams()
  const deal = mockDeals.find((d) => d.id === params.dealId)
  const market = deal?.analysis?.market

  if (!market) return <p className="text-sm text-muted-foreground">No market analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Market Analysis" score={market.score} verdict={market.verdict} dataCompleteness={market.dataCompleteness} />

      {/* TAM/SAM/SOM */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Market Size Validation</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Founder Claim</TableHead>
                <TableHead>Validated Estimate</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Assessment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {market.marketSize.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{row.founderClaim}</TableCell>
                  <TableCell>{row.validatedEstimate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.variance}</TableCell>
                  <TableCell className="max-w-[200px] text-sm text-muted-foreground">{row.assessment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Market Dynamics */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Market Dynamics</CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{market.marketDynamics}</p></CardContent>
      </Card>

      {/* Why Now */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            Why Now?
            <Badge variant="outline" className={`${DOMAIN_VERDICT_COLORS[market.whyNowScore].bg} ${DOMAIN_VERDICT_COLORS[market.whyNowScore].text}`}>
              {market.whyNowScore}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{market.whyNow}</p></CardContent>
      </Card>

      {/* Competitive Landscape */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Competitive Landscape</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor</TableHead>
                <TableHead>Funding</TableHead>
                <TableHead>Threat Level</TableHead>
                <TableHead>Differentiation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {market.competitors.map((c) => {
                const colors = THREAT_COLORS[c.threatLevel]
                return (
                  <TableRow key={c.name}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.funding ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${colors.bg} ${colors.text}`}>{c.threatLevel}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] text-sm text-muted-foreground">{c.differentiation}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RedFlagsList items={market.redFlags} />
    </div>
  )
}
