"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, KeyRound, ArrowRight, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordConfirmPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session))
      setChecking(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
    setTimeout(() => router.push("/deals"), 1500)
  }

  if (checking) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#0F3D2E]" />
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">
          Link expired
        </p>
        <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
          This reset link is no longer valid
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Reset links expire after a short time or once used. Request a new one.
        </p>
        <div className="mt-7">
          <Link
            href="/reset-password"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 px-5 py-3 text-sm font-semibold transition"
          >
            Request a new link
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
          Password updated
        </p>
        <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
          You&apos;re all set
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Redirecting you to your dashboard…
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
        <KeyRound className="h-5 w-5" />
      </div>
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
        Choose a new password
      </p>
      <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
        Set your new password
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Pick something you haven&apos;t used before.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[13px] text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-sm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 px-5 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
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
