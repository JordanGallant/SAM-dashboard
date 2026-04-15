"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (!adminEmail) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(user?.email === adminEmail)
      setLoading(false)
    })
  }, [])

  return { isAdmin, loading }
}
