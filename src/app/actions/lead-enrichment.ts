"use server"

import { createClient } from "@/lib/supabase/server"
import {
  upsertHubspotContact,
  createHubspotLeadDeal,
  type HubspotContactFields,
} from "@/lib/hubspot"

export interface LeadEnrichmentInput {
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
}

/**
 * Called from the onboarding wizard after the user fills in their personal
 * details + fund profile. Writes the personal fields onto profiles (gracefully
 * skips if the SQL columns don't exist yet) and pushes a full enrichment to
 * HubSpot:
 *
 *   1. Upsert the contact by email (name, phone, role, company, MQL stage)
 *   2. Create a Deal in the "Sam pipeline dashboard" / "Inbound signup"
 *      stage and associate it with the contact — but only once per user
 *      (idempotency via `profiles.hubspot_deal_id`).
 *
 * Never throws upstream — wizard completion shouldn't fail because the CRM
 * had a hiccup or the `profiles.first_name` column hasn't been added yet.
 */
export async function enrichLead(input: LeadEnrichmentInput) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || !user.email) return { success: false, error: "Not authenticated" }

    // Best-effort write to profiles. If columns don't exist (SQL not run),
    // catch the error and continue — HubSpot push still works.
    const personalPatch = {
      first_name: input.firstName?.trim() || null,
      last_name: input.lastName?.trim() || null,
      phone: input.phone?.trim() || null,
      role: input.role?.trim() || null,
    }
    try {
      await supabase.from("profiles").update(personalPatch).eq("id", user.id)
    } catch (err) {
      console.warn("profiles personal fields update skipped (run SQL?):", err)
    }

    // Pull fund profile + check if a deal was already created for this user.
    const [{ data: fund }, { data: profile }] = await Promise.all([
      supabase.from("funds").select("*").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("profiles")
        .select("hubspot_deal_id")
        .eq("id", user.id)
        .maybeSingle(),
    ])

    const hubspotFields: HubspotContactFields = {
      firstname: input.firstName,
      lastname: input.lastName,
      phone: input.phone,
      jobtitle: input.role,
      lifecyclestage: "marketingqualifiedlead",
    }
    if (fund?.name) hubspotFields.company = fund.name

    // Fire upsert. Wait for it (not fire-and-forget) so we can grab the
    // contactId for deal association. Still wrapped — never throws upstream.
    let contactId: string | null = null
    try {
      const result = await upsertHubspotContact(user.email, hubspotFields)
      contactId = result.contactId
    } catch (err) {
      console.error("HubSpot upsert during enrichLead failed:", err)
    }

    // Create the lead Deal ONCE per user. Without this guard, re-completing
    // the wizard would create duplicate deals. We persist the deal ID on the
    // profile so it survives across sessions. If the column doesn't exist
    // yet, the update silently no-ops (Supabase 42703) — fine, we'll just
    // log + skip.
    const dealAlreadyExists = (profile as { hubspot_deal_id?: string | null } | null)
      ?.hubspot_deal_id
    if (contactId && !dealAlreadyExists) {
      try {
        const dealId = await createHubspotLeadDeal(contactId, {
          firstname: input.firstName,
          lastname: input.lastName,
          company: fund?.name,
        })
        if (dealId) {
          await supabase
            .from("profiles")
            .update({ hubspot_deal_id: dealId })
            .eq("id", user.id)
        }
      } catch (err) {
        console.error("HubSpot deal create during enrichLead failed:", err)
      }
    }

    return { success: true }
  } catch (err) {
    console.error("enrichLead error:", err)
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}
