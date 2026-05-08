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
      let tier = session.metadata?.tier

      // Coupon-driven tier upgrade. Any discount applied at checkout bumps
      // the user to Professional so they get Fund Fit + Word export — which
      // is what people expect when they redeem a coupon. Without this,
      // someone redeeming on the Starter price stays on Starter and the
      // coupon silently does nothing for tier-gated features. Fund tier is
      // sales-only and never reached here, so we don't need to handle it.
      const hasDiscount = (session.total_details?.amount_discount ?? 0) > 0
      if (hasDiscount && tier !== "fund") {
        tier = "professional"
        // Keep the subscription's own metadata in sync, otherwise the next
        // customer.subscription.updated event would read the original tier
        // and downgrade them back to Starter.
        if (typeof session.subscription === "string") {
          try {
            await getStripe().subscriptions.update(session.subscription, {
              metadata: { supabase_user_id: userId ?? "", tier },
            })
          } catch (err) {
            console.error("Failed to sync subscription metadata after coupon:", err)
          }
        }
      }

      if (userId && tier) {
        // Mirror Stripe's actual trial state: with payment_method_collection
        // 'if_required' + trial_period_days 14 the sub here is `trialing`, so
        // we want subscription_status: 'trial' and trial_ends_at synced to
        // Stripe's trial_end. If a card was collected (paid path), sub is
        // 'active' immediately and trial_ends_at is null.
        let status = "active"
        let trialEndsAt: string | null = null
        if (typeof session.subscription === "string") {
          try {
            const sub = await getStripe().subscriptions.retrieve(session.subscription)
            if (sub.status === "trialing") {
              status = "trial"
              if (sub.trial_end) {
                trialEndsAt = new Date(sub.trial_end * 1000).toISOString()
              }
            }
          } catch (err) {
            console.error("Failed to retrieve subscription for trial state:", err)
          }
        }

        await supabaseAdmin
          .from("profiles")
          .update({
            tier,
            subscription_status: status,
            stripe_customer_id: session.customer as string,
            trial_ends_at: trialEndsAt,
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
        let status: string
        let trialEndsAt: string | null = null
        if (subscription.status === "trialing") {
          status = "trial"
          if (subscription.trial_end) {
            trialEndsAt = new Date(subscription.trial_end * 1000).toISOString()
          }
        } else if (subscription.status === "active") {
          status = "active"
        } else if (subscription.status === "past_due") {
          status = "past_due"
        } else if (subscription.status === "canceled") {
          status = "canceled"
        } else {
          status = "inactive"
        }

        const update: Record<string, unknown> = {
          subscription_status: status,
          trial_ends_at: trialEndsAt,
        }
        // Tier mirrors only when the sub is in a "user has access" state.
        // Past-due / inactive / canceled keep whatever tier we last knew so
        // dashboards don't silently flip to Starter when a card declines.
        if (tier && (status === "active" || status === "trial")) update.tier = tier

        await supabaseAdmin.from("profiles").update(update).eq("id", userId)
      }
      break
    }

    case "customer.subscription.trial_will_end": {
      // Stripe fires this 3 days before trial ends. Logging only for now —
      // the dashboard already shows a "trial ends in N days" banner via
      // useTier().trialDaysLeft (computed from profiles.trial_ends_at, which
      // we kept in sync above). Wire in a reminder email here when ready.
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.supabase_user_id
      console.log(
        `[stripe-webhook] trial_will_end userId=${userId} sub=${subscription.id} trial_end=${subscription.trial_end}`,
      )
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
