"use client"

import { FileText, ExternalLink } from "lucide-react"
import type { DealDocument } from "@/lib/types/deal"

export type ExternalSource = {
  label: string
  url: string
  kind?: "linkedin" | "web" | "search"
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
  const docs = documents.filter((d) => d.filename)
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
    <section className="mt-2 border-t border-foreground/10 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground/55">
          Sources
        </span>
        <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
          {docs.length + links.length}
        </span>
        {generatedLabel && (
          <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
            Generated · {generatedLabel}
          </span>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-2">
        {docs.map((d) => (
          <li key={d.id}>
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] ring-1 ring-foreground/10 px-2.5 py-1 text-[11.5px] text-foreground/75 hover:text-foreground transition-colors max-w-full"
              title={d.filename}
            >
              <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
                {DOC_KIND_LABELS[d.docType] ?? "Doc"}
              </span>
              <span className="text-foreground/60">·</span>
              <span className="truncate max-w-[28ch]">{d.filename}</span>
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
                className={`inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] ring-1 ring-foreground/10 px-2.5 py-1 text-[11.5px] transition-colors max-w-full ${
                  isLinkedIn ? "text-[#0A66C2] hover:text-[#084c92]" : "text-foreground/75 hover:text-foreground"
                }`}
                title={l.url}
              >
                {isLinkedIn ? (
                  <LinkedInGlyph className="h-3 w-3 shrink-0" />
                ) : (
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate max-w-[28ch]">{l.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
