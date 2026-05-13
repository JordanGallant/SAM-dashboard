// Single-source admin gate. /admin/* routes call this to decide access.
//
// Configured via ADMIN_EMAILS env var (comma-separated). Defaults to
// mark@green-whale.nl so Mark gets the admin pane the moment he signs up
// with that email even before the env is set. To grant a second admin,
// set ADMIN_EMAILS="mark@green-whale.nl,you@samvc.ai" in Vercel.

const FALLBACK_ADMINS = ["mark@green-whale.nl"]

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const lower = email.trim().toLowerCase()
  const raw = process.env.ADMIN_EMAILS
  const list = raw && raw.trim().length
    ? raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : FALLBACK_ADMINS.map((s) => s.toLowerCase())
  return list.includes(lower)
}
