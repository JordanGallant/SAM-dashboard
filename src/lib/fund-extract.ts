// Shared fund-field extraction. Used by /api/fund-doc (PDF mandate document)
// and /api/fund-website (scraped homepage HTML). One source of truth so both
// flows produce the same canonical structured-fund JSON and obey the same
// validation rules.
//
// The Azure OpenAI call uses response_format: json_object — we then defensively
// validate and only return values that match our canonical sets. Anything off-
// schema is dropped so a hallucinated stage like "Series Z" never leaks into
// the funds row.

import OpenAI from "openai"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"

export interface ExtractedFundFields {
  name?: string
  website?: string
  thesis?: string
  stageFocus?: string[]
  sectorFocus?: string[]
  geoFocus?: string[]
  ticketSizeMin?: number
  ticketSizeMax?: number
  additional?: string
}

// Canonical-only filter helpers (kept in sync with constants.ts).
const STAGE_ALLOWED = new Set<string>(DEAL_STAGES)
const SECTOR_ALLOWED = new Set<string>(SECTORS)
const GEO_ALLOWED = new Set<string>(GEOS)

// "Source kind" is purely a hint for the prompt — the JSON schema is identical
// either way. We tell the model whether it's reading a structured mandate doc
// or a scraped marketing site so it can be appropriately cautious about the
// thesis (mandate text is usually verbatim; website copy is often marketing
// fluff that needs distilling).
export type FundSource = "mandate-doc" | "website"

export async function extractFundFields(
  docText: string,
  source: FundSource = "mandate-doc",
): Promise<ExtractedFundFields | null> {
  const key = process.env.AZURE_AI_KEY
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const model = process.env.AZURE_AI_MODEL || "gpt-4o"
  if (!key || !endpoint) return null

  const client = new OpenAI({ baseURL: endpoint, apiKey: key })

  const sourceHint =
    source === "website"
      ? `The text below was scraped from the fund's public website. Marketing copy may overstate scope — extract only what's clearly stated. If a section reads as boilerplate ("we partner with founders"), prefer to leave thesis empty rather than echo platitudes.`
      : `The text below is a fund mandate document (1-pager / LP deck). Treat phrasing as authoritative.`

  const systemPrompt = `Extract structured fund-profile fields from a fund's source text. Return JSON only, no prose.

${sourceHint}

Schema:
{
  "name": string — the fund's name as stated (e.g. "Horizon Ventures II"). Drop boilerplate suffixes like ", L.P." or ", Fund SCSp". Empty string if no clear fund name.
  "website": string — the fund's website if mentioned (https://… form). Empty string if not stated.
  "thesis": string — 1-3 sentences capturing the fund's investment thesis. Verbatim phrasing preferred. Empty string if not stated or only generic platitudes.
  "stageFocus": string[] — pick zero or more from: ${DEAL_STAGES.join(", ")}. Only include stages the source explicitly mentions.
  "sectorFocus": string[] — pick zero or more from: ${SECTORS.join(", ")}. Map the wording to these canonical buckets. "Other" if the fund's focus doesn't fit cleanly.
  "geoFocus": string[] — pick zero or more from: ${GEOS.join(", ")}. EU-only mandates → ["Europe"]. EU+UK → ["Europe", "UK"].
  "ticketSizeMin": integer EUR — first-cheque minimum, in raw euros (e.g. 500000 not "500K"). Null if not stated.
  "ticketSizeMax": integer EUR — first-cheque maximum, in raw euros. Null if not stated.
  "additional": string — capture all hard restrictions, exclusions, and binding LP constraints in one paragraph. Examples: "no defense, gambling, or non-EU companies; GDPR-by-design preferred; quarterly LP reviews".
}

Be conservative. Do not invent fields. Empty string / null / [] are valid when the source is silent.`

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: docText },
      ],
    })
    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) return null
    const parsed = JSON.parse(raw)

    return {
      name: typeof parsed.name === "string" ? parsed.name.trim() : undefined,
      website: typeof parsed.website === "string" ? parsed.website.trim() : undefined,
      thesis: typeof parsed.thesis === "string" ? parsed.thesis.trim() : undefined,
      stageFocus: Array.isArray(parsed.stageFocus)
        ? parsed.stageFocus.filter((s: unknown): s is string => typeof s === "string" && STAGE_ALLOWED.has(s))
        : undefined,
      sectorFocus: Array.isArray(parsed.sectorFocus)
        ? parsed.sectorFocus.filter((s: unknown): s is string => typeof s === "string" && SECTOR_ALLOWED.has(s))
        : undefined,
      geoFocus: Array.isArray(parsed.geoFocus)
        ? parsed.geoFocus.filter((s: unknown): s is string => typeof s === "string" && GEO_ALLOWED.has(s))
        : undefined,
      ticketSizeMin:
        typeof parsed.ticketSizeMin === "number" && parsed.ticketSizeMin > 0
          ? Math.round(parsed.ticketSizeMin)
          : undefined,
      ticketSizeMax:
        typeof parsed.ticketSizeMax === "number" && parsed.ticketSizeMax > 0
          ? Math.round(parsed.ticketSizeMax)
          : undefined,
      additional: typeof parsed.additional === "string" ? parsed.additional.trim() : undefined,
    }
  } catch (err) {
    console.error("Fund field extraction failed:", err)
    return null
  }
}

// Empty-fields-only merge helpers — used by both routes so the user's typed
// values are never overwritten. The "(awaiting fund details)" placeholder is
// treated as empty (it's a stub we write when a row is created without a real
// name yet).
export const isEmptyStr = (v: unknown) =>
  typeof v !== "string" || !v.trim() || v.trim() === "(awaiting fund details)"
export const isEmptyArr = (v: unknown) => !Array.isArray(v) || v.length === 0
export const isEmptyNum = (v: unknown) => typeof v !== "number" || !v
