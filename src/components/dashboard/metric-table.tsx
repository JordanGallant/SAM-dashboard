import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react"
import type { MetricRow } from "@/lib/types/analysis"

const statusIcons = {
  check: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  critical: <XCircle className="h-4 w-4 text-red-600" />,
  gap: <HelpCircle className="h-4 w-4 text-gray-400" />,
}

export function MetricTable({
  rows,
  showBenchmark = true,
  showGrowth = false,
}: {
  rows: MetricRow[]
  showBenchmark?: boolean
  showGrowth?: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Value</TableHead>
          {showGrowth && <TableHead>Growth</TableHead>}
          {showBenchmark && <TableHead>Benchmark</TableHead>}
          <TableHead className="w-[40px]">Status</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{row.metric}</TableCell>
            <TableCell>{row.value}</TableCell>
            {showGrowth && <TableCell>{row.growth ?? "—"}</TableCell>}
            {showBenchmark && <TableCell className="text-muted-foreground">{row.benchmark ?? "—"}</TableCell>}
            <TableCell>{statusIcons[row.status]}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{row.statusNote ?? ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
