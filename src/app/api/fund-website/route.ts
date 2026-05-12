// Fund-website scraper. The user enters their fund's homepage URL on
// /settings/fund-profile and clicks "Scrape website". This endpoint:
//
//   1. Validates the URL (http(s), 8s timeout, html content-type, follows
//      redirects, capped response size)
//   2. Strips the HTML to visible text via a regex pipeline (no cheerio dep —
//      it isn't in the tree and the brief said don't add deps unless checked)
//   3. Caps text at 24k chars (matches /api/fund-doc) and runs the SAME
//      Azure OpenAI extraction (extractFundFields from @/lib/fund-extract) so
//      the structured-fund JSON is identical to the mandate-doc flow
//   4. Merges into the funds row with empty-fields-only rules — typed values
//      are never overwritten
//   5. Appends a markdown summary of the scraped data to the `additional`
//      column so Flow 10's prompt has the website context, even when other
//      structured fields were already filled. This is the user's actual ask
//      — they want the scraped data to land in `additional` in particular.
//   6. Fire-and-forget HubSpot sync (mirrors fund-doc).
//
// Tradeoff: we fetch raw HTML, no headless browser. Static-HTML fund sites
// (Index, Sequoia, most VC marketing pages) work great. JS-rendered SPAs
// (rare for fund sites) will return empty text and the extraction will be
// weak. We surface a clear error in that case.

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { upsertHubspotContact } from "@/lib/hubspot"
import {
  extractFundFields,
  isEmptyStr,
  isEmptyArr,
  isEmptyNum,
  type ExtractedFundFields,
} from "@/lib/fund-extract"

const MAX_TEXT_CHARS = 24000
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024 // 5 MB cap on raw HTML
const FETCH_TIMEOUT_MS = 8000
const ADDITIONAL_SUMMARY_CAP = 3000 // ~750 words — enough context for Flow 10
const USER_AGENT =
  "Mozilla/5.0 (compatible; SAMFundScraper/1.0; +https://test.jgsleepy.xyz)"

// Validate + normalise. Throws on bad URL.
function normaliseUrl(input: string): URL {
  let raw = (input || "").trim()
  if (!raw) throw new Error("URL is required")
  // Tolerate a missing scheme — users often paste "indexventures.com".
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error("That doesn't look like a valid URL")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported")
  }
  // SSRF guard: refuse obvious internal addresses. We don't resolve DNS here
  // — that requires Node-internal calls and adds attack surface — but we do
  // catch the easy cases (localhost, link-local, RFC1918 by hostname).
  const host = url.hostname.toLowerCase()
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    throw new Error("That URL points to a private network and can't be scraped")
  }
  return url
}

// Fetch with timeout + size cap. Returns the body as a string (HTML).
async function fetchHtml(url: URL): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en",
      },
    })
    if (!res.ok) {
      throw new Error(`The site responded with HTTP ${res.status}`)
    }
    const ctype = (res.headers.get("content-type") || "").toLowerCase()
    if (!ctype.includes("html") && !ctype.includes("xml") && ctype !== "") {
      throw new Error(
        "That URL doesn't return HTML — point us at the homepage, not a PDF or feed",
      )
    }
    // Stream-read with a hard size cap so a 1 GB page can't OOM us.
    const reader = res.body?.getReader()
    if (!reader) {
      const text = await res.text()
      return text.slice(0, MAX_RESPONSE_BYTES)
    }
    const chunks: Uint8Array[] = []
    let total = 0
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (!value) continue
      total += value.byteLength
      if (total > MAX_RESPONSE_BYTES) {
        try { await reader.cancel() } catch {}
        break
      }
      chunks.push(value)
    }
    const merged = new Uint8Array(total > MAX_RESPONSE_BYTES ? MAX_RESPONSE_BYTES : total)
    let offset = 0
    for (const c of chunks) {
      const remaining = merged.byteLength - offset
      if (remaining <= 0) break
      const slice = c.byteLength > remaining ? c.subarray(0, remaining) : c
      merged.set(slice, offset)
      offset += slice.byteLength
    }
    return new TextDecoder("utf-8", { fatal: false }).decode(merged)
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("The site took too long to respond (8s timeout)")
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// HTML → visible text. Hand-rolled because cheerio isn't installed (we'd need
// `pnpm add cheerio` and the brief said don't unless we checked — we did:
// pnpm why returned no result, so we strip with regex).
//
// Steps:
//   - drop <script>, <style>, <noscript>, <template> (and their contents)
//   - drop HTML comments
//   - prefer <main>/<article>/<body> if present (cuts boilerplate header/footer)
//   - decode common entities
//   - collapse whitespace
function htmlToText(html: string): string {
  let h = html

  // Remove blocks where the *content* is not visible text.
  h = h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  h = h.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  h = h.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
  h = h.replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, " ")
  h = h.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
  h = h.replace(/<!--[\s\S]*?-->/g, " ")

  // Prefer the most informative region if the page exposes one. We try in
  // descending order of signal — main > article > body. If none match we keep
  // the full doc.
  const tryExtract = (tag: string) => {
    const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
    const m = h.match(re)
    return m?.[1]
  }
  const main = tryExtract("main") || tryExtract("article") || tryExtract("body")
  if (main && main.length > 200) h = main

  // Insert spaces around block-level boundaries so words don't run together
  // when we strip tags.
  h = h.replace(/<(\/?(?:p|div|section|li|tr|td|th|h[1-6]|br|hr|header|footer|nav|aside|article|main|figcaption))\b[^>]*>/gi, " ")

  // Strip all remaining tags.
  h = h.replace(/<[^>]+>/g, " ")

  // Decode the handful of named entities that show up in real-world HTML.
  // (A full entity map is overkill for fund-fit context.)
  h = h
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&hellip;/gi, "…")
    .replace(/&#(\d+);/g, (_, d) => {
      const n = parseInt(d, 10)
      return Number.isFinite(n) && n > 0 && n < 0x10ffff ? String.fromCodePoint(n) : " "
    })

  // Collapse whitespace runs.
  h = h.replace(/\s+/g, " ").trim()
  return h.slice(0, MAX_TEXT_CHARS)
}

