"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import { useFundProfile } from "@/hooks/use-fund-profile"

/**
 * Shown when the user has no fund profile, or the profile is too sparse
 * for Fund Fit scoring to work (needs at least name + stage + sector).
 */
export function FundProfileBanner() {
  const { fund, loading } = useFundProfile()

  if (loading || !fund) {
    // No fund at all (brand-new user or skipped wizard)
    if (!loading && !fund) {
      return (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="pt-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Set up your fund profile
                </p>
                <p className="mt-0.5 text-xs text-amber-800">
                  Tell us your investment focus so Sam can match deals to your thesis.
                </p>
              </div>
            </div>
            <Link href="/setup" className={buttonVariants({ size: "sm", className: "bg-amber-600 hover:bg-amber-700 text-white shrink-0" })}>
              Continue setup
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  // Check completeness for Fund Fit: name + at least one stage + one sector
  const incomplete =
    !fund.name ||
    !fund.stageFocus?.length ||
    !fund.sectorFocus?.length

  if (!incomplete) return null

  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <CardContent className="pt-5 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Fund profile needs a few more details
            </p>
            <p className="mt-0.5 text-xs text-amber-800">
              Add your stage and sector focus to unlock Fund Fit scoring.
            </p>
          </div>
        </div>
        <Link href="/setup" className={buttonVariants({ size: "sm", variant: "outline", className: "border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0" })}>
          Complete setup
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
