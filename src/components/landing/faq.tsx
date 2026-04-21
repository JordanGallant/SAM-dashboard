"use client"

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

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
  return (
    <section className="py-24 border-t">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
          {/* Left: sticky heading */}
          <Reveal direction="left" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-mono uppercase tracking-widest text-amber-600">Reference</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
              Questions, answered.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Everything investors have asked us during pilots and preview calls. If your question isn&apos;t here, email{" "}
              <a href="mailto:hello@sam.ai" className="underline hover:text-foreground">hello@sam.ai</a>.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <span>{questions.length.toString().padStart(2, "0")} items</span>
              <span className="text-border">·</span>
              <span>April 2026</span>
            </div>
          </Reveal>

          {/* Right: numbered Q&A */}
          <RevealGroup className="space-y-0" stagger={0.05}>
            {questions.map((item, i) => (
              <RevealItem key={i}>
                <div className="group grid grid-cols-[3rem_1fr] gap-4 md:gap-6 py-7 border-b last:border-b-0 border-border transition-colors hover:bg-slate-50/50 -mx-4 px-4 rounded-md">
                  <span className="text-xs font-mono text-muted-foreground pt-1 transition-colors group-hover:text-amber-600">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-base md:text-lg font-semibold leading-snug">
                      {item.q}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
