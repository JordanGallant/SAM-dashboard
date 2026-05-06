import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type { Tier } from "@/lib/types/user"

const PRICE_IDS: Record<Tier, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
  fund: process.env.STRIPE_FUND_PRICE_ID,
}

// Switch the customer's existing subscription to a new tier in-place.
// Called by the billing page when the user is already active — replaces the
// old "create a second subscription via /checkout" path that was double-billing
// people. Fund tier is sales-only, so we reject it here.
export async function POST(request: Request) {
  try {
    const { tier } = (await request.json()) as { tier: Tier }

    const priceId = PRICE_IDS[tier]
    if (!priceId) {
      if (tier === "fund") {
        return NextResponse.json(
          { error: "Fund tier requires a walkthrough", contact: true },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No active subscription — start checkout first" },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Find the live subscription. We pick the first non-canceled one — in
    // practice users have exactly one because the new switch flow no longer
    // creates duplicates. If we ever find multiple, the most recent wins.
    const subs = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "all",
      limit: 10,
    })
    const live = subs.data
      .filter((s) => s.status === "active" || s.status === "trialing" || s.status === "past_due")
      .sort((a, b) => b.created - a.created)[0]

    if (!live) {
      return NextResponse.json(
        { error: "No active subscription found on this customer" },
        { status: 400 }
      )
    }

    const item = live.items.data[0]
    if (!item) {
      return NextResponse.json({ error: "Subscription has no items" }, { status: 500 })
    }

    // No-op if already on this price.
    if (item.price.id === priceId) {
      return NextResponse.json({ ok: true, unchanged: true })
    }

    const updated = await stripe.subscriptions.update(live.id, {
      items: [{ id: item.id, price: priceId }],
      proration_behavior: "create_prorations",
      metadata: {
        supabase_user_id: user.id,
        tier,
      },
    })

    // Mirror the new tier into Supabase immediately so the user sees it on
    // the next page load — the webhook will also fire customer.subscription
    // .updated and reconcile, but we don't want to wait on it for UX.
    await supabase
      .from("profiles")
      .update({ tier, subscription_status: "active", pending_tier: null })
      .eq("id", user.id)

    return NextResponse.json({ ok: true, subscriptionId: updated.id })
  } catch (error) {
    console.error("Stripe switch error:", error)
    const message = error instanceof Error ? error.message : "Failed to switch plan"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
