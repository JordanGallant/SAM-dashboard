"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { TIER_CONFIG, type TierLimits } from "@/lib/tier-config"
import { effectiveLimits, type EffectiveLimits } from "@/lib/effective-limits"
import type { Tier } from "@/lib/types/user"

interface TierContextValue {
  tier: Tier
  config: TierLimits
  /**
   * Per-fund effective caps. Honours admin overrides set via /admin/limits
   * (009_fund_overrides.sql). Prefer reading `limits.seats` / `limits.memos`
   * over `config.users` / `config.dealsPerMonth` so a customer with a
   * bumped cap sees the right number in member rosters, memo meters, etc.
   */
  limits: EffectiveLimits
  loading: boolean
  isTrialing: boolean
  trialDaysLeft: number
}

const defaultLimits: EffectiveLimits = {
  seats: TIER_CONFIG.starter.users,
  memos: TIER_CONFIG.starter.dealsPerMonth,
  seatsOverridden: false,
  memosOverridden: false,
}

const TierContext = createContext<TierContextValue>({
  tier: "starter",
  config: TIER_CONFIG.starter,
  limits: defaultLimits,
  loading: true,
  isTrialing: false,
  trialDaysLeft: 0,
})

export function TierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>("starter")
  const [loading, setLoading] = useState(true)
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [seatsOverride, setSeatsOverride] = useState<number | null>(null)
  const [memosOverride, setMemosOverride] = useState<number | null>(null)

  useEffect(() => {
    async function fetchTier() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("tier, trial_ends_at, subscription_status")
            .eq("id", user.id)
            .single()

          if (profile?.tier) {
            setTier(profile.tier as Tier)
            setTrialEndsAt(profile.trial_ends_at)
            setSubscriptionStatus(profile.subscription_status ?? null)
          }

          // Look up the user's fund (as owner or member) to read any
          // override values. We pick the first membership row — the
          // one-fund-per-user invariant means there's only ever one.
          const { data: membership } = await supabase
            .from("fund_members")
            .select("fund_id")
            .eq("user_id", user.id)
            .limit(1)
            .maybeSingle()
          if (membership?.fund_id) {
            const { data: fund } = await supabase
              .from("funds")
              .select("seats_override, memos_override")
              .eq("id", membership.fund_id)
              .maybeSingle()
            if (fund) {
              setSeatsOverride(fund.seats_override ?? null)
              setMemosOverride(fund.memos_override ?? null)
            }
          }
        }
      } catch {
        // Not logged in or no profile — default to starter
      } finally {
        setLoading(false)
      }
    }

    fetchTier()
  }, [])

  const now = new Date()
  const trialEnd = trialEndsAt ? new Date(trialEndsAt) : null
  // Only flag as trialing when the subscription_status actually says so.
  // `trial_ends_at` alone is unreliable — the profile-creation trigger
  // writes a 14-day default on every signup even before any trial is
  // claimed, which previously caused a phantom "X days left" chip to
  // appear for brand-new inactive accounts.
  const isTrialing = subscriptionStatus === "trial" && !!trialEnd && trialEnd > now
  const trialDaysLeft = isTrialing && trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0

  const limits = effectiveLimits({ tier, seatsOverride, memosOverride })

  return (
    <TierContext.Provider value={{ tier, config: TIER_CONFIG[tier], limits, loading, isTrialing, trialDaysLeft }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  return useContext(TierContext)
}
