import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      const tier = session.metadata?.tier

      if (userId && tier) {
        await supabaseAdmin
          .from("profiles")
          .update({
            tier,
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            trial_ends_at: null,
            pending_tier: null,
          })
          .eq("id", userId)
      }
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.supabase_user_id
      const tier = subscription.metadata?.tier

      if (userId) {
        const status =
          subscription.status === "active" || subscription.status === "trialing"
            ? "active"
            : subscription.status === "past_due"
              ? "past_due"
              : subscription.status === "canceled"
                ? "canceled"
                : "inactive"

        const update: Record<string, unknown> = { subscription_status: status }
        if (tier && status === "active") update.tier = tier

        await supabaseAdmin.from("profiles").update(update).eq("id", userId)
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.supabase_user_id

      if (userId) {
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "canceled",
          })
          .eq("id", userId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
