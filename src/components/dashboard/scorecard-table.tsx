import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DOMAIN_VERDICT_COLORS, getScoreColor } from "@/lib/constants"
import type { ScorecardRow } from "@/lib/types/analysis"

export function ScorecardTable({ scorecard }: { scorecard: ScorecardRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead className="w-[70px] text-center">Score</TableHead>
          <TableHead className="w-[100px]">Verdict</TableHead>
          <TableHead>Key Finding</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scorecard.map((row) => {
          const scoreColor = getScoreColor(row.score)
          const verdictColor = DOMAIN_VERDICT_COLORS[row.verdict]
          return (
            <TableRow key={row.domain}>
              <TableCell className="font-medium">{row.domain}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className={`${scoreColor.bg} ${scoreColor.text} font-mono`}>
                  {row.score}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${verdictColor.bg} ${verdictColor.text}`}>
                  {row.verdict}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md text-sm text-muted-foreground">{row.keyFinding}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
