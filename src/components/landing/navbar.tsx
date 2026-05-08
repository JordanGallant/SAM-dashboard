"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"

// Light-field navbar matching mockup4 aesthetic. Off-white when scrolled,
// transparent at the top, hairline border, tight Geist-style typography.
const RULE = "rgba(10,10,10,0.10)"
const LIME = "#C9E63B"
const INK = "#0A0A0A"

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-angels", label: "For angels" },
  { href: "/for-vc-funds", label: "For VC funds" },
  { href: "/sample", label: "Sample" },
  { href: "/#pricing", label: "Pricing" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 transition-all backdrop-blur"
      style={{
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        borderBottom: scrolled ? `1px solid ${RULE}` : "1px solid transparent",
        color: INK,
      }}
    >
      <div className="mx-auto max-w-[1240px] px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-[16px] tracking-tight">
          sam<span className="opacity-50">/</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13.5px]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-60 transition">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-[13.5px] hover:opacity-60 transition"
          >
            Sign in
          </Link>
          <Link
            href="/register?tier=professional"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-semibold transition hover:scale-[1.02]"
            style={{ background: INK, color: "#FFF" }}
          >
            Analyse a deck
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full"
            style={{ border: `1px solid ${RULE}` }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden backdrop-blur"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderTop: `1px solid ${RULE}`,
          }}
        >
          <div className="mx-auto max-w-[1240px] px-6 py-4 flex flex-col">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] py-2.5"
                style={{ borderBottom: `1px solid ${RULE}` }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-[14px] py-2.5 font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// Re-export the lime constant in case anyone imports it.
export const NAVBAR_LIME = LIME
