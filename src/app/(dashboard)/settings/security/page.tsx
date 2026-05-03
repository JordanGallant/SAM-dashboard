"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, ShieldCheck, AlertTriangle, KeyRound, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useTier } from "@/lib/tier-context"

export default function SecurityPage() {
  const { config } = useTier()
  const [mfaEnrolled, setMfaEnrolled] = useState<boolean | null>(null)
  const [disabling, setDisabling] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "error" | "success"
    text: string
  } | null>(null)

  useEffect(() => {
    refreshMfaState()
  }, [])

  async function refreshMfaState() {
    const supabase = createClient()
    const { data } = await supabase.auth.mfa.listFactors()
    const verified = data?.totp?.find((f) => f.status === "verified")
    setMfaEnrolled(!!verified)
  }

  async function disableMfa() {
    if (config.twoFactorRequired) return
    setDisabling(true)
    const supabase = createClient()
    const { data } = await supabase.auth.mfa.listFactors()
    const allTotp = (data?.all ?? []).filter((f) => f.factor_type === "totp")
    for (const f of allTotp) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }
    await refreshMfaState()
    setDisabling(false)
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMessage(null)
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }
    setPasswordLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordMessage({ type: "error", text: error.message })
    } else {
      setPasswordMessage({ type: "success", text: "Password updated" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
    setPasswordLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      {/* 2FA */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10 shrink-0">
              <Shield className="h-5 w-5 text-[#0F3D2E]" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                Two-factor authentication
              </p>
              <h3 className="mt-1 font-heading text-[15px] font-bold leading-tight">
                TOTP · authenticator app
              </h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
                Adds a second factor to your sign-in. We support any standard TOTP app
                (Authy, 1Password, Google Authenticator, …).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mfaEnrolled === true && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Enabled
              </span>
            )}
            {mfaEnrolled === false && (
              <span className="inline-flex items-center rounded-full bg-primary/10 ring-1 ring-primary/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-primary">
                Not set up
              </span>
            )}
            {config.twoFactorRequired && (
              <span className="inline-flex items-center rounded-full bg-red-50 ring-1 ring-red-200 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-red-700">
                Required on {config.label}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {mfaEnrolled === false && config.twoFactorRequired && (
            <div className="rounded-xl bg-primary/5 ring-1 ring-primary/30 p-3 flex gap-2 text-sm text-primary">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Your {config.label} plan requires 2FA. Set it up to keep dashboard access.
              </span>
            </div>
          )}

          {mfaEnrolled === null ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking 2FA status…
            </div>
          ) : mfaEnrolled ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/settings/security/2fa"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                Reconfigure
              </Link>
              {!config.twoFactorRequired && (
                <Button variant="outline" size="sm" onClick={disableMfa} disabled={disabling}>
                  {disabling && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Disable 2FA
                </Button>
              )}
            </div>
          ) : (
            <Link
              href={`/settings/security/2fa${config.twoFactorRequired ? "?required=true" : ""}`}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
            >
              <Shield className="h-4 w-4" />
              Enable 2FA
            </Link>
          )}
        </div>
      </section>

      {/* Password */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10 shrink-0">
            <KeyRound className="h-5 w-5 text-[#0F3D2E]" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
              Password
            </p>
            <h3 className="mt-1 font-heading text-[15px] font-bold leading-tight">
              Change password
            </h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
              Minimum 6 characters. Updates immediately — no re-confirmation email.
            </p>
          </div>
        </div>

        <form onSubmit={updatePassword} className="space-y-4">
          {passwordMessage && (
            <div
              className={`rounded-md p-3 text-sm ring-1 ${
                passwordMessage.type === "error"
                  ? "bg-red-50 text-red-700 ring-red-200"
                  : "bg-emerald-50 text-emerald-700 ring-emerald-200"
              }`}
            >
              {passwordMessage.text}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Not required if you signed in with Google.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </button>
        </form>
      </section>
    </div>
  )
}
