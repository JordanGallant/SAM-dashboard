import Link from "next/link"
import { Shield, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Setup2FAPage() {
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
        <Shield className="h-5 w-5" />
      </div>
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
        Two-factor authentication
      </p>
      <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0A2E22]">
        Set up your authenticator
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Scan the QR code with Google Authenticator, 1Password, or Authy.
      </p>

      <div className="mt-7 mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-foreground/[0.04] ring-1 ring-foreground/10 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        QR code placeholder
      </div>

      <div className="mt-6 space-y-1.5">
        <Label htmlFor="code" className="text-sm">Enter 6-digit code</Label>
        <Input
          id="code"
          placeholder="000000"
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="text-center text-2xl font-mono tabular-nums tracking-[0.4em]"
        />
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href="/deals"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full ring-1 ring-foreground/15 hover:ring-foreground/30 hover:bg-foreground/5 px-4 py-2.5 text-[13px] font-medium transition-colors"
        >
          Skip for now
        </Link>
        <Link
          href="/deals"
          className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-4 py-2.5 text-[13px] font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          Verify &amp; enable
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
