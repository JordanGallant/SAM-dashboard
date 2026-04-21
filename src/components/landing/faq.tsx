"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const questions = [
  {
    q: "How is Sam different from using ChatGPT to analyse a pitch deck?",
    a: "Sam is not a chatbot. It applies a fixed five-domain evaluation framework to every deck, produces scored verdicts, and maintains consistency across memos. ChatGPT reshuffles the words in your deck and tells you they look good. The two are not substitutes.",
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
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 border-t">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">FAQ</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-2">
          {questions.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border bg-card overflow-hidden transition-colors",
                  isOpen && "border-l-4 border-l-amber-500"
                )}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-medium text-sm md:text-base">{item.q}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
