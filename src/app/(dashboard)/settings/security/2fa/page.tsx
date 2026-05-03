"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, Shield, AlertTriangle, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
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

    const { data: factors } = await supabase.auth.mfa.listFactors()
    const verified = factors?.totp?.find((f) => f.status === "verified")
    if (verified) {
      setStep("done")
      return
    }

    const stale = (factors?.all ?? []).filter(
      (f) => f.factor_type === "totp" && f.status !== "verified",
    )
    for (const f of stale) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Sam · ${Date.now()}`,
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
    <div className="mx-auto max-w-2xl space-y-7">
      <div>
        <Link
          href="/settings/security"
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Security
        </Link>
        <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
          Set up
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-[-0.01em] text-[#0A2E22]">
          Two-factor authentication
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
          Scan the QR code with an authenticator app, then enter the 6-digit code to enable.
        </p>
      </div>

      {required && step !== "done" && (
        <div className="rounded-2xl ring-1 ring-primary/30 bg-primary/5 p-5 flex gap-3">
          <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-heading font-bold text-primary">
              2FA required for your plan
            </p>
            <p className="mt-1 text-[12.5px] text-primary/85 leading-relaxed">
              Fund tier accounts must have 2FA enabled to access the dashboard. Complete
              setup below to continue.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "loading" && (
        <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6 flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing your 2FA code…
        </section>
      )}

      {step === "enroll" && enrollment && (
        <>
          {/* Step 1 — install app */}
          <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <SectionLabel className="mb-3">Step 1 · Install an authenticator app</SectionLabel>
            <p className="text-sm text-muted-foreground max-w-md">
              If you don&apos;t already have one, install Google Authenticator. Authy and
              1Password also work.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://apps.apple.com/app/google-authenticator/id388497605"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl ring-1 ring-foreground/10 hover:ring-foreground/25 hover:bg-muted/40 px-4 py-3 text-sm transition-colors"
              >
                <span className="font-medium">Google Authenticator · iOS</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl ring-1 ring-foreground/10 hover:ring-foreground/25 hover:bg-muted/40 px-4 py-3 text-sm transition-colors"
              >
                <span className="font-medium">Google Authenticator · Android</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </section>

          {/* Step 2 — scan / paste */}
          <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <SectionLabel className="mb-3">Step 2 · Scan the QR code</SectionLabel>
            <p className="text-sm text-muted-foreground max-w-md">
              In your authenticator app, tap <span className="font-semibold">+</span> →{" "}
              <span className="font-semibold">Scan a QR code</span>, then point at the image
              below.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="rounded-xl bg-white ring-1 ring-foreground/15 p-3 shrink-0">
                <Image
                  src={enrollment.qrCode}
                  alt="2FA QR code"
                  width={180}
                  height={180}
                  unoptimized
                />
              </div>
              <div className="flex-1 w-full">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Or enter this secret manually
                </p>
                <div className="rounded-xl bg-muted/40 ring-1 ring-foreground/10 px-3 py-3 font-mono text-xs break-all select-all">
                  {enrollment.secret}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                  In the app, tap <span className="font-semibold">+</span> →{" "}
                  <span className="font-semibold">Enter a setup key</span> and paste this.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3 — verify */}
          <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <SectionLabel className="mb-3">Step 3 · Enter the 6-digit code</SectionLabel>
            <form onSubmit={verifyCode} className="mt-3 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-sm">
                  Type the code currently shown in your authenticator app
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
                Verify and enable 2FA
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </section>
        </>
      )}

      {step === "done" && (
        <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-9 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#0A2E22]">
            Two-factor authentication active
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            From now on, you&apos;ll need your authenticator app to sign in.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Link
              href="/settings/security"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-foreground/15 hover:ring-foreground/30 hover:bg-foreground/5 px-4 py-2 text-[13px] font-medium transition-colors"
            >
              Back to Security
            </Link>
            <button
              onClick={() => {
                router.push("/deals")
                router.refresh()
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
            >
              Go to dashboard
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        </section>
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
