// Browser-side access to Azure Blob storage. The client can't hold the account
// key, so it asks here for a short-lived upload URL and then PUTs the file
// directly to Azure (the body never touches Vercel). Paths are confined to the
// caller's own `{user_id}/` namespace — the same rule the Supabase bucket RLS
// enforced ("Users upload/delete own pitch decks").

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createUploadUrl, removeFiles } from "@/lib/storage"

export const runtime = "nodejs"

async function authorizedPath(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  const body = await request.json().catch(() => null)
  const storagePath = typeof body?.storagePath === "string" ? body.storagePath : ""
  if (!storagePath || !storagePath.startsWith(`${user.id}/`) || storagePath.includes("..")) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }
  return { storagePath }
}

// POST { storagePath } -> { url } : signed PUT URL, valid 10 minutes.
export async function POST(request: Request) {
  const { storagePath, error } = await authorizedPath(request)
  if (error) return error
  return NextResponse.json({ url: createUploadUrl(storagePath) })
}

// DELETE { storagePath } : cleanup after a failed registration.
export async function DELETE(request: Request) {
  const { storagePath, error } = await authorizedPath(request)
  if (error) return error
  try {
    await removeFiles([storagePath])
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Delete failed" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
