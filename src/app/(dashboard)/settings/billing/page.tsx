"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ExternalLink, Loader2, Check, X, AlertTriangle, Sparkles, CreditCard } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"
import { createClient } from "@/lib/supabase/client"
import { SectionLabel } from "@/components/dashboard/section-label"
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
  const [subStatus, setSubStatus] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .maybeSingle()
      setSubStatus(data?.subscription_status ?? "inactive")
    })
  }, [])

  async function handleSubscribe(targetTier: Tier) {
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

  async function handleManage() {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
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
                  EUR {config.price} / month
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
              ["Memos / mo", config.dealsPerMonth === -1 ? "Unlimited" : String(config.dealsPerMonth)],
              ["Docs / deal", config.docsPerDeal === -1 ? "Unlimited" : String(config.docsPerDeal)],
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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {isActive && (
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
                  <span className="font-mono text-[12px] text-muted-foreground">EUR</span>
                  <span className="font-heading font-bold text-2xl tabular-nums">{tc.price}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>

                <ul className="mt-4 space-y-1.5 text-[12.5px] flex-1">
                  <FeatureRow
                    on={true}
                    label={`${tc.dealsPerMonth === -1 ? "Unlimited" : tc.dealsPerMonth} memos / month`}
                  />
                  <FeatureRow on={true} label={`${tc.users} user${tc.users > 1 ? "s" : ""}`} />
                  <FeatureRow on={tc.wordExport} label="Word export" />
                  <FeatureRow on={tc.fundFit} label="Fund Fit scoring" />
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
                    {isInactive || isExpiredTrial
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
    </div>
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
