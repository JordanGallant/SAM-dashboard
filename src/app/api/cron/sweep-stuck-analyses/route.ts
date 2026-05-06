import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Pilot feedback #6: an analysis can finish in n8n without the SAM callback
// landing — the row stays `processing` indefinitely and the UI shows a stuck
// spinner. This sweep flips any row that has been `processing` longer than
// the timeout to `failed`. Realtime then propagates the status change to
// useDeals so the UI shows "Failed" + the retry path.
const TIMEOUT_MIN = 20

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 })
  }
  if (request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cutoff = new Date(Date.now() - TIMEOUT_MIN * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("analyses")
    .update({
      status: "failed",
      error: `Timeout: analysis exceeded ${TIMEOUT_MIN} min without callback`,
      completed_at: new Date().toISOString(),
    })
    .eq("status", "processing")
    .lt("created_at", cutoff)
    .select("id, deal_id")

  if (error) {
    console.error("sweep-stuck-analyses failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    swept: data?.length ?? 0,
    rows: data ?? [],
    cutoff,
  })
}
