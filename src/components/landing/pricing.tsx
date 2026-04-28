"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Check, X, Sparkles, Tag, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"

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
    <section
      id="pricing"
      className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-[#F4FAF6] via-white to-[#F4FAF6]"
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(0,168,107,0.10),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_80%_100%,rgba(212,255,107,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
            <Tag className="h-3 w-3" />
            Pricing
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
            Priced against the value
            <br />
            <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
              of a decision.
            </span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            One memo can validate or prevent a €250k check. Choose the tier that matches your deal flow — cancel any time.
          </p>

          {/* Animated billing toggle */}
          <LayoutGroup id="billing-toggle">
            <div className="mt-8 inline-flex items-center rounded-full border border-[#0F3D2E]/10 bg-white p-1 shadow-sm relative">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors z-10",
                  !annual ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {!annual && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] rounded-full -z-10 shadow-md shadow-primary/20"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 z-10",
                  annual ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {annual && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] rounded-full -z-10 shadow-md shadow-primary/20"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                Annual
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-colors",
                    annual ? "bg-[#D4FF6B] text-[#0A2E22]" : "bg-[#D4FF6B]/20 text-[#0F3D2E]"
                  )}
                >
                  Save 17%
                </span>
              </button>
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-5 md:gap-6 md:grid-cols-3 items-stretch"
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
                className={cn("relative", tier.popular && "md:-translate-y-2 md:scale-[1.02]")}
              >
                <div
                  className={cn(
                    "relative flex flex-col h-full rounded-3xl transition-all duration-300 hover:-translate-y-1",
                    tier.popular
                      ? "bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#1A6B47] text-white shadow-2xl shadow-[#0F3D2E]/30 hover:shadow-[#0F3D2E]/50"
                      : "bg-white border border-[#0F3D2E]/10 shadow-sm hover:border-[#0F3D2E]/25 hover:shadow-xl"
                  )}
                >
                  {/* Decorative glows / ribbon — clipped inside */}
                  {tier.popular && (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#D4FF6B]/20 blur-3xl" />
                      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
                      <div className="absolute inset-x-8 top-0 h-0.5 rounded-b-full bg-gradient-to-r from-transparent via-[#D4FF6B] to-transparent" />
                    </div>
                  )}

                  {/* "Most popular" ribbon — outside the clip */}
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D4FF6B] shadow-lg shadow-[#D4FF6B]/30 px-3 py-1">
                        <Sparkles className="h-3 w-3 text-[#0A2E22]" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A2E22]">
                          Most popular
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="relative p-7 md:p-8 pb-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={cn(
                          "text-xl font-heading font-bold",
                          tier.popular ? "text-white" : "text-[#0A2E22]"
                        )}
                      >
                        {tier.name}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        tier.popular ? "text-white/60" : "text-muted-foreground"
                      )}
                    >
                      {tier.description}
                    </p>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-1">
                      <span
                        className={cn(
                          "text-lg font-mono font-semibold",
                          tier.popular ? "text-white/50" : "text-muted-foreground"
                        )}
                      >
                        €
                      </span>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={displayPrice}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className={cn(
                            "text-6xl font-mono font-bold tracking-tight inline-block leading-none",
                            tier.popular
                              ? "bg-gradient-to-br from-white to-[#D4FF6B] bg-clip-text text-transparent"
                              : "text-[#0A2E22]"
                          )}
                        >
                          {displayPrice}
                        </motion.span>
                      </AnimatePresence>
                      <span
                        className={cn(
                          "text-sm font-mono ml-1",
                          tier.popular ? "text-white/50" : "text-muted-foreground"
                        )}
                      >
                        / month
                      </span>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={annual ? "annual" : "monthly"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "mt-2 text-[10px] font-mono uppercase tracking-widest",
                          tier.popular ? "text-white/40" : "text-muted-foreground/80"
                        )}
                      >
                        {annual ? `€${tier.annual} billed annually` : "Billed monthly · cancel anytime"}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* CTA */}
                  <div className="relative px-7 md:px-8">
                    <Link
                      href={`/register?tier=${tier.key}`}
                      className={cn(
                        "group/cta inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5",
                        tier.popular
                          ? "bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#0A2E22] shadow-xl shadow-[#D4FF6B]/25 hover:shadow-2xl hover:shadow-[#D4FF6B]/40"
                          : "bg-[#0F3D2E] hover:bg-[#0A2E22] text-white shadow-md shadow-[#0F3D2E]/15 hover:shadow-lg hover:shadow-[#0F3D2E]/25"
                      )}
                    >
                      {tier.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                    <p
                      className={cn(
                        "mt-3 text-center text-[10px] font-mono uppercase tracking-widest",
                        tier.popular ? "text-white/40" : "text-muted-foreground"
                      )}
                    >
                      Free trial · no credit card
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className={cn(
                      "mt-6 mx-7 md:mx-8 border-t",
                      tier.popular ? "border-white/10" : "border-[#0F3D2E]/10"
                    )}
                  />

                  {/* Feature list */}
                  <motion.ul
                    className="relative p-7 md:p-8 pt-5 space-y-3 flex-1"
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
                        className="flex items-start gap-2.5 text-[13px]"
                      >
                        {feature.included ? (
                          <span
                            className={cn(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                              tier.popular
                                ? "bg-[#D4FF6B] shadow-sm shadow-[#D4FF6B]/20"
                                : "bg-[#0F3D2E]/10"
                            )}
                          >
                            <Check
                              className={cn(
                                "h-2.5 w-2.5 stroke-[3]",
                                tier.popular ? "text-[#0A2E22]" : "text-[#0F3D2E]"
                              )}
                            />
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                              tier.popular ? "bg-white/10" : "bg-muted"
                            )}
                          >
                            <X
                              className={cn(
                                "h-2.5 w-2.5 stroke-[2.5]",
                                tier.popular ? "text-white/30" : "text-muted-foreground/40"
                              )}
                            />
                          </span>
                        )}
                        <span
                          className={cn(
                            feature.included
                              ? tier.popular
                                ? "text-white/90"
                                : "text-[#0A2E22]"
                              : tier.popular
                              ? "text-white/35 line-through"
                              : "text-muted-foreground/50 line-through"
                          )}
                        >
                          {feature.text}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Small note below */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            14-day free trial
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Cancel anytime
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            EU-invoiced VAT incl.
          </span>
        </Reveal>
      </div>
    </section>
  )
}
