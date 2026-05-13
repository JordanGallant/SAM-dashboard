"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BarChart3, Loader2, Shield, ArrowRight, ArrowLeft, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Tier } from "@/lib/types/user"
import { GoogleButton } from "@/components/auth/google-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { acceptInvite } from "@/app/actions/members"
import { syncLeadToHubspot } from "@/app/actions/lead-sync"

type Step = "credentials" | "mfa"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tierParam = searchParams.get("tier") as Tier | null
  const inviteToken = searchParams.get("invite")

  // Already-signed-in invitee path: if a logged-in user lands here with an
  // invite token in the URL, accept the invite immediately and redirect to
  // /deals. Mirrors the same behaviour on /register so the invite flow
  // works no matter which auth page the user clicks through.
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

  const [step, setStep] = useState<Step>("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [factorId, setFactorId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Safety net for HubSpot capture. Email+password users whose confirm-link
    // PKCE exchange silently failed (cross-browser click, email scanner
    // pre-fetch, expired cookie) never make it through /auth/callback. Fire
    // upsert here so every authenticated user is in the CRM. Idempotent on
    // email, fire-and-forget, never blocks login.
    void syncLeadToHubspot({ email }).catch(() => {})

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.nextLevel === "aal2") {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const verified = factors?.totp?.find((f) => f.status === "verified")
      if (verified) {
        setFactorId(verified.id)
        setStep("mfa")
        setLoading(false)
        return
      }
    }

    await finishLogin()
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId })

    if (challengeErr || !challenge) {
      setError(challengeErr?.message || "Failed to start 2FA check")
      setLoading(false)
      return
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: mfaCode,
    })

    if (verifyErr) {
      setError(verifyErr.message)
      setLoading(false)
      return
    }

    await finishLogin()
  }

  async function finishLogin() {
    // Invite path beats every other post-login route. The user is here
    // because they clicked an email invite link; once authenticated, accept
    // the invite and drop them in /deals.
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
    if (tierParam) {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: tierParam }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
      } catch {
        // fall through to deals
      }
    }
    router.push("/deals")
    router.refresh()
  }

  if (step === "mfa") {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
          <Shield className="h-5 w-5" />
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
          Two-factor authentication
        </p>
        <h1 className="mt-1 text-center font-heading text-xl font-bold tracking-[-0.01em] text-[#0F3D2E]">
          Enter your 6-digit code
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Open your authenticator app to find the current code.
        </p>

        <form onSubmit={handleMfa} className="mt-7 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[13px] text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="mfaCode" className="text-sm">Code</Label>
            <Input
              id="mfaCode"
              autoFocus
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl font-mono tabular-nums tracking-[0.4em]"
              autoComplete="one-time-code"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || mfaCode.length !== 6}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 px-5 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => { setStep("credentials"); setError(""); setMfaCode("") }}
            className="inline-flex w-full items-center justify-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
        Sign in
      </p>
      <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
        Welcome back
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Sign in to your Sam account to continue.
      </p>

      <div className="mt-7 space-y-4">
        <GoogleButton
          label={inviteToken ? "Continue with Google" : "Sign in with Google"}
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

        <form onSubmit={handleCredentials} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[13px] text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input id="email" type="email" placeholder="you@fund.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Link href="/reset-password" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Forgot password?</Link>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 px-5 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href={tierParam ? `/register?tier=${tierParam}` : "/register"} className="font-medium text-foreground hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
