"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { TIER_CONFIG, type TierLimits } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"

interface TierContextValue {
  tier: Tier
  config: TierLimits
  loading: boolean
  isTrialing: boolean
  trialDaysLeft: number
}

const TierContext = createContext<TierContextValue>({
  tier: "starter",
  config: TIER_CONFIG.starter,
  loading: true,
  isTrialing: false,
  trialDaysLeft: 0,
})

export function TierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>("starter")
  const [loading, setLoading] = useState(true)
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTier() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("tier, trial_ends_at")
            .eq("id", user.id)
            .single()

          if (profile?.tier) {
            setTier(profile.tier as Tier)
            setTrialEndsAt(profile.trial_ends_at)
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
  const isTrialing = trialEnd ? trialEnd > now : false
  const trialDaysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0

  return (
    <TierContext.Provider value={{ tier, config: TIER_CONFIG[tier], loading, isTrialing, trialDaysLeft }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  return useContext(TierContext)
}
