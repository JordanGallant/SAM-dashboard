"use client"

/**
 * Client-side hook mirroring the server-side trial cap check.
 *
 * Re-queries on mount + subscribes to the deals table via Supabase Realtime
 * so the counter updates instantly when the user creates a new deal in any
 * tab. Keep this hook side-effect-free — it's mounted on every dashboard
 * surface (sidebar, topbar, deal layout, etc.) and a hot path.
 */

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { TRIAL_DEAL_CAP, type TrialUsage } from "@/lib/trial-limits"

const EMPTY: TrialUsage & { loading: boolean } = {
  isTrialing: false,
  used: 0,
  cap: TRIAL_DEAL_CAP,
  remaining: TRIAL_DEAL_CAP,
  atLimit: false,
  loading: true,
}

export function useTrialUsage() {
  const [state, setState] = useState<TrialUsage & { loading: boolean }>(EMPTY)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function refresh() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) setState({ ...EMPTY, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .maybeSingle()

      const isTrialing = profile?.subscription_status === "trial"
      if (!isTrialing) {
        if (!cancelled) {
          setState({
            isTrialing: false,
            used: 0,
            cap: TRIAL_DEAL_CAP,
            remaining: TRIAL_DEAL_CAP,
            atLimit: false,
            loading: false,
          })
        }
        return
      }

      const { count } = await supabase
        .from("deals")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (cancelled) return
      const used = count ?? 0
      const remaining = Math.max(0, TRIAL_DEAL_CAP - used)
      setState({
        isTrialing: true,
        used,
        cap: TRIAL_DEAL_CAP,
        remaining,
        atLimit: used >= TRIAL_DEAL_CAP,
        loading: false,
      })
    }

    refresh()

    // Realtime: re-count when the user creates / deletes a deal. The deals
    // table emits INSERT/DELETE events; we don't need the row payload, just
    // a trigger to re-run the count.
    const channel = supabase
      .channel("trial-usage-deals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deals" },
        () => refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => refresh(),
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  return state
}
