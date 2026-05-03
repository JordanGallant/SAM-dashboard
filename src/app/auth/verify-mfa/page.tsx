"use client"

// MFA challenge page for users who have verified TOTP factors but haven't
// passed the challenge in their current session. Common case: Google OAuth
// users — /login's email/password flow handles MFA inline, but /auth/callback
// (the OAuth landing) doesn't. Middleware redirects here when
// aal.nextLevel === "aal2" && currentLevel !== "aal2".

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Shield, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function VerifyMfa() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/deals"

  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login")
        return
      }
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const verified = factors?.totp?.find((f) => f.status === "verified")
      if (!verified) {
        // No verified factor — nothing to challenge. Bypass.
        router.replace(next)
        return
      }
      setFactorId(verified.id)
      setLoading(false)
    })()
  }, [router, next])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    setVerifying(true)
    setError("")

    const supabase = createClient()
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
      factorId,
    })
    if (challengeErr || !challenge) {
      setError(challengeErr?.message || "Failed to start 2FA check")
      setVerifying(false)
      return
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })
    if (verifyErr) {
      setError(verifyErr.message)
      setVerifying(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="mx-auto max-w-md py-16 px-4">
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
          <Shield className="h-5 w-5 text-[#0F3D2E]" />
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
          Two-factor authentication
        </p>
        <h1 className="mt-1 text-center font-heading text-xl font-bold tracking-[-0.01em] text-[#0A2E22]">
          Enter your 6-digit code
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Open your authenticator app to find the current code.
        </p>

        {loading ? (
          <div className="mt-7 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <form onSubmit={handleVerify} className="mt-7 space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-sm">
                Code
              </Label>
              <Input
                id="code"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl font-mono tabular-nums tracking-[0.4em]"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={code.length !== 6 || verifying}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-3 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col items-center gap-1.5 text-[12px] text-muted-foreground">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Sign out
          </button>
          <Link
            href="/settings/security"
            className="hover:text-foreground transition-colors"
          >
            Lost access to your authenticator?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyMfaPage() {
  return (
    <Suspense>
      <VerifyMfa />
    </Suspense>
  )
}
