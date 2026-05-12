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
    const { tier, coupon } = (await request.json()) as {
      tier: Tier
      coupon?: string
    }

    const priceId = PRICE_IDS[tier]
    if (!priceId) {
      // No Stripe price configured. For Fund this means we're sales-only;
      // for the others it means the env var is missing in this environment.
      if (tier === "fund") {
        return NextResponse.json(
          {
            error: "Fund tier requires a walkthrough",
            contact: true,
            mailto: "mark@green-whale.nl?subject=SAM%20Fund%20-%20Walkthrough%20request",
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

    const stripe = getStripe()

    // Coupon-gated trial. Per the launch plan, trials are only available to
    // users redeeming a promotion code (FOUNDER90 etc.). Direct-pay users
    // without a coupon get the standard immediate-charge flow.
    //
    // If a coupon code was provided, look it up so we can pre-attach it to
    // the session via `discounts` (the user already typed it on our side —
    // no need to re-paste at Stripe Checkout). If lookup fails we surface
    // a friendly inline error rather than letting Stripe Checkout reject it
    // mid-flow.
    let promotionCodeId: string | undefined
    const couponCode = (coupon ?? "").trim()
    if (couponCode) {
      const promos = await stripe.promotionCodes.list({
        code: couponCode,
        active: true,
        limit: 1,
      })
      const match = promos.data[0]
      if (!match) {
        return NextResponse.json(
          { error: `Coupon code "${couponCode}" is not valid or has expired.` },
          { status: 400 },
        )
      }
      promotionCodeId = match.id
    }

    const viaCoupon = Boolean(promotionCodeId)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3004"

    // Coupon path always lands on Professional tier for 14 days. Without this,
    // someone redeeming FOUNDER90 on Angel would get Angel billing (€149/mo)
    // but the webhook's "any discount -> bump to Pro" rule would set their
    // tier to professional — billing/features mismatch. Forcing Pro at
    // checkout keeps both sides consistent.
    const effectiveTier: Tier = viaCoupon ? "professional" : tier
    const effectivePriceId = viaCoupon ? PRICE_IDS.professional ?? priceId : priceId

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Don't hard-code payment_method_types. Stripe Checkout falls back to
      // payment methods enabled in your Stripe dashboard, so you can toggle
      // iDEAL / SEPA Debit / etc. without a deploy.
      line_items: [{ price: effectivePriceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/settings/billing?canceled=true`,
      ...(profile?.stripe_customer_id
        ? { customer: profile.stripe_customer_id }
        : { customer_email: user.email }),
      // Coupon path: pre-attach so the user doesn't have to paste it twice.
      // Direct-pay path: still allow the Stripe-native promo entry on the
      // Checkout page (e.g. for late-applied loyalty discounts).
      ...(viaCoupon
        ? { discounts: [{ promotion_code: promotionCodeId }] }
        : { allow_promotion_codes: true }),
      // Coupon path: 14-day trial, no card required, auto-cancel at trial end
      // if no payment method was added. Direct-pay path: card required at
      // checkout, immediate charge today, no trial.
      ...(viaCoupon
        ? {
            payment_method_collection: "if_required" as const,
          }
        : {
            payment_method_collection: "always" as const,
          }),
      metadata: {
        supabase_user_id: user.id,
        tier: effectiveTier,
        ...(viaCoupon ? { coupon: couponCode } : {}),
      },
      subscription_data: {
        ...(viaCoupon
          ? {
              trial_period_days: 14,
              trial_settings: {
                end_behavior: {
                  missing_payment_method: "cancel" as const,
                },
              },
            }
          : {}),
        metadata: {
          supabase_user_id: user.id,
          tier: effectiveTier,
          ...(viaCoupon ? { coupon: couponCode } : {}),
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
