"use client"

import { useEffect } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"
import type { AnalysisStatus, DealAnalysis } from "@/lib/types/analysis"
import { recomputeCompleteness } from "@/lib/recompute-completeness"

type UseDealResult = {
  deal: Deal | null
  analysisStatus: AnalysisStatus | null
  analysisError: string | null
}

async function fetchDeal(dealId: string): Promise<UseDealResult> {
  const supabase = createClient()
  const [{ data: dealRow }, { data: docRows }, { data: latestAnalysis }] = await Promise.all([
    supabase.from("deals").select("*").eq("id", dealId).single(),
    supabase.from("documents").select("*").eq("deal_id", dealId),
    supabase
      .from("analyses")
      .select("*")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (!dealRow) {
    return { deal: null, analysisStatus: null, analysisError: null }
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
  const completedResult: DealAnalysis | undefined = rawResult
    ? recomputeCompleteness(rawResult)
    : undefined

  return {
    deal: dbToDeal(dealRow as DbDeal, (docRows ?? []) as DbDocument[], completedResult),
    analysisStatus: status,
    analysisError: derivedError,
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
      refreshInterval: (latest) =>
        latest?.analysisStatus === "pending" || latest?.analysisStatus === "processing"
          ? 60000
          : 0,
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
  }
}
