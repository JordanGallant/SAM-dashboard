"use client"

import { FileText, ExternalLink } from "lucide-react"
import type { Deal, DealDocument } from "@/lib/types/deal"

export type ExternalSource = {
  label: string
  url: string
  kind?: "linkedin" | "web" | "search"
}

/**
 * Founder-LinkedIn extractor — shared by every deal-detail tab so the
 * Sources block at the bottom renders the same data set on Summary, Team,
 * Market, Product, Traction, Finance, Exit, and Fund-fit.
 *
 * Previously only Summary + Team called this inline; the other six tabs
 * passed documents only, which made Sources look thinner on those pages
 * even though the underlying analysis cited the same founders.
 */
export function getFounderLinks(deal: Deal | undefined): ExternalSource[] {
  const founders = deal?.analysis?.team?.founders ?? []
  return founders
    .filter((f) => f.linkedinUrl)
    .map<ExternalSource>((f) => ({
      label: `${f.name} — LinkedIn`,
      url: f.linkedinUrl as string,
      kind: "linkedin",
    }))
}

const DOC_KIND_LABELS: Record<DealDocument["docType"], string> = {
  "pitch-deck": "Pitch deck",
  transcript: "Transcript",
  "dd-doc": "DD doc",
  "financial-model": "Financial model",
  other: "Document",
}

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function dedupeByUrl(items: ExternalSource[]): ExternalSource[] {
  const seen = new Set<string>()
  const out: ExternalSource[] = []
  for (const it of items) {
    if (!it.url) continue
    if (seen.has(it.url)) continue
    seen.add(it.url)
    out.push(it)
  }
  return out
}

export function DomainSources({
  documents = [],
  externalLinks = [],
  generatedAt,
}: {
  documents?: DealDocument[]
  externalLinks?: ExternalSource[]
  generatedAt?: string
}) {
  // Pilot #9: pitch deck is the input, not a source — exclude it from this
  // block. Prompt instruction has been unreliable; post-filter is the safe
  // guard. Other doc types (transcripts, DD docs, financial models) still show.
  const docs = documents.filter((d) => d.filename && d.docType !== "pitch-deck")
  const links = dedupeByUrl(externalLinks)

  if (docs.length === 0 && links.length === 0) return null

  const generatedLabel = generatedAt
    ? new Date(generatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  return (
    <section className="mt-2 border-t border-foreground/10 pt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-mono uppercase tracking-widest font-extrabold text-foreground/70">
          Sources
        </span>
        <span className="text-[10px] font-mono tabular-nums font-semibold text-muted-foreground">
          {docs.length + links.length}
        </span>
        {generatedLabel && (
          <span className="ml-auto text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">
            Generated · {generatedLabel}
          </span>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
        {docs.map((d) => (
          <li key={d.id}>
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] ring-1 ring-foreground/10 px-2 py-0.5 text-[10.5px] font-semibold text-foreground/80 hover:text-foreground transition-colors max-w-full"
              title={d.filename}
            >
              <FileText className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
              <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-muted-foreground/85">
                {DOC_KIND_LABELS[d.docType] ?? "Doc"}
              </span>
              <span className="text-foreground/40">·</span>
              <span className="truncate max-w-[26ch] font-medium">{d.filename}</span>
            </a>
          </li>
        ))}
        {links.map((l) => {
          const isLinkedIn = l.kind === "linkedin"
          return (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] ring-1 ring-foreground/10 px-2 py-0.5 text-[10.5px] font-semibold transition-colors max-w-full ${
                  isLinkedIn ? "text-[#0A66C2] hover:text-[#084c92]" : "text-foreground/80 hover:text-foreground"
                }`}
                title={l.url}
              >
                {isLinkedIn ? (
                  <LinkedInGlyph className="h-2.5 w-2.5 shrink-0" />
                ) : (
                  <ExternalLink className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate max-w-[26ch]">{l.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
