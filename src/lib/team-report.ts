// Parser for Flow 3's "LLM TEAM" markdown report (stored as sam_jobs.team_result).
//
// The main pipeline never parses this directly — Flow 8 reformats it into the
// flat `founders_overview_text` shape that n8n-reshape.ts handles. But a
// team-only re-run (triggered when a user pastes a founder LinkedIn URL by
// hand) doesn't go through Flow 8, so the regenerated prose would otherwise be
// stranded in n8n while the portal kept showing the pre-scrape text.
//
// Shape this expects, from a real run:
//
//   ## TEAM ANALYSIS REPORT
//   **Company:** Dawnguard
//   **Score:** 72/100
//
//   ### FOUNDER PROFILES
//
//   **Kim van Lavieren** - Co-Founder & CTO
//   - LinkedIn: https://www.linkedin.com/in/kim-v-0645931b4/
//   - Background: PhD in Artificial Intelligence ... [Source: LinkedIn]
//   - Founder-Market Fit: **Strong** — ...
//   - Key Strength: ...
//   - Concern: ...
//
//   ### TEAM DYNAMICS
//   ...
//
// Everything is best-effort: a section that doesn't parse is returned absent
// rather than empty, so callers can keep whatever they already had.

import type { FounderRow } from "@/lib/types/analysis"
import { canonicalLinkedInUrl } from "@/lib/founder-links"

export interface ParsedTeamReport {
  score?: number
  founders: FounderRow[]
  founderMarketFit?: string
  teamDynamics?: string
}

/** Strip the markdown emphasis the model sprinkles through its prose. */
function clean(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/** Split "### HEADING" sections into a lookup keyed by upper-cased heading. */
function sections(text: string): Map<string, string> {
  const out = new Map<string, string>()
  const parts = text.split(/^#{2,3}\s+(.+?)\s*$/m)
  // parts = [preamble, heading1, body1, heading2, body2, ...]
  for (let i = 1; i < parts.length - 1; i += 2) {
    out.set(parts[i].trim().toUpperCase(), parts[i + 1] ?? "")
  }
  return out
}

/**
 * Pull "- Label: value" bullets out of one founder's block, joining wrapped
 * continuation lines onto the bullet they belong to.
 */
function bullets(block: string): Map<string, string> {
  const out = new Map<string, string>()
  let current: string | null = null
  for (const raw of block.split("\n")) {
    const line = raw.trim()
    if (!line) continue
    const m = line.match(/^[-*•]\s*([A-Za-z][A-Za-z \-&]{2,30}?)\s*:\s*(.*)$/)
    if (m) {
      current = m[1].trim().toUpperCase()
      out.set(current, m[2].trim())
    } else if (current && !line.startsWith("**") && !line.startsWith("#")) {
      out.set(current, `${out.get(current) ?? ""} ${line}`.trim())
    }
  }
  return out
}

function parseFounderProfiles(body: string): FounderRow[] {
  // Founder header: "**Name** - Role". Split so each chunk starts at a header.
  const chunks = body.split(/^\*\*(?=[^*\n]+\*\*\s*[-–—])/m)
  const out: FounderRow[] = []

  for (const chunk of chunks) {
    const header = chunk.match(/^([^*\n]+)\*\*\s*[-–—]\s*(.*)$/m)
    if (!header) continue
    const name = clean(header[1])
    const role = clean(header[2])
    if (!name) continue

    const b = bullets(chunk)
    const linkedinRaw = b.get("LINKEDIN") ?? ""
    const linkedinUrl =
      canonicalLinkedInUrl(linkedinRaw) ??
      (chunk.match(/https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9_\-%.]+\/?/i)
        ? canonicalLinkedInUrl(
            chunk.match(
              /https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9_\-%.]+\/?/i,
            )![0],
          )
        : null) ??
      undefined

    out.push({
      name,
      role,
      background: clean(b.get("BACKGROUND") ?? ""),
      strength: clean(b.get("KEY STRENGTH") ?? b.get("STRENGTH") ?? ""),
      keyConcern: clean(b.get("CONCERN") ?? b.get("KEY CONCERN") ?? ""),
      ...(linkedinUrl ? { linkedinUrl } : {}),
    })
  }
  return out
}

export function parseTeamReport(text: string | undefined): ParsedTeamReport | null {
  if (!text || !text.trim()) return null

  const secs = sections(text)
  const profiles = secs.get("FOUNDER PROFILES")
  const founders = profiles ? parseFounderProfiles(profiles) : []

  // A report we can't find founders in is more likely a format change than a
  // team with no founders — refuse it rather than blanking the deal's roster.
  if (founders.length === 0) return null

  const scoreMatch = text.match(/\*{0,2}Score:?\*{0,2}\s*(\d{1,3})\s*\/\s*100/i)
  const score = scoreMatch ? Number(scoreMatch[1]) : undefined

  const fmf = secs.get("FOUNDER-MARKET FIT ASSESSMENT") ?? secs.get("FOUNDER-MARKET FIT")
  const dynamics = secs.get("TEAM DYNAMICS")

  return {
    founders,
    ...(score !== undefined && score >= 0 && score <= 100 ? { score } : {}),
    ...(fmf?.trim() ? { founderMarketFit: clean(fmf) } : {}),
    ...(dynamics?.trim() ? { teamDynamics: clean(dynamics) } : {}),
  }
}
