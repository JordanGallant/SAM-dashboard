"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"
import type { AnalysisStatus } from "@/lib/types/analysis"

const STALE_MS = 60 * 60 * 1000 // 1h

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const supabase = createClient()
    const { data: dealRows } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false })

    if (!dealRows) {
      setDeals([])
      setLoading(false)
      return
    }

    const dealIds = dealRows.map((d: DbDeal) => d.id)

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

    const result = (dealRows as DbDeal[]).map((d) => {
      const docs = ((docRows ?? []) as DbDocument[]).filter((doc) => doc.deal_id === d.id)
      const completedAnalysis = latestCompletedByDeal.get(d.id)?.result ?? undefined
      const latest = latestByDeal.get(d.id)

      let latestStatus: AnalysisStatus | undefined = latest?.status
      let latestError: string | undefined = latest?.error ?? undefined
      const startedAt = latest?.created_at

      // Read-time stale detector: anything pending/processing older than 1h is treated as failed
      // even if the DB row hasn't been flipped yet. Catches n8n silent deaths.
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

    setDeals(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  // Realtime subscription so the deals list updates the moment n8n's callback writes
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
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deals" },
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => refetch()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  return { deals, loading, refetch }
}
