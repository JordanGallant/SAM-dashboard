/**
 * Admin: create a custom, invoiced, auto-renewing ANNUAL subscription.
 *
 * For enterprise / Fund deals where the customer pays by invoice (net terms)
 * rather than card-on-file at Checkout. It creates a real Stripe Subscription
 * with `collection_method: 'send_invoice'`, so Stripe emails a hosted invoice
 * the customer can pay by card or bank transfer — no card needed up front — and
 * re-invoices automatically every year.
 *
 * The subscription is tagged with `metadata.supabase_user_id` + `metadata.tier`,
 * so the Stripe webhook (`customer.subscription.created`) flips the user's
 * profiles row to subscription_status='active' + the tier, granting app access
 * immediately (net-30 trust model). As a safety net for environments where the
 * webhook isn't deployed yet, this script also writes that profiles row directly.
 *
 * Usage (loads .env.local then .env):
 *   npx tsx scripts/create-annual-invoice-subscription.ts \
 *     --email customer@fund.com \
 *     --amount 6000 \           # annual total in MAJOR units (e.g. 6000 = €6,000)
 *     [--tier fund] \           # default: fund
 *     [--currency eur] \        # default: eur
 *     [--days-until-due 30] \   # invoice net terms, default: 30
 *     [--name "SAM Fund — annual"] \
 *     [--user-id <uuid>] \      # use instead of --email to skip email lookup
 *     [--dry-run]               # print the plan, create nothing
 *
 * Required env: STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Optional env: STRIPE_TAX_RATE_ID (applies your manual VAT rate to the invoices).
 */

import { config } from "dotenv"
import type Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { getStripe } from "../src/lib/stripe"

// Next.js keeps secrets in .env.local; fall back to .env without overriding.
config({ path: ".env.local" })
config()

type Args = {
  email?: string
  userId?: string
  amount?: string
  tier: string
  currency: string
  daysUntilDue: string
  name?: string
  dryRun: boolean
}

function parseArgs(argv: string[]): Args {
  const out: Args = {
    tier: "fund",
    currency: "eur",
    daysUntilDue: "30",
    dryRun: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => argv[++i]
    switch (a) {
      case "--email": out.email = next(); break
      case "--user-id": out.userId = next(); break
      case "--amount": out.amount = next(); break
      case "--tier": out.tier = next() ?? out.tier; break
      case "--currency": out.currency = (next() ?? out.currency).toLowerCase(); break
      case "--days-until-due": out.daysUntilDue = next() ?? out.daysUntilDue; break
      case "--name": out.name = next(); break
      case "--dry-run": out.dryRun = true; break
      default:
        throw new Error(`Unknown argument: ${a}`)
    }
  }
  return out
}

