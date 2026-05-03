// Fund 1-pager processing endpoint. Mirrors /api/upload-deck's pattern:
// the client uploads the PDF directly to Supabase Storage (so we don't hit
// Vercel's serverless body-size limit), then POSTs the storage path here.
// We pull the file back, extract text via unpdf, and persist it onto the
// user's funds row. The text feeds Flow 10's prompt as authoritative fund
// context — much better signal than checkbox arrays.
//
// DELETE wipes the file from storage and clears the three columns.

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { extractText, getDocumentProxy } from "unpdf"
import OpenAI from "openai"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"
import { upsertHubspotContact } from "@/lib/hubspot"

const MAX_TEXT_CHARS = 24000 // ~6k tokens — generous enough for a multi-page mandate

async function extractAllPagesText(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: true })
  const joined = Array.isArray(text) ? text.join("\n") : String(text)
  return joined.slice(0, MAX_TEXT_CHARS).trim()
}

interface ExtractedFundFields {
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

// Pull structured fund fields out of the mandate doc text using Azure OpenAI.
// Same client pattern as /api/upload-deck. Returns null on any failure — the
// upload flow continues even if extraction fails (the raw text is still saved
// and Flow 10 will use it directly via the doc-as-authoritative prompt).
async function extractFundFields(docText: string): Promise<ExtractedFundFields | null> {
  const key = process.env.AZURE_AI_KEY
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const model = process.env.AZURE_AI_MODEL || "gpt-4o"
  if (!key || !endpoint) return null

  const client = new OpenAI({ baseURL: endpoint, apiKey: key })

  const systemPrompt = `Extract structured fund-profile fields from a fund mandate document. Return JSON only, no prose.

Schema:
{
  "name": string — the fund's name as stated in the doc (e.g. "Horizon Ventures II"). Drop boilerplate suffixes like ", L.P." or ", Fund SCSp". Empty string if no clear fund name.
  "website": string — the fund's website if mentioned (https://… form). Empty string if not stated.
  "thesis": string — 1-3 sentences capturing the fund's investment thesis. Verbatim phrasing from the doc preferred. Empty string if not stated.
  "stageFocus": string[] — pick zero or more from: ${DEAL_STAGES.join(", ")}. Only include stages the doc explicitly mentions.
  "sectorFocus": string[] — pick zero or more from: ${SECTORS.join(", ")}. Map the doc's wording to these canonical buckets. "Other" if the fund's focus doesn't fit cleanly.
  "geoFocus": string[] — pick zero or more from: ${GEOS.join(", ")}. EU-only mandates → ["Europe"]. EU+UK → ["Europe", "UK"].
  "ticketSizeMin": integer EUR — first-cheque minimum, in raw euros (e.g. 500000 not "500K"). Null if not stated.
  "ticketSizeMax": integer EUR — first-cheque maximum, in raw euros. Null if not stated.
  "additional": string — capture all hard restrictions, exclusions, and binding LP constraints in one paragraph. Examples: "no defense, gambling, or non-EU companies; GDPR-by-design preferred; quarterly LP reviews".
}

Be conservative. Do not invent fields. Empty string / null / [] are valid when the doc is silent.`

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

    // Defensive validation — only keep canonical values.
    const stageAllowed = new Set<string>(DEAL_STAGES)
    const sectorAllowed = new Set<string>(SECTORS)
    const geoAllowed = new Set<string>(GEOS)

    return {
      name: typeof parsed.name === "string" ? parsed.name.trim() : undefined,
      website: typeof parsed.website === "string" ? parsed.website.trim() : undefined,
      thesis: typeof parsed.thesis === "string" ? parsed.thesis.trim() : undefined,
      stageFocus: Array.isArray(parsed.stageFocus)
        ? parsed.stageFocus.filter((s: unknown): s is string => typeof s === "string" && stageAllowed.has(s))
        : undefined,
      sectorFocus: Array.isArray(parsed.sectorFocus)
        ? parsed.sectorFocus.filter((s: unknown): s is string => typeof s === "string" && sectorAllowed.has(s))
        : undefined,
      geoFocus: Array.isArray(parsed.geoFocus)
        ? parsed.geoFocus.filter((s: unknown): s is string => typeof s === "string" && geoAllowed.has(s))
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

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers)
    const rl = checkRateLimit(`fund-doc:${ip}`, { limit: 6, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rl.retryAfter}s.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const storagePath = typeof body?.storagePath === "string" ? body.storagePath : ""
    const filename = typeof body?.filename === "string" ? body.filename : ""
    const sizeBytes = typeof body?.size === "number" ? body.size : 0

    if (!storagePath || !filename) {
      return NextResponse.json(
        { error: "storagePath and filename are required" },
        { status: 400 }
      )
    }

    // Defence in depth: ensure the path the client gave us actually belongs to this user.
    if (!storagePath.startsWith(`${user.id}/fund-docs/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Download the PDF from Supabase Storage (skips Vercel body-size limit).
    const { data: blob, error: dlErr } = await supabase.storage
      .from("pitch-decks")
      .download(storagePath)

    if (dlErr || !blob) {
      return NextResponse.json(
        { error: dlErr?.message || "Could not read uploaded file" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await blob.arrayBuffer())

    let pdfText: string
    try {
      pdfText = await extractAllPagesText(buffer)
    } catch (err) {
      console.error("Fund-doc PDF extract failed", err)
      return NextResponse.json(
        { error: "Failed to read PDF. The file may be corrupted or password-protected." },
        { status: 400 }
      )
    }

    if (pdfText.length < 30) {
      return NextResponse.json(
        {
          error:
            "Could not read text from this PDF. It may be image-only or scanned — try a text-based version.",
        },
        { status: 400 }
      )
    }

    // Find or create the funds row, then attach the doc.
    const { data: existing } = await supabase
      .from("funds")
      .select(
        "id, name, website, thesis, stage_focus, sector_focus, geo_focus, ticket_size_min, ticket_size_max, additional, one_pager_filename"
      )
      .eq("user_id", user.id)
      .maybeSingle()

    // If they had a previous doc, remove the old file from storage so we
    // don't leak orphaned PDFs.
    if (existing?.one_pager_filename) {
      const previousPath = `${user.id}/fund-docs/${existing.one_pager_filename}`
      if (previousPath !== storagePath) {
        await supabase.storage
          .from("pitch-decks")
          .remove([previousPath])
          .catch(() => {})
      }
    }

    // LLM-extract structured fields from the doc.
    const extracted = await extractFundFields(pdfText)

    // Only fill EMPTY fields. We never overwrite values the user has already
    // typed in by hand — their work wins. This keeps the upload-doc flow safe
    // for returning users who've customised their fund profile.
    // Exception: the "(awaiting fund details)" placeholder is treated as empty
    // — that's a stub we wrote when a row was created without a real name yet.
    const isEmptyStr = (v: unknown) =>
      typeof v !== "string" || !v.trim() || v.trim() === "(awaiting fund details)"
    const isEmptyArr = (v: unknown) => !Array.isArray(v) || v.length === 0
    const isEmptyNum = (v: unknown) => typeof v !== "number" || !v

    const patch: Record<string, unknown> = {
      one_pager_text: pdfText,
      one_pager_filename: filename,
      one_pager_uploaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const filled: string[] = []

    if (extracted) {
      if (extracted.name && isEmptyStr(existing?.name)) {
        patch.name = extracted.name
        filled.push("name")
      }
      if (extracted.website && isEmptyStr(existing?.website)) {
        patch.website = extracted.website
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
      if (extracted.additional && isEmptyStr(existing?.additional)) {
        patch.additional = extracted.additional
        filled.push("additional")
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
      // No fund row yet — create one. Use extracted thesis/focus/etc directly,
      // since there's nothing to preserve on a fresh row.
      const { error } = await supabase.from("funds").insert({
        user_id: user.id,
        name: "(awaiting fund details)",
        ...patch,
      })
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    // Sync the freshly-extracted fund context up to HubSpot. Fire-and-forget —
    // upload success doesn't depend on the CRM round-trip. We push name +
    // website to standard fields and pack thesis / stage / sector / geo /
    // ticket size into the long-text `description` slot.
    if (user.email) {
      const eff = (k: keyof typeof patch, fallback: unknown) =>
        (patch as Record<string, unknown>)[k] ??
        (existing as Record<string, unknown> | null)?.[k] ??
        fallback
      const finalName =
        (typeof eff("name", null) === "string" && eff("name", null) !== "(awaiting fund details)"
          ? (eff("name", null) as string)
          : null)
      const finalWebsite = (eff("website", null) as string | null) || null
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
      if (tMin || tMax) {
        descParts.push(
          `Ticket size: EUR ${tMin || "?"} – ${tMax || "?"}`
        )
      }
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
      filename,
      sizeBytes,
      wordsExtracted: Math.round(pdfText.split(/\s+/).filter(Boolean).length),
      uploadedAt: patch.one_pager_uploaded_at,
      autoFilledFields: filled,
    })
  } catch (err) {
    console.error("Fund-doc upload error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const ip = getClientIp(request.headers)
    const rl = checkRateLimit(`fund-doc-del:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rl.retryAfter}s.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: existing } = await supabase
      .from("funds")
      .select("id, one_pager_filename")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({ success: true })
    }

    if (existing.one_pager_filename) {
      const path = `${user.id}/fund-docs/${existing.one_pager_filename}`
      await supabase.storage
        .from("pitch-decks")
        .remove([path])
        .catch(() => {})
    }

    const { error } = await supabase
      .from("funds")
      .update({
        one_pager_text: null,
        one_pager_filename: null,
        one_pager_uploaded_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Fund-doc delete error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
