import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, FileText } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Zap className="h-3 w-3 text-amber-500" />
            AI-Powered Due Diligence
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl font-heading">
            From deck to decision
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              in minutes, not weeks
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            SAM analyzes pitch decks, transcripts, and DD documents to deliver structured investment analysis with scored verdicts. Built for VCs who want speed without sacrificing depth.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "text-base px-8" })}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="#pricing" className={buttonVariants({ variant: "outline", size: "lg", className: "text-base px-8" })}>
              View Pricing
            </Link>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">14 days free. No credit card required.</p>
        </div>

        {/* Header image placeholder */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-xl border bg-gradient-to-br from-slate-100 to-slate-50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="flex items-center gap-1.5 border-b bg-slate-100/80 px-4 py-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-[10px] text-muted-foreground">test.jgsleepy.xyz/deals/deal-1/summary</span>
            </div>
            <div className="p-8 md:p-12 flex items-center justify-center min-h-[300px]">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-3 rounded-lg bg-red-100 border border-red-200 px-5 py-2.5">
                  <span className="text-2xl font-bold font-heading text-red-800">DENY</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Confidence: Low</span>
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Score: 24/100</span>
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                  Executive Summary with verdict, scorecard, strengths, risks, and data completeness — all generated from uploaded documents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Analysis in minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>Stage-aware scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>Word doc export</span>
          </div>
        </div>
      </div>
    </section>
  )
}
