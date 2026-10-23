import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // Pinned to the API version this integration was built against. The SDK
      // bump moved its LatestApiVersion literal forward; advancing this pin
      // changes Stripe response shapes, so it's kept and cast deliberately.
      apiVersion: "2026-03-25.dahlia" as Stripe.LatestApiVersion,
      typescript: true,
    })
  }
  return _stripe
}
