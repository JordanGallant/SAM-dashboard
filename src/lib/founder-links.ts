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
 * Is this a person's name, or a section heading the analysis parser mistook for
 * one? Reports get chopped into "founders" like "ADDITIONAL FOUNDERS /
 * EXECUTIVE TEAM" or "LinkedIn: Not Available", and a URL pasted onto one of
 * those still has to work — we just take the real name off the scraped profile
 * instead of trusting the roster.
 */
export function looksLikePerson(name: string | undefined): boolean {
  const n = (name ?? "").trim()
  if (!n) return false
  if (/[:/|]|\d/.test(n)) return false
  if (/\b(TEAM|FOUNDERS|EXECUTIVE|ADDITIONAL|UNKNOWN|AVAILABLE|OVERVIEW|PROFILES)\b/i.test(n)) {
    return false
  }
  const words = n.split(/\s+/)
  return words.length >= 2 && words.length <= 4
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

/** "https://www.linkedin.com/in/sanderkamphuis/" -> "sanderkamphuis" */
export function linkedInHandle(url: string): string {
  return url.match(/linkedin\.com\/in\/([A-Za-z0-9_\-%.]+)/i)?.[1] ?? ""
}

/**
 * Overlay stored overrides onto an analysis result. Returns a new object —
 * callers hand this straight to SWR/React, which needs a changed identity.
 *
 * A link that matches no founder is one the user added by hand, for someone
 * the analysis missed entirely. Those become founder rows in their own right so
 * the card appears the moment it's saved, with the details filled in once the
 * scrape comes back.
 */
export function applyFounderLinks(
  analysis: DealAnalysis,
  links: FounderLink[],
  removedKeys: string[] = [],
): DealAnalysis {
  if ((!links.length && !removedKeys.length) || !analysis.team) return analysis

  const removed = new Set(removedKeys)
  const unmatched = new Map(
    links.filter((l) => !removed.has(l.founderKey)).map((l) => [l.founderKey, l]),
  )

  const founders = (analysis.team.founders ?? [])
    .filter((f) => !removed.has(founderKey(f.name)))
    .map((f) => {
    const key = founderKey(f.name)
    // Match by name, or by URL — an added founder is saved under their
    // LinkedIn handle, and once the scrape has put their real name on the
    // roster the names no longer line up while the URLs still do. Without the
    // URL check the leftover handle row would render a phantom second card.
    let override = unmatched.get(key)
    if (!override && f.linkedinUrl) {
      const h = linkedInHandle(f.linkedinUrl)
      override = [...unmatched.values()].find((l) => linkedInHandle(l.linkedinUrl) === h)
    }
    if (!override) return f
    unmatched.delete(override.founderKey)
    return { ...f, linkedinUrl: override.linkedinUrl, linkedinManual: true }
  })

  for (const added of unmatched.values()) {
    founders.push({
      name: added.founderName,
      role: "",
      background: "",
      strength: "",
      keyConcern: "",
      linkedinUrl: added.linkedinUrl,
      linkedinManual: true,
      addedByUser: true,
    })
  }

  return { ...analysis, team: { ...analysis.team, founders } }
}
