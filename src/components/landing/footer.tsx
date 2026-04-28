import Link from "next/link"
import { BarChart3, Shield, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#060F0B] via-[#0A2E22] to-[#0F3D2E] text-white/80">
      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[60rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#00A86B]/15 blur-3xl pointer-events-none" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#0F8F5A] shadow-lg shadow-primary/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">Sam</span>
            </div>
            <p className="mt-4 text-sm text-white/60 max-w-sm leading-relaxed">
              Sam helps investors decide.
              <br />
              Built in Europe, for European investors.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-[#7FD9AA]" />
                GDPR by design
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-[#7FD9AA]" />
                EU-hosted
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#7FD9AA] mb-4">Product</p>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/for-angels" className="hover:text-white transition-colors">For angels</Link></li>
              <li><Link href="/for-vc-funds" className="hover:text-white transition-colors">For VC funds</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#7FD9AA] mb-4">Trust</p>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-white transition-colors">GDPR &amp; privacy</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-xs font-mono uppercase tracking-widest text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Sam · All rights reserved</p>
          <p>Built in Europe · Hosted in Europe</p>
        </div>
      </div>
    </footer>
  )
}
