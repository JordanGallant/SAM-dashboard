import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Shield, FileCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl font-heading">
            From pitch deck
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              to investment decision.
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Sam analyses pitch decks across five investment domains and returns a scored, IC-ready memo. Built for European investors who need consistent, defensible evaluation — not summaries.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register?tier=professional" className={buttonVariants({ size: "lg", className: "text-base px-8" })}>
              Start with a deck
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="#output-preview" className={buttonVariants({ variant: "outline", size: "lg", className: "text-base px-8" })}>
              See a sample memo
            </Link>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">GDPR-compliant. Servers in the European Union.</p>
        </div>

        {/* Sample memo preview */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-xl border bg-gradient-to-br from-slate-100 to-slate-50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="flex items-center gap-1.5 border-b bg-slate-100/80 px-4 py-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-[10px] text-muted-foreground">sam.ai · Executive Summary</span>
            </div>
            <div className="p-6 md:p-8 min-h-[320px] space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-lg bg-emerald-100 border border-emerald-200 px-4 py-2">
                  <span className="text-xl font-bold font-heading text-emerald-800">STRONG BUY</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Confidence: High</span>
                <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-700">82/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {[
                  { domain: "Team", score: 88 },
                  { domain: "Market", score: 76 },
                  { domain: "Product", score: 84 },
                  { domain: "Traction", score: 72 },
                  { domain: "Finance", score: 90 },
                ].map((d) => (
                  <div key={d.domain} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-14 text-muted-foreground">{d.domain}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${d.score}%` }} />
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-700 w-6 text-right">{d.score}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-white/80 border p-3 space-y-1.5">
                  <p className="text-xs font-medium text-emerald-700 flex items-center gap-1"><Shield className="h-3 w-3" /> Key Strengths</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Experienced founding team with 15+ years domain expertise. Strong regulatory tailwinds.</p>
                </div>
                <div className="rounded-lg bg-white/80 border p-3 space-y-1.5">
                  <p className="text-xs font-medium text-amber-700 flex items-center gap-1"><FileCheck className="h-3 w-3" /> Key Risks</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Capital-intensive model requires follow-on funding. Hardware margins thin at 15-25%.</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground font-mono">Executive summary — domain scores, strengths, risks, thesis.</p>
        </div>
      </div>
    </section>
  )
}
