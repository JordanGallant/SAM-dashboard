// HubSpot CRM lead sync. Idempotent on email — first call creates a contact,
// subsequent calls update the same contact. We never throw upstream so a
// HubSpot hiccup never blocks the user-facing flow (signup, onboarding).
//
// Usage:
//   await upsertHubspotContact("jordan@green-whale.nl", { firstName: "Jordan", ... })
//
// Pattern: try a PATCH by email (idprop=email) first; on 404 fall back to POST.
// This is HubSpot's recommended pattern for upsert without owning the contact id.

const HUBSPOT_BASE = "https://api.hubapi.com"

// Standard HubSpot contact properties — always exist in any portal.
// (Custom properties like sam_signed_up_at can be added later if Mark wants
// finer tracking; HubSpot rejects unknown property names with HTTP 400.)
export type HubspotContactFields = Partial<{
  email: string
  firstname: string
  lastname: string
  phone: string
  jobtitle: string
  company: string
  lifecyclestage: string
  /** Free-text notes — overflow for fund-context fields HubSpot doesn't have a slot for. */
  notes_last_contacted: string
}>

// Keys we'll send to HubSpot. Anything else gets stripped before the call so a
// stray custom-property name doesn't 400 the whole request.
const ALLOWED_HUBSPOT_PROPS: ReadonlySet<string> = new Set([
  "email",
  "firstname",
  "lastname",
  "phone",
  "jobtitle",
  "company",
  "lifecyclestage",
  "website",
  "address",
  "city",
  "country",
])

function getToken(): string | null {
  return process.env.HUBSPOT_ACCESS_TOKEN || null
}

/** Public entry — never throws. Returns true on success, false on configured-off or any error. */
export async function upsertHubspotContact(
  email: string,
  fields: HubspotContactFields = {}
): Promise<boolean> {
  const token = getToken()
  if (!token) {
    // Quietly no-op when HubSpot isn't configured (local dev, demo accounts, etc.)
    return false
  }
  if (!email || typeof email !== "string") return false

  const properties = stripEmpty({ ...fields, email })

  try {
    // Try PATCH using email as the unique identifier (idproperty=email).
    const patchResp = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ properties }),
      }
    )

    if (patchResp.ok) return true

    if (patchResp.status === 404) {
      // No existing contact with this email — create it.
      const postResp = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ properties }),
      })
      if (postResp.ok) return true
      const text = await postResp.text().catch(() => "")
      console.error("HubSpot create contact failed", postResp.status, text.slice(0, 300))
      return false
    }

    const text = await patchResp.text().catch(() => "")
    console.error("HubSpot upsert contact failed", patchResp.status, text.slice(0, 300))
    return false
  } catch (err) {
    console.error("HubSpot upsert error:", err)
    return false
  }
}

/** Drop empty / null / undefined values so HubSpot doesn't blank out fields we don't mean to clear. */
function stripEmpty<T extends Record<string, unknown>>(obj: T): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (!ALLOWED_HUBSPOT_PROPS.has(k)) continue
    if (v === null || v === undefined) continue
    if (typeof v === "string") {
      const t = v.trim()
      if (t) out[k] = t
      continue
    }
    if (Array.isArray(v)) {
      const joined = v.map(String).filter(Boolean).join(", ")
      if (joined) out[k] = joined
      continue
    }
    out[k] = String(v)
  }
  return out
}
