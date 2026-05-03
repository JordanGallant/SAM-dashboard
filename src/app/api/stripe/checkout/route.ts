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

    // Fund tier is custom-priced — no self-serve checkout. Direct to sales.
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

    const priceId = PRICE_IDS[tier]
    if (!priceId) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3004"

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "ideal"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/settings/billing?canceled=true`,
      customer_email: user.email,
      allow_promotion_codes: true,
      metadata: {
        supabase_user_id: user.id,
        tier,
      },
      subscription_data: {
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
