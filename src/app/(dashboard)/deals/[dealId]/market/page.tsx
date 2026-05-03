"use client"

import { useParams } from "next/navigation"
import { useDeal } from "@/hooks/use-deal"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SectionLabel } from "@/components/dashboard/section-label"
import { RedFlagsList } from "@/components/dashboard/red-flags-list"
import { THREAT_COLORS } from "@/lib/constants"
import { Globe, Clock, Swords } from "lucide-react"
import { DomainSources } from "@/components/dashboard/domain-sources"
import { InsightBlock, leadSplit, emphasize } from "@/components/dashboard/editorial"

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

export default function MarketPage() {
  const params = useParams()
  const { deal } = useDeal(params.dealId as string)
  const market = deal?.analysis?.market

  if (!market) return <p className="text-sm text-muted-foreground">No market analysis available.</p>

  const dyn = leadSplit(market.marketDynamics)
  const why = leadSplit(market.whyNow)
  const competitors = market.competitors.filter((c) => c.name)

  return (
    <div className="space-y-7">
      <SectionHeader
        title="Market Analysis"
        score={market.score}
        verdict={market.verdict}
        dataCompleteness={market.dataCompleteness}
      />

      {/* Market Size — same chrome as Traction MetricTable, responsive on mobile */}
      <section>
        <SectionLabel className="mb-3">Market Size Validation</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-[#0F3D2E]/10 bg-white">
          {/* Column header (md+ only) — labels not repeated per row */}
          <div className="hidden md:grid md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)_96px] items-center gap-x-4 px-4 py-3 border-b border-[#0F3D2E]/10 bg-[#F4FAF6]/50">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Metric</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Founder claim</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Validated</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold text-right">Variance</span>
          </div>

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
                className={`grid grid-cols-[56px_minmax(0,1fr)_88px] md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)_96px] items-baseline gap-x-4 gap-y-3 px-4 py-3 ${
                  i !== market.marketSize.length - 1 ? "border-b border-[#0F3D2E]/5" : ""
                } ${i % 2 === 1 ? "bg-[#F4FAF6]/30" : ""}`}
              >
                {/* Metric tag */}
                <div className="font-heading text-[14px] font-bold tracking-wide text-foreground">
                  {row.metric}
                </div>

                {/* Founder claim */}
                <div className="min-w-0">
                  <p className="md:hidden text-[9px] font-mono uppercase tracking-widest text-foreground/50 font-bold mb-0.5">
                    Claim
                  </p>
                  <p className="font-mono text-[13px] md:text-[13.5px] tabular-nums text-foreground/75 break-words">
                    {row.founderClaim || "—"}
                  </p>
                </div>

                {/* Validated — on mobile spans row 2 full width; on md+ its own col */}
                <div className="min-w-0 col-span-3 md:col-span-1">
                  <p className="md:hidden text-[9px] font-mono uppercase tracking-widest text-primary font-bold mb-0.5">
                    Validated
                  </p>
                  <p className="font-heading text-[14.5px] md:text-[15px] font-bold tabular-nums text-foreground break-words leading-snug">
                    {row.validatedEstimate || "—"}
                  </p>
                </div>

                {/* Variance chip — sits at row 1 col 3 on mobile, col 4 on md+ */}
                <div className="row-start-1 col-start-3 md:col-start-4 md:row-start-auto justify-self-end self-baseline">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold tabular-nums ring-1 whitespace-nowrap ${chip}`}
                  >
                    {arrow}
                    {row.variance || "N/A"}
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
        <div className="grid gap-4 lg:grid-cols-2">
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

      <DomainSources documents={deal?.documents} generatedAt={deal?.analysis?.createdAt} />
    </div>
  )
}
