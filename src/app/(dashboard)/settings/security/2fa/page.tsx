"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, Shield, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SectionLabel } from "@/components/dashboard/section-label"

interface EnrollState {
  factorId: string
  qrCode: string
  secret: string
}

function TwoFactorSetup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const required = searchParams.get("required") === "true"

  const [step, setStep] = useState<"loading" | "enroll" | "verify" | "done">("loading")
  const [enrollment, setEnrollment] = useState<EnrollState | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    startEnrollment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startEnrollment() {
    const supabase = createClient()

    // Check if user already has a verified factor
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const verified = factors?.totp?.find((f) => f.status === "verified")
    if (verified) {
      setStep("done")
      return
    }

    // Remove any non-verified (pending) factors from previous attempts
    const pending = factors?.totp?.filter((f) => f.status !== "verified") ?? []
    for (const f of pending) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }

    // Enroll a fresh TOTP factor
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Sam · ${new Date().toISOString().slice(0, 10)}`,
    })

    if (error || !data) {
      setError(error?.message || "Failed to start 2FA enrollment")
      return
    }

    setEnrollment({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    })
    setStep("enroll")
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (!enrollment) return
    setVerifying(true)
    setError("")

    const supabase = createClient()
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
      factorId: enrollment.factorId,
    })

    if (challengeErr || !challenge) {
      setError(challengeErr?.message || "Failed to create challenge")
      setVerifying(false)
      return
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId: enrollment.factorId,
      challengeId: challenge.id,
      code,
    })

    if (verifyErr) {
      setError(verifyErr.message)
      setVerifying(false)
      return
    }

    setStep("done")
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <SectionLabel>Security</SectionLabel>
        <h1 className="mt-1 text-xl font-bold font-heading">Set up two-factor authentication</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use an authenticator app — Google Authenticator, Authy, or 1Password — to generate a 6-digit code on every sign-in.
        </p>
      </div>

      {required && step !== "done" && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="pt-5 flex gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">2FA is required for your plan</p>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                Fund tier accounts must have 2FA enabled to access the dashboard. Complete setup below to continue.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {step === "loading" && (
        <Card>
          <CardContent className="pt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Preparing your 2FA code...
          </CardContent>
        </Card>
      )}

      {step === "enroll" && enrollment && (
        <Card>
          <CardHeader>
            <SectionLabel>Step 1 · Install an authenticator app</SectionLabel>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you don&apos;t already have one, install Google Authenticator on your phone. Authy and 1Password also work.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://apps.apple.com/app/google-authenticator/id388497605"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">Google Authenticator · iOS</span>
                <span className="text-[11px] font-mono text-muted-foreground">App Store ↗</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">Google Authenticator · Android</span>
                <span className="text-[11px] font-mono text-muted-foreground">Play Store ↗</span>
              </a>
            </div>

            <hr />

            <SectionLabel>Step 2 · Scan this QR code</SectionLabel>
            <p className="text-sm text-muted-foreground">
              In Google Authenticator, tap <span className="font-medium">+</span> → <span className="font-medium">Scan a QR code</span>, then point your camera at the image below.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="bg-white p-3 rounded-lg border">
                <Image src={enrollment.qrCode} alt="2FA QR code" width={180} height={180} unoptimized />
              </div>
              <div className="flex-1 w-full">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Or enter this secret manually</p>
                <div className="rounded-md bg-muted/50 border p-3 font-mono text-xs break-all select-all">
                  {enrollment.secret}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  In the app, tap <span className="font-medium">+</span> → <span className="font-medium">Enter a setup key</span> and paste this.
                </p>
              </div>
            </div>

            <hr />
            <div>
              <SectionLabel>Step 3 · Enter the 6-digit code</SectionLabel>
              <form onSubmit={verifyCode} className="mt-3 space-y-3">
                <Label htmlFor="code" className="text-sm">Type the code currently shown in your authenticator app</Label>
                <Input
                  id="code"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl font-mono tracking-widest"
                  autoComplete="one-time-code"
                  autoFocus
                />
                <Button type="submit" disabled={code.length !== 6 || verifying} className="w-full">
                  {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify and enable 2FA
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "done" && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center py-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="font-heading font-semibold">Two-factor authentication active</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              From now on, you&apos;ll need your authenticator app to sign in.
            </p>
            <div className="mt-6 flex gap-2">
              <Link href="/settings/security" className={buttonVariants({ variant: "outline" })}>
                Back to Security
              </Link>
              <Button onClick={() => { router.push("/deals"); router.refresh() }}>
                Go to dashboard
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function TwoFactorSetupPage() {
  return (
    <Suspense>
      <TwoFactorSetup />
    </Suspense>
  )
}
