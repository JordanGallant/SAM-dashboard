"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { upsertHubspotContact } from "@/lib/hubspot"

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
  additional?: string
}

// Build the same description payload that fund-doc + fund-website endpoints
// use so manual settings edits, PDF uploads and web scrapes all push
// HubSpot in the same shape (no drift between the three sync points).
function buildFundDescription(input: FundInput): string | undefined {
  const parts: string[] = []
  if (input.thesis) parts.push(`Thesis: ${input.thesis}`)
  if (input.stageFocus?.length) parts.push(`Stage focus: ${input.stageFocus.join(", ")}`)
  if (input.sectorFocus?.length) parts.push(`Sector focus: ${input.sectorFocus.join(", ")}`)
  if (input.geoFocus?.length) parts.push(`Geography: ${input.geoFocus.join(", ")}`)
  if (input.ticketSizeMin || input.ticketSizeMax) {
    parts.push(
      `Ticket size: EUR ${input.ticketSizeMin ?? "?"} – ${input.ticketSizeMax ?? "?"}`,
    )
  }
  if (input.additional?.trim()) parts.push(`Restrictions: ${input.additional.trim()}`)
  return parts.length ? parts.join("\n\n") : undefined
}

export async function upsertFund(input: FundInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Lookup happens through fund_members so a teammate editing the fund
  // profile updates the *owner's* fund row, not a phantom new fund.
  const { data: membership } = await supabase
    .from("fund_members")
    .select("fund_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  const payload = {
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
    additional: input.additional?.trim() ? input.additional.trim() : null,
    updated_at: new Date().toISOString(),
  }

  if (membership) {
    const fundId = (membership as { fund_id: string }).fund_id
    const { error } = await supabase.from("funds").update(payload).eq("id", fundId)
    if (error) return { error: error.message }
  } else {
    // First-time setup: create the fund AND insert the owner row in
    // fund_members so subsequent lookups go through the membership path.
    const { data: newFund, error: insertErr } = await supabase
      .from("funds")
      .insert({ ...payload, user_id: user.id })
      .select("id")
      .single()
    if (insertErr) return { error: insertErr.message }

    const newFundId = (newFund as { id: string }).id
    const { error: memberErr } = await supabase
      .from("fund_members")
      .insert({ fund_id: newFundId, user_id: user.id, role: "owner" })
    if (memberErr && memberErr.code !== "23505") {
      // Roll back the fund row to keep the schema invariant clean.
      await supabase.from("funds").delete().eq("id", newFundId)
      return { error: memberErr.message }
    }
  }

  // Fire-and-forget HubSpot sync — same pattern as fund-doc / fund-website /
  // lead-enrichment so manual edits land in CRM. Failures never block the
  // save (CRM hiccup shouldn't make the user's update fail).
  if (user.email) {
    void upsertHubspotContact(user.email, {
      company: input.name || undefined,
      website: input.website || undefined,
      description: buildFundDescription(input),
      lifecyclestage: "marketingqualifiedlead",
    }).catch(() => {})
  }

  revalidatePath("/settings/fund-profile")
  return { success: true }
}
