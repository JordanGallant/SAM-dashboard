"use client"

/**
 * Shared editorial primitives for the deal-detail tabs.
 * Keeps the lead-sentence + body layout, number emphasis, and insight-block
 * styling consistent across summary/team/market/product/traction/finance.
 */

import * as React from "react"
import { DOMAIN_VERDICT_COLORS } from "@/lib/constants"
import type { DomainVerdict } from "@/lib/types/analysis"

export function leadSplit(text: string | undefined | null): { lead: string; rest: string } {
  const t = (text ?? "").trim()
  const idx = t.search(/[.!?](?=\s+\S)/)
  if (idx === -1) return { lead: t, rest: "" }
  return { lead: t.slice(0, idx + 1), rest: t.slice(idx + 1).trim() }
}

const HIGHLIGHT_RE =
  /(\b(?:USD|EUR|GBP|CHF)\s?\d[\d,.]*\s?(?:[KMB]|trillion|billion|million)?\b|[\$€£]\s?\d[\d,.]*\s?(?:[KMB]|trillion|billion|million)?\b|\b\d+(?:\.\d+)?%\b|\b\d{4}\b|\b\d+(?:\.\d+)?[KMB]?\s?(?:CAGR|ARR|MRR|TAM|SAM|SOM|LTV|CAC|NRR)\b)/g

export function emphasize(text: string | undefined | null): React.ReactNode {
  if (!text) return null
  return text.split(HIGHLIGHT_RE).map((part, i) =>
    i % 2 === 0 ? (
      <span key={i}>{part}</span>
    ) : (
      <span key={i} className="font-semibold text-foreground bg-primary/8 rounded px-0.5">
        {part}
      </span>
    )
  )
}

export function InsightBlock({
  icon,
  label,
  lead,
  rest,
  verdict,
  pill,
}: {
  icon?: React.ReactNode
  label: string
  lead: string
  rest?: string
  verdict?: DomainVerdict
  /** Generic right-side pill (overrides verdict if both supplied). */
  pill?: { text: string; bg: string; fg: string }
}) {
  if (!lead) return null
  const v = verdict ? DOMAIN_VERDICT_COLORS[verdict] : null
  const right = pill ?? (v && verdict ? { text: verdict, bg: v.bg, fg: v.text } : null)
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="grid place-items-center h-7 w-7 rounded-md bg-foreground/5 text-foreground/60">
              {icon}
            </span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/60">
            {label}
          </span>
        </div>
        {right && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ring-1 ring-black/5 ${right.bg} ${right.fg}`}
          >
            {right.text}
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

/** Standard editorial card with header label and free-form children. */
export function EditorialCard({
  label,
  count,
  icon,
  rightSlot,
  children,
  className = "",
}: {
  label: string
  count?: number
  icon?: React.ReactNode
  rightSlot?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/60">
            {label}
          </span>
          {count !== undefined && (
            <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  )
}
