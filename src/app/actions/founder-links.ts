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
