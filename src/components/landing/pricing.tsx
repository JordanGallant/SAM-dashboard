"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const tiers = [
  {
    key: "starter" as const,
    name: "Starter",
    price: 49,
    annual: 490,
    description: "For angels and scouts",
    cta: "Subscribe",
    popular: false,
    features: [
      { text: "5 deals / month", included: true },
      { text: "1 user", included: true },
      { text: "Quick Scan analysis", included: true },
      { text: "Deck upload only", included: true },
      { text: "3 email summaries / month", included: true },
      { text: "Full Report", included: false },
      { text: "Fund Fit scoring", included: false },
      { text: "Word doc export", included: false },
      { text: "Priority processing", included: false },
    ],
  },
  {
    key: "professional" as const,
    name: "Professional",
    price: 149,
    annual: 1490,
    description: "For individual VCs and small funds",
    cta: "Subscribe",
    popular: true,
    features: [
      { text: "25 deals / month", included: true },
      { text: "1 user", included: true },
      { text: "Quick Scan + Full Report", included: true },
      { text: "Deck + 5 docs per deal", included: true },
      { text: "Unlimited email summaries", included: true },
      { text: "Fund Fit scoring", included: true },
      { text: "Word doc export", included: true },
      { text: "Priority processing", included: false },
      { text: "Dedicated schema", included: false },
    ],
  },
  {
    key: "fund" as const,
    name: "Fund",
    price: 399,
    annual: 3990,
    description: "For VC funds and CVCs",
    cta: "Subscribe",
    popular: false,
    features: [
      { text: "Unlimited deals", included: true },
      { text: "5 users (+EUR 49/seat)", included: true },
      { text: "Quick Scan + Full Report", included: true },
      { text: "Unlimited doc uploads", included: true },
      { text: "Unlimited email summaries", included: true },
      { text: "Fund Fit scoring", included: true },
      { text: "Word doc export", included: true },
      { text: "Priority processing", included: true },
      { text: "Dedicated schema + 2FA required", included: true },
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-muted-foreground">
            14 days free on all plans. No credit card required.
          </p>

          {/* Annual toggle */}
          <div className="mt-6 inline-flex items-center rounded-full border bg-background p-1 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5",
                annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5 py-0">Save 17%</Badge>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-start">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative flex flex-col",
                tier.popular
                  ? "border-2 border-primary shadow-xl shadow-primary/5 scale-[1.02] md:scale-105 !pt-0"
                  : "border"
              )}
            >
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-xs font-medium flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">EUR</span>
                    <span className="text-5xl font-bold font-heading tracking-tight">
                      {annual ? Math.round(tier.annual / 12) : tier.price}
                    </span>
                    <span className="text-muted-foreground">/ mo</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      EUR {tier.annual} billed annually
                    </p>
                  )}
                  {!annual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed monthly
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-5">
                <Link
                  href={`/register?tier=${tier.key}`}
                  className={buttonVariants({
                    variant: tier.popular ? "default" : "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  {tier.cta}
                </Link>
                <p className="text-center text-[11px] text-muted-foreground -mt-2">
                  Have a <Link href={`/register?tier=${tier.key}`} className="underline hover:text-foreground">promo code</Link>? Free trial available.
                </p>
                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2.5 text-sm">
                      {feature.included ? (
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-2.5 w-2.5 text-emerald-700" />
                        </div>
                      ) : (
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
                          <X className="h-2.5 w-2.5 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
