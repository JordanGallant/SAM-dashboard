"use client"

import { useEffect } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"
import type { AnalysisStatus } from "@/lib/types/analysis"

const STALE_MS = 60 * 60 * 1000 // 1h

type DealsResult = (Deal & {
  latestAnalysisStatus?: AnalysisStatus
  latestAnalysisStartedAt?: string
  latestAnalysisError?: string
})[]

async function fetchDeals(): Promise<DealsResult> {
  const supabase = createClient()
  const { data: dealRows } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false })

  if (!dealRows) return []

  const dealIds = (dealRows as DbDeal[]).map((d) => d.id)

  const [{ data: docRows }, { data: analysisRows }] = await Promise.all([
    dealIds.length
      ? supabase.from("documents").select("*").in("deal_id", dealIds)
      : Promise.resolve({ data: [] }),
    dealIds.length
      ? supabase
          .from("analyses")
          .select("*")
          .in("deal_id", dealIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  // Two indexes per deal: latest-of-any-status (for state badge) and latest-completed (for analysis content)
  const latestByDeal = new Map<string, DbAnalysis>()
  const latestCompletedByDeal = new Map<string, DbAnalysis>()
  for (const row of (analysisRows ?? []) as DbAnalysis[]) {
    if (!latestByDeal.has(row.deal_id)) latestByDeal.set(row.deal_id, row)
    if (row.status === "completed" && !latestCompletedByDeal.has(row.deal_id)) {
      latestCompletedByDeal.set(row.deal_id, row)
    }
  }

  const now = Date.now()

  return (dealRows as DbDeal[]).map((d) => {
    const docs = ((docRows ?? []) as DbDocument[]).filter((doc) => doc.deal_id === d.id)
    const completedAnalysis = latestCompletedByDeal.get(d.id)?.result ?? undefined
    const latest = latestByDeal.get(d.id)

    let latestStatus: AnalysisStatus | undefined = latest?.status
    let latestError: string | undefined = latest?.error ?? undefined
    const startedAt = latest?.created_at

    // Read-time stale detector: anything pending/processing older than 1h is treated as failed
    // even if the DB row hasnt been flipped yet. Catches n8n silent deaths.
    if (
      (latestStatus === "pending" || latestStatus === "processing") &&
      startedAt &&
      now - new Date(startedAt).getTime() > STALE_MS
    ) {
      latestStatus = "failed"
      if (!latestError) latestError = "Analysis stalled — no callback received within 1 hour"
    }

    const deal = dbToDeal(d, docs, completedAnalysis)
    return {
      ...deal,
      latestAnalysisStatus: latestStatus,
      latestAnalysisStartedAt: startedAt,
      latestAnalysisError: latestError,
    }
  })
}

export function useDeals() {
  const { data, isLoading, mutate } = useSWR<DealsResult>(
    ["deals"],
    () => fetchDeals(),
    {
      // revalidateOnFocus + revalidateOnReconnect default to true — left enabled.
      // No conditional polling at the list level — the per-deal hook handles in-progress polling.
    }
  )

  // Realtime subscription so the deals list updates the moment n8ns callback writes
  // a result. Without this, statuses can stay "Awaiting" until the user refreshes.
  // Random suffix avoids channel collisions when the page mounts twice.
  useEffect(() => {
    const supabase = createClient()
    const channelName = `deals-list-${Math.random().toString(36).slice(2, 10)}`
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analyses" },
        () => mutate()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deals" },
        () => mutate()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => mutate()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  // Preserve original public shape. `refetch` is a thin wrapper over SWR mutate
  // so consumers calling `await refetch()` keep their existing semantics.
  const refetch = async () => {
    await mutate()
  }

  return {
    deals: data ?? [],
    loading: isLoading,
    refetch,
  }
}
