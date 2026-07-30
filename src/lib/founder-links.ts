// Manual LinkedIn overrides for founders.
//
// The team page gets `linkedinUrl` from whatever the analysis pipeline managed
// to scrape, which is frequently wrong or missing — company team pages often
// render profiles in JS, link to the company page instead of the person, or
// omit the link entirely. `founder_links` lets a user paste the right URL by
// hand; those overrides win over the extracted value at read time.
//
// Founders have no stable id in the analysis blob (it's regenerated on every
// re-run), so overrides are keyed on the founder's name.

import type { DealAnalysis } from "@/lib/types/analysis"

export interface FounderLink {
  founderKey: string
  founderName: string
  linkedinUrl: string
}

/**
 * Key a founder by name. Case- and whitespace-insensitive so an override
 * survives a re-analysis that returns "de Vries, Jan" as "De  Vries, Jan".
 */
export function founderKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * Normalise anything a user might paste into a canonical profile URL:
 * full URLs with locale subdomains and tracking params, scheme-less hosts,
 * or a bare handle. Returns null when it isn't a LinkedIn profile at all.
 *
 * Company/school URLs are rejected on purpose — this field is per-founder,
 * and silently accepting `/company/acme` would put a wrong link behind a
 * "confirmed" checkmark.
 */
export function canonicalLinkedInUrl(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null

  // Bare handle, e.g. "jangallant" or "jan-gallant-123".
  if (/^[A-Za-z0-9_\-%.]+$/.test(raw) && !raw.includes(".com")) {
    return `https://www.linkedin.com/in/${raw.replace(/\/$/, "")}/`
  }

  const match = raw.match(
    /(?:^|\/\/|\s)(?:[a-z]{2,3}\.)?linkedin\.com\/(in|pub)\/([A-Za-z0-9_\-%.]+)/i,
  )
  if (!match) return null

  return `https://www.linkedin.com/in/${match[2].replace(/\/$/, "")}/`
}

/**
 * Overlay stored overrides onto an analysis result. Returns a new object —
 * callers hand this straight to SWR/React, which needs a changed identity.
 */
export function applyFounderLinks(
  analysis: DealAnalysis,
  links: FounderLink[],
): DealAnalysis {
  if (!links.length || !analysis.team?.founders?.length) return analysis

  const byKey = new Map(links.map((l) => [l.founderKey, l.linkedinUrl]))

  return {
    ...analysis,
    team: {
      ...analysis.team,
      founders: analysis.team.founders.map((f) => {
        const override = byKey.get(founderKey(f.name))
        return override ? { ...f, linkedinUrl: override, linkedinManual: true } : f
      }),
    },
  }
}
