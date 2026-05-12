import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Returns the fund_id the calling user is a member of (or null if none).
 *
 * Replaces the older "the fund row whose user_id matches mine" lookup.
 * With seat sharing, a user might be a member of a fund they don't own,
 * so we always go through fund_members.
 *
 * Assumes one fund per user (enforced at the application layer). If a user
 * ever ends up in two funds, this returns whichever the DB returns first —
 * fix the data, don't paper over it.
 */
export async function getActiveFundId(
  supabase: SupabaseClient,
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("fund_members")
    .select("fund_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()
  return (data as { fund_id: string } | null)?.fund_id ?? null
}