function requireEnv(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing required env var: ${key}`)
  return v
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (!args.amount) throw new Error("--amount is required (annual total in major units, e.g. 6000)")
  if (!args.email && !args.userId) throw new Error("Provide --email or --user-id")

  const amountMajor = Number(args.amount)
  if (!Number.isFinite(amountMajor) || amountMajor <= 0) {
    throw new Error(`--amount must be a positive number, got: ${args.amount}`)
  }
  const unitAmount = Math.round(amountMajor * 100) // Stripe wants minor units (cents)
  const daysUntilDue = Number(args.daysUntilDue)
  if (!Number.isInteger(daysUntilDue) || daysUntilDue < 0) {
    throw new Error(`--days-until-due must be a non-negative integer, got: ${args.daysUntilDue}`)
  }

  requireEnv("STRIPE_SECRET_KEY")
  const stripe = getStripe()
  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  )
  const taxRateId = process.env.STRIPE_TAX_RATE_ID || undefined

  // 1) Resolve the Supabase user + their profile. The admin API has no
  //    get-by-email, so page through users and match when only --email is given.
  let userId = args.userId
  if (!userId) {
    const target = args.email!.trim().toLowerCase()
    for (let page = 1; page <= 50 && !userId; page++) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
      if (error) throw new Error(`auth.admin.listUsers failed: ${error.message}`)
      userId = data.users.find((u) => u.email?.toLowerCase() === target)?.id
      if (data.users.length < 200) break // last page
    }
    if (!userId) throw new Error(`No auth user found for email: ${args.email}`)
  }
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("id, stripe_customer_id, tier, subscription_status")
    .eq("id", userId)
    .maybeSingle()
  if (profErr) throw new Error(`Failed to load profile: ${profErr.message}`)
  if (!profile) throw new Error(`No profiles row for user ${userId}`)

  const productName = args.name ?? `SAM ${args.tier} — annual (invoiced)`
  const euros = (unitAmount / 100).toLocaleString("en-IE", { style: "currency", currency: args.currency.toUpperCase() })

  console.log("Plan:")
  console.log(`  user_id:         ${userId}${args.email ? ` (${args.email})` : ""}`)
  console.log(`  tier:            ${args.tier}`)
  console.log(`  annual amount:   ${euros} (${unitAmount} ${args.currency} minor units)`)
  console.log(`  collection:      send_invoice, net-${daysUntilDue}, auto-renews yearly`)
  console.log(`  VAT tax rate:    ${taxRateId ?? "(none configured — invoice will carry no VAT)"}`)
  console.log(`  stripe customer: ${profile.stripe_customer_id ?? "(will create)"}`)

  if (args.dryRun) {
    console.log("\n--dry-run: nothing created.")
    return
  }

  // 2) Reuse or create the Stripe Customer; make sure it has an email (required
  //    for send_invoice delivery) and our supabase_user_id metadata.
  let customerId = profile.stripe_customer_id as string | null
  if (customerId) {
    await stripe.customers.update(customerId, {
      ...(args.email ? { email: args.email } : {}),
      metadata: { supabase_user_id: userId },
    })
  } else {
    const customer = await stripe.customers.create({
      ...(args.email ? { email: args.email } : {}),
      metadata: { supabase_user_id: userId },
    })
    customerId = customer.id
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId)
  }

  // 3) Create the annual recurring price (custom amount, product created inline).
  const price = await stripe.prices.create({
    currency: args.currency,
    unit_amount: unitAmount,
    recurring: { interval: "year" },
    product_data: { name: productName },
  })

  // 4) Create the invoiced, auto-renewing subscription. Expand the first invoice
  //    so we can hand back its hosted payment URL.
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
    collection_method: "send_invoice",
    days_until_due: daysUntilDue,
    ...(taxRateId ? { default_tax_rates: [taxRateId] } : {}),
    metadata: { supabase_user_id: userId, tier: args.tier },
    expand: ["latest_invoice"],
  })

  // First invoice for a send_invoice sub is created as a draft; finalize + send
  // so the customer actually receives it now (Stripe auto-advance would too, but
  // doing it explicitly makes the script's output deterministic).
  let invoice = subscription.latest_invoice as Stripe.Invoice | null
  if (invoice && invoice.id && invoice.status === "draft") {
    await stripe.invoices.finalizeInvoice(invoice.id)
    invoice = await stripe.invoices.sendInvoice(invoice.id)
  }

  // 5) Safety net: write the profiles row directly in case the webhook isn't live
  //    yet. The webhook's customer.subscription.created does the same thing.
  await supabase
    .from("profiles")
    .update({ tier: args.tier, subscription_status: "active", stripe_customer_id: customerId })
    .eq("id", userId)

  console.log("\n✓ Created.")
  console.log(`  subscription:    ${subscription.id} (status: ${subscription.status})`)
  console.log(`  customer:        ${customerId}`)
  console.log(`  price:           ${price.id}`)
  if (invoice) {
    console.log(`  invoice:         ${invoice.id} (status: ${invoice.status})`)
    if (invoice.hosted_invoice_url) console.log(`  pay link:        ${invoice.hosted_invoice_url}`)
    if (invoice.invoice_pdf) console.log(`  pdf:             ${invoice.invoice_pdf}`)
  }
  console.log("\nThe customer has been emailed the invoice and now has app access (tier set).")
}

main().catch((err) => {
  console.error("\n✗ Failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
