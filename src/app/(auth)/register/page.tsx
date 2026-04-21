"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants, Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, Check, Tag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tierParam = (searchParams.get("tier") as Tier) || "professional"
  const codeParam = searchParams.get("code") || ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [promoCode, setPromoCode] = useState(codeParam)
  const [codeValid, setCodeValid] = useState<null | { days: number }>(null)
  const [codeChecking, setCodeChecking] = useState(false)
  const [codeError, setCodeError] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const tier = TIER_CONFIG[tierParam]

  // Auto-validate code if provided via URL
  useEffect(() => {
    if (codeParam) validatePromo(codeParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeParam])

  async function validatePromo(code: string) {
    setCodeChecking(true)
    setCodeError("")
    setCodeValid(null)
    try {
      const res = await fetch(`/api/auth/apply-trial?code=${encodeURIComponent(code)}`)
      const data = await res.json()
      if (data.valid) {
        setCodeValid({ days: data.days })
      } else {
        setCodeError("That code isn't valid")
      }
    } catch {
      setCodeError("Couldn't verify code")
    } finally {
      setCodeChecking(false)
    }
  }

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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signupError || !data.user) {
      setError(signupError?.message || "Failed to create account")
      setLoading(false)
      return
    }

    // If we have a valid promo code, apply it
    if (codeValid && promoCode) {
      // Wait a moment for the profile trigger to fire
      await new Promise((r) => setTimeout(r, 800))

      const applyRes = await fetch("/api/auth/apply-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, tier: tierParam }),
      })

      if (applyRes.ok) {
        // Trial granted — go to setup wizard
        router.push("/setup")
        router.refresh()
        return
      }
      // If apply fails, fall through to paid flow
    }

    // No code (or code failed) — send to Stripe Checkout
    await new Promise((r) => setTimeout(r, 500))
    try {
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierParam }),
      })
      const checkoutData = await checkoutRes.json()
      if (checkoutData.url) {
        window.location.href = checkoutData.url
        return
      }
      setError(checkoutData.error || "Failed to start checkout")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Selected plan: <Badge variant="outline" className="ml-1">{tier.label}</Badge>
          <span className="ml-2 text-muted-foreground">EUR {tier.price}/mo</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@fund.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          {/* Promo code section */}
          <div className="rounded-md border bg-muted/30 p-3 space-y-2">
            <Label htmlFor="promo" className="flex items-center gap-1.5 text-xs font-medium">
              <Tag className="h-3.5 w-3.5" />
              Promo code (optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="promo"
                placeholder="e.g. FOUNDER90"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase())
                  setCodeValid(null)
                  setCodeError("")
                }}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!promoCode || codeChecking}
                onClick={() => validatePromo(promoCode)}
              >
                {codeChecking ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
              </Button>
            </div>
            {codeValid && (
              <p className="text-xs text-emerald-700 flex items-center gap-1">
                <Check className="h-3 w-3" /> {codeValid.days}-day free trial will activate
              </p>
            )}
            {codeError && <p className="text-xs text-red-700">{codeError}</p>}
            {!codeValid && !codeError && (
              <p className="text-xs text-muted-foreground">
                Have a code? Apply it to skip the payment screen and start a free trial.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {codeValid ? "Start Free Trial" : "Continue to Payment"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link href={`/login?tier=${tierParam}`} className="font-medium text-foreground hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
}
