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
  website: string
  /** Long-text summary — used to capture fund thesis + focus where there's no other slot. */
  description: string
  city: string
  country: string
  address: string
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
  "description",
  "address",
  "city",
  "country",
])

function getToken(): string | null {
  return process.env.HUBSPOT_ACCESS_TOKEN || null
}

// PROPERTY_DOESNT_EXIST error names cache. When a HubSpot portal lacks a
// property we send (e.g. `description` on a fresh portal), every contact
// write would fail the entire payload. We learn missing names from the API
// response, strip them on retry, and cache them so subsequent calls within
// the same server process skip the wasted round-trip. Cache is best-effort —
// it resets on cold start, which is fine: HubSpot only rejects a property if
// it's genuinely missing.
const MISSING_PROPERTIES = new Set<string>()

/** Parse HubSpot's 400 PROPERTY_DOESNT_EXIST response to learn which names. */
function extractMissingPropertyNames(responseText: string): string[] {
  try {
    const data: unknown = JSON.parse(responseText)
    const arr = (data as { errors?: Array<{ context?: { name?: string[] } }> })?.errors
    if (Array.isArray(arr)) {
      return arr.flatMap((e) => e.context?.name ?? [])
    }
  } catch {
    // fall through
  }
  // Some error payloads use `message: "Property "X" does not exist"` shape.
  const matches = [...responseText.matchAll(/Property "([^"]+)" does not exist/g)]
  return matches.map((m) => m[1])
}

async function hubspotFetch(
  url: string,
  method: "PATCH" | "POST",
  token: string,
  properties: Record<string, string>,
): Promise<{ ok: boolean; status: number; text: string }> {
  const resp = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ properties }),
  })
  const text = resp.ok ? "" : await resp.text().catch(() => "")
  return { ok: resp.ok, status: resp.status, text }
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

  // Pre-strip properties known to be missing in this portal (learned from
  // previous failures). Avoids a wasted round-trip + retry on every call.
  let properties = stripEmpty({ ...fields, email })
  for (const name of MISSING_PROPERTIES) delete properties[name]

  const patchUrl = `${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`
  const postUrl = `${HUBSPOT_BASE}/crm/v3/objects/contacts`

  try {
    // First attempt: PATCH by email.
    let r = await hubspotFetch(patchUrl, "PATCH", token, properties)

    // 404 → contact doesn't exist yet, fall through to POST-create.
    if (r.status === 404) {
      r = await hubspotFetch(postUrl, "POST", token, properties)
    }

    // 400 PROPERTY_DOESNT_EXIST → learn the missing names, strip, retry once.
    if (!r.ok && r.status === 400 && /PROPERTY_DOESNT_EXIST/i.test(r.text)) {
      const missing = extractMissingPropertyNames(r.text)
      if (missing.length) {
        for (const name of missing) {
          MISSING_PROPERTIES.add(name)
          delete properties[name]
        }
        console.warn(
          `HubSpot: stripped missing property(ies) ${missing.join(", ")} and retrying. ` +
          `Add them in Settings -> Properties to capture full data.`,
        )
        // Retry — same flow, PATCH then POST on 404.
        r = await hubspotFetch(patchUrl, "PATCH", token, properties)
        if (r.status === 404) {
          r = await hubspotFetch(postUrl, "POST", token, properties)
        }
      }
    }

    if (r.ok) return true
    console.error("HubSpot upsert failed", r.status, r.text.slice(0, 300))
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
