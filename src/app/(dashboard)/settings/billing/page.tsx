"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ExternalLink, Loader2, Check, X, AlertTriangle, Sparkles, CreditCard, ArrowRight, ArrowDown, ArrowUp } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"
import { createClient } from "@/lib/supabase/client"
import { SectionLabel } from "@/components/dashboard/section-label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const TIER_ORDER: Tier[] = ["starter", "professional", "fund"]

function BillingContent() {
  const searchParams = useSearchParams()
  const showExpired = searchParams.get("expired") === "true"
  const showSubscribe = searchParams.get("subscribe") === "true"
  const showCanceled = searchParams.get("canceled") === "true"

  const { tier, config, isTrialing, trialDaysLeft } = useTier()
  const [loading, setLoading] = useState<Tier | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<string | null>(null)
  // Whether we have a Stripe customer ID at all. A profile can be marked
  // active without one (legacy migrations, manual flips, 100% coupon paths
  // that never round-tripped the webhook) — when that happens, we have to
  // route through fresh Checkout instead of Switch / Portal because Stripe
  // has no customer to operate on.
  const [hasStripeCustomer, setHasStripeCustomer] = useState<boolean | null>(null)
  // Pilot #18: usage count vs cap so users know when they're approaching the
  // tier limit. Counted as analyses started this calendar month.
  const [memosUsed, setMemosUsed] = useState<number | null>(null)

  // In-page confirmation modal for upgrades/downgrades. Replaces the
  // browser-native window.confirm() / alert() pair which (a) looks unprofessional,
  // (b) gives no proration context, (c) renders the page unable to display
  // failures inline.
  const [switchDialog, setSwitchDialog] = useState<Tier | null>(null)
  const [switchError, setSwitchError] = useState<string | null>(null)
  const [switchSubmitting, setSwitchSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const [{ data }, { count }] = await Promise.all([
        supabase
          .from("profiles")
          .select("subscription_status, stripe_customer_id")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("analyses")
          .select("id, deals!inner(user_id)", { count: "exact", head: true })
          .eq("deals.user_id", user.id)
          .gte("created_at", startOfMonth.toISOString()),
      ])
      setSubStatus(data?.subscription_status ?? "inactive")
      setHasStripeCustomer(Boolean(data?.stripe_customer_id))
      setMemosUsed(count ?? 0)
    })
  }, [])

  const memoCap = config.dealsPerMonth // -1 = unlimited
  const memoPct = memoCap === -1 || memoCap === 0 || memosUsed === null
    ? 0
    : Math.min(100, Math.round((memosUsed / memoCap) * 100))
  const memoNearLimit = memoCap > 0 && memoPct >= 80
  const memoAtLimit = memoCap > 0 && memosUsed !== null && memosUsed >= memoCap

  async function handleSubscribe(targetTier: Tier) {
    // Switch path requires both a live sub AND an actual Stripe customer to
    // operate on. "Live" means active OR trialing — the switch endpoint
    // already accepts both (filters status === active|trialing|past_due).
    // If either piece is missing (legacy state, manual flip, coupon path that
    // never linked a customer), fall through to fresh Checkout — otherwise
    // /api/stripe/switch errors with "No active subscription" and the user
    // is stuck. Without the trial branch here, brand-new trialing users
    // clicking Upgrade/Downgrade would silently start a second checkout.
    const hasLiveSub = subStatus === "active" || subStatus === "trial"
    if (hasLiveSub && hasStripeCustomer) {
      setSwitchError(null)
      setSwitchDialog(targetTier)
      return
    }

    setLoading(targetTier)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: targetTier }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  async function confirmSwitch() {
    if (!switchDialog) return
    setSwitchSubmitting(true)
    setSwitchError(null)
    try {
      // Fund tier requires a sales conversation — surface that inline instead
      // of crashing with a 400.
      if (switchDialog === "fund") {
        setSwitchError("Fund tier requires a walkthrough — book one via 'Manage subscription' or contact us.")
        return
      }
      const res = await fetch("/api/stripe/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: switchDialog }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSwitchError(data.error ?? "Couldn't switch plan. Please try again or use 'Manage subscription'.")
        return
      }
      // Reload so TierProvider, sidebar, and tier-gated UI pick up the new tier.
      window.location.reload()
    } catch (err) {
      setSwitchError(err instanceof Error ? err.message : "Network error — please retry.")
    } finally {
      setSwitchSubmitting(false)
    }
  }

  async function handleManage() {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      // Portal needs a Stripe customer to attach to. If we don't have one yet
      // (legacy/manual/coupon-without-webhook), surface a clear inline error
      // rather than the previous silent no-op.
      setPortalError(
        data.error === "No subscription found"
          ? "We can't open the Stripe portal because your account isn't linked to a Stripe customer yet. Pick a plan below to subscribe — that will create the link."
          : data.error ?? "Couldn't open the Stripe portal. Try again or use the plan picker below.",
      )
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Network error — try again.")
    } finally {
      setPortalLoading(false)
    }
  }

  const isActive = subStatus === "active"
  const isInactive = subStatus === "inactive" || !subStatus
  const isExpiredTrial = subStatus === "trial" && !isTrialing

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      {/* Status banners */}
      {showExpired && (
        <div className="rounded-xl bg-primary/5 ring-1 ring-primary/30 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-primary text-sm">Your trial has ended</p>
            <p className="text-[13px] text-primary/85 mt-0.5">
              Subscribe to a plan below to continue using SAM.
            </p>
          </div>
        </div>
      )}

      {/* Trial countdown banner. Visible whenever the user is in their 14-day
          trial. Tightens to amber under 3 days remaining so the urgency is
          obvious. Hidden once the user is on a paid sub or after the trial
          has expired (the showExpired banner above takes over for that case). */}
      {isTrialing && (
        <div
          className={
            trialDaysLeft <= 3
              ? "rounded-xl bg-amber-50 ring-1 ring-amber-300 p-4 flex gap-3"
              : "rounded-xl bg-primary/5 ring-1 ring-primary/30 p-4 flex gap-3"
          }
        >
          <Sparkles
            className={
              trialDaysLeft <= 3
                ? "h-5 w-5 text-amber-700 shrink-0 mt-0.5"
                : "h-5 w-5 text-primary shrink-0 mt-0.5"
            }
          />
          <div>
            <p
              className={
                trialDaysLeft <= 3
                  ? "font-heading font-bold text-amber-900 text-sm"
                  : "font-heading font-bold text-primary text-sm"
              }
            >
              {trialDaysLeft === 0
                ? "Your trial ends today"
                : trialDaysLeft === 1
                  ? "Your trial ends tomorrow"
                  : `${trialDaysLeft} days left in your trial`}
            </p>
            <p
              className={
                trialDaysLeft <= 3
                  ? "text-[13px] text-amber-800/90 mt-0.5"
                  : "text-[13px] text-primary/85 mt-0.5"
              }
            >
              {hasStripeCustomer
                ? "Add a payment method via 'Manage subscription' before the trial ends to keep your access."
                : "Add a payment method before the trial ends to keep your access — otherwise your subscription will be cancelled automatically."}
            </p>
          </div>
        </div>
      )}

      {showSubscribe && isInactive && (
        <div className="rounded-xl bg-blue-50 ring-1 ring-blue-200 p-4 flex gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-blue-900 text-sm">Subscription required</p>
            <p className="text-[13px] text-blue-800/90 mt-0.5">
              Pick a plan below to get access. You can apply a coupon at checkout.
            </p>
          </div>
        </div>
      )}

      {showCanceled && (
        <div className="rounded-xl bg-muted/40 ring-1 ring-foreground/10 px-4 py-3">
          <p className="text-sm text-muted-foreground">Checkout canceled — try again any time.</p>
        </div>
      )}

      {/* Current plan */}
      {!isInactive && (
        <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10 shrink-0">
              <CreditCard className="h-5 w-5 text-[#0F3D2E]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                Current plan
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <h3 className="font-heading text-[18px] font-bold tracking-[-0.01em] text-[#0A2E22]">
                  {config.label}
                </h3>
                <p className="font-mono text-[13px] text-muted-foreground tabular-nums">
                  {config.price === 0 ? "Custom pricing" : `EUR ${config.price} / month`}
                </p>
                {isTrialing && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 ring-1 ring-primary/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-primary">
                    Trial · {trialDaysLeft} {trialDaysLeft === 1 ? "day" : "days"} left
                  </span>
                )}
                {isActive && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-700">
                    Active
                  </span>
                )}
                {isExpiredTrial && (
                  <span className="inline-flex items-center rounded-full bg-red-50 ring-1 ring-red-200 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-red-700">
                    Expired
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-foreground/10 rounded-xl overflow-hidden ring-1 ring-foreground/10">
            {[
              ["Analyses / mo", config.dealsPerMonth === -1 ? "Custom" : String(config.dealsPerMonth)],
              ["Docs / deal", config.docsPerDeal === -1 ? "Custom" : String(config.docsPerDeal)],
              ["Word export", config.wordExport ? "Yes" : "No"],
              ["Fund Fit", config.fundFit ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label as string} className="bg-card p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1.5 font-heading font-bold text-[15px] text-[#0A2E22]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Pilot #18: monthly memo usage meter. Hides for unlimited tiers. */}
          {memoCap !== -1 && memosUsed !== null && (
            <div className="mt-5">
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                  Memos this month
                </p>
                <p className="font-mono tabular-nums text-[13px] font-semibold">
                  {memosUsed} / {memoCap}
                </p>
              </div>
              <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500",
                    memoAtLimit
                      ? "bg-red-500"
                      : memoNearLimit
                      ? "bg-amber-500"
                      : "bg-gradient-to-r from-[#0F3D2E] to-[#00A86B]",
                  )}
                  style={{ width: `${memoPct}%` }}
                />
              </div>
              {memoNearLimit && !memoAtLimit && (
                <p className="mt-2 text-[12px] text-amber-700 font-medium">
                  You&apos;ve used {memoPct}% of this month&apos;s memos — consider upgrading to avoid hitting the cap.
                </p>
              )}
              {memoAtLimit && (
                <p className="mt-2 text-[12px] text-red-700 font-medium">
                  Cap reached for this month. Upgrade below or wait until next billing cycle to analyse new decks.
                </p>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {isActive && hasStripeCustomer && (
              <button
                onClick={handleManage}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 rounded-full ring-1 ring-foreground/15 hover:ring-foreground/30 hover:bg-foreground/5 px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60"
              >
                {portalLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" />
                )}
                Manage subscription (Stripe)
              </button>
            )}
            {isTrialing && (
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={loading !== null}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {loading === tier && <Loader2 className="h-4 w-4 animate-spin" />}
                Add payment method — keep my plan
              </button>
            )}
          </div>

          {portalError && (
            <div className="mt-4 rounded-md bg-amber-50 ring-1 ring-amber-200 p-3 text-[13px] text-amber-800">
              {portalError}
            </div>
          )}
        </section>
      )}

      {/* Plan picker */}
      <div>
        <SectionLabel className="mb-4">
          {isInactive || isExpiredTrial ? "Choose a plan" : "Switch plan"}
        </SectionLabel>
        <div className="grid gap-4 md:grid-cols-3">
          {TIER_ORDER.map((t) => {
            const tc = TIER_CONFIG[t]
            const isCurrent = t === tier && !isInactive && !isExpiredTrial
            return (
              <div
                key={t}
                className={cn(
                  "rounded-2xl ring-1 p-5 flex flex-col bg-card transition-shadow hover:shadow-sm",
                  isCurrent ? "ring-primary/40 bg-primary/[0.03]" : "ring-foreground/10"
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-heading font-bold text-[16px] text-[#0A2E22]">
                    {tc.label}
                  </h3>
                  {isCurrent && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 ring-1 ring-primary/30 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-primary">
                      Current
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  {tc.price === 0 ? (
                    <span className="font-heading font-bold text-2xl">Custom</span>
                  ) : (
                    <>
                      <span className="font-mono text-[12px] text-muted-foreground">EUR</span>
                      <span className="font-heading font-bold text-2xl tabular-nums">{tc.price}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </>
                  )}
                </div>

                <ul className="mt-4 space-y-1.5 text-[12.5px] flex-1">
                  <FeatureRow
                    on={true}
                    label={`${tc.dealsPerMonth === -1 ? "Custom volume" : tc.dealsPerMonth} pitch deck analyses / month`}
                  />
                  <FeatureRow
                    on={true}
                    label={`${tc.users === -1 ? "Custom" : tc.users} ${tc.users === 1 ? "seat" : "seats"}`}
                  />
                  <FeatureRow on={tc.wordExport} label="Word export" />
                  <FeatureRow on={tc.fundFit} label="Full fund-fit scoring" />
                  <FeatureRow on={tc.priorityProcessing} label="Priority processing" />
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-foreground/15 bg-muted/40 text-muted-foreground px-4 py-2 text-[13px] font-medium cursor-default"
                  >
                    Current plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(t)}
                    disabled={loading !== null}
                    className="mt-5 group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-4 py-2 text-[13px] font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading === t && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isInactive || isExpiredTrial || !hasStripeCustomer
                      ? "Subscribe"
                      : TIER_ORDER.indexOf(t) > TIER_ORDER.indexOf(tier)
                      ? "Upgrade"
                      : "Downgrade"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Switch confirmation dialog. Replaces window.confirm() so users see
          tier-diff context (current -> new, prorated billing note) instead of
          a stark browser modal, and so failures render inline rather than
          via window.alert. */}
      <SwitchDialog
        targetTier={switchDialog}
        currentTier={tier}
        submitting={switchSubmitting}
        error={switchError}
        onCancel={() => {
          if (!switchSubmitting) {
            setSwitchDialog(null)
            setSwitchError(null)
          }
        }}
        onConfirm={confirmSwitch}
      />
    </div>
  )
}

function SwitchDialog({
  targetTier,
  currentTier,
  submitting,
  error,
  onCancel,
  onConfirm,
}: {
  targetTier: Tier | null
  currentTier: Tier
  submitting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  const open = targetTier !== null
  const isUpgrade = targetTier
    ? TIER_ORDER.indexOf(targetTier) > TIER_ORDER.indexOf(currentTier)
    : false
  const direction = isUpgrade ? "Upgrade" : "Downgrade"
  const tc = targetTier ? TIER_CONFIG[targetTier] : null
  const cc = TIER_CONFIG[currentTier]
  const DirectionIcon = isUpgrade ? ArrowUp : ArrowDown

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <DialogContent className="sm:max-w-md">
        {tc && (
          <>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "grid place-items-center h-10 w-10 rounded-xl shrink-0 ring-1",
                  isUpgrade
                    ? "bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-[#0F3D2E]/10 text-[#0F3D2E]"
                    : "bg-amber-50 ring-amber-200 text-amber-700",
                )}
              >
                <DirectionIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                  {direction}
                </p>
                <h2 className="mt-1 font-heading text-[17px] font-bold tracking-[-0.01em] text-[#0A2E22]">
                  {direction} to {tc.label}?
                </h2>
              </div>
            </div>

            <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden text-sm">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 bg-muted/30">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    From
                  </p>
                  <p className="mt-0.5 font-heading font-bold text-[15px] truncate">{cc.label}</p>
                  <p className="text-[12px] text-muted-foreground tabular-nums">
                    {cc.price === 0 ? "Custom" : `EUR ${cc.price} / mo`}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 text-right">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    To
                  </p>
                  <p className="mt-0.5 font-heading font-bold text-[15px] truncate text-[#0A2E22]">
                    {tc.label}
                  </p>
                  <p className="text-[12px] text-muted-foreground tabular-nums">
                    {tc.price === 0 ? "Custom" : `EUR ${tc.price} / mo`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-foreground/10 ring-t ring-foreground/10">
                {[
                  ["Analyses / mo", cc.dealsPerMonth, tc.dealsPerMonth],
                  ["Seats", cc.users, tc.users],
                ].map(([label, from, to]) => (
                  <div key={label as string} className="bg-card px-4 py-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 font-mono text-[13px] tabular-nums">
                      {from === -1 ? "Custom" : from} <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" />
                      <span className="font-bold">{to === -1 ? "Custom" : to}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              {isUpgrade
                ? "Stripe will charge a prorated amount today for the rest of this billing period and bill the new monthly rate from your next invoice onwards."
                : "Stripe will apply a prorated credit to your account for the unused portion of this billing period; the new lower rate kicks in on your next invoice."}
            </p>

            {error && (
              <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="inline-flex items-center rounded-full ring-1 ring-foreground/15 hover:ring-foreground/30 hover:bg-foreground/5 px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2 text-[13px] font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm {direction.toLowerCase()}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function FeatureRow({ on, label }: { on: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2">
      {on ? (
        <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-2.5 w-2.5 text-emerald-700 stroke-[3]" />
        </span>
      ) : (
        <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-muted">
          <X className="h-2.5 w-2.5 text-muted-foreground/45 stroke-[2.5]" />
        </span>
      )}
      <span className={on ? "text-foreground" : "text-muted-foreground/60"}>{label}</span>
    </li>
  )
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  )
}
