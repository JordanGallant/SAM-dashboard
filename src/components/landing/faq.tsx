"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, HelpCircle, Mail } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"

// FAQ answers support both plain paragraphs (strings) and bulleted blocks
// (`{ bullets: [...] }`). Iteration order is preserved so the render walks
// the array and emits <p> or <ul> per entry. This avoids splitting answers
// by line-magic and keeps the data shape explicit.
type AnswerBlock = string | { bullets: string[] }

const questions: { q: string; a: AnswerBlock[] }[] = [
  {
    q: "How is Sam different from using generic AI to analyse a pitch deck?",
    a: [
      "Sam applies a fixed six-domain investment framework to every deck. Same structure, scoring rubric, and severity classifications every time.",
      "Generic AI returns whatever comes out of a prompt, so the output varies, cannot be compared across deals, and lacks a repeatable methodology.",
      "Sam's framework is the product; the model is just the engine.",
    ],
  },
  {
    q: "Does Sam give investment advice or replace partners?",
    a: [
      "No. Sam is decision support, not investment advice.",
      "Sam handles the repetitive first-screening layer: structuring the deck, scoring the opportunity, flagging risks, identifying missing information, and preparing follow-up questions.",
      "Partners, analysts, and investors still make the judgment. Sam helps them spend more time on the deals worth deeper work — and on the conversations only humans can run.",
    ],
  },
  {
    q: "What does source attribution actually mean?",
    a: [
      "Every claim in a Sam assessment is tagged with its source:",
      {
        bullets: [
          "Pitch Deck — unvalidated",
          "Source: LinkedIn",
          "Source: Knowledge Base",
          "Source: market report",
          "Generated inference",
        ],
      },
      "This means you can always see the basis for each claim — whether it comes from the founder's deck, an external reference, your fund context, or Sam's own reasoning.",
      "Unvalidated claims are flagged explicitly. External references still need to be reviewed by the investor before making a decision.",
    ],
  },
  {
    q: "Is my pitch deck data secure and confidential?",
    a: [
      "Yes. Sam is designed for confidential investor workflows.",
      {
        bullets: [
          "Decks are processed and stored within the EU.",
          "Submitted decks are not used to train any AI model — ours or anyone else's.",
          "Access is controlled within your workspace.",
          "Retention and deletion requirements can be configured for Fund customers.",
        ],
      },
      "As with any investment workflow, users should only upload materials they are authorised to review and process.",
    ],
  },
  {
    q: "How does fund-fit work? What can I upload?",
    a: [
      "You can upload your fund one-pager or define your thesis, stage focus, sector focus, geography, and ticket size directly in Sam.",
      "Sam then compares each deck against your mandate and shows how well the opportunity fits your criteria. Fund-fit can include:",
      {
        bullets: [
          "stage match",
          "sector match",
          "geography match",
          "ticket-size match",
          "thesis alignment",
          "portfolio conflict indication",
        ],
      },
      "Full fund-fit scoring is included in the Fund tier. A lighter fund-fit view is available in Pro.",
    ],
  },
  {
    q: "Can I export the assessment?",
    a: [
      "Yes. Every assessment can be exported as a Word or PDF record.",
      "This helps you preserve why a deal was advanced, parked, or passed — including the score, key risks, missing information, and follow-up questions.",
      "CRM-native pushes to tools such as Affinity and HubSpot are on the roadmap.",
    ],
  },
  {
    q: "What happens when information is missing from the deck?",
    a: [
      "Missing information is flagged separately. It does not automatically reduce the score.",
      "A missing CAC figure, for example, is not the same as a bad CAC figure. Sam identifies the gap and turns it into a founder follow-up question — so you know exactly what to ask before spending more time on the deal.",
    ],
  },
  {
    q: "Does a low score mean we should pass?",
    a: [
      "No. A low score is not an automatic pass recommendation.",
      "It means Sam found weaknesses, missing evidence, or risk factors in the available materials. You may still decide to take the call if you have relevant context, founder knowledge, or a thesis-driven reason to explore.",
      "Sam frames the discussion. It does not make the decision.",
    ],
  },
  {
    q: "Can Sam replace our analyst or associate?",
    a: [
      "No. Sam supports analysts and associates — it does not replace them.",
      "Sam helps with the repetitive first-screening work: structuring the deck, surfacing risks, checking consistency, and preparing questions. Your team still owns judgment, diligence, founder conversations, and conviction.",
      "Sam helps analysts spend less time turning messy decks into structured notes — and more time on the deals that deserve deeper work.",
    ],
  },
  {
    q: "Why not build this internally with ChatGPT?",
    a: [
      "You can build a simple AI summary workflow internally. The harder part is making it consistent, fund-specific, source-aware, and usable across a team.",
      "Sam combines:",
      {
        bullets: [
          "a fixed six-domain investment framework",
          "stage-aware scoring",
          "source attribution",
          "missing-information logic",
          "Ask Sam co-pilot in context",
          "fund-fit scoring",
          "exportable decision records",
        ],
      },
      "That is the difference between a prompt and a workflow.",
    ],
  },
  {
    q: "Is Sam useful for angels and family offices, or only VC funds?",
    a: [
      "Sam is built for investors who review early-stage dealflow — regardless of fund size.",
      {
        bullets: [
          "Angels use Sam as a structured second opinion before a first call.",
          "Family offices and syndicates use Sam to create a shared first screen.",
          "VC funds use Sam to make first-pass assessments more consistent across analysts, associates, and partners.",
        ],
      },
    ],
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white via-[#FAFAF7] to-white">
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
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0F3D2E]">
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
              href="mailto:hello@samvc.ai"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F3D2E] shadow-sm hover:border-[#0F3D2E]/30 hover:shadow-md transition-all"
            >
              <Mail className="h-3.5 w-3.5" />
              hello@samvc.ai
            </a>
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
                          isOpen ? "text-[#0F3D2E]" : "text-[#0F3D2E]/80 group-hover:text-[#0F3D2E]"
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
                              <div className="mt-3 space-y-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed pr-8">
                                {item.a.map((block, bi) =>
                                  typeof block === "string" ? (
                                    <p key={bi}>{block}</p>
                                  ) : (
                                    <ul key={bi} className="space-y-1.5 pl-1">
                                      {block.bullets.map((b, bj) => (
                                        <li key={bj} className="flex items-start gap-2.5">
                                          <span
                                            aria-hidden
                                            className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F3D2E]"
                                          />
                                          <span>{b}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ),
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                        isOpen
                          ? "bg-[#B5D33C] rotate-45"
                          : "bg-[#0F3D2E]/5 group-hover:bg-[#0F3D2E]/10"
                      }`}>
                        <Plus className={`h-4 w-4 stroke-[2.5] ${isOpen ? "text-[#0F3D2E]" : "text-[#0F3D2E]/70"}`} />
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
