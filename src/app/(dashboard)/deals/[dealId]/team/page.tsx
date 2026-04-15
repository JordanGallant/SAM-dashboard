"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionHeader } from "@/components/dashboard/section-header"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { useDeal } from "@/hooks/use-deal"
import { ExternalLink } from "lucide-react"

export default function TeamPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const team = deal?.analysis?.team

  if (!team) return <p className="text-sm text-muted-foreground">No team analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Team Analysis" score={team.score} verdict={team.verdict} dataCompleteness={team.dataCompleteness} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Founders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Founder</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Background</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Key Concern</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.founders.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {f.name}
                    {f.linkedinUrl && (
                      <a href={f.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex text-blue-600 hover:underline">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell>{f.role}</TableCell>
                  <TableCell className="max-w-[200px] text-sm text-muted-foreground">{f.background}</TableCell>
                  <TableCell className="max-w-[200px] text-sm text-muted-foreground">{f.strength}</TableCell>
                  <TableCell className="max-w-[200px] text-sm text-muted-foreground">{f.keyConcern}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Founder-Market Fit</CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{team.founderMarketFit}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Team Dynamics & Composition</CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{team.teamDynamics}</p></CardContent>
      </Card>

      <RedFlagsList items={team.redFlags} />
    </div>
  )
}
