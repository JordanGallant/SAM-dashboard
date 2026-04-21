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
    name: "Angel",
    price: 49,
    annual: 490,
    description: "For individual investors handling their own deal flow.",
    cta: "Subscribe",
    popular: false,
    features: [
      { text: "All five investment domains", included: true },
      { text: "PDF export", included: true },
      { text: "1 user", included: true },
      { text: "Deck upload only", included: true },
      { text: "Supporting docs (transcripts, DD)", included: false },
      { text: "Team seats", included: false },
    ],
  },
  {
    key: "professional" as const,
    name: "Pro",
    price: 149,
    annual: 1490,
    description: "For syndicates, scouts, and solo GPs.",
    cta: "Subscribe",
    popular: true,
    features: [
      { text: "All five investment domains", included: true },
      { text: "PDF export", included: true },
      { text: "1 user", included: true },
      { text: "Supporting docs (transcripts, DD)", included: true },
      { text: "Priority processing", included: false },
      { text: "Team seats", included: false },
    ],
  },
  {
    key: "fund" as const,
    name: "VC Fund",
    price: 399,
    annual: 3990,
    description: "For fund teams running first-screening at scale.",
    cta: "Book a walkthrough",
    popular: false,
    features: [
      { text: "All five investment domains", included: true },
      { text: "PDF export", included: true },
      { text: "Team seats", included: true },
      { text: "Supporting docs (transcripts, DD)", included: true },
      { text: "Priority processing", included: true },
      { text: "Shared memo library", included: true },
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold font-heading tracking-tight md:text-4xl">
            Priced against the value of a decision.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            One memo can validate or prevent a €250k check. Choose the tier that matches your deal flow.
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
                "relative flex flex-col transition-all duration-300 hover:-translate-y-1",
                tier.popular
                  ? "border-2 border-primary shadow-xl shadow-primary/5 scale-[1.02] md:scale-105 !pt-0 hover:shadow-2xl hover:shadow-primary/10"
                  : "border hover:shadow-lg"
              )}
            >
              {tier.popular && (
                <div className="bg-amber-500 text-white text-center py-2 text-[11px] font-mono font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-mono text-muted-foreground">EUR</span>
                    <span className="text-5xl font-mono font-bold tracking-tight">
                      {annual ? Math.round(tier.annual / 12) : tier.price}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">/mo</span>
                  </div>
                  {annual ? (
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                      EUR {tier.annual} billed annually
                    </p>
                  ) : (
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
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
