"use client"

/**
 * Trial paywall — shown when a coupon-trial user hits the deal cap.
 *
 * Single-decision UI: one big "Continue with Pro" CTA + email-us fallback.
 * No tier picker (they're already on Pro features for the past 3 decks —
 * Pro is the natural continuation). No "Maybe later" button — that's what
 * the dialog's outside-click / ESC are for.
 */

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Mail, Loader2, Sparkles } from "lucide-react"

export function TrialPaywallDialog({
  open,
  onClose,
  used,
  cap,
}: {
  open: boolean
  onClose: () => void
  used: number
  cap: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "professional" }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Couldn't start checkout. Try again or contact us.")
        return
      }
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-start gap-3">
          <div className="grid place-items-center h-10 w-10 rounded-xl shrink-0 ring-1 bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-[#0F3D2E]/10 text-[#0F3D2E]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
              Trial cap reached
            </p>
            <h2 className="mt-1 font-heading text-[17px] font-bold tracking-[-0.01em] text-[#0F3D2E]">
              {used} of {cap} free decks used.
            </h2>
          </div>
        </div>

        <p className="text-[13.5px] text-muted-foreground leading-relaxed">
          You&apos;ve seen what SAM can do across {cap} decks. Add a payment
          method to keep going — same Pro features, 30 decks per month.
        </p>

        <div className="rounded-xl ring-1 ring-foreground/10 bg-muted/30 px-4 py-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Continue with
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <p className="font-heading text-[20px] font-bold tracking-[-0.01em] text-[#0F3D2E]">
              Professional
            </p>
            <p className="font-mono text-[13px] text-muted-foreground tabular-nums">
              €299 / month
            </p>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            30 decks, Ask SAM, exports, fund-fit calibration.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-[1fr_auto] pt-1">
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 px-5 py-2.5 text-[13px] font-semibold transition disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Continue with Pro
          </button>
          <a
            href="mailto:mark@green-whale.nl?subject=SAM%20Trial%20-%20questions%20before%20I%20upgrade"
            className="inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-foreground/15 hover:ring-foreground/30 hover:bg-foreground/5 px-4 py-2.5 text-[13px] font-semibold transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Email us
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
