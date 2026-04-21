"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Shield, FileCheck } from "lucide-react"
import { motion } from "framer-motion"
import { CountUp } from "@/components/motion/count-up"
import { AnimatedBar } from "@/components/motion/animated-bar"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const domains = [
  { domain: "TEAM", score: 88 },
  { domain: "MARKET", score: 76 },
  { domain: "PRODUCT", score: 84 },
  { domain: "TRACTION", score: 72 },
  { domain: "FINANCIALS", score: 90 },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.08),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <motion.div initial="hidden" animate="visible" variants={container} className="mx-auto max-w-3xl text-center">
          <motion.h1 variants={item} className="text-4xl font-bold tracking-tight md:text-6xl font-heading">
            From pitch deck
            <br />
            <span className="text-primary">to investment decision.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Sam analyses pitch decks across five investment domains and returns a scored, IC-ready memo. Built for European investors who need consistent, defensible evaluation — not summaries.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register?tier=professional" className={buttonVariants({ size: "lg", className: "text-base px-8" })}>
              Start with a deck
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/sample" className={buttonVariants({ variant: "outline", size: "lg", className: "text-base px-8" })}>
              See a sample memo
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>5 domains</span>
            <span className="text-border">·</span>
            <span>scored 0 — 100</span>
            <span className="text-border">·</span>
            <span>EU-hosted</span>
            <span className="text-border">·</span>
            <span>GDPR by design</span>
          </motion.div>
        </motion.div>

        {/* Sample memo preview */}
        <motion.div
          id="sample-memo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 mx-auto max-w-4xl scroll-mt-20"
        >
          <div className="rounded-xl border bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="flex items-center gap-1.5 border-b bg-slate-50 px-4 py-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">sam · executive summary</span>
            </div>

            <div className="p-6 md:p-8 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                    <span className="text-lg font-bold font-heading text-emerald-800">STRONG BUY</span>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-white border px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    Confidence · High
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <CountUp to={82} className="text-4xl font-mono font-bold text-amber-600 leading-none" />
                  <span className="text-sm font-mono text-muted-foreground">/100</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-b">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-4">Domain Scores</p>
              <div className="space-y-2.5 font-mono text-xs">
                {domains.map((d, i) => (
                  <div key={d.domain} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-4">
                    <span className="text-muted-foreground tracking-wider">{d.domain}</span>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <AnimatedBar percent={d.score} delay={0.8 + i * 0.08} className="h-full rounded-full bg-primary" />
                    </div>
                    <CountUp to={d.score} duration={0.9} className="font-semibold text-primary text-right tabular-nums" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
              <div className="p-6 md:p-8 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                  <Shield className="h-3 w-3" /> Key Strengths
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">Experienced founding team with 15+ years domain expertise. Strong regulatory tailwinds.</p>
              </div>
              <div className="p-6 md:p-8 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
                  <FileCheck className="h-3 w-3" /> Key Risks
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">Capital-intensive model requires follow-on funding. Hardware margins thin at 15-25%.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
