"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToFund, type DbFund } from "@/lib/db-mappers"
import { mockFundProfile } from "@/lib/mock-data/fund-profile"
import type { FundProfile } from "@/lib/types/fund"
import { useIsAdmin } from "./use-is-admin"

export function useFundProfile() {
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [fund, setFund] = useState<FundProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (adminLoading) return

    if (isAdmin) {
      setFund(mockFundProfile)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setFund(null)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from("funds")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    setFund(data ? dbToFund(data as DbFund) : null)
    setLoading(false)
  }, [isAdmin, adminLoading])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { fund, loading, refetch }
}
