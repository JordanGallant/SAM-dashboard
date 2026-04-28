"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"
import type { AnalysisStatus } from "@/lib/types/analysis"

export function useDeal(dealId: string | undefined) {
  const [deal, setDeal] = useState<Deal | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!dealId) return

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
      setDeal(null)
      setAnalysisStatus(null)
      setLoading(false)
      return
    }

    const analysisRow = latestAnalysis as DbAnalysis | null
    const status = analysisRow?.status ?? null
    const completedResult = status === "completed" ? analysisRow?.result ?? undefined : undefined

    setAnalysisStatus(status)
    setDeal(dbToDeal(dealRow as DbDeal, (docRows ?? []) as DbDocument[], completedResult))
    setLoading(false)
  }, [dealId])

  useEffect(() => {
    refetch()
  }, [refetch])

  // Realtime: subscribe to analyses + documents inserts/updates for this deal.
  // The n8n callback writes to analyses.result on completion — Supabase pushes the change
  // here within ~100ms, so the UI updates without a manual reload.
  useEffect(() => {
    if (!dealId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`deal-${dealId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analyses", filter: `deal_id=eq.${dealId}` },
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents", filter: `deal_id=eq.${dealId}` },
        () => refetch()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [dealId, refetch])

  // Polling fallback while pending/processing in case Realtime is blocked (corp proxies, etc.)
  // 60s cadence — Realtime is the primary signal, this is a safety net.
  useEffect(() => {
    if (analysisStatus !== "pending" && analysisStatus !== "processing") return
    const interval = setInterval(refetch, 60000)
    return () => clearInterval(interval)
  }, [analysisStatus, refetch])

  // Window-event bridge — kept for cases where another component does an optimistic
  // mutation before Realtime fires (e.g., document upload completion).
  useEffect(() => {
    if (!dealId) return
    function onChanged(e: Event) {
      const ce = e as CustomEvent<{ dealId?: string }>
      if (!ce.detail?.dealId || ce.detail.dealId === dealId) refetch()
    }
    window.addEventListener("deal:changed", onChanged)
    return () => window.removeEventListener("deal:changed", onChanged)
  }, [dealId, refetch])

  return { deal, loading, refetch, analysisStatus }
}
