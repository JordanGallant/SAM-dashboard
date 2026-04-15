"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToDeal, type DbDeal, type DbDocument } from "@/lib/db-mappers"
import { mockDeals } from "@/lib/mock-data/deals"
import type { Deal } from "@/lib/types/deal"
import { useIsAdmin } from "./use-is-admin"

export function useDeals() {
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (adminLoading) return

    if (isAdmin) {
      setDeals(mockDeals)
      setLoading(false)
      return
    }

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

    // Fetch documents for all deals in one query
    const dealIds = dealRows.map((d: DbDeal) => d.id)
    const { data: docRows } = dealIds.length
      ? await supabase.from("documents").select("*").in("deal_id", dealIds)
      : { data: [] }

    const deals = (dealRows as DbDeal[]).map((d) => {
      const docs = ((docRows ?? []) as DbDocument[]).filter((doc) => doc.deal_id === d.id)
      return dbToDeal(d, docs)
    })

    setDeals(deals)
    setLoading(false)
  }, [isAdmin, adminLoading])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { deals, loading, refetch }
}
