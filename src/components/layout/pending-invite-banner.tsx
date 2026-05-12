"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Users, X, Loader2 } from "lucide-react"
import { acceptInvite, getPendingInviteForCurrentUser } from "@/app/actions/members"

/**
 * Last-resort catch for invitees who slipped past the auth-page accept paths.
 * On every dashboard mount we check whether the signed-in user has a pending
 * invite for their email; if yes, show a banner with a one-click accept.
 *
 * Why this exists: the cleanest path is /register or /login auto-accepting,
 * but browser cache, OAuth race conditions, and bookmark-the-old-URL routes
 * can all leave the token behind. The banner means the user is never stuck.
 */
export function PendingInviteBanner() {
  const router = useRouter()
  const [invite, setInvite] = useState<{ id: string; token: string; fundName: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await getPendingInviteForCurrentUser()
      if (cancelled) return
      if ("error" in res) return
      if (res.invite) setInvite(res.invite)
    })()
    return () => { cancelled = true }
  }, [])

  if (!invite || dismissed) return null

  function handleAccept() {
    if (!invite) return
    setError(null)
    startTransition(async () => {
      const result = await acceptInvite(invite.token)
      if ("error" in result) {
        setError(result.error)
        return
      }
      // Hard reload so middleware re-reads the new membership for entitlement.
      window.location.href = "/deals"
    })
  }

  return (
    <div className="border-b border-[#B5D33C]/40 bg-[#B5D33C]/20 px-4 py-2.5 md:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Users className="h-4 w-4 shrink-0 text-[#0F3D2E]" />
        <p className="flex-1 text-[13px] text-[#0F3D2E]">
          You&apos;ve been invited to join <strong>{invite.fundName}</strong>.{" "}
          {error && <span className="text-red-700">{error}</span>}
        </p>
        <button
          type="button"
          onClick={handleAccept}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#0F3D2E]/90 disabled:opacity-60"
        >
          {pending && <Loader2 className="h-3 w-3 animate-spin" />}
          Accept
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-[#0F3D2E]/60 hover:text-[#0F3D2E]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
