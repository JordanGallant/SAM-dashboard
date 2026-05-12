"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BarChart3, Loader2, ArrowRight, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"
import { GoogleButton } from "@/components/auth/google-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { acceptInvite } from "@/app/actions/members"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tierParam = (searchParams.get("tier") as Tier) || "professional"

  // Invite-link signup: the email field is pre-filled from the URL and locked
  // so the new account matches the invited address (strict match on accept).
  const inviteToken = searchParams.get("invite")
  const invitedEmail = searchParams.get("email") || ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState(invitedEmail)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // If the invitee is already signed in (existing SAM user accepting an
  // invite), skip the signup form and call acceptInvite immediately.
  // Without this, the form throws "User already registered" and the user
  // is stuck — exactly what happened on the first invite attempt.
  useEffect(() => {
    if (!inviteToken) return
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      const result = await acceptInvite(inviteToken)
      if (cancelled) return
      if ("error" in result) {
        setError(result.error)
      } else {
        router.push("/deals")
      }
    })()
    return () => { cancelled = true }
  }, [inviteToken, router])

  const tier = TIER_CONFIG[tierParam]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) return setError("Passwords do not match")
    if (password.length < 6) return setError("Password must be at least 6 characters")

    setLoading(true)

    const supabase = createClient()
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, pending_tier: tierParam },
        // Pass the invite token through email confirmation so /auth/callback
        // accepts the invite and routes to /deals (rather than /checkout-redirect).
        emailRedirectTo: inviteToken
          ? `${window.location.origin}/auth/callback?invite=${encodeURIComponent(inviteToken)}`
          : `${window.location.origin}/auth/callback`,
      },
    })

    if (signupError || !data.user) {
      setError(signupError?.message || "Failed to create account")
      setLoading(false)
      return
    }

    if (!data.session) {
      // For invite flow: still need email confirmation before joining the fund.
      // The token + email pass through so /auth/callback completes acceptance.
      const next = inviteToken
        ? `?email=${encodeURIComponent(email)}&invite=${encodeURIComponent(inviteToken)}`
        : `?email=${encodeURIComponent(email)}`
      router.push(`/auth/check-email${next}`)
      return
    }

    // Invited users skip checkout — they piggy-back on the inviter's plan.
    if (inviteToken) {
      const result = await acceptInvite(inviteToken)
      if ("error" in result) {
        setError(result.error)
        setLoading(false)
        return
      }
      router.push("/deals")
      return
    }

    router.push(`/checkout-redirect?tier=${tierParam}`)
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
        {inviteToken ? "Accept team invite" : "Create account"}
      </p>
      <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
        {inviteToken ? "Join your team on Sam" : "Get started with Sam"}
      </h1>
      {inviteToken ? (
        <div className="mt-3 mx-auto max-w-sm rounded-xl bg-[#B5D33C]/20 ring-1 ring-[#B5D33C]/40 px-4 py-3 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
            <Users className="h-3 w-3" />
            You&apos;ve been invited
          </p>
          <p className="mt-1 text-[12.5px] text-[#0F3D2E]/80 leading-relaxed">
            Create your account to join your team&apos;s shared workspace. No payment required — your seat is included in the plan.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] ring-1 ring-foreground/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E]/75">
            {tier.label}
          </span>
          <span className="text-[12px] font-mono tabular-nums text-muted-foreground">
            {tier.price === 0 ? "Custom pricing" : `EUR ${tier.price}/mo`}
          </span>
        </div>
      )}

      <div className="mt-7 space-y-4">
        <GoogleButton
          label={inviteToken ? "Join with Google" : "Sign up with Google"}
          tier={tierParam}
          inviteToken={inviteToken}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
            <span className="bg-card px-3 text-muted-foreground">or with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[13px] text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm">Full name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@fund.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly={!!inviteToken}
              className={inviteToken ? "bg-foreground/[0.04] cursor-not-allowed" : undefined}
            />
            {inviteToken && (
              <p className="text-[11px] text-muted-foreground">
                Invites are locked to the address they were sent to.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-sm">Confirm</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-3 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {inviteToken ? "Create account & join team" : "Continue to payment"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {!inviteToken && (
            <p className="text-center text-[11px] text-muted-foreground">
              Have a coupon? You can apply it on the next screen.
            </p>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/login?tier=${tierParam}`} className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
}
