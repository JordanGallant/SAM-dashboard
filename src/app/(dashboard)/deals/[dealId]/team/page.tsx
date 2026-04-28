"use client"

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { ExternalLink, Sparkles, AlertTriangle, Users, Handshake } from "lucide-react"
import type { FounderRow } from "@/lib/types/analysis"

const AVATAR_GRADIENTS = [
  "from-[#0F3D2E] to-[#00A86B]",
  "from-[#1B4D3E] to-[#5FB892]",
  "from-[#143F2A] to-[#82C99B]",
  "from-[#2A5C4A] to-[#0FA56C]",
] as const

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?"
}

function leadSplit(text: string): { lead: string; rest: string } {
  const t = (text ?? "").trim()
  const idx = t.search(/[.!?](?=\s+\S)/)
  if (idx === -1) return { lead: t, rest: "" }
  return { lead: t.slice(0, idx + 1), rest: t.slice(idx + 1).trim() }
}

export default function TeamPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const team = deal?.analysis?.team

  if (!team) return <p className="text-sm text-muted-foreground">No team analysis available.</p>

  const founders = team.founders.filter((f) => f.name && f.name !== "Unknown")
  const fmf = leadSplit(team.founderMarketFit)
  const dynamics = leadSplit(team.teamDynamics)
  const founderCols = founders.length >= 5 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"

  return (
    <div className="space-y-7">
      <SectionHeader
        title="Team Analysis"
        score={team.score}
        verdict={team.verdict}
        dataCompleteness={team.dataCompleteness}
      />

      {/* Founders */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <SectionLabel className="!mb-0">Founders</SectionLabel>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
            {founders.length}
          </span>
        </div>

        {founders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-muted/30 p-8 text-center">
            <Users className="mx-auto h-5 w-5 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">No founder data extracted.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${founderCols}`}>
            {founders.map((f, i) => (
              <FounderCard key={f.name + i} founder={f} grad={AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} />
            ))}
          </div>
        )}
      </section>

      {/* Insights — combined Founder-Market Fit + Team Dynamics */}
      <section>
        <SectionLabel className="mb-3">Team Insights</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightBlock
            icon={<Handshake className="h-4 w-4" />}
            label="Founder-market fit"
            lead={fmf.lead}
            rest={fmf.rest}
          />
          <InsightBlock
            icon={<Users className="h-4 w-4" />}
            label="Team dynamics & composition"
            lead={dynamics.lead}
            rest={dynamics.rest}
          />
        </div>
      </section>

      {/* Red Flags */}
      <RedFlagsList items={team.redFlags} />
    </div>
  )
}

// ---------------------------------------------------------------- founder card
function FounderCard({ founder: f, grad }: { founder: FounderRow; grad: string }) {
  return (
    <article className="group relative rounded-2xl bg-card ring-1 ring-foreground/10 hover:ring-foreground/20 transition-shadow hover:shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Header — avatar + name + role + linkedin */}
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 grid place-items-center h-12 w-12 rounded-full bg-gradient-to-br ${grad} ring-1 ring-black/5 shadow-sm`}
          >
            <span className="font-mono text-[13px] font-bold tracking-wider text-[#D4FF6B]">
              {initials(f.name)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-[15px] font-heading font-bold leading-tight truncate">
                {f.name}
              </h3>
              {f.linkedinUrl && (
                <a
                  href={f.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  title="LinkedIn profile"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {f.role && (
              <p className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {f.role}
              </p>
            )}
          </div>
        </div>

        {/* Background prose */}
        {f.background && (
          <p className="mt-4 text-[13px] leading-[1.65] text-foreground/75 max-w-[60ch]">
            {f.background}
          </p>
        )}

        {/* Strength / Concern split */}
        {(f.strength || f.keyConcern) && (
          <div className="mt-4 grid gap-2.5">
            {f.strength && (
              <div className="rounded-xl bg-emerald-50/70 ring-1 ring-emerald-200/70 p-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-700" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-800">
                    Strength
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-emerald-950/85">
                  {f.strength}
                </p>
              </div>
            )}
            {f.keyConcern && (
              <div className="rounded-xl bg-red-50/70 ring-1 ring-red-200/70 p-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-red-700" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-red-800">
                    Key concern
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-red-950/85">
                  {f.keyConcern}
                </p>
              </div>
            )}
          </div>
        )}

        {/* External profile link, footer-aligned, optional */}
        {f.linkedinUrl && (
          <a
            href={f.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            View profile
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  )
}

// ---------------------------------------------------------------- insight block
function InsightBlock({
  icon,
  label,
  lead,
  rest,
}: {
  icon: React.ReactNode
  label: string
  lead: string
  rest: string
}) {
  if (!lead) return null
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
      <div className="flex items-center gap-2">
        <span className="grid place-items-center h-7 w-7 rounded-md bg-foreground/5 text-foreground/60">
          {icon}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/60">
          {label}
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-[1.5] font-medium text-foreground tracking-[-0.005em] max-w-[55ch]">
        {lead}
      </p>
      {rest && (
        <p className="mt-2.5 text-[13px] leading-[1.7] text-foreground/70 max-w-[60ch]">
          {rest}
        </p>
      )}
    </div>
  )
}
