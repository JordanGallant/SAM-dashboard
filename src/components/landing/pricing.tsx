"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Starter",
    price: 49,
    annual: 490,
    description: "For angels and scouts",
    cta: "Start Free Trial",
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
    name: "Professional",
    price: 149,
    annual: 1490,
    description: "For individual VCs and small funds",
    cta: "Start Free Trial",
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
    name: "Fund",
    price: 399,
    annual: 3990,
    description: "For VC funds and CVCs",
    cta: "Start Free Trial",
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
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-muted-foreground">
            14 days free on all plans. No credit card required.
          </p>

          {/* Annual toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border bg-muted/50 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !annual ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                annual ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
            >
              Annual
              <Badge className="ml-2 bg-emerald-100 text-emerald-700 border-0 text-[10px]">2 months free</Badge>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative",
                tier.popular && "border-primary shadow-lg shadow-primary/10"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-4xl font-bold font-heading tracking-tight">
                    EUR {annual ? Math.round(tier.annual / 12) : tier.price}
                  </span>
                  <span className="text-muted-foreground"> / month</span>
                  {annual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      EUR {tier.annual} billed annually
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: tier.popular ? "default" : "outline",
                    className: "w-full",
                  })}
                >
                  {tier.cta}
                </Link>
                <ul className="space-y-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/60"}>
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
