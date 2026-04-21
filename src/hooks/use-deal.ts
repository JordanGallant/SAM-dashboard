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

  useEffect(() => {
    if (analysisStatus !== "pending" && analysisStatus !== "processing") return
    const interval = setInterval(() => {
      refetch()
    }, 30000)
    return () => clearInterval(interval)
  }, [analysisStatus, refetch])

  return { deal, loading, refetch, analysisStatus }
}
