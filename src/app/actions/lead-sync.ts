"use server"

import { upsertHubspotContact } from "@/lib/hubspot"

// Capture a lead in HubSpot the moment we observe their email — either at
// signup (before email confirmation) or at first password sign-in.
//
// Why a dedicated action: /auth/callback is the only other place that pushes
// to HubSpot, and it's fragile — the PKCE code exchange silently fails when
// the user clicks the confirm link in a different browser / pre-fetched by
// an email scanner / cookie expired, and signInWithPassword never hits the
// callback at all. Result: email+password signups were missing from HubSpot.
//
// Idempotent on email (HubSpot PATCH-by-email upserts), so it's safe to call
// from both /register and /login. Never throws upstream.
export async function syncLeadToHubspot(params: {
  email: string
  fullName?: string | null
}): Promise<{ ok: boolean }> {
  const email = params.email?.trim().toLowerCase()
  if (!email) return { ok: false }

  const { firstname, lastname } = splitFullName(params.fullName)

  const { ok } = await upsertHubspotContact(email, {
    firstname,
    lastname,
    lifecyclestage: "lead",
  })
  return { ok }
}

function splitFullName(name?: string | null): {
  firstname?: string
  lastname?: string
} {
  if (!name) return {}
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { firstname: parts[0] }
  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  }
}
