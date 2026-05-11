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

// Client-supplied pipeline / stage for the website-lead funnel. If these
// shift, override via env vars without a redeploy.
const HUBSPOT_PIPELINE_ID =
  process.env.HUBSPOT_PIPELINE_ID || "t_6128dd9d6f3380e7c97402984e00da92"
const HUBSPOT_INBOUND_SIGNUP_STAGE_ID =
  process.env.HUBSPOT_INBOUND_SIGNUP_STAGE_ID || "5340860617"
// HubSpot's built-in "Contact to Deal" association is association type 3
// (HUBSPOT_DEFINED). Standard across all portals — never changes.
const HUBSPOT_CONTACT_TO_DEAL_TYPE_ID = 3

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
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; text: string; data: Record<string, unknown> | null }> {
  const resp = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  const raw = await resp.text().catch(() => "")
  let data: Record<string, unknown> | null = null
  try {
    data = raw ? (JSON.parse(raw) as Record<string, unknown>) : null
  } catch {
    /* not JSON */
  }
  return { ok: resp.ok, status: resp.status, text: resp.ok ? "" : raw, data }
}

export type UpsertResult = { ok: boolean; contactId: string | null }

/**
 * Public entry — never throws. Returns `{ ok, contactId }` so callers that
 * need to do follow-up work (e.g. create + associate a Deal) can grab the
 * ID without a second round-trip. Boolean callers can just check `ok`.
 */
export async function upsertHubspotContact(
  email: string,
  fields: HubspotContactFields = {}
): Promise<UpsertResult> {
  const token = getToken()
  if (!token) {
    // Quietly no-op when HubSpot isn't configured (local dev, demo accounts, etc.)
    return { ok: false, contactId: null }
  }
  if (!email || typeof email !== "string") return { ok: false, contactId: null }

  // Pre-strip properties known to be missing in this portal (learned from
  // previous failures). Avoids a wasted round-trip + retry on every call.
  const properties = stripEmpty({ ...fields, email })
  for (const name of MISSING_PROPERTIES) delete properties[name]

  const patchUrl = `${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`
  const postUrl = `${HUBSPOT_BASE}/crm/v3/objects/contacts`

  try {
    // First attempt: PATCH by email.
    let r = await hubspotFetch(patchUrl, "PATCH", token, { properties })

    // 404 → contact doesn't exist yet, fall through to POST-create.
    if (r.status === 404) {
      r = await hubspotFetch(postUrl, "POST", token, { properties })
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
        r = await hubspotFetch(patchUrl, "PATCH", token, { properties })
        if (r.status === 404) {
          r = await hubspotFetch(postUrl, "POST", token, { properties })
        }
      }
    }

    if (r.ok) {
      const id = typeof r.data?.id === "string" ? r.data.id : null
      return { ok: true, contactId: id }
    }
    console.error("HubSpot upsert failed", r.status, r.text.slice(0, 300))
    return { ok: false, contactId: null }
  } catch (err) {
    console.error("HubSpot upsert error:", err)
    return { ok: false, contactId: null }
  }
}

/**
 * Create a HubSpot Deal in the "Sam pipeline dashboard" / "Inbound signup"
 * stage and associate it with the supplied contact in a single API call.
 *
 * Idempotency: HubSpot Deals do NOT have a natural unique key the way
 * Contacts do (email). Calling this twice for the same lead will create
 * two deals. Callers should track creation themselves (e.g. via a
 * `hubspot_deal_id` on profiles) before calling. Returns the new deal's
 * ID on success, or null on failure / configured-off.
 */
export async function createHubspotLeadDeal(
  contactId: string,
  meta: { firstname?: string; lastname?: string; company?: string },
): Promise<string | null> {
  const token = getToken()
  if (!token || !contactId) return null

  // Build dealname per the client's template:
  //   "Website lead - {firstname} {lastname} - {company}"
  // Collapse multiple spaces and clean trailing separators when fields are
  // missing so we don't end up with "Website lead -  - Acme".
  const name = [meta.firstname, meta.lastname].filter(Boolean).join(" ").trim()
  const company = (meta.company ?? "").trim()
  const rawName = `Website lead - ${name}${company ? ` - ${company}` : ""}`.replace(/\s+/g, " ").trim()
  const dealname = rawName.endsWith("-") ? rawName.slice(0, -1).trim() : rawName

  try {
    const r = await hubspotFetch(
      `${HUBSPOT_BASE}/crm/v3/objects/deals`,
      "POST",
      token,
      {
        properties: {
          dealname,
          pipeline: HUBSPOT_PIPELINE_ID,
          dealstage: HUBSPOT_INBOUND_SIGNUP_STAGE_ID,
        },
        // Associate the contact at creation time — saves a follow-up call.
        // associationTypeId=3 is HubSpot's built-in "Contact to Deal" link.
        associations: [
          {
            to: { id: contactId },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: HUBSPOT_CONTACT_TO_DEAL_TYPE_ID,
              },
            ],
          },
        ],
      },
    )
    if (!r.ok) {
      console.error("HubSpot deal create failed", r.status, r.text.slice(0, 300))
      return null
    }
    return typeof r.data?.id === "string" ? r.data.id : null
  } catch (err) {
    console.error("HubSpot deal create error:", err)
    return null
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
