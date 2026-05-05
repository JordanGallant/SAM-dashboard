"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BarChart3, Loader2, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"
import { GoogleButton } from "@/components/auth/google-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
        Create account
      </p>
      <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0A2E22]">
        Get started with Sam
      </h1>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] ring-1 ring-foreground/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#0A2E22]/75">
          {tier.label}
        </span>
        <span className="text-[12px] font-mono tabular-nums text-muted-foreground">
          EUR {tier.price}/mo
        </span>
      </div>

      <div className="mt-7 space-y-4">
        <GoogleButton label="Sign up with Google" tier={tierParam} />

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
            <Input id="email" type="email" placeholder="you@fund.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
            Continue to payment
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            Have a coupon? You can apply it on the next screen.
          </p>
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
