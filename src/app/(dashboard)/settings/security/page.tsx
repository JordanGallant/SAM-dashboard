"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Loader2, ShieldCheck, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useTier } from "@/lib/tier-context"
import { SectionLabel } from "@/components/dashboard/section-label"

export default function SecurityPage() {
  const { tier, config } = useTier()
  const [mfaEnrolled, setMfaEnrolled] = useState<boolean | null>(null)
  const [disabling, setDisabling] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

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
    <div className="max-w-2xl space-y-6">
      {/* 2FA */}
      <Card>
        <CardHeader>
          <SectionLabel>Two-factor authentication</SectionLabel>
          <div className="mt-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">TOTP · authenticator app</span>
            {mfaEnrolled === true && (
              <Badge className="bg-emerald-100 text-emerald-700 border-0">Enabled</Badge>
            )}
            {mfaEnrolled === false && (
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Not set up</Badge>
            )}
            {config.twoFactorRequired && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-mono text-[10px]">
                Required on {config.label}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mfaEnrolled === false && config.twoFactorRequired && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex gap-2 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Your {config.label} plan requires 2FA. Set it up to keep dashboard access.</span>
            </div>
          )}

          {mfaEnrolled === null ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking 2FA status...
            </div>
          ) : mfaEnrolled ? (
            <div className="flex flex-wrap gap-2">
              <Link href="/settings/security/2fa" className={buttonVariants({ variant: "outline", size: "sm" })}>
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
              className={buttonVariants({ size: "sm" })}
            >
              <Shield className="mr-2 h-3.5 w-3.5" />
              Enable 2FA
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <SectionLabel>Password</SectionLabel>
        </CardHeader>
        <CardContent>
          <form onSubmit={updatePassword} className="space-y-4">
            {passwordMessage && (
              <div className={`rounded-md p-3 text-sm ${passwordMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {passwordMessage.text}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">Not required if you signed in with Google.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
