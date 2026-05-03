"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { InsightBlock, leadSplit } from "@/components/dashboard/editorial"
import { Sparkles, AlertTriangle, Users, Handshake, MessageSquare, ArrowRight } from "lucide-react"
import { DomainSources, type ExternalSource } from "@/components/dashboard/domain-sources"
import type { FounderRow } from "@/lib/types/analysis"

// Brand glyphs (lucide doesn't ship these). Sized via the parent's font-size or className.
function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.88-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.26a7.21 7.21 0 0 1 0-4.51V6.64H1.27a12.04 12.04 0 0 0 0 10.73l4-3.11Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.18 15.24 0 12 0 7.36 0 3.36 2.69 1.27 6.64l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  )
}

function profileUrl(founder: FounderRow, companyName: string | undefined) {
  if (founder.linkedinUrl) return { href: founder.linkedinUrl, kind: "linkedin" as const }
  // Fallback: a targeted Google search likely to surface their LinkedIn profile
  const query = [founder.name, companyName, "linkedin"].filter(Boolean).join(" ")
  return {
    href: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    kind: "search" as const,
  }
}

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
              <FounderCard
                key={f.name + i}
                founder={f}
                grad={AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}
                companyName={deal?.companyName}
              />
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

      <Link
        href={`/deals/${params.dealId}/ask?scope=team`}
        className="group flex items-center justify-between gap-3 rounded-xl bg-[#F4FAF6]/60 ring-1 ring-[#0F3D2E]/10 px-4 py-3 hover:bg-[#F4FAF6] hover:ring-[#0F3D2E]/20 transition-colors"
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-[13px] text-foreground/80 group-hover:text-foreground">
            Ask SAM about the team
          </span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
      </Link>

      <DomainSources
        documents={deal?.documents}
        externalLinks={founders
          .filter((f) => f.linkedinUrl)
          .map<ExternalSource>((f) => ({
            label: `${f.name} — LinkedIn`,
            url: f.linkedinUrl as string,
            kind: "linkedin",
          }))}
        generatedAt={deal?.analysis?.createdAt}
      />
    </div>
  )
}

// ---------------------------------------------------------------- founder card
function FounderCard({
  founder: f,
  grad,
  companyName,
}: {
  founder: FounderRow
  grad: string
  companyName?: string
}) {
  const link = profileUrl(f, companyName)
  const isLinkedIn = link.kind === "linkedin"
  const linkLabel = isLinkedIn ? "View LinkedIn" : "Search on Google"
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
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`shrink-0 inline-flex items-center transition-colors ${
                  isLinkedIn ? "text-[#0A66C2] hover:text-[#084c92]" : "text-muted-foreground hover:text-foreground"
                }`}
                title={linkLabel}
              >
                {isLinkedIn ? (
                  <LinkedInGlyph className="h-3.5 w-3.5" />
                ) : (
                  <GoogleGlyph className="h-3.5 w-3.5" />
                )}
              </a>
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

        {/* Profile lookup link — direct LinkedIn if Flow 8 found one, Google search fallback */}
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
            isLinkedIn ? "text-[#0A66C2] hover:text-[#084c92]" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isLinkedIn ? (
            <LinkedInGlyph className="h-3 w-3" />
          ) : (
            <GoogleGlyph className="h-3 w-3" />
          )}
          {linkLabel}
        </a>
      </div>
    </article>
  )
}

