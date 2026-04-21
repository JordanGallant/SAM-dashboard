"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"

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

    // Fetch documents + latest completed analysis for each deal in parallel
    const [{ data: docRows }, { data: analysisRows }] = await Promise.all([
      dealIds.length
        ? supabase.from("documents").select("*").in("deal_id", dealIds)
        : Promise.resolve({ data: [] }),
      dealIds.length
        ? supabase
            .from("analyses")
            .select("*")
            .in("deal_id", dealIds)
            .eq("status", "completed")
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
    ])

    // Keep only the most recent completed analysis per deal
    const analysisByDeal = new Map<string, DbAnalysis>()
    for (const row of (analysisRows ?? []) as DbAnalysis[]) {
      if (!analysisByDeal.has(row.deal_id)) {
        analysisByDeal.set(row.deal_id, row)
      }
    }

    const result = (dealRows as DbDeal[]).map((d) => {
      const docs = ((docRows ?? []) as DbDocument[]).filter((doc) => doc.deal_id === d.id)
      const analysis = analysisByDeal.get(d.id)?.result ?? undefined
      return dbToDeal(d, docs, analysis)
    })

    setDeals(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { deals, loading, refetch }
}
