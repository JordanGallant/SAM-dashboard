"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { canonicalLinkedInUrl, founderKey, linkedInHandle } from "@/lib/founder-links"

/**
 * How long to wait for n8n to take the job before returning to the user. Only
 * needs to cover receipt — the run itself continues without us.
 */
const TRIGGER_ACK_MS = 3000

/**
 * Save a hand-pasted LinkedIn URL for one founder on a deal.
 *
 * Accepts anything paste-shaped (full URL, scheme-less host, bare handle) and
 * stores the canonical form. RLS scopes the write to the deal's owner and
 * their fund teammates; we don't re-check ownership here beyond requiring a
 * session, because the policy is the authority.
 */
export async function setFounderLink(
  dealId: string,
  founderName: string,
  url: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const canonical = canonicalLinkedInUrl(url)
  if (!canonical) {
    return { error: "That doesn't look like a LinkedIn profile URL." }
  }

  const { error } = await supabase.from("founder_links").upsert(
    {
      deal_id: dealId,
      founder_key: founderKey(founderName),
      founder_name: founderName,
      linkedin_url: canonical,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "deal_id,founder_key" },
  )

  if (error) return { error: error.message }

  await retriggerTeamFlow(supabase, dealId)

  revalidatePath(`/deals/${dealId}/team`)
  return { url: canonical }
}

/**
 * Re-run the n8n team flow so the pasted profile actually gets scraped, rather
 * than just relabelling the link in the UI.
 *
 * Flow 3 ("analyze-team") keys off job_id, which is the analyses row id the
 * trigger route sends as `job_id`, and looks the deck text up from sam_jobs.
 * We pass every override we hold for the deal — the flow prefers a supplied
 * URL over its Google/LLM discovery chain and skips straight to the scraper.
 *
 * Fire-and-forget on purpose: saving the URL is the user's actual request, and
 * it must not fail because n8n is down or slow. Unset env var = store-only.
 */
async function retriggerTeamFlow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  dealId: string,
) {
  const webhook = process.env.N8N_TEAM_WEBHOOK_URL
  if (!webhook) return

  try {
    const [{ data: analysis }, { data: links }] = await Promise.all([
      supabase
        .from("analyses")
        .select("id")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("founder_links")
        .select("founder_name, linkedin_url")
        .eq("deal_id", dealId),
    ])
    if (!analysis?.id) return

    // Stamp before firing so the UI shows "refreshing" even if the webhook call
    // itself is slow. The team callback clears it; readers age it out if the
    // callback never lands.
    await supabase
      .from("deals")
      .update({ team_refresh_at: new Date().toISOString() })
      .eq("id", dealId)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.samvc.ai"

    const res = await fetch(webhook, {
      method: "POST",
      // Flow 3's webhook is responseMode "lastNode", so it holds the connection
      // open for the entire run — minutes. Blocking the save on that pinned the
      // "Saving…" button and stopped the user doing anything else. n8n starts
      // the execution on receipt and finishes it after we hang up (verified
      // against a real run), so we only wait long enough to hand the job over.
      signal: AbortSignal.timeout(TRIGGER_ACK_MS),
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        job_id: analysis.id,
        deal_id: dealId,
        // Flow 3 has no baked-in secrets; it posts back to whatever we hand it,
        // same contract Flow 1 uses.
        callback_url: `${appUrl}/api/analysis/callback`,
        callback_token: process.env.ANALYSIS_CALLBACK_TOKEN,
        manual_links: (links ?? []).map((l) => ({
          founder_name: l.founder_name,
          linkedin_url: l.linkedin_url,
        })),
      }),
    })

    // fetch only rejects on network failure, so a wrong webhook path (n8n
    // answers 404 for an unregistered path, and test URLs 404 unless the
    // editor is listening) would otherwise fail completely silently.
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error(
        `Team flow re-trigger: n8n returned ${res.status} for ${webhook} — ${detail.slice(0, 300)}`,
      )
      // Nothing is coming back, so don't leave the UI claiming a refresh.
      await supabase.from("deals").update({ team_refresh_at: null }).eq("id", dealId)
    }
  } catch (err) {
    // Hanging up on a run we successfully started is the expected path, not a
    // failure — leave the refreshing state alone so the callback can clear it.
    const handedOff =
      err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
    if (handedOff) return

    console.error("Team flow re-trigger failed:", err)
    await supabase.from("deals").update({ team_refresh_at: null }).eq("id", dealId)
  }
}

/**
 * Add a founder the analysis missed entirely.
 *
 * Only a URL is asked for: the deck didn't name this person, so neither can the
 * user reliably. We store the LinkedIn handle as a placeholder name so a card
 * appears immediately, and the scrape replaces it with the real one — the same
 * path that already repoints a mis-parsed roster entry.
 */
export async function addFounder(dealId: string, url: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const canonical = canonicalLinkedInUrl(url)
  if (!canonical) {
    return { error: "That doesn't look like a LinkedIn profile URL." }
  }

  const { data: existing } = await supabase
    .from("founder_links")
    .select("founder_name")
    .eq("deal_id", dealId)
    .eq("linkedin_url", canonical)
    .maybeSingle()
  if (existing) {
    return { error: "That profile is already on this deal." }
  }

  const placeholder = linkedInHandle(canonical) || canonical

  const { error } = await supabase.from("founder_links").upsert(
    {
      deal_id: dealId,
      founder_key: founderKey(placeholder),
      founder_name: placeholder,
      linkedin_url: canonical,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "deal_id,founder_key" },
  )

  if (error) return { error: error.message }

  await retriggerTeamFlow(supabase, dealId)

  revalidatePath(`/deals/${dealId}/team`)
  return { url: canonical }
}

/** Drop the override and fall back to whatever the analysis extracted. */
export async function clearFounderLink(dealId: string, founderName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("founder_links")
    .delete()
    .eq("deal_id", dealId)
    .eq("founder_key", founderKey(founderName))

  if (error) return { error: error.message }

  revalidatePath(`/deals/${dealId}/team`)
  return { ok: true }
}
