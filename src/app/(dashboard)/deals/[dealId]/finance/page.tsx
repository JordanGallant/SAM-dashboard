"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionHeader } from "@/components/dashboard/section-header"
import { MetricTable } from "@/components/dashboard/metric-table"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { useDeal } from "@/hooks/use-deal"

export default function FinancePage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const finance = deal?.analysis?.finance

  if (!finance) return <p className="text-sm text-muted-foreground">No financial analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Financial Analysis" score={finance.score} verdict={finance.verdict} dataCompleteness={finance.dataCompleteness} />

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Financial Health</CardTitle></CardHeader>
        <CardContent><MetricTable rows={finance.financialHealth} showBenchmark={false} /></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Capital Efficiency</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{finance.capitalEfficiency}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Investor Signals</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{finance.investorSignals}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Valuation Assessment</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Implied Value</TableHead>
                <TableHead>Basis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finance.valuation.map((v) => (
                <TableRow key={v.method}>
                  <TableCell className="font-medium">{v.method}</TableCell>
                  <TableCell>{v.impliedValue}</TableCell>
                  <TableCell className="max-w-[300px] text-sm text-muted-foreground">{v.basis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Deal Terms & Cap Table</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{finance.dealTerms}</p></CardContent>
      </Card>

      <RedFlagsList items={finance.redFlags} />
    </div>
  )
}
