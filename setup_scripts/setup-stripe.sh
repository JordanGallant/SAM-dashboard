#!/bin/bash
# setup-stripe.sh
# Creates SAM Stripe products, prices, and webhook endpoint.
# Run this whenever you switch to a new Stripe account/project.
#
# Usage:
#   ./setup_scripts/setup-stripe.sh sk_test_YOUR_SECRET_KEY
#   ./setup_scripts/setup-stripe.sh sk_test_YOUR_SECRET_KEY https://your-domain.com

set -euo pipefail

STRIPE_SECRET_KEY="${1:-}"
APP_URL="${2:-https://test.jgsleepy.xyz}"

if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo "Usage: $0 <STRIPE_SECRET_KEY> [APP_URL]"
  echo ""
  echo "  STRIPE_SECRET_KEY  Your Stripe secret key (sk_test_... or sk_live_...)"
  echo "  APP_URL            Your app URL (default: https://test.jgsleepy.xyz)"
  exit 1
fi

echo "Creating Stripe products, prices, and webhook..."
echo "  Stripe key: ${STRIPE_SECRET_KEY:0:12}..."
echo "  Webhook URL: ${APP_URL}/api/stripe/webhook"
echo ""

RESULT=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('${STRIPE_SECRET_KEY}');

async function setup() {
  // Create products
  const starter = await stripe.products.create({
    name: 'SAM Starter',
    description: 'For angels and scouts — 5 deals/mo, Quick Scan',
  });
  const starterPrice = await stripe.prices.create({
    product: starter.id,
    unit_amount: 4900,
    currency: 'eur',
    recurring: { interval: 'month' },
  });

  const pro = await stripe.products.create({
    name: 'SAM Professional',
    description: 'For VCs and small funds — 25 deals/mo, Full Reports, Fund Fit',
  });
  const proPrice = await stripe.prices.create({
    product: pro.id,
    unit_amount: 14900,
    currency: 'eur',
    recurring: { interval: 'month' },
  });

  const fund = await stripe.products.create({
    name: 'SAM Fund',
    description: 'For VC funds and CVCs — Unlimited deals, 5 users, Priority',
  });
  const fundPrice = await stripe.prices.create({
    product: fund.id,
    unit_amount: 39900,
    currency: 'eur',
    recurring: { interval: 'month' },
  });

  // Create annual prices
  const starterAnnual = await stripe.prices.create({
    product: starter.id,
    unit_amount: 49000,
    currency: 'eur',
    recurring: { interval: 'year' },
  });
  const proAnnual = await stripe.prices.create({
    product: pro.id,
    unit_amount: 149000,
    currency: 'eur',
    recurring: { interval: 'year' },
  });
  const fundAnnual = await stripe.prices.create({
    product: fund.id,
    unit_amount: 399000,
    currency: 'eur',
    recurring: { interval: 'year' },
  });

  // Create webhook
  const webhook = await stripe.webhookEndpoints.create({
    url: '${APP_URL}/api/stripe/webhook',
    enabled_events: [
      'checkout.session.completed',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ],
  });

  console.log(JSON.stringify({
    starter: { product: starter.id, monthly: starterPrice.id, annual: starterAnnual.id },
    professional: { product: pro.id, monthly: proPrice.id, annual: proAnnual.id },
    fund: { product: fund.id, monthly: fundPrice.id, annual: fundAnnual.id },
    webhook: { id: webhook.id, secret: webhook.secret },
  }));
}

setup().catch(e => { console.error(e.message); process.exit(1); });
")

# Parse results
STARTER_PRICE=$(echo "$RESULT" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(d.starter.monthly)")
PRO_PRICE=$(echo "$RESULT" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(d.professional.monthly)")
FUND_PRICE=$(echo "$RESULT" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(d.fund.monthly)")
WEBHOOK_SECRET=$(echo "$RESULT" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(d.webhook.secret)")

echo "Done! Add these to your .env.local:"
echo ""
echo "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}"
echo "STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}"
echo "STRIPE_STARTER_PRICE_ID=${STARTER_PRICE}"
echo "STRIPE_PROFESSIONAL_PRICE_ID=${PRO_PRICE}"
echo "STRIPE_FUND_PRICE_ID=${FUND_PRICE}"
echo ""

# Auto-update .env.local if it exists
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  read -p "Update .env.local automatically? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    sed -i "s|^STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}|" "$ENV_FILE"
    sed -i "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}|" "$ENV_FILE"
    sed -i "s|^STRIPE_STARTER_PRICE_ID=.*|STRIPE_STARTER_PRICE_ID=${STARTER_PRICE}|" "$ENV_FILE"
    sed -i "s|^STRIPE_PROFESSIONAL_PRICE_ID=.*|STRIPE_PROFESSIONAL_PRICE_ID=${PRO_PRICE}|" "$ENV_FILE"
    sed -i "s|^STRIPE_FUND_PRICE_ID=.*|STRIPE_FUND_PRICE_ID=${FUND_PRICE}|" "$ENV_FILE"
    echo ".env.local updated. Restart your app to apply."
  fi
fi
