"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"
import { CountUp } from "@/components/motion/count-up"

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
        <Reveal className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold font-heading tracking-tight md:text-4xl">
            Priced against the value of a decision.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            One memo can validate or prevent a €250k check. Choose the tier that matches your deal flow.
          </p>

          {/* Animated billing toggle */}
          <LayoutGroup id="billing-toggle">
            <div className="mt-6 inline-flex items-center rounded-full border bg-background p-1 shadow-sm relative">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors z-10",
                  !annual ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {!annual && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 z-10",
                  annual ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {annual && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                Annual
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5 py-0">Save 17%</Badge>
              </button>
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-3 items-start"
        >
          {tiers.map((tier, tierIndex) => {
            const displayPrice = annual ? Math.round(tier.annual / 12) : tier.price
            return (
              <motion.div
                key={tier.name}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <Card
                  className={cn(
                    "relative flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden",
                    tier.popular
                      ? "border-2 border-primary shadow-xl shadow-primary/5 scale-[1.02] md:scale-105 !pt-0 hover:shadow-2xl hover:shadow-amber-500/20"
                      : "border hover:shadow-lg"
                  )}
                >
                  {tier.popular && (
                    <div className="relative bg-amber-500 text-white text-center py-2 text-[11px] font-mono font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 overflow-hidden">
                      <Sparkles className="h-3 w-3 relative z-10" />
                      <span className="relative z-10">Most Popular</span>
                      {/* Ambient shimmer sweep */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-mono text-muted-foreground">EUR</span>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={displayPrice}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="text-5xl font-mono font-bold tracking-tight inline-block"
                          >
                            <CountUp to={displayPrice} duration={0.8} />
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-sm font-mono text-muted-foreground">/mo</span>
                      </div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={annual ? "annual" : "monthly"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1"
                        >
                          {annual ? `EUR ${tier.annual} billed annually` : "Billed monthly"}
                        </motion.p>
                      </AnimatePresence>
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
                    <motion.ul
                      className="space-y-3 flex-1"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ staggerChildren: 0.06, delayChildren: 0.2 + tierIndex * 0.1 }}
                    >
                      {tier.features.map((feature) => (
                        <motion.li
                          key={feature.text}
                          variants={{
                            hidden: { opacity: 0, x: -8 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
                          }}
                          className="flex items-start gap-2.5 text-sm"
                        >
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
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
