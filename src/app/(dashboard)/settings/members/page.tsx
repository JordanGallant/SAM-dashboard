"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Users, Mail, Loader2, X, ArrowRight, Crown, AlertCircle } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import {
  listMembers,
  createInvite,
  revokeInvite,
  removeMember,
} from "@/app/actions/members"

interface Member {
  user_id: string
  email: string
  display_name: string | null
  role: "owner" | "member"
  joined_at: string
}

interface Invite {
  id: string
  email: string
  created_at: string
  expires_at: string
}

interface MembersData {
  fundId: string
  fundName: string
  ownerTier: "starter" | "professional" | "fund"
  ownerStatus: string
  seatCap: number
  members: Member[]
  invites: Invite[]
}

export default function MembersPage() {
  const { tier, isTrialing, loading: tierLoading } = useTier()
  const [data, setData] = useState<MembersData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function refresh() {
    const res = await listMembers()
    if ("error" in res) {
      setLoadError(res.error)
      setData(null)
    } else {
      setLoadError(null)
      setData(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  // Gate the UI client-side. Server actions enforce again — defense in depth.
  // Tier is the owner's tier the user is associated with, *not* the caller's.
  // Once data loads we use ownerTier; before that we use the caller's tier
  // as a friendly placeholder.
  if (tierLoading || loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading members…
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {loadError}
      </div>
    )
  }

  if (!data) return null

  const isPaidTeamTier =
    (data.ownerTier === "professional" || data.ownerTier === "fund") &&
    data.ownerStatus === "active"

  if (!isPaidTeamTier) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-card p-8 max-w-2xl">
        <Users className="h-8 w-8 text-primary mb-4" />
        <h2 className="text-xl font-bold font-heading">Invite teammates</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Team seats are available on the Pro plan. Upgrade to invite up to{" "}
          <strong>3 teammates</strong> to your shared workspace — they get access to your fund profile, deals, and assessments.
        </p>
        <Link
          href="/settings/billing"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0F3D2E] text-white px-4 py-2 text-sm font-semibold hover:bg-[#0F3D2E]/90 transition"
        >
          Upgrade to Pro
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {tier === "professional" && isTrialing && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            Coupon trials don&apos;t include team seats — they unlock after the first paid invoice.
          </p>
        )}
      </div>
    )
  }

  const usedSeats = data.members.length + data.invites.length
  const seatsLeft = Math.max(0, data.seatCap - usedSeats)
  const capLabel = data.seatCap >= 999 ? "Unlimited" : `${data.seatCap}`

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError(null)
    setInviteSuccess(null)
    if (!inviteEmail.trim()) return

    startTransition(async () => {
      const res = await createInvite(inviteEmail.trim())
      if ("error" in res) {
        setInviteError(res.error)
      } else {
        setInviteSuccess(`Invite sent to ${inviteEmail.trim()}.`)
        setInviteEmail("")
        await refresh()
      }
    })
  }

  function handleRevoke(invitationId: string) {
    startTransition(async () => {
      await revokeInvite(invitationId)
      await refresh()
    })
  }

  function handleRemove(userId: string, email: string) {
    if (!confirm(`Remove ${email} from ${data!.fundName}? They'll lose access to all deals and assessments.`)) return
    startTransition(async () => {
      await removeMember(userId)
      await refresh()
    })
  }

  return (
    <div className="space-y-7 max-w-3xl">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
            {data.fundName}
          </p>
          <h2 className="mt-1 text-2xl font-bold font-heading">Members</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            People with shared access to your fund&apos;s deals and assessments.
          </p>
        </div>
        <div className="rounded-xl bg-foreground/[0.04] ring-1 ring-foreground/10 px-4 py-2.5 text-right">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Seats used
          </p>
          <p className="mt-0.5 font-heading font-bold tabular-nums">
            {usedSeats} <span className="text-muted-foreground font-normal">/ {capLabel}</span>
          </p>
        </div>
      </header>

      {/* Invite form */}
      <section className="rounded-2xl border border-foreground/10 bg-card p-5 md:p-6">
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-3">
          Invite teammate
        </p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@fund.com"
              disabled={pending || seatsLeft <= 0}
              className="w-full rounded-full bg-background ring-1 ring-foreground/10 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={pending || seatsLeft <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#0F3D2E]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
            Send invite
          </button>
        </form>
        {seatsLeft <= 0 && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Seat limit reached. Revoke a pending invite or remove a member to free up a seat.
          </p>
        )}
        {inviteError && (
          <p className="mt-3 text-[13px] text-red-700">{inviteError}</p>
        )}
        {inviteSuccess && (
          <p className="mt-3 text-[13px] text-emerald-700">{inviteSuccess}</p>
        )}
      </section>

      {/* Active members */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
          Active members ({data.members.length})
        </p>
        <ul className="space-y-2">
          {data.members.map((m) => (
            <li
              key={m.user_id}
              className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate flex items-center gap-2">
                  {m.display_name || m.email}
                  {m.role === "owner" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#B5D33C]/30 text-[#0F3D2E] px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest">
                      <Crown className="h-2.5 w-2.5" />
                      Owner
                    </span>
                  )}
                </p>
                {m.display_name && (
                  <p className="text-[12px] text-muted-foreground truncate">{m.email}</p>
                )}
              </div>
              {m.role !== "owner" && (
                <button
                  type="button"
                  onClick={() => handleRemove(m.user_id, m.email)}
                  disabled={pending}
                  className="text-[12px] text-muted-foreground hover:text-red-600 transition disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Pending invites */}
      {data.invites.length > 0 && (
        <section>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Pending invites ({data.invites.length})
          </p>
          <ul className="space-y-2">
            {data.invites.map((inv) => {
              const sentAgo = relativeTime(inv.created_at)
              return (
                <li
                  key={inv.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{inv.email}</p>
                    <p className="text-[12px] text-muted-foreground">Sent {sentAgo}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevoke(inv.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-red-600 transition disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    Revoke
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
