import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type { Tier } from "@/lib/types/user"

const PRICE_IDS: Record<Tier, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
  fund: process.env.STRIPE_FUND_PRICE_ID,
}

export async function POST(request: Request) {
  try {
    const { tier } = (await request.json()) as { tier: Tier }

    const priceId = PRICE_IDS[tier]
    if (!priceId) {
      // No Stripe price configured. For Fund this means we're sales-only;
      // for the others it means the env var is missing in this environment.
      if (tier === "fund") {
        return NextResponse.json(
          {
            error: "Fund tier requires a walkthrough",
            contact: true,
            mailto: "hello@sam.ai?subject=SAM%20Fund%20-%20Walkthrough%20request",
          },
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

    // Reuse the existing Stripe customer if we have one — otherwise checkout
    // creates a brand new Customer record on every visit, which fragments
    // their billing history across multiple customers in the dashboard.
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3004"

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      // Don't hard-code payment_method_types. Stripe Checkout falls back to the
      // payment methods enabled in your Stripe dashboard (Settings -> Payment
      // methods), so you can toggle iDEAL / SEPA Debit / etc. without a deploy.
      // The previous explicit list ["card","ideal"] worked in test mode but
      // live mode requires sepa_debit to be activated alongside iDEAL for
      // subscriptions — letting the dashboard drive avoids that coupling.
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/settings/billing?canceled=true`,
      ...(profile?.stripe_customer_id
        ? { customer: profile.stripe_customer_id }
        : { customer_email: user.email }),
      allow_promotion_codes: true,
      // 14-day Stripe-native trial. Card is NOT collected at signup so users
      // get immediate access with a real (trialing) Stripe subscription from
      // day 1 — that means switch / portal / coupon flows all work without
      // the previous "no Stripe customer" edge cases. If they don't add a
      // payment method by trial end, missing_payment_method: 'cancel' tells
      // Stripe to auto-cancel rather than transition to past_due, which the
      // webhook surfaces as subscription_status: 'canceled' and middleware
      // routes back to /settings/billing.
      payment_method_collection: "if_required",
      metadata: {
        supabase_user_id: user.id,
        tier,
      },
      subscription_data: {
        trial_period_days: 14,
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        metadata: {
          supabase_user_id: user.id,
          tier,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
