"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { TIER_CONFIG } from "@/lib/tier-config"
import { sendInviteEmail } from "@/lib/email/send-invite"
import type { Tier } from "@/lib/types/user"

/**
 * Service-role client for reading auth.users (member emails).
 * Only used after we've verified the caller is a fund member.
 */
function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

interface MemberRow {
  user_id: string
  email: string
  display_name: string | null
  role: "owner" | "member"
  joined_at: string
}

interface InviteRow {
  id: string
  email: string
  created_at: string
  expires_at: string
}

interface MembersPayload {
  fundId: string
  fundName: string
  ownerTier: Tier
  ownerStatus: string
  seatCap: number
  members: MemberRow[]
  invites: InviteRow[]
}

async function loadFundContext() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" as const }

  const { data: membership } = await supabase
    .from("fund_members")
    .select("fund_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (membership) {
    return { supabase, user, fundId: (membership as { fund_id: string }).fund_id }
  }

  // Self-heal: if the user owns a funds row but pre-dates the fund_members
  // backfill, insert their owner row now and proceed. This catches users
  // whose fund was created before 006_fund_members.sql ran, or via paths
  // that didn't yet seat the owner.
  const { data: ownedFund } = await supabase
    .from("funds")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (ownedFund) {
    const ownedId = (ownedFund as { id: string }).id
    // Use the admin client: the existing fund_members RLS requires you to
    // already be a member to insert, which is circular for the very first
    // owner row. We've already verified the caller owns the funds row above,
    // so it's safe to bootstrap their membership here.
    const admin = adminClient()
    const { error: insErr } = await admin
      .from("fund_members")
      .insert({ fund_id: ownedId, user_id: user.id, role: "owner" })
    if (insErr && insErr.code !== "23505") {
      console.error("[members] self-heal fund_members insert failed:", insErr)
    }
    return { supabase, user, fundId: ownedId }
  }

  // No fund at all yet — distinct from "user error" so the UI can show a
  // friendly "create your fund first" CTA instead of a red error box.
  return { error: "NO_FUND" as const }
}

export async function listMembers(): Promise<
  { error: string } | { data: MembersPayload }
> {
  const ctx = await loadFundContext()
  if ("error" in ctx) return { error: String(ctx.error) }
  const { supabase, fundId } = ctx

  const [{ data: fund }, { data: members }, { data: invites }] = await Promise.all([
    supabase
      .from("funds")
      .select("id, name, user_id")
      .eq("id", fundId)
      .single(),
    supabase
      .from("fund_members")
      .select("user_id, role, joined_at")
      .eq("fund_id", fundId)
      .order("joined_at", { ascending: true }),
    supabase
      .from("fund_invitations")
      .select("id, email, created_at, expires_at")
      .eq("fund_id", fundId)
      .is("accepted_at", null)
      .is("revoked_at", null)
      .order("created_at", { ascending: false }),
  ])

  if (!fund) return { error: "Fund not found" }

  // Owner's tier drives the seat cap. With one-fund-per-user, owner = funds.user_id.
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("tier, subscription_status")
    .eq("id", (fund as { user_id: string }).user_id)
    .maybeSingle()

  const ownerTier = ((ownerProfile as { tier: Tier } | null)?.tier ?? "starter") as Tier
  const ownerStatus =
    (ownerProfile as { subscription_status: string } | null)?.subscription_status ?? "inactive"
  const cap = TIER_CONFIG[ownerTier]?.users ?? 1
  const seatCap = cap === -1 ? 999 : cap

  // Enrich each member row with email via admin lookup
  const admin = adminClient()
  const enriched: MemberRow[] = []
  for (const m of (members ?? []) as { user_id: string; role: "owner" | "member"; joined_at: string }[]) {
    const { data: au } = await admin.auth.admin.getUserById(m.user_id)
    enriched.push({
      user_id: m.user_id,
      email: au?.user?.email ?? "(unknown)",
      display_name: (au?.user?.user_metadata?.full_name as string | undefined) ?? null,
      role: m.role,
      joined_at: m.joined_at,
    })
  }

  return {
    data: {
      fundId,
      fundName: (fund as { name: string }).name,
      ownerTier,
      ownerStatus,
      seatCap,
      members: enriched,
      invites: (invites ?? []) as InviteRow[],
    },
  }
}

