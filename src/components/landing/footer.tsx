import Link from "next/link"
import { Shield, MapPin } from "lucide-react"

const RULE = "rgba(255,255,255,0.08)"
const LIME = "#C9E63B"
const INK = "#0A0A0A"

export function Footer() {
  return (
    <footer style={{ background: INK, color: "#FFF" }}>
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-[20px] tracking-tight">
              sam<span className="opacity-50">/</span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-[1.6] text-white/60">
              From deck to decision.<br />
              Built in Europe, for European investors.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3 w-3" style={{ color: LIME }} />
                GDPR by design
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" style={{ color: LIME }} />
                EU-hosted
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: LIME }}>
              Product
            </p>
            <ul className="space-y-3 text-[13.5px] text-white/65">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/sample" className="hover:text-white transition-colors">Sample assessment</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/for-angels" className="hover:text-white transition-colors">For angels</Link></li>
              <li><Link href="/for-vc-funds" className="hover:text-white transition-colors">For VC funds</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: LIME }}>
              Trust
            </p>
            <ul className="space-y-3 text-[13.5px] text-white/65">
              <li><Link href="/privacy" className="hover:text-white transition-colors">GDPR &amp; privacy</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Log in</Link></li>
              <li><Link href="/register?tier=professional" className="hover:text-white transition-colors">Analyse a deck</Link></li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 pt-6 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/45 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: `1px solid ${RULE}` }}
        >
          <p>&copy; {new Date().getFullYear()} Sam · All rights reserved</p>
          <p>Built in Europe · Hosted in Europe</p>
        </div>
      </div>
    </footer>
  )
}
