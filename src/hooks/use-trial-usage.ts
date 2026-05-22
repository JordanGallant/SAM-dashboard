"use client"

/**
 * Client-side hook mirroring the server-side trial cap check.
 *
 * Re-queries on mount + subscribes to the deals table via Supabase Realtime
 * so the counter updates instantly when the user creates a new deal in any
 * tab. Keep this hook side-effect-free — it's mounted on every dashboard
 * surface (sidebar, topbar, deal layout, etc.) and a hot path.
 */

import { useEffect, useRef, useState } from "react"
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
  // Unique channel name per hook instance. Without this, multiple mounts
  // (sidebar + dashboard + deal layout + uploader) all collide on a shared
  // channel and StrictMode's double-mount triggers
  // "cannot add postgres_changes callbacks after subscribe()".
  const channelName = useRef<string>(
    `trial-usage-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`,
  )

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

      // Mirror server-side getTrialUsage: lift the hardcoded cap when the
      // user's fund has a memos_override set by /admin/limits.
      const { data: mem } = await supabase
        .from("fund_members")
        .select("fund_id")
        .eq("user_id", user.id)
        .limit(1)
      const fundId = mem?.[0]?.fund_id as string | undefined
      let cap = TRIAL_DEAL_CAP
      if (fundId) {
        const { data: fund } = await supabase
          .from("funds")
          .select("memos_override")
          .eq("id", fundId)
          .maybeSingle()
        const override = (fund as { memos_override: number | null } | null)?.memos_override
        if (typeof override === "number" && override > 0) cap = override
      }

      const { count } = await supabase
        .from("deals")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (cancelled) return
      const used = count ?? 0
      setState({
        isTrialing: true,
        used,
        cap,
        remaining: Math.max(0, cap - used),
        atLimit: used >= cap,
        loading: false,
      })
    }

    refresh()

    // Realtime: re-count when the user creates / deletes a deal. The deals
    // table emits INSERT/DELETE events; we don't need the row payload, just
    // a trigger to re-run the count.
    //
    // Channel name is unique per hook instance (channelName.current) so
    // multiple components mounting this hook don't collide on a shared
    // channel, which under React StrictMode's double-mount produced
    // "cannot add `postgres_changes` callbacks ... after `subscribe()`".
    const channel = supabase
      .channel(channelName.current)
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
