"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, HelpCircle, Mail } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"

const questions = [
  {
    q: "How is Sam different from using generic AI to analyse a pitch deck?",
    a: "Sam applies a fixed five-domain evaluation framework to every deck — the same structure, scoring rubric, and severity classifications every time. Generic AI returns whatever comes out of a prompt, so the output varies, can't be compared across deals, and lacks a defensible methodology. Sam's framework is the product; the model is just the engine behind it.",
  },
  {
    q: "Is my pitch deck data secure and confidential?",
    a: "Yes. Sam runs on European servers only. Your deck is processed, analysed, and stored within the EU. No submitted material is used to train any model, and data is deleted on your retention schedule.",
  },
  {
    q: "What does a Sam investment memo actually include?",
    a: "Executive summary, overall score and confidence rating, per-domain verdicts across Team, Market, Product, Traction, and Financials, investment thesis, red flags, due diligence questionnaire, and IC-ready next steps. Structured the same way every time.",
  },
  {
    q: "How long does it take to generate a memo?",
    a: "Analysis runs in the background. You can close the browser — the memo appears in your account when ready, and you'll get an email notification.",
  },
  {
    q: "Can Sam replace a human analyst or associate?",
    a: "No. Sam handles the repetitive first-screening layer — consistent structure, scoring, red flags — so your analyst can focus on the deals worth deeper work. It is infrastructure, not a substitute for judgment.",
  },
  {
    q: "What stage of startups does Sam work best for?",
    a: "Pre-seed through Series A. The framework is stage-aware: traction weighs less at pre-seed, more at Series A. Later-stage evaluation is available and benchmarked against public comparables, but pre-seed to Series A is where Sam's framework delivers the most differentiation.",
  },
  {
    q: "Do I need any technical setup to use Sam?",
    a: "No. Upload a PDF, or forward a deck by email. The memo appears in your account. No CRM integration required, no data warehouse, no IT project.",
  },
  {
    q: "Is Sam suitable for a solo angel investor, or only for funds?",
    a: "Both. The Angel tier is priced for individual investors handling their own deal flow. The Fund tier adds team accounts, priority processing, and shared memo libraries. Same framework, different workflow.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white via-[#F4FAF6] to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_80%_40%,rgba(0,168,107,0.08),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_20%_70%,rgba(127,217,170,0.10),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
          {/* Left: sticky heading */}
          <Reveal direction="left" className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
              <HelpCircle className="h-3 w-3" />
              Reference
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
              Questions,
              <br />
              <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
                answered.
              </span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Everything investors have asked us during pilots and preview calls. If your question isn&apos;t here, we&apos;ll answer it personally.
            </p>

            <a
              href="mailto:hello@sam.ai"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0A2E22] shadow-sm hover:border-[#0F3D2E]/30 hover:shadow-md transition-all"
            >
              <Mail className="h-3.5 w-3.5" />
              hello@sam.ai
            </a>

            <div className="mt-8 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                {questions.length.toString().padStart(2, "0")} questions
              </span>
              <span className="text-border">·</span>
              <span>Updated April 2026</span>
            </div>
          </Reveal>

          {/* Right: accordion Q&A */}
          <div className="space-y-3">
            {questions.map((item, i) => {
              const isOpen = open === i
              return (
                <Reveal key={i} delay={i * 0.04}>
                  <motion.div
                    layout
                    className={`group rounded-2xl border transition-all ${
                      isOpen
                        ? "border-primary/30 bg-white shadow-xl shadow-primary/5"
                        : "border-[#0F3D2E]/10 bg-white/60 backdrop-blur hover:border-primary/20 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start gap-4 md:gap-6 p-5 md:p-6 text-left"
                    >
                      <span className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors ${
                        isOpen
                          ? "bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20"
                          : "bg-[#0F3D2E]/5 text-[#0F3D2E]/70 group-hover:bg-[#0F3D2E]/10"
                      }`}>
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-heading text-base md:text-lg font-semibold leading-snug transition-colors ${
                          isOpen ? "text-[#0A2E22]" : "text-[#0A2E22]/80 group-hover:text-[#0A2E22]"
                        }`}>
                          {item.q}
                        </h3>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="mt-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed pr-8">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                        isOpen
                          ? "bg-[#D4FF6B] rotate-45"
                          : "bg-[#0F3D2E]/5 group-hover:bg-[#0F3D2E]/10"
                      }`}>
                        <Plus className={`h-4 w-4 stroke-[2.5] ${isOpen ? "text-[#0A2E22]" : "text-[#0F3D2E]/70"}`} />
                      </span>
                    </button>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
