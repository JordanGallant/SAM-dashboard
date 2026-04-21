"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument } from "@/lib/db-mappers"
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
    const { data: docRows } = dealIds.length
      ? await supabase.from("documents").select("*").in("deal_id", dealIds)
      : { data: [] }

    const result = (dealRows as DbDeal[]).map((d) => {
      const docs = ((docRows ?? []) as DbDocument[]).filter((doc) => doc.deal_id === d.id)
      return dbToDeal(d, docs)
    })

    setDeals(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { deals, loading, refetch }
}
