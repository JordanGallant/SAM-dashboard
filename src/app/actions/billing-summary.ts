"use server"

import type Stripe from "stripe"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"
import { TIER_PRICE_ENV } from "@/lib/tier-config"

/**
 * Live billing summary for the current user, read from Stripe.
 *
 * The billing page historically rendered price/plan purely from tier-config
 * (always "EUR <tier price> / month") and always exposed the self-serve
 * "Manage subscription" + "Switch plan" actions. That's wrong for customers on
 * a bespoke, admin-created **invoiced** subscription (e.g. a custom annual deal
 * via send_invoice): it showed the wrong amount/interval, and the self-serve
 * buttons let them open the Stripe portal (cancel) or start a *second* checkout
 * subscription. This action surfaces the actual subscription so the UI can show
 * the real figures and hide self-serve management for managed/invoiced plans.
 */
export interface BillingSummary {
  hasStripeCustomer: boolean
  subscriptionStatus: string
  /** The governing live subscription (active/trialing/past_due), or null. */
  live: {
    /** Recurring amount in minor units (e.g. 150000 = €1.500,00). */
    priceAmount: number | null
    currency: string | null
    /** "month" | "year". */
    interval: string | null
    intervalCount: number | null
    /** "charge_automatically" | "send_invoice". */
    collectionMethod: string | null
    /** True when billed by invoice (net terms) rather than card-on-file. */
    isInvoiced: boolean
    /** True for bespoke deals: invoiced, or a price that isn't a standard tier price. */
    isCustom: boolean
    cancelAtPeriodEnd: boolean
    /** Unix seconds for the current period end (next renewal/invoice date). */
    currentPeriodEnd: number | null
  } | null
}

const EMPTY: BillingSummary = {
  hasStripeCustomer: false,
  subscriptionStatus: "inactive",
  live: null,
}

export async function getBillingSummary(): Promise<BillingSummary> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return EMPTY

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle()

  const subscriptionStatus = (profile?.subscription_status as string) ?? "inactive"
  const customerId = (profile?.stripe_customer_id as string | null) ?? null
  if (!customerId) {
    return { hasStripeCustomer: false, subscriptionStatus, live: null }
  }

  // Pick the governing subscription: most recent one in a "has access" state.
  let sub: Stripe.Subscription | null = null
  try {
    const subs = await getStripe().subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 20,
      expand: ["data.items.data.price"],
    })
    sub =
      subs.data
        .filter((s) => ["active", "trialing", "past_due"].includes(s.status))
        .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))[0] ?? null
  } catch (err) {
    // Degrade gracefully — the page falls back to tier-config display.
    console.error("[billing-summary] Stripe lookup failed:", err)
    return { hasStripeCustomer: true, subscriptionStatus, live: null }
  }

  if (!sub) return { hasStripeCustomer: true, subscriptionStatus, live: null }

  const item = sub.items.data[0]
  const price = item?.price
  const recurring = price?.recurring
  const collectionMethod = sub.collection_method ?? null
  const isInvoiced = collectionMethod === "send_invoice"

  // Standard tier price ids come from env. A live price that isn't one of them
  // (and isn't a normal card sub) is a bespoke amount created for this customer.
  const standardPriceIds = new Set(
    Object.values(TIER_PRICE_ENV)
      .map((envKey) => process.env[envKey])
      .filter((v): v is string => Boolean(v)),
  )
  const isStandardPrice = price?.id ? standardPriceIds.has(price.id) : false
  const isCustom = isInvoiced || (standardPriceIds.size > 0 && !isStandardPrice)

  // current_period_end lives on the item in recent API versions; fall back to
  // the legacy subscription-level field for older shapes.
  const periodEnd =
    (item as unknown as { current_period_end?: number })?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    null

  return {
    hasStripeCustomer: true,
    subscriptionStatus,
    live: {
      priceAmount: price?.unit_amount ?? null,
      currency: price?.currency ?? null,
      interval: recurring?.interval ?? null,
      intervalCount: recurring?.interval_count ?? null,
      collectionMethod,
      isInvoiced,
      isCustom,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      currentPeriodEnd: periodEnd,
    },
  }
}
