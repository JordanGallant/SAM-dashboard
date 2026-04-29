import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Shield, AlertTriangle, ArrowRight } from "lucide-react"
import { sampleAnalysis } from "@/lib/sample-analysis"
import { VERDICT_COLORS, DOMAIN_VERDICT_COLORS } from "@/lib/constants"

export default function SamplePage() {
  const es = sampleAnalysis.executiveSummary
  const verdictColor = VERDICT_COLORS[es.verdict]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page hero */}
        <section className="py-16 border-b bg-slate-50/50">
          <div className="mx-auto max-w-4xl px-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Sample memo</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold font-heading tracking-tight">
              What a Sam analysis looks like.
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Below is an illustrative Sam memo for a fictional Seed-stage SaaS company. Every section follows the same structure Sam produces for any deck — executive summary, scored domain breakdown, thesis, strengths, risks, and recommended next steps.
            </p>
          </div>
        </section>

        {/* Live dashboard mockups — what investors actually see in product */}
        <section className="relative py-20 md:py-24 border-b overflow-hidden bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] text-white">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#D4FF6B]/10 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="max-w-3xl mb-10 md:mb-14">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF6B]/80">In the dashboard</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold font-heading tracking-[-0.025em] leading-tight text-white">
                The same memo,{" "}
                <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
                  rendered in product.
                </span>
              </h2>
              <p className="mt-4 text-base text-white/70 leading-relaxed">
                Every memo is a structured document. You can read it as text, export it to Word, or work through each domain in the dashboard.
              </p>
            </div>

            {/* Featured — Summary (the marquee shot) */}
            <figure className="group mb-5 md:mb-6">
              <div className="rounded-2xl bg-[#0F1B17]/80 ring-1 ring-white/10 shadow-2xl shadow-black/40 overflow-hidden transition-transform group-hover:-translate-y-0.5">
                <div className="flex items-center gap-2 border-b border-white/10 bg-[#0A1A14]/80 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-3 flex-1 rounded-md bg-white/5 ring-1 ring-white/10 px-3 py-1 text-[11px] font-mono text-white/40 truncate">
                    sam.ai/deals/vrey/summary
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/design/dashboard-summary.png"
                    alt="Sam dashboard — Executive summary"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  {/* subtle bottom fade so the crop reads as intentional */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F1B17] to-transparent" />
                </div>
              </div>
              <figcaption className="mt-3.5 px-1 max-w-2xl">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#D4FF6B]/80">
                  Executive summary
                </p>
                <p className="mt-1 text-[13px] md:text-[14px] text-white/70 leading-relaxed">
                  Overall score, verdict, radar across the five domains, and the investment thesis at a glance.
                </p>
              </figcaption>
            </figure>

            {/* Supporting trio — uniform tiles, top-aligned crop so heights match */}
            <div className="grid gap-5 md:gap-6 md:grid-cols-3">
              {[
                { src: "/design/dashboard-team.png", slug: "team", label: "Team analysis", desc: "Founder cards with backgrounds, strengths, concerns, and red flags." },
                { src: "/design/dashboard-market.png", slug: "market", label: "Market analysis", desc: "TAM / SAM / SOM validated, competitive landscape, market timing." },
                { src: "/design/dashboard-finance.png", slug: "finance", label: "Financial analysis", desc: "Cash, burn, runway, valuation methods, investor signals." },
              ].map((m) => (
                <figure key={m.src} className="group">
                  <div className="rounded-2xl bg-[#0F1B17]/80 ring-1 ring-white/10 shadow-2xl shadow-black/40 overflow-hidden transition-transform group-hover:-translate-y-0.5">
                    <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#0A1A14]/80 px-3 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                      <span className="ml-2 text-[9px] font-mono text-white/35 truncate">
                        sam.ai/deals/vrey/{m.slug}
                      </span>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.src}
                        alt={`Sam dashboard — ${m.label}`}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0F1B17] to-transparent" />
                    </div>
                  </div>
                  <figcaption className="mt-3 px-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF6B]/80">
                      {m.label}
                    </p>
                    <p className="mt-1 text-[12.5px] text-white/70 leading-relaxed">{m.desc}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* The memo */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 space-y-6">
            {/* Company header */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Company</p>
                <h2 className="mt-1 text-2xl font-bold font-heading">{es.companyName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{es.sector}</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Stage</p>
                    <p className="font-medium">{es.stage}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Geography</p>
                    <p className="font-medium">{es.geography}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Raising</p>
                    <p className="font-medium">{es.raising}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">MRR</p>
                    <p className="font-medium">{es.mrr}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verdict header */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-3">Verdict</p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`inline-flex items-center rounded-md ${verdictColor.bg} ${verdictColor.border} border px-3 py-1.5`}>
                      <span className={`text-lg font-bold font-heading ${verdictColor.text}`}>{es.verdict.toUpperCase()}</span>
                    </div>
                    <span className="inline-flex items-center rounded-md bg-white border px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                      Confidence · {es.confidence}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-mono font-bold text-primary leading-none">{es.overallScore}</span>
                    <span className="text-sm font-mono text-muted-foreground">/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain scores */}
            <Card>
              <CardHeader className="pb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Investment scorecard</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-xs">
                  {es.scorecard.map((row) => {
                    const dv = DOMAIN_VERDICT_COLORS[row.verdict]
                    return (
                      <div key={row.domain} className="grid grid-cols-[6rem_1fr_2.5rem_5rem] items-center gap-4">
                        <span className="text-muted-foreground tracking-wider uppercase">{row.domain}</span>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${row.score}%` }} />
                        </div>
                        <span className="font-semibold text-primary text-right tabular-nums">{row.score}</span>
                        <span className={`${dv.text} uppercase tracking-wider text-[10px]`}>{row.verdict}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 space-y-3 border-t pt-5">
                  {es.scorecard.map((row) => (
                    <div key={row.domain} className="text-sm">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{row.domain}</p>
                      <p className="mt-0.5 text-foreground/80 leading-relaxed">{row.keyFinding}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Thesis */}
            <Card>
              <CardHeader className="pb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Investment thesis</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/80">{es.thesis}</p>
              </CardContent>
            </Card>

            {/* Strengths + Risks */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Key strengths
                  </p>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    {es.strengths.map((s) => (
                      <li key={s.id} className="flex gap-2">
                        <span className="font-mono text-muted-foreground shrink-0">{s.id}.</span>
                        <div>
                          <Badge variant="outline" className="mb-1 text-[10px] font-mono uppercase tracking-wider">
                            {s.severity}
                          </Badge>
                          <p className="text-foreground/80 leading-relaxed">{s.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Key risks
                  </p>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    {es.risks.map((r) => (
                      <li key={r.id} className="flex gap-2">
                        <span className="font-mono text-muted-foreground shrink-0">{r.id}.</span>
                        <div>
                          <Badge variant="outline" className="mb-1 text-[10px] font-mono uppercase tracking-wider">
                            {r.severity}
                          </Badge>
                          <p className="text-foreground/80 leading-relaxed">{r.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Next steps */}
            <Card>
              <CardHeader className="pb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Recommended next steps</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-foreground/80">
                  {es.recommendedNextSteps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-primary shrink-0">0{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Your memo</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold font-heading tracking-tight">
              Run the same analysis on your next deck.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Upload a pitch deck and get a structured memo back. No onboarding, no integrations.
            </p>
            <Link href="/register?tier=professional" className={buttonVariants({ size: "lg", className: "mt-6 text-base px-8" })}>
              Analyse a deck
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
