/**
 * Coupon-trial deal cap.
 *
 * Users on a Stripe-native trial (entered via FOUNDER90 or similar promo
 * code) get a hard cap of TRIAL_DEAL_CAP total deals. Once they hit it, the
 * UI gates new-deal creation behind a paywall dialog and the server-side
 * endpoint refuses with 402.
 *
 * The cap exists to force conversion at peak perceived value (right after
 * they see the 3rd memo) instead of letting them consume the full 14 days
 * for free. Paid Pro users (`subscription_status === "active"`) are not
 * affected — they get the normal monthly cap from tier-config.
 */
import type { SupabaseClient } from "@supabase/supabase-js"

export const TRIAL_DEAL_CAP = 3

export type TrialUsage = {
  isTrialing: boolean
  used: number
  cap: number
  remaining: number
  atLimit: boolean
}

const EMPTY: TrialUsage = {
  isTrialing: false,
  used: 0,
  cap: TRIAL_DEAL_CAP,
  remaining: TRIAL_DEAL_CAP,
  atLimit: false,
}

export async function getTrialUsage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  userId: string,
): Promise<TrialUsage> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", userId)
    .maybeSingle()

  const isTrialing = profile?.subscription_status === "trial"
  if (!isTrialing) return EMPTY

  // Count total deals ever — trial users have no pre-trial access so this
  // equals "deals during current trial". Cheap query (one row), runs on
  // every gated action.
  const { count } = await supabase
    .from("deals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)

  const used = count ?? 0
  const remaining = Math.max(0, TRIAL_DEAL_CAP - used)
  return {
    isTrialing: true,
    used,
    cap: TRIAL_DEAL_CAP,
    remaining,
    atLimit: used >= TRIAL_DEAL_CAP,
  }
}
