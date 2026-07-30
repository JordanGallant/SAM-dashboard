"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { canonicalLinkedInUrl, founderKey } from "@/lib/founder-links"

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

    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        job_id: analysis.id,
        deal_id: dealId,
        manual_links: (links ?? []).map((l) => ({
          founder_name: l.founder_name,
          linkedin_url: l.linkedin_url,
        })),
      }),
    })
  } catch (err) {
    console.error("Team flow re-trigger failed:", err)
  }
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
