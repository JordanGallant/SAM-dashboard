"use client"

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { THREAT_COLORS, DOMAIN_VERDICT_COLORS } from "@/lib/constants"
import { Globe, Clock, Swords } from "lucide-react"
import type { DomainVerdict } from "@/lib/types/analysis"

function leadSplit(text: string): { lead: string; rest: string } {
  const t = (text ?? "").trim()
  const idx = t.search(/[.!?](?=\s+\S)/)
  if (idx === -1) return { lead: t, rest: "" }
  return { lead: t.slice(0, idx + 1), rest: t.slice(idx + 1).trim() }
}

// Look at a variance string like "-17% to -28%" or "+12%" / "N/A" and decide
// the directional tone for the chip. Negative → down (red), positive → up (emerald),
// neutral/missing → flat (zinc).
function parseDirection(variance: string | undefined): "up" | "down" | "flat" {
  const v = (variance ?? "").toLowerCase()
  if (!v || v === "—" || v.includes("n/a")) return "flat"
  if (v.includes("-") && !v.includes("--")) return "down"
  if (v.startsWith("+") || /^\d/.test(v)) return "up"
  return "flat"
}

const HIGHLIGHT_RE =
  /(\b(?:USD|EUR|GBP|CHF)\s?\d[\d,.]*\s?(?:[KMB]|trillion|billion|million)?\b|[\$€£]\s?\d[\d,.]*\s?(?:[KMB]|trillion|billion|million)?\b|\b\d+(?:\.\d+)?%\b|\b\d{4}\b|\b\d+(?:\.\d+)?[KMB]?\s?(?:CAGR|ARR|MRR|TAM|SAM|SOM)\b)/g

function emphasize(text: string) {
  if (!text) return null
  return text.split(HIGHLIGHT_RE).map((p, i) =>
    i % 2 === 0 ? (
      <span key={i}>{p}</span>
    ) : (
      <span key={i} className="font-semibold text-foreground bg-primary/8 rounded px-0.5">
        {p}
      </span>
    )
  )
}

export default function MarketPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const market = deal?.analysis?.market

  if (!market) return <p className="text-sm text-muted-foreground">No market analysis available.</p>

  const dyn = leadSplit(market.marketDynamics)
  const why = leadSplit(market.whyNow)
  const competitors = market.competitors.filter((c) => c.name)

  return (
    <div className="space-y-7 max-w-4xl">
      <SectionHeader
        title="Market Analysis"
        score={market.score}
        verdict={market.verdict}
        dataCompleteness={market.dataCompleteness}
      />

      {/* Market Size — single card, aligned rows for TAM/SAM/SOM */}
      <section>
        <SectionLabel className="mb-3">Market Size Validation</SectionLabel>
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
          {market.marketSize.map((row, i) => {
            const dir = parseDirection(row.variance)
            const chip =
              dir === "down"
                ? "bg-red-50 text-red-700 ring-red-200"
                : dir === "up"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-foreground/5 text-foreground/65 ring-foreground/10"
            const arrow = dir === "down" ? "↓" : dir === "up" ? "↑" : "·"
            return (
              <div
                key={row.metric}
                className={`grid grid-cols-[64px_1fr_1fr_88px] md:grid-cols-[80px_1fr_1fr_96px] items-center gap-x-4 px-5 md:px-6 py-4 ${
                  i > 0 ? "border-t border-foreground/10" : ""
                }`}
              >
                {/* Metric tag */}
                <div className="font-heading text-[14px] font-bold tracking-wide text-foreground">
                  {row.metric}
                </div>

                {/* Founder claim */}
                <div className="min-w-0">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-foreground/50 font-bold">
                    Claim
                  </p>
                  <p className="mt-0.5 font-mono text-[14px] tabular-nums text-foreground/70 truncate">
                    {row.founderClaim || "—"}
                  </p>
                </div>

                {/* Validated */}
                <div className="min-w-0">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold">
                    Validated
                  </p>
                  <p className="mt-0.5 font-heading text-[16px] font-bold tabular-nums text-foreground truncate">
                    {row.validatedEstimate || "—"}
                  </p>
                </div>

                {/* Variance chip */}
                <div className="justify-self-end">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold tabular-nums ring-1 ${chip}`}
                  >
                    {arrow}
                    <span className="hidden md:inline">{row.variance || "N/A"}</span>
                    <span className="md:hidden">{(row.variance || "N/A").replace(/\s+/g, "")}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Dynamics + Why Now */}
      <section>
        <SectionLabel className="mb-3">Market Context</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightBlock
            icon={<Globe className="h-4 w-4" />}
            label="Market dynamics"
            lead={dyn.lead}
            rest={dyn.rest}
          />
          <InsightBlock
            icon={<Clock className="h-4 w-4" />}
            label="Why now?"
            lead={why.lead}
            rest={why.rest}
            verdict={market.whyNowScore}
          />
        </div>
      </section>

      {/* Competitive Landscape */}
      {competitors.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Swords className="h-3.5 w-3.5 text-muted-foreground" />
            <SectionLabel className="!mb-0">Competitive Landscape</SectionLabel>
            <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
              {competitors.length}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {competitors.map((c) => {
              const colors = THREAT_COLORS[c.threatLevel]
              return (
                <article
                  key={c.name}
                  className="rounded-2xl bg-card ring-1 ring-foreground/10 p-4 hover:ring-foreground/20 transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[14px] font-heading font-bold leading-tight">
                      {c.name}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ring-1 ring-black/5 ${colors.bg} ${colors.text}`}
                    >
                      {c.threatLevel}
                    </span>
                  </div>
                  {c.funding && (
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      Funding · {c.funding}
                    </p>
                  )}
                  {c.differentiation && (
                    <p className="mt-2.5 text-[12.5px] leading-snug text-foreground/75 max-w-[40ch]">
                      {emphasize(c.differentiation)}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      <RedFlagsList items={market.redFlags} />
    </div>
  )
}

// ---------------------------------------------------------------- insight block
function InsightBlock({
  icon,
  label,
  lead,
  rest,
  verdict,
}: {
  icon: React.ReactNode
  label: string
  lead: string
  rest: string
  verdict?: DomainVerdict
}) {
  if (!lead) return null
  const v = verdict ? DOMAIN_VERDICT_COLORS[verdict] : null
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-7 w-7 rounded-md bg-foreground/5 text-foreground/60">
            {icon}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/60">
            {label}
          </span>
        </div>
        {v && verdict && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ring-1 ring-black/5 ${v.bg} ${v.text}`}
          >
            {verdict}
          </span>
        )}
      </div>
      <p className="mt-3 text-[15px] leading-[1.5] font-medium text-foreground tracking-[-0.005em] max-w-[55ch]">
        {emphasize(lead)}
      </p>
      {rest && (
        <p className="mt-2.5 text-[13px] leading-[1.7] text-foreground/70 max-w-[60ch]">
          {emphasize(rest)}
        </p>
      )}
    </div>
  )
}
