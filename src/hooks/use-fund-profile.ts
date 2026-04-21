"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToFund, type DbFund } from "@/lib/db-mappers"
import type { FundProfile } from "@/lib/types/fund"

export function useFundProfile() {
  const [fund, setFund] = useState<FundProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { fund, loading, refetch }
}
