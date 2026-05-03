"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"
import { GoogleButton } from "@/components/auth/google-button"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tierParam = (searchParams.get("tier") as Tier) || "professional"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signupError || !data.user) {
      setError(signupError?.message || "Failed to create account")
      setLoading(false)
      return
    }

    if (!data.session) {
      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`)
      return
    }

    router.push(`/checkout-redirect?tier=${tierParam}`)
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
      <CardContent className="space-y-4">
        <GoogleButton label="Sign up with Google" tier={tierParam} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
            <span className="bg-card px-3 text-muted-foreground">or with email</span>
          </div>
        </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Payment
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Have a coupon? You can apply it on the next screen.
          </p>
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
