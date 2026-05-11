"use client"

/**
 * Trial counter chip — shown in every dashboard surface where the user
 * might think about a new deal (sidebar, dashboard hero, deal layout
 * header, dealroom topbar, billing). Single component so spacing, copy,
 * and color states stay consistent.
 *
 * Tone shifts by remaining decks:
 *   3 / 3 free   → neutral primary
 *   2 left       → neutral primary
 *   1 left       → amber tint
 *   atLimit      → red, opens paywall on click
 *
 * Click behavior:
 *   - atLimit → opens TrialPaywallDialog
 *   - otherwise → routes to /settings/billing
 *
 * Returns null when the user is NOT trialing — safe to drop into any layout.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { useTrialUsage } from "@/hooks/use-trial-usage"
import { TrialPaywallDialog } from "@/components/billing/trial-paywall-dialog"
import { cn } from "@/lib/utils"

type Size = "sm" | "md"

export function TrialChip({
  size = "md",
  className,
}: {
  size?: Size
  className?: string
}) {
  const { isTrialing, used, cap, remaining, atLimit, loading } = useTrialUsage()
  const router = useRouter()
  const [paywallOpen, setPaywallOpen] = useState(false)

  if (loading || !isTrialing) return null

  const label = atLimit
    ? "Trial cap reached"
    : remaining === 1
      ? "1 free deck left"
      : `${used} / ${cap} free decks`

  const tone = atLimit
    ? "bg-red-50 ring-red-200 text-red-800 hover:bg-red-100"
    : remaining === 1
      ? "bg-amber-50 ring-amber-200 text-amber-900 hover:bg-amber-100"
      : "bg-primary/5 ring-primary/25 text-[#0F3D2E] hover:bg-primary/10"

  const iconTone = atLimit
    ? "text-red-700"
    : remaining === 1
      ? "text-amber-700"
      : "text-primary"

  const sizing =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-[11px] gap-1.5"

  function handleClick() {
    if (atLimit) setPaywallOpen(true)
    else router.push("/settings/billing")
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center rounded-full ring-1 font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer",
          sizing,
          tone,
          className,
        )}
        title={atLimit ? "Trial cap reached — click to upgrade" : `${remaining} of ${cap} decks remaining`}
      >
        <Sparkles className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3", iconTone)} />
        {label}
      </button>

      <TrialPaywallDialog
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        used={used}
        cap={cap}
      />
    </>
  )
}
