"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Loader2, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Tier } from "@/lib/types/user"
import { GoogleButton } from "@/components/auth/google-button"

type Step = "credentials" | "mfa"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tierParam = searchParams.get("tier") as Tier | null

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

    // Does this user need an MFA challenge?
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
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMfa} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <Input
              autoFocus
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl font-mono tracking-widest"
              autoComplete="one-time-code"
              required
            />
            <Button className="w-full" type="submit" disabled={loading || mfaCode.length !== 6}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
            <button
              type="button"
              className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
              onClick={() => { setStep("credentials"); setError(""); setMfaCode("") }}
            >
              Back
            </button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your Sam account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton label="Sign in with Google" tier={tierParam} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
            <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleCredentials} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@fund.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/reset-password" className="text-xs text-muted-foreground hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link href={tierParam ? `/register?tier=${tierParam}` : "/register"} className="font-medium text-foreground hover:underline">Create one</Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
