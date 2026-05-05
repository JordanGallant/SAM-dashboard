// List the current user's chat threads for a given (deal, scope) pair.
// Used by the Ask SAM right-rail panel to render the thread switcher.

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const dealId = url.searchParams.get("dealId")
  const scope = url.searchParams.get("scope")
  if (!dealId || !scope) {
    return NextResponse.json({ error: "dealId and scope are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("chat_threads")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .eq("deal_id", dealId)
    .eq("scope", scope)
    .order("updated_at", { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    threads: (data ?? []).map((t) => ({ id: t.id, title: t.title, updatedAt: t.updated_at })),
  })
}
