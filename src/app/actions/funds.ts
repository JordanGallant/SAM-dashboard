"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export interface FundInput {
  name: string
  website?: string
  thesis?: string
  stageFocus?: string[]
  sectorFocus?: string[]
  geoFocus?: string[]
  ticketSizeMin?: number
  ticketSizeMax?: number
  fundSize?: number
  portfolioCompanies?: string[]
}

export async function upsertFund(input: FundInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Check if user has an existing fund
  const { data: existing } = await supabase
    .from("funds")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  const payload = {
    user_id: user.id,
    name: input.name,
    website: input.website ?? null,
    thesis: input.thesis ?? null,
    stage_focus: input.stageFocus ?? [],
    sector_focus: input.sectorFocus ?? [],
    geo_focus: input.geoFocus ?? [],
    ticket_size_min: input.ticketSizeMin ?? null,
    ticket_size_max: input.ticketSizeMax ?? null,
    fund_size: input.fundSize ?? null,
    portfolio_companies: input.portfolioCompanies ?? [],
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { error } = await supabase.from("funds").update(payload).eq("id", existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("funds").insert(payload)
    if (error) return { error: error.message }
  }

  revalidatePath("/settings/fund-profile")
  return { success: true }
}
