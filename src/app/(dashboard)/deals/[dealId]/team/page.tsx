"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { setFounderLink, clearFounderLink, addFounder } from "@/app/actions/founder-links"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { InsightBlock, leadSplit } from "@/components/dashboard/editorial"
import { Sparkles, AlertTriangle, Users, Handshake, Pencil, Loader2, UserPlus } from "lucide-react"
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

// Both LinkedIn and Google links — LinkedIn falls back to a LinkedIn-scoped
// search when we don't have a confirmed URL, so the LinkedIn glyph always
// renders and the Google glyph always offers a wider web search alongside.
function profileLinks(founder: FounderRow, companyName: string | undefined) {
  const query = [founder.name, companyName].filter(Boolean).join(" ")
  const linkedin = founder.linkedinUrl
    ? { href: founder.linkedinUrl, confirmed: true }
    : {
        href: `https://www.google.com/search?q=${encodeURIComponent(`${query} site:linkedin.com/in`)}`,
        confirmed: false,
      }
  const google = {
    href: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  }
  return { linkedin, google }
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
  const dealId = params.dealId as string
  const { deal, refetch, teamRefreshing } = useDeal(dealId)
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
      />

      {/* Founders */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <SectionLabel className="!mb-0">Founders</SectionLabel>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
            {founders.length}
          </span>
          {teamRefreshing && (
            <span
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"
              role="status"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Refreshing profiles…
            </span>
          )}
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
                dealId={dealId}
                onSaved={refetch}
              />
            ))}
          </div>
        )}

        {/* Decks routinely omit people, and the extractor misses others
            entirely — so correcting a founder isn't enough, you have to be able
            to add one. Shown even with an empty roster, which is exactly when
            the deck was unreadable. */}
        <AddFounder dealId={dealId} onSaved={refetch} />
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

// ------------------------------------------------------------ add a founder
// Only a URL is asked for: if the deck never named this person, the user can't
// reliably either. The scrape supplies the real name, so until it lands the
// card is labelled with the LinkedIn handle.
function AddFounder({ dealId, onSaved }: { dealId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    const res = await addFounder(dealId, value)
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setValue("")
    setOpen(false)
    onSaved()
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-foreground/20 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Add a founder we missed
      </button>
    )
  }

  return (
    <div className="mt-4 max-w-md space-y-2 rounded-xl border border-foreground/15 bg-card p-3">
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        Add founder
      </p>
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save()
          if (e.key === "Escape") setOpen(false)
        }}
        placeholder="linkedin.com/in/username"
        aria-label="LinkedIn profile URL of the founder to add"
        className="h-8 text-[12.5px]"
      />
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <p className="text-[11px] text-muted-foreground">
        We&apos;ll pull their name and background from the profile.
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" className="h-7 text-[11px]" disabled={saving || !value.trim()} onClick={save}>
          {saving ? "Adding…" : "Add founder"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[11px]"
          disabled={saving}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// ------------------------------------------------- manual LinkedIn editor
// Extraction misses founder profiles often enough that every card needs a
// paste-it-yourself path: "Add LinkedIn" when we have nothing confirmed,
// "Edit" when we do. Saves through a server action, then refetches the deal.
function LinkedInEditor({
  dealId,
  founder,
  onSaved,
  onCancel,
}: {
  dealId: string
  founder: FounderRow
  onSaved: () => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(founder.linkedinUrl ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    const res = await setFounderLink(dealId, founder.name, value)
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    onSaved()
  }

  async function remove() {
    setSaving(true)
    setError(null)
    const res = await clearFounderLink(dealId, founder.name)
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    onSaved()
  }

  return (
    <div className="mt-4 space-y-2">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save()
          if (e.key === "Escape") onCancel()
        }}
        placeholder="linkedin.com/in/username"
        aria-label={`LinkedIn profile URL for ${founder.name}`}
        className="h-8 text-[12.5px]"
      />
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <div className="flex items-center gap-2">
        <Button size="sm" className="h-7 text-[11px]" disabled={saving || !value.trim()} onClick={save}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[11px]"
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </Button>
        {founder.linkedinManual && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-[11px] text-muted-foreground hover:text-red-600 ml-auto"
            disabled={saving}
            onClick={remove}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- founder card
function FounderCard({
  founder: f,
  grad,
  companyName,
  dealId,
  onSaved,
}: {
  founder: FounderRow
  grad: string
  companyName?: string
  dealId: string
  onSaved: () => void
}) {
  const [editing, setEditing] = useState(false)
  const links = profileLinks(f, companyName)
  return (
    <article className="group relative rounded-2xl bg-card ring-1 ring-foreground/10 hover:ring-foreground/20 transition-shadow hover:shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Header — avatar + name + role + LinkedIn + Google */}
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 grid place-items-center h-12 w-12 rounded-full bg-gradient-to-br ${grad} ring-1 ring-black/5 shadow-sm`}
          >
            <span className="font-mono text-[13px] font-bold tracking-wider text-[#B5D33C]">
              {initials(f.name)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-[15px] font-heading font-bold leading-tight truncate">
                {f.name}
              </h3>
              <a
                href={links.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`shrink-0 inline-flex items-center transition-colors ${
                  links.linkedin.confirmed
                    ? "text-[#0A66C2] hover:text-[#084c92]"
                    : "text-[#0A66C2]/55 hover:text-[#0A66C2]"
                }`}
                title={links.linkedin.confirmed ? "View LinkedIn profile" : "Search LinkedIn for this name"}
              >
                <LinkedInGlyph className="h-3.5 w-3.5" />
              </a>
              <a
                href={links.google.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                title="Search on Google"
              >
                <GoogleGlyph className="h-3.5 w-3.5" />
              </a>
            </div>
            {f.role && (
              <p className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {f.role}
              </p>
            )}
          </div>
        </div>

        {/* Just added and the scrape hasn't come back yet — say so, rather than
            rendering a card that looks like the analysis found nothing. */}
        {f.addedByUser && !f.background && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Fetching profile…
          </p>
        )}

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

        {/* Profile lookup link — primary footer link points at LinkedIn (or
            LinkedIn-scoped search if no confirmed URL); Google glyph in the
            header keeps the wider-web fallback one click away. The paste
            affordance sits alongside it because the extracted URL is wrong
            or missing often enough to need a manual correction path. */}
        {editing ? (
          <LinkedInEditor
            dealId={dealId}
            founder={f}
            onSaved={() => {
              setEditing(false)
              onSaved()
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <a
              href={links.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                links.linkedin.confirmed
                  ? "text-[#0A66C2] hover:text-[#084c92]"
                  : "text-[#0A66C2]/70 hover:text-[#0A66C2]"
              }`}
            >
              {links.linkedin.confirmed ? (
                <LinkedInGlyph className="h-3 w-3" />
              ) : (
                <GoogleGlyph className="h-3 w-3" />
              )}
              {links.linkedin.confirmed ? "View LinkedIn" : "Search LinkedIn"}
            </a>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              title={
                links.linkedin.confirmed
                  ? "Replace this LinkedIn URL"
                  : "Paste this founder's LinkedIn URL"
              }
            >
              <Pencil className="h-3 w-3" />
              {links.linkedin.confirmed ? "Edit" : "Add LinkedIn"}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

