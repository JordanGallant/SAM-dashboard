// Sign + redirect to a private storage object. Source pills on the report
// link here so the browser can follow a stable path (the signed URL itself
// is short-lived and can't be embedded directly in the page).

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createSignedUrl } from "@/lib/storage"

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params

  // RLS on `documents` already restricts to the owning user via deal_id →
  // user_id, so a row coming back here is implicitly authorized.
  const { data: doc, error } = await supabase
    .from("documents")
    .select("storage_path, filename")
    .eq("id", id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let signedUrl: string
  try {
    signedUrl = createSignedUrl(doc.storage_path, 60 * 5)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Sign failed" }, { status: 500 })
  }

  return NextResponse.redirect(signedUrl, { status: 302 })
}
