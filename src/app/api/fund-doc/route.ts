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
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const MAX_TEXT_CHARS = 24000 // ~6k tokens — generous enough for a multi-page mandate

async function extractAllPagesText(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: true })
  const joined = Array.isArray(text) ? text.join("\n") : String(text)
  return joined.slice(0, MAX_TEXT_CHARS).trim()
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
    if (!storagePath.startsWith(`fund-docs/${user.id}/`)) {
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
      .select("id, one_pager_filename")
      .eq("user_id", user.id)
      .maybeSingle()

    // If they had a previous doc, remove the old file from storage so we
    // don't leak orphaned PDFs.
    if (existing?.one_pager_filename) {
      const previousPath = `fund-docs/${user.id}/${existing.one_pager_filename}`
      if (previousPath !== storagePath) {
        await supabase.storage
          .from("pitch-decks")
          .remove([previousPath])
          .catch(() => {})
      }
    }

    const patch = {
      one_pager_text: pdfText,
      one_pager_filename: filename,
      one_pager_uploaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      // No fund row yet — create a stub with just the doc + name placeholder.
      const { error } = await supabase
        .from("funds")
        .insert({
          user_id: user.id,
          name: "(awaiting fund details)",
          ...patch,
        })
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      filename,
      sizeBytes,
      wordsExtracted: Math.round(pdfText.split(/\s+/).filter(Boolean).length),
      uploadedAt: patch.one_pager_uploaded_at,
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
      const path = `fund-docs/${user.id}/${existing.one_pager_filename}`
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
