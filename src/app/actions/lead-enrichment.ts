"use server"

import { createClient } from "@/lib/supabase/server"
import { upsertHubspotContact, type HubspotContactFields } from "@/lib/hubspot"

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
 * HubSpot.
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

    // Pull fund profile to attach as enrichment context.
    const { data: fund } = await supabase
      .from("funds")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    const hubspotFields: HubspotContactFields = {
      firstname: input.firstName,
      lastname: input.lastName,
      phone: input.phone,
      jobtitle: input.role,
      lifecyclestage: "marketingqualifiedlead",
    }
    if (fund?.name) hubspotFields.company = fund.name

    void upsertHubspotContact(user.email, hubspotFields).catch(() => {})

    return { success: true }
  } catch (err) {
    console.error("enrichLead error:", err)
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}
