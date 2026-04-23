"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { useDeal } from "@/hooks/use-deal"
import { ExternalLink, TrendingUp, AlertTriangle } from "lucide-react"

export default function TeamPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const team = deal?.analysis?.team

  if (!team) return <p className="text-sm text-muted-foreground">No team analysis available.</p>

  return (
    <div className="space-y-6">
      <SectionHeader title="Team Analysis" score={team.score} verdict={team.verdict} dataCompleteness={team.dataCompleteness} />

      {/* Founders — card per founder in a 2-col grid */}
      <section>
        <SectionLabel className="mb-3">Founders · {team.founders.length}</SectionLabel>
        <div className="grid gap-3 md:grid-cols-2">
          {team.founders.map((f, i) => (
            <Card key={i} size="sm">
              <CardContent className="space-y-2.5">
                <div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-semibold truncate">{f.name}</span>
                    {f.linkedinUrl && (
                      <a
                        href={f.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {f.role}
                  </p>
                </div>
                {f.background && (
                  <p className="border-t pt-2 text-[12.5px] leading-snug text-foreground/75">
                    {f.background}
                  </p>
                )}
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-[12.5px] leading-snug">
                  <TrendingUp className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-foreground/80">{f.strength}</p>
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-red-600" />
                  <p className="text-foreground/80">{f.keyConcern}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Narrative sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Founder-Market Fit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-prose text-sm leading-relaxed text-foreground/80">{team.founderMarketFit}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Team Dynamics & Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-prose text-sm leading-relaxed text-foreground/80">{team.teamDynamics}</p>
        </CardContent>
      </Card>

      <RedFlagsList items={team.redFlags} />
    </div>
  )
}