// Build a markdown-ish summary of what we extracted, for the `additional`
// column. We deliberately format it so Flow 10's prompt can recognise it as
// scraped context (the "From website" header is the cue).
function buildSummary(
  extracted: ExtractedFundFields | null,
  fallbackText: string,
  url: string,
): string {
  if (!extracted) {
    // Couldn't structure it — just give Flow 10 the trimmed scraped text.
    return fallbackText.slice(0, ADDITIONAL_SUMMARY_CAP).trim()
  }
  const parts: string[] = []
  if (extracted.thesis) parts.push(`Thesis: ${extracted.thesis}`)
  if (extracted.stageFocus?.length) parts.push(`Stage focus: ${extracted.stageFocus.join(", ")}`)
  if (extracted.sectorFocus?.length) parts.push(`Sector focus: ${extracted.sectorFocus.join(", ")}`)
  if (extracted.geoFocus?.length) parts.push(`Geography: ${extracted.geoFocus.join(", ")}`)
  if (extracted.ticketSizeMin || extracted.ticketSizeMax) {
    parts.push(
      `Ticket size: EUR ${extracted.ticketSizeMin || "?"} – ${extracted.ticketSizeMax || "?"}`,
    )
  }
  if (extracted.additional) parts.push(`Restrictions: ${extracted.additional}`)

  // If structured extraction was thin, pad with raw scraped text so Flow 10
  // still has something to work with.
  if (parts.length < 2) {
    parts.push(`Scraped text:\n${fallbackText.slice(0, ADDITIONAL_SUMMARY_CAP - 200).trim()}`)
  }
  return `Source: ${url}\n\n${parts.join("\n\n")}`.slice(0, ADDITIONAL_SUMMARY_CAP)
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers)
    const rl = checkRateLimit(`fund-website:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rl.retryAfter}s.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfter),
            "X-RateLimit-Limit": String(rl.limit),
            "X-RateLimit-Window": "60",
          },
        },
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const rawUrl = typeof body?.url === "string" ? body.url : ""
    let url: URL
    try {
      url = normaliseUrl(rawUrl)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid URL" },
        { status: 400 },
      )
    }

    let html: string
    try {
      html = await fetchHtml(url)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Could not reach that URL" },
        { status: 400 },
      )
    }

    const text = htmlToText(html)
    if (text.length < 80) {
      return NextResponse.json(
        {
          error:
            "Couldn't read enough text from that page — it may be JavaScript-rendered or behind a login. Try a different URL or use the mandate-document upload instead.",
        },
        { status: 400 },
      )
    }

    // Find the shared fund via fund_members so teammates' scrapes update the
    // same row.
    const { data: membership } = await supabase
      .from("fund_members")
      .select("fund_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()
    const memberFundId = (membership as { fund_id: string } | null)?.fund_id ?? null
    const { data: existing } = memberFundId
      ? await supabase
          .from("funds")
          .select(
            "id, name, website, thesis, stage_focus, sector_focus, geo_focus, ticket_size_min, ticket_size_max, additional",
          )
          .eq("id", memberFundId)
          .maybeSingle()
      : { data: null }

    // LLM-extract structured fields from the scraped text. "website" hint
    // tells the model to be skeptical of marketing fluff.
    const extracted = await extractFundFields(text, "website")

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    const filled: string[] = []

    if (extracted) {
      if (extracted.name && isEmptyStr(existing?.name)) {
        patch.name = extracted.name
        filled.push("name")
      }
      // We DON'T overwrite website — the user just typed it. But if the row
      // somehow has no website yet, fall back to the URL they scraped.
      if (isEmptyStr(existing?.website)) {
        patch.website = url.toString()
        filled.push("website")
      }
      if (extracted.thesis && isEmptyStr(existing?.thesis)) {
        patch.thesis = extracted.thesis
        filled.push("thesis")
      }
      if (extracted.stageFocus && extracted.stageFocus.length > 0 && isEmptyArr(existing?.stage_focus)) {
        patch.stage_focus = extracted.stageFocus
        filled.push("stageFocus")
      }
      if (extracted.sectorFocus && extracted.sectorFocus.length > 0 && isEmptyArr(existing?.sector_focus)) {
        patch.sector_focus = extracted.sectorFocus
        filled.push("sectorFocus")
      }
      if (extracted.geoFocus && extracted.geoFocus.length > 0 && isEmptyArr(existing?.geo_focus)) {
        patch.geo_focus = extracted.geoFocus
        filled.push("geoFocus")
      }
      if (extracted.ticketSizeMin && isEmptyNum(existing?.ticket_size_min)) {
        patch.ticket_size_min = extracted.ticketSizeMin
        filled.push("ticketSizeMin")
      }
      if (extracted.ticketSizeMax && isEmptyNum(existing?.ticket_size_max)) {
        patch.ticket_size_max = extracted.ticketSizeMax
        filled.push("ticketSizeMax")
      }
    } else if (isEmptyStr(existing?.website)) {
      // Even if extraction failed entirely, store the URL the user gave us.
      patch.website = url.toString()
      filled.push("website")
    }

    // The user's literal ask: scraped data should land in `additional` so
    // Flow 10's prompt has website context. Always update this column —
    // either fill it (if empty) or append a clearly-marked section.
    const summary = buildSummary(extracted, text, url.toString())
    let additionalUpdated = false
    if (summary) {
      const today = new Date().toISOString().slice(0, 10)
      const existingAdditional = (existing?.additional || "").trim()
      if (!existingAdditional || existingAdditional === "(awaiting fund details)") {
        patch.additional = summary
        additionalUpdated = true
      } else if (!existingAdditional.includes("## From website")) {
        patch.additional = `${existingAdditional}\n\n## From website (scraped ${today})\n\n${summary}`
        additionalUpdated = true
      } else {
        // Replace the previous "## From website (...)" section so re-scrapes
        // don't pile up. Match from the header to either the next "## " or EOF.
        const replaced = existingAdditional.replace(
          /\n*## From website[\s\S]*?(?=\n## |$)/,
          `\n\n## From website (scraped ${today})\n\n${summary}`,
        )
        patch.additional = replaced.trim()
        additionalUpdated = true
      }
    }

    if (existing) {
      const { error } = await supabase
        .from("funds")
        .update(patch)
        .eq("id", existing.id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      // No fund row yet — create one. Use the URL as the website if extraction
      // didn't supply one, and the placeholder name so other UI still works.
      const insertRow: Record<string, unknown> = {
        user_id: user.id,
        name: (patch.name as string | undefined) || "(awaiting fund details)",
        website: (patch.website as string | undefined) || url.toString(),
        ...patch,
      }
      const { data: newFund, error } = await supabase
        .from("funds")
        .insert(insertRow)
        .select("id")
        .single()
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      // Seat the creator as owner so /settings/members works for them too.
      // Uses the service role: the fund_members RLS requires existing membership,
      // which is circular for the very first owner row.
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } },
      )
      await admin
        .from("fund_members")
        .insert({ fund_id: (newFund as { id: string }).id, user_id: user.id, role: "owner" })
        .then(({ error: memErr }) => {
          if (memErr && memErr.code !== "23505") {
            console.error("[fund-website] fund_members owner insert failed:", memErr)
          }
        })
    }

    // Fire-and-forget HubSpot sync — same pattern as /api/fund-doc.
    if (user.email) {
      const eff = (k: string, fallback: unknown) =>
        (patch as Record<string, unknown>)[k] ??
        (existing as Record<string, unknown> | null)?.[k] ??
        fallback
      const finalName =
        typeof eff("name", null) === "string" && eff("name", null) !== "(awaiting fund details)"
          ? (eff("name", null) as string)
          : null
      const finalWebsite = (eff("website", null) as string | null) || url.toString()
      const thesis = (eff("thesis", null) as string | null) || ""
      const stage = (eff("stage_focus", []) as string[]).join(", ")
      const sector = (eff("sector_focus", []) as string[]).join(", ")
      const geo = (eff("geo_focus", []) as string[]).join(", ")
      const tMin = eff("ticket_size_min", null)
      const tMax = eff("ticket_size_max", null)
      const additional = (eff("additional", null) as string | null) || ""

      const descParts: string[] = []
      if (thesis) descParts.push(`Thesis: ${thesis}`)
      if (stage) descParts.push(`Stage focus: ${stage}`)
      if (sector) descParts.push(`Sector focus: ${sector}`)
      if (geo) descParts.push(`Geography: ${geo}`)
      if (tMin || tMax) descParts.push(`Ticket size: EUR ${tMin || "?"} – ${tMax || "?"}`)
      if (additional) descParts.push(`Restrictions: ${additional}`)

      void upsertHubspotContact(user.email, {
        company: finalName ?? undefined,
        website: finalWebsite ?? undefined,
        description: descParts.join("\n\n") || undefined,
        lifecyclestage: "marketingqualifiedlead",
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      autoFilledFields: filled,
      additionalUpdated,
      wordsExtracted: Math.round(text.split(/\s+/).filter(Boolean).length),
    })
  } catch (err) {
    console.error("Fund-website scrape error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}
