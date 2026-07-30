"use client"

import { useEffect } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"
import type { AnalysisStatus, DealAnalysis } from "@/lib/types/analysis"
import { recomputeCompleteness } from "@/lib/recompute-completeness"
import { applyFounderLinks } from "@/lib/founder-links"

type UseDealResult = {
  deal: Deal | null
  analysisStatus: AnalysisStatus | null
  analysisError: string | null
  teamRefreshing: boolean
}

// A team re-run takes a minute or two. If the callback never lands (n8n down,
// flow failed) the stamp would otherwise pin the indicator on forever, so age
// it out rather than trusting the flag alone.
const TEAM_REFRESH_TIMEOUT_MS = 5 * 60 * 1000

async function fetchDeal(dealId: string): Promise<UseDealResult> {
  const supabase = createClient()
  const [{ data: dealRow }, { data: docRows }, { data: latestAnalysis }, { data: linkRows }] =
    await Promise.all([
      supabase.from("deals").select("*").eq("id", dealId).single(),
      supabase.from("documents").select("*").eq("deal_id", dealId),
      supabase
        .from("analyses")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("founder_links")
        .select("founder_key, founder_name, linkedin_url")
        .eq("deal_id", dealId),
    ])

  if (!dealRow) {
    return { deal: null, analysisStatus: null, analysisError: null, teamRefreshing: false }
  }

  const analysisRow = latestAnalysis as DbAnalysis | null
  let status = analysisRow?.status ?? null
  let derivedError = status === "failed" ? analysisRow?.error ?? null : null

  // Read-time stale detector: pending/processing > 1h is treated as failed.
  if (
    (status === "pending" || status === "processing") &&
    analysisRow?.created_at &&
    Date.now() - new Date(analysisRow.created_at).getTime() > 60 * 60 * 1000
  ) {
    status = "failed"
    derivedError = derivedError ?? "Analysis stalled — no callback received within 1 hour"
  }

  const rawResult = analysisRow?.status === "completed" ? analysisRow?.result ?? undefined : undefined
  const founderLinks = (linkRows ?? []).map((r) => ({
    founderKey: r.founder_key as string,
    founderName: r.founder_name as string,
    linkedinUrl: r.linkedin_url as string,
  }))

  const completedResult: DealAnalysis | undefined = rawResult
    ? applyFounderLinks(recomputeCompleteness(rawResult), founderLinks)
    : undefined

  const refreshStamp = (dealRow as { team_refresh_at?: string | null }).team_refresh_at
  const teamRefreshing =
    !!refreshStamp && Date.now() - new Date(refreshStamp).getTime() < TEAM_REFRESH_TIMEOUT_MS

  return {
    deal: dbToDeal(dealRow as DbDeal, (docRows ?? []) as DbDocument[], completedResult),
    analysisStatus: status,
    analysisError: derivedError,
    teamRefreshing,
  }
}

export function useDeal(dealId: string | undefined) {
  const swrKey = dealId ? (["deal", dealId] as const) : null

  const { data, isLoading, mutate } = useSWR<UseDealResult>(
    swrKey,
    // SWR passes the key tuple directly; pull the id off the second slot.
    ([, id]: readonly [string, string]) => fetchDeal(id),
    {
      // Conditional polling fallback: only while pending/processing.
      // Realtime is the primary signal; this is a corp-proxy safety net.
      refreshInterval: (latest) => {
        if (latest?.analysisStatus === "pending" || latest?.analysisStatus === "processing") {
          return 60000
        }
        // A team re-run finishes in a minute or two, so poll tighter than the
        // full-analysis case — and this also ages the indicator out on its own
        // if the callback never lands.
        return latest?.teamRefreshing ? 15000 : 0
      },
      // revalidateOnFocus + revalidateOnReconnect default to true — left enabled.
    }
  )

  // Realtime: subscribe to analyses + documents inserts/updates for this deal.
  // The n8n callback writes to analyses.result on completion — Supabase pushes the change
  // here within ~100ms, so the UI updates without a manual reload.
  // Unique channel suffix avoids collisions when multiple useDeal instances mount for the same dealId
  // (Supabase returns the SAME channel object on repeat .channel(name) calls, so re-using `deal-${id}`
  // would throw "cannot add callbacks after subscribe()").
  useEffect(() => {
    if (!dealId) return
    const supabase = createClient()
    const channelName = `deal-${dealId}-${Math.random().toString(36).slice(2, 10)}`
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analyses", filter: `deal_id=eq.${dealId}` },
        () => mutate()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents", filter: `deal_id=eq.${dealId}` },
        () => mutate()
      )
      // Manual LinkedIn overrides: a teammate pasting a URL, or the team
      // callback patching one, has to reach every open tab on this deal.
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "founder_links", filter: `deal_id=eq.${dealId}` },
        () => mutate()
      )
      // The deal row itself carries team_refresh_at, so the refreshing
      // indicator clears the moment the callback lands rather than on the
      // next poll.
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deals", filter: `id=eq.${dealId}` },
        () => mutate()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [dealId, mutate])

  // Window-event bridge — kept for cases where another component does an optimistic
  // mutation before Realtime fires (e.g., document upload completion).
  useEffect(() => {
    if (!dealId) return
    function onChanged(e: Event) {
      const ce = e as CustomEvent<{ dealId?: string }>
      if (!ce.detail?.dealId || ce.detail.dealId === dealId) mutate()
    }
    window.addEventListener("deal:changed", onChanged)
    return () => window.removeEventListener("deal:changed", onChanged)
  }, [dealId, mutate])

  // Preserve original public shape. `refetch` is a thin wrapper over SWR mutate
  // so consumers calling `await refetch()` keep their existing semantics.
  const refetch = async () => {
    await mutate()
  }

  return {
    deal: data?.deal ?? null,
    loading: isLoading,
    refetch,
    analysisStatus: data?.analysisStatus ?? null,
    analysisError: data?.analysisError ?? null,
    teamRefreshing: data?.teamRefreshing ?? false,
  }
}
