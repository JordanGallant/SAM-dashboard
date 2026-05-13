"use server"

import { revalidatePath } from "next/cache"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { isAdminEmail } from "@/lib/admin-auth"
import { effectiveLimits } from "@/lib/effective-limits"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

async function gateAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return { error: "Not authorized" as const }
  }
  return { user }
}

/**
 * Lightweight check used by client components (sidebar link visibility,
 * etc.). Does NOT expose data; it just returns a boolean.
 */
export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return isAdminEmail(user?.email)
}

export interface AdminFundRow {
  fundId: string
  fundName: string
  ownerEmail: string
  ownerTier: Tier
  ownerStatus: string
  /** Default cap from tier-config — shown beside the override input. */
  tierSeats: number
  tierMemos: number
  /** Current override (NULL = none). */
  seatsOverride: number | null
  memosOverride: number | null
  /** Members + pending invites — context for choosing override values. */
  memberCount: number
  pendingInvites: number
  memosThisMonth: number
  /** Email list for every member of this fund (owner + teammates). */
  members: { email: string; role: "owner" | "member"; joinedAt: string }[]
}

export interface AdminFundlessUser {
  userId: string
  email: string
  createdAt: string
  provider: string | null
}

export async function listAllFundsForAdmin(): Promise<
  { error: string } | { data: AdminFundRow[] }
> {
  const gate = await gateAdmin()
  if ("error" in gate) return { error: String(gate.error) }

  const admin = adminClient()
  const { data: funds, error } = await admin
    .from("funds")
    .select("id, name, user_id, seats_override, memos_override, created_at")
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }

  const rows: AdminFundRow[] = []
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  for (const f of (funds ?? []) as Array<{
    id: string
    name: string
    user_id: string
    seats_override: number | null
    memos_override: number | null
  }>) {
    // Owner email + profile.
    const { data: ownerAuth } = await admin.auth.admin.getUserById(f.user_id)
    const ownerEmail = ownerAuth?.user?.email ?? "(unknown)"
    const { data: ownerProfile } = await admin
      .from("profiles")
      .select("tier, subscription_status")
      .eq("id", f.user_id)
      .maybeSingle()
    const ownerTier = ((ownerProfile as { tier: Tier } | null)?.tier ?? "starter") as Tier
    const ownerStatus =
      (ownerProfile as { subscription_status: string } | null)?.subscription_status ?? "inactive"

    // Counts + roster: members (with emails), pending invites, memos this month.
    const [membersRes, inviteRes, memoRes] = await Promise.all([
      admin
        .from("fund_members")
        .select("user_id, role, joined_at")
        .eq("fund_id", f.id)
        .order("joined_at", { ascending: true }),
      admin
        .from("fund_invitations")
        .select("id", { count: "exact", head: true })
        .eq("fund_id", f.id)
        .is("accepted_at", null)
        .is("revoked_at", null),
      admin
        .from("analyses")
        .select("id, deals!inner(fund_id)", { count: "exact", head: true })
        .eq("deals.fund_id", f.id)
        .gte("created_at", startOfMonth.toISOString()),
    ])

    const memberRows = (membersRes.data ?? []) as Array<{
      user_id: string
      role: "owner" | "member"
      joined_at: string
    }>
    const members: AdminFundRow["members"] = []
    for (const m of memberRows) {
      const { data: au } = await admin.auth.admin.getUserById(m.user_id)
      members.push({
        email: au?.user?.email ?? "(unknown)",
        role: m.role,
        joinedAt: m.joined_at,
      })
    }

    rows.push({
      fundId: f.id,
      fundName: f.name,
      ownerEmail,
      ownerTier,
      ownerStatus,
      tierSeats: TIER_CONFIG[ownerTier].users,
      tierMemos: TIER_CONFIG[ownerTier].dealsPerMonth,
      seatsOverride: f.seats_override,
      memosOverride: f.memos_override,
      memberCount: members.length,
      pendingInvites: inviteRes.count ?? 0,
      memosThisMonth: memoRes.count ?? 0,
      members,
    })
  }

  return { data: rows }
}

export async function updateFundLimits(input: {
  fundId: string
  seatsOverride: number | null
  memosOverride: number | null
}): Promise<{ error: string } | { success: true }> {
  const gate = await gateAdmin()
  if ("error" in gate) return { error: String(gate.error) }

  // Coerce to nullable positive ints. NULL/0/'' all collapse to "no override".
  const seats = normaliseOverride(input.seatsOverride)
  const memos = normaliseOverride(input.memosOverride)

  const admin = adminClient()
  const { error } = await admin
    .from("funds")
    .update({ seats_override: seats, memos_override: memos })
    .eq("id", input.fundId)
  if (error) return { error: error.message }

  revalidatePath("/admin/limits")
  return { success: true }
}

function normaliseOverride(v: number | null): number | null {
  if (v === null || v === undefined) return null
  if (typeof v !== "number" || !Number.isFinite(v)) return null
  if (v <= 0) return null
  return Math.floor(v)
}

/**
 * Users who signed up but aren't in any fund_members row yet — abandoned
 * onboarding, bots, manually-created accounts that never ran /setup. Surfaced
 * so the admin can see who's lingering before any team activity.
 */
export async function listFundlessUsers(): Promise<
  { error: string } | { data: AdminFundlessUser[] }
> {
  const gate = await gateAdmin()
  if ("error" in gate) return { error: String(gate.error) }

  const admin = adminClient()

  // Page through all auth users (admin.listUsers caps at perPage; default 50).
  const allUsers: Array<{
    id: string
    email: string | undefined
    created_at: string
    app_metadata?: { provider?: string }
  }> = []
  let page = 1
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) return { error: error.message }
    if (!data.users.length) break
    allUsers.push(...(data.users as typeof allUsers))
    if (data.users.length < 200) break
    page++
  }

  // Anyone in fund_members is excluded — that includes owners and teammates,
  // which is exactly the "has a team" definition we want here.
  const { data: members } = await admin.from("fund_members").select("user_id")
  const seatedIds = new Set(((members ?? []) as Array<{ user_id: string }>).map((m) => m.user_id))

  const rows: AdminFundlessUser[] = []
  for (const u of allUsers) {
    if (seatedIds.has(u.id)) continue
    rows.push({
      userId: u.id,
      email: u.email ?? "(no email)",
      createdAt: u.created_at,
      provider: u.app_metadata?.provider ?? null,
    })
  }
  rows.sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1))
  return { data: rows }
}

// Re-export so the admin page can preview effective values inline without
// re-importing the helper alongside this module.
export { effectiveLimits }
