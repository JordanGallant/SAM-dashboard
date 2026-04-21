"use client"

import { Check, X, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { Reveal } from "@/components/motion/reveal"

type CellValue = boolean | "partial"

const features: { label: string; chatgpt: CellValue; database: CellValue; sam: CellValue }[] = [
  { label: "Structured five-domain framework", chatgpt: false, database: false, sam: true },
  { label: "Scored 0 — 100 with verdicts", chatgpt: false, database: false, sam: true },
  { label: "Consistent memos, comparable across deals", chatgpt: false, database: "partial", sam: true },
  { label: "Validates claims against sources", chatgpt: false, database: true, sam: true },
  { label: "Red flags classified by severity", chatgpt: false, database: false, sam: true },
  { label: "Hosted in the EU / GDPR by design", chatgpt: false, database: "partial", sam: true },
]

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 mx-auto">
        <Check className="h-4 w-4 text-primary" />
      </div>
    )
  }
  if (value === "partial") {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 mx-auto">
        <Minus className="h-4 w-4 text-amber-700" />
      </div>
    )
  }
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 mx-auto">
      <X className="h-4 w-4 text-slate-400" />
    </div>
  )
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export function Comparison() {
  return (
    <section className="py-24 border-t bg-slate-50/50">
      <div className="mx-auto max-w-5xl px-4">
        <Reveal className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">Where Sam sits</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Structured analysis,
            <br />
            <span className="text-muted-foreground">not freeform summaries.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sam is the evaluation layer that sits between the deck and the decision. Other tools help you find deals or store them — Sam is what tells you whether to invest.
          </p>
        </Reveal>

        <Reveal>
          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium">
                      Capability
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium">
                      Generic AI
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium">
                      Startup database
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-mono uppercase tracking-wider text-primary font-semibold bg-primary/5">
                      Sam
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ staggerChildren: 0.06 }}
                >
                  {features.map((f, i) => (
                    <motion.tr
                      key={f.label}
                      variants={rowVariants}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={i !== features.length - 1 ? "border-b" : ""}
                    >
                      <td className="px-6 py-4 text-foreground/90">{f.label}</td>
                      <td className="px-4 py-4"><Cell value={f.chatgpt} /></td>
                      <td className="px-4 py-4"><Cell value={f.database} /></td>
                      <td className="px-4 py-4 bg-primary/5"><Cell value={f.sam} /></td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <p className="text-xs text-center text-muted-foreground font-mono">
            Sam is not a startup database (that&apos;s Dealroom). Not a CRM (Affinity). Not a data platform (PitchBook). Sam is the evaluation layer on top of the deck.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
