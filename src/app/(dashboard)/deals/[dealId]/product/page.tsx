"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { useDeal } from "@/hooks/use-deal"

export default function ProductPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const product = deal?.analysis?.product

  if (!product) return <p className="text-sm text-muted-foreground">No product analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Product Analysis" score={product.score} verdict={product.verdict} dataCompleteness={product.dataCompleteness} />

      {/* Problem Assessment */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Problem Assessment</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline">Problem Type: {product.problemType}</Badge>
            <Badge variant="outline">Pain Score: {product.painScore}</Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Current Solutions</p>
            <p className="text-sm text-muted-foreground">{product.currentSolutions}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Evidence of Pain</p>
            <p className="text-sm text-muted-foreground">{product.evidenceOfPain}</p>
          </div>
        </CardContent>
      </Card>

      {/* Solution Comparison */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Solution & 10x Better Test</CardTitle></CardHeader>
        <CardContent>
          <MetricTable rows={product.solutionComparison} />
        </CardContent>
      </Card>

      {/* PMF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            Product-Market Fit
            <Badge variant="outline">{product.pmfStatus}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{product.pmfDetails}</p></CardContent>
      </Card>

      {/* Moat */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Moat Assessment</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Moat Type</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.moat.map((m) => (
                <TableRow key={m.type}>
                  <TableCell className="font-medium">{m.type}</TableCell>
                  <TableCell>{m.present ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{m.strength}/10</Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] text-sm text-muted-foreground">{m.evidence}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <RedFlagsList items={product.redFlags} />
    </div>
  )
}
