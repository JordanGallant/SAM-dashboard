"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import { mockDeals } from "@/lib/mock-data/deals"
import type { Deal } from "@/lib/types/deal"
import { useIsAdmin } from "./use-is-admin"

export function useDeal(dealId: string | undefined) {
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (adminLoading || !dealId) return

    if (isAdmin) {
      setDeal(mockDeals.find((d) => d.id === dealId) ?? null)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const [{ data: dealRow }, { data: docRows }, { data: analysisRow }] = await Promise.all([
      supabase.from("deals").select("*").eq("id", dealId).single(),
      supabase.from("documents").select("*").eq("deal_id", dealId),
      supabase.from("analyses").select("*").eq("deal_id", dealId).eq("status", "completed").maybeSingle(),
    ])

    if (!dealRow) {
      setDeal(null)
      setLoading(false)
      return
    }

    const analysis = (analysisRow as DbAnalysis | null)?.result ?? undefined
    setDeal(dbToDeal(dealRow as DbDeal, (docRows ?? []) as DbDocument[], analysis))
    setLoading(false)
  }, [isAdmin, adminLoading, dealId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { deal, loading, refetch }
}
