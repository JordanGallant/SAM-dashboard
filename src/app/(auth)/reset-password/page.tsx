"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, CheckCircle2, KeyRound, ArrowRight, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings/security`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
          Email sent
        </p>
        <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
          Check your email
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          We sent a password reset link to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <div className="mt-7">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
        <KeyRound className="h-5 w-5" />
      </div>
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
        Reset password
      </p>
      <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
        Forgot your password?
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[13px] text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input id="email" type="email" placeholder="you@fund.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 px-5 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <div className="mt-6">
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
