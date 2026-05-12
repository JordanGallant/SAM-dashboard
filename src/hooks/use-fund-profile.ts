"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { dbToFund, type DbFund } from "@/lib/db-mappers"
import type { FundProfile } from "@/lib/types/fund"

/**
 * Returns the fund the current user belongs to (owned or as a teammate).
 * Lookup goes through fund_members so invited users see the inviter's fund.
 * `isOwner` distinguishes the original owner from a seated teammate so
 * the UI can hide destructive actions for non-owners.
 */
export function useFundProfile() {
  const [fund, setFund] = useState<FundProfile | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setFund(null)
      setIsOwner(false)
      setLoading(false)
      return
    }

    const { data: membership } = await supabase
      .from("fund_members")
      .select("fund_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()

    if (!membership) {
      setFund(null)
      setIsOwner(false)
      setLoading(false)
      return
    }

    const fundId = (membership as { fund_id: string; role: string }).fund_id
    const role = (membership as { fund_id: string; role: string }).role

    const { data } = await supabase
      .from("funds")
      .select("*")
      .eq("id", fundId)
      .maybeSingle()

    setFund(data ? dbToFund(data as DbFund) : null)
    setIsOwner(role === "owner")
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { fund, isOwner, loading, refetch }
}
