"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useFundProfile } from "@/hooks/use-fund-profile"

/**
 * Shown when the user has no fund profile, or the profile is too sparse
 * for Fund Fit scoring to work (needs at least name + stage + sector).
 */
export function FundProfileBanner() {
  const { fund, loading } = useFundProfile()

  if (loading) return null

  // No fund at all
  if (!fund) {
    return (
      <Banner
        title="Set up your fund profile"
        body="Tell us your investment focus so Sam can match deals to your thesis."
        cta="Continue setup"
      />
    )
  }

  // Check completeness for Fund Fit
  const incomplete = !fund.name || !fund.stageFocus?.length || !fund.sectorFocus?.length
  if (!incomplete) return null

  return (
    <Banner
      title="Fund profile needs a few more details"
      body="Add your stage and sector focus to unlock Fund Fit scoring."
      cta="Complete setup"
    />
  )
}

function Banner({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#1A6B47] p-5 md:p-6 text-white shadow-lg shadow-[#0F3D2E]/20">
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#D4FF6B]/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      </div>
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4FF6B]/15 ring-1 ring-[#D4FF6B]/30 shrink-0">
            <Sparkles className="h-4 w-4 text-[#D4FF6B]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-heading font-bold text-white">{title}</p>
            <p className="mt-0.5 text-xs text-white/65 leading-relaxed">{body}</p>
          </div>
        </div>
        <Link
          href="/setup"
          className="group inline-flex items-center gap-1.5 rounded-full bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#0A2E22] px-4 py-2 text-xs font-semibold shadow-md shadow-[#D4FF6B]/25 hover:shadow-lg transition-all shrink-0"
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