export async function createInvite(
  emailRaw: string,
): Promise<{ error: string } | { success: true; id: string }> {
  const email = emailRaw.trim().toLowerCase()
  if (!email || !email.includes("@")) return { error: "Enter a valid email" }

  const ctx = await loadFundContext()
  if ("error" in ctx) return { error: String(ctx.error) }
  const { supabase, user, fundId } = ctx

  // Seat check: owner's tier defines the cap.
  const { data: fund } = await supabase
    .from("funds")
    .select("user_id, name")
    .eq("id", fundId)
    .single()
  if (!fund) return { error: "Fund not found" }

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("tier, subscription_status")
    .eq("id", (fund as { user_id: string }).user_id)
    .maybeSingle()
  const ownerTier = ((ownerProfile as { tier: Tier } | null)?.tier ?? "starter") as Tier
  const status = (ownerProfile as { subscription_status: string } | null)?.subscription_status

  // Tier gate: Pro or Fund. Coupon trial users get full Pro features during
  // the trial — gating them out would mean they never see team invites and
  // never have a reason to convert. Past_due / canceled / inactive are blocked.
  if (ownerTier === "starter") return { error: "Upgrade to Pro to invite teammates" }
  if (status !== "active" && status !== "trial") {
    return { error: "Active Pro plan required to invite teammates" }
  }

  const cap = TIER_CONFIG[ownerTier].users
  const effectiveCap = cap === -1 ? 999 : cap

  const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
    supabase
      .from("fund_members")
      .select("user_id", { count: "exact", head: true })
      .eq("fund_id", fundId),
    supabase
      .from("fund_invitations")
      .select("id", { count: "exact", head: true })
      .eq("fund_id", fundId)
      .is("accepted_at", null)
      .is("revoked_at", null),
  ])

  const used = (memberCount ?? 0) + (pendingCount ?? 0)
  if (used >= effectiveCap) {
    return { error: `Seat limit reached (${effectiveCap}). Revoke a pending invite or remove a member first.` }
  }

  // Generate token + insert. Unique partial index on (fund_id, lower(email))
  // prevents duplicate pending invites for the same email.
  const token = randomBytes(24).toString("base64url")
  const { data: inserted, error: insertErr } = await supabase
    .from("fund_invitations")
    .insert({
      fund_id: fundId,
      email,
      token,
      invited_by: user.id,
    })
    .select("id")
    .single()

  if (insertErr) {
    if (insertErr.code === "23505") {
      return { error: "This email already has a pending invite." }
    }
    return { error: insertErr.message }
  }

  // Fire email. Failures are surfaced (this is a user-initiated action).
  const { full_name } = (user.user_metadata ?? {}) as { full_name?: string }
  const sendResult = await sendInviteEmail({
    to: email,
    inviterName: full_name || user.email || "A teammate",
    fundName: (fund as { name: string }).name,
    token,
  })

  if (!sendResult.ok) {
    // Roll back the invite row so the user can retry cleanly.
    await supabase.from("fund_invitations").delete().eq("id", (inserted as { id: string }).id)
    return { error: `Couldn't send invite: ${sendResult.error}` }
  }

  revalidatePath("/settings/members")
  return { success: true, id: (inserted as { id: string }).id }
}

export async function revokeInvite(
  invitationId: string,
): Promise<{ error: string } | { success: true }> {
  const ctx = await loadFundContext()
  if ("error" in ctx) return { error: String(ctx.error) }
  const { supabase, fundId } = ctx

  const { error } = await supabase
    .from("fund_invitations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", invitationId)
    .eq("fund_id", fundId)
  if (error) return { error: error.message }

  revalidatePath("/settings/members")
  return { success: true }
}

export async function removeMember(
  userId: string,
): Promise<{ error: string } | { success: true }> {
  const ctx = await loadFundContext()
  if ("error" in ctx) return { error: String(ctx.error) }
  const { supabase, fundId } = ctx

  const { data: fund } = await supabase
    .from("funds")
    .select("user_id")
    .eq("id", fundId)
    .single()
  if (fund && (fund as { user_id: string }).user_id === userId) {
    return { error: "Can't remove the fund owner. Transfer ownership first." }
  }

  const { error } = await supabase
    .from("fund_members")
    .delete()
    .eq("fund_id", fundId)
    .eq("user_id", userId)
  if (error) return { error: error.message }

  revalidatePath("/settings/members")
  return { success: true }
}

/**
 * Called from /register after a successful signup when the URL carried
 * ?invite=token. Adds the new user to the inviter's fund as a member.
 *
 * Returns { joined: true, fundName } on success so the caller can redirect
 * to /deals instead of the setup wizard.
 */
export async function acceptInvite(
  token: string,
): Promise<{ error: string } | { joined: true; fundName: string }> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: invite } = await supabase
    .from("fund_invitations")
    .select("id, fund_id, email, expires_at, accepted_at, revoked_at")
    .eq("token", token)
    .maybeSingle()

  if (!invite) return { error: "Invite not found" }
  const inv = invite as {
    id: string
    fund_id: string
    email: string
    expires_at: string
    accepted_at: string | null
    revoked_at: string | null
  }
  if (inv.revoked_at) return { error: "Invite was revoked" }
  if (inv.accepted_at) return { error: "Invite already accepted" }
  if (new Date(inv.expires_at) < new Date()) return { error: "Invite has expired" }

  // Strict email match — invite goes to the address it was sent to.
  if ((user.email || "").toLowerCase() !== inv.email.toLowerCase()) {
    return {
      error: `Invite is for ${inv.email}. Sign in with that email to accept.`,
    }
  }

  // Insert membership + mark accepted. Use service role to bypass RLS on
  // a fund the new user isn't yet a member of (RLS read-after-write race).
  const admin = adminClient()
  const { error: insErr } = await admin.from("fund_members").insert({
    fund_id: inv.fund_id,
    user_id: user.id,
    role: "member",
  })
  if (insErr && insErr.code !== "23505") return { error: insErr.message }

  await admin
    .from("fund_invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", inv.id)

  const { data: fund } = await admin
    .from("funds")
    .select("name")
    .eq("id", inv.fund_id)
    .single()

  return { joined: true, fundName: (fund as { name: string } | null)?.name ?? "your fund" }
}

/**
 * Used by /setup and onboarding flows: returns true if the current user
 * is already a member of a fund (i.e. accepted an invite — skip wizard).
 */
export async function userHasFundMembership(): Promise<boolean> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase
    .from("fund_members")
    .select("fund_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()
  return !!data
}
