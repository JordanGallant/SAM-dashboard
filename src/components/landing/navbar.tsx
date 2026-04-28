"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, Menu, X } from "lucide-react"

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-angels", label: "Angels" },
  { href: "/for-vc-funds", label: "VC Funds" },
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
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 bg-[#050B15]/85 backdrop-blur-xl border-b ${
        scrolled ? "border-white/10 shadow-lg shadow-black/20" : "border-white/5"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] shadow-md shadow-primary/20 ring-1 ring-[#D4FF6B]/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
            <BarChart3 className="h-4 w-4 text-[#D4FF6B]" />
          </div>
          <span className="text-lg font-bold font-heading tracking-tight text-white">
            Sam
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-white/80 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center text-[13px] font-semibold text-white/70 hover:text-white px-3 py-2 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register?tier=professional"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#050B15] px-4 py-2 text-[13px] font-semibold shadow-md shadow-[#D4FF6B]/20 hover:shadow-lg hover:shadow-[#D4FF6B]/30 transition-all"
          >
            Analyse a deck
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#050B15]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/70 hover:text-white py-2.5 border-b border-white/5 last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-sm font-semibold text-white/80 hover:text-white py-2.5"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
