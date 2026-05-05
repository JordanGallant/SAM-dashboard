// Load full message history for a single thread, or delete it.
// RLS ensures users can only touch their own threads.

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params

  const { data: thread, error: tErr } = await supabase
    .from("chat_threads")
    .select("id, title, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })
  if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 })

  const { data: messages, error: mErr } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("thread_id", id)
    .order("created_at", { ascending: true })
  if (mErr) return NextResponse.json({ error: mErr.message }, { status: 500 })

  return NextResponse.json({
    id: thread.id,
    title: thread.title,
    updatedAt: thread.updated_at,
    messages: messages ?? [],
  })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params

  // ON DELETE CASCADE on chat_messages.thread_id handles the messages cleanup.
  const { error } = await supabase
    .from("chat_threads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
