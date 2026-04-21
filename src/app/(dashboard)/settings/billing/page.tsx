"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2, Check, X, AlertTriangle, Sparkles } from "lucide-react"
import { useTier } from "@/lib/tier-context"
import { TIER_CONFIG } from "@/lib/tier-config"
import type { Tier } from "@/lib/types/user"
import { createClient } from "@/lib/supabase/client"

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
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-bold">Billing & Subscription</h1>

      {showExpired && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Your trial has ended</p>
            <p className="text-sm text-amber-800 mt-0.5">
              Subscribe to a plan below to continue using SAM.
            </p>
          </div>
        </div>
      )}

      {showSubscribe && isInactive && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-4 flex gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Subscription required</p>
            <p className="text-sm text-blue-800 mt-0.5">
              Pick a plan below to get access. Have a promo code? Contact support to apply it.
            </p>
          </div>
        </div>
      )}

      {showCanceled && (
        <div className="rounded-md bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-700">Checkout canceled — you can try again anytime.</p>
        </div>
      )}

      {/* Current plan */}
      {!isInactive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              Current Plan
              <Badge className="bg-primary/10 text-primary border-0">{config.label}</Badge>
              {isTrialing && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Trial: {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left
                </Badge>
              )}
              {isActive && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Active
                </Badge>
              )}
              {isExpiredTrial && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Expired
                </Badge>
              )}
            </CardTitle>
            <CardDescription>EUR {config.price}/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Deals / month</p>
                <p className="font-medium">{config.dealsPerMonth === -1 ? "Unlimited" : config.dealsPerMonth}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Docs / deal</p>
                <p className="font-medium">{config.docsPerDeal === -1 ? "Unlimited" : config.docsPerDeal}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Word export</p>
                <p className="font-medium">{config.wordExport ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fund Fit scoring</p>
                <p className="font-medium">{config.fundFit ? "Yes" : "No"}</p>
              </div>
            </div>
            {isActive && (
              <Button variant="outline" onClick={handleManage} disabled={portalLoading}>
                {portalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Subscription (Stripe)
              </Button>
            )}
            {isTrialing && (
              <Button onClick={() => handleSubscribe(tier)} disabled={loading !== null}>
                {loading === tier && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Payment Method — Keep My Plan
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* All plans */}
      <div>
        <h2 className="text-sm font-medium mb-3">
          {isInactive || isExpiredTrial ? "Choose a plan" : "Switch plan"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TIER_ORDER.map((t) => {
            const tc = TIER_CONFIG[t]
            const isCurrent = t === tier && !isInactive && !isExpiredTrial
            return (
              <Card key={t} className={isCurrent ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {tc.label}
                    {isCurrent && <Badge variant="outline" className="text-[10px]">Current</Badge>}
                  </CardTitle>
                  <p className="text-2xl font-bold font-heading">
                    EUR {tc.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-600" />
                      {tc.dealsPerMonth === -1 ? "Unlimited" : tc.dealsPerMonth} deals/mo
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-600" />
                      {tc.users} user{tc.users > 1 ? "s" : ""}
                    </li>
                    <li className="flex items-center gap-1.5">
                      {tc.wordExport ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
                      <span className={tc.wordExport ? "" : "text-muted-foreground/50"}>Word export</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {tc.fundFit ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
                      <span className={tc.fundFit ? "" : "text-muted-foreground/50"}>Fund Fit</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {tc.priorityProcessing ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
                      <span className={tc.priorityProcessing ? "" : "text-muted-foreground/50"}>Priority</span>
                    </li>
                  </ul>
                  {isCurrent ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>Current Plan</Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleSubscribe(t)}
                      disabled={loading !== null}
                    >
                      {loading === t && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                      {isInactive || isExpiredTrial
                        ? "Subscribe"
                        : TIER_ORDER.indexOf(t) > TIER_ORDER.indexOf(tier)
                          ? "Upgrade"
                          : "Downgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  )
}
