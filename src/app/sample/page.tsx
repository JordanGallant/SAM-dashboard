import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, ArrowRight, Quote } from "lucide-react"
import { sampleAnalysis } from "@/lib/sample-analysis"

export default function SamplePage() {
  const es = sampleAnalysis.executiveSummary

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page hero — light field, design-aligned */}
        <section className="relative pt-16 md:pt-24 pb-16 md:pb-20" style={{ background: "#FFFFFF" }}>
          <div className="relative mx-auto max-w-[1240px] px-6">
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(10,10,10,0.62)" }}>
                  Sample assessment
                </p>
                <h1
                  className="mt-5 font-bold leading-[0.96] tracking-[-0.04em]"
                  style={{ fontSize: "clamp(36px, 5.5vw, 68px)", color: "#0A0A0A" }}
                >
                  See what Sam creates{" "}
                  <span className="font-serif italic font-normal" style={{ color: "#0F3D2E" }}>
                    from a pitch deck.
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-[16px] md:text-[17px] leading-[1.6]" style={{ color: "rgba(10,10,10,0.62)" }}>
                  A structured investment assessment with scores, red flags, missing information,
                  fund fit and an in-context co-pilot — across six investment domains, every deck.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(10,10,10,0.55)" }}>
                  <span>6 domains</span>
                  <span style={{ color: "rgba(10,10,10,0.18)" }}>·</span>
                  <span>source-tagged</span>
                  <span style={{ color: "rgba(10,10,10,0.18)" }}>·</span>
                  <span>IC-prep</span>
                </div>
              </div>

              {/* Browser-chrome hero screenshot */}
              <div className="relative">
                <div className="absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(15,61,46,0.10),transparent_60%)] blur-2xl" />
                <div
                  className="relative rounded-2xl bg-white shadow-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(10,10,10,0.10)" }}
                >
                  <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(10,10,10,0.10)", background: "#F7F7F2" }}>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    <span className="ml-3 flex-1 rounded-md px-3 py-1 text-[11px] font-mono truncate" style={{ background: "#FFF", border: "1px solid rgba(10,10,10,0.10)", color: "rgba(10,10,10,0.55)" }}>
                      sam.ai/deals/nexicon/summary
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/design/hero-img-new.png"
                    alt="Sam dashboard — Nexicon assessment with overall score, radar chart, and domain breakdowns"
                    className="block w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live dashboard mockups — what investors actually see in product */}
        <section
          className="relative py-24 md:py-28 border-y"
          style={{ borderColor: "rgba(10,10,10,0.10)", background: "#F7F7F2" }}
        >
          <div className="relative mx-auto max-w-[1240px] px-6">
            <div className="max-w-3xl mb-10 md:mb-14">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(10,10,10,0.62)" }}>
                In the dashboard
              </p>
              <h2
                className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(32px, 4.5vw, 56px)", color: "#0A0A0A" }}
              >
                The same assessment,{" "}
                <span className="font-serif italic font-normal" style={{ color: "#0F3D2E" }}>
                  rendered in product.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6]" style={{ color: "rgba(10,10,10,0.62)" }}>
                Every assessment is a structured document. Read it as text, export to Word, or
                work through each domain in the dashboard.
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
                    sam.ai/deals/nexicon/summary
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
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#B5D33C]/80">
                  Executive summary
                </p>
                <p className="mt-1 text-[13px] md:text-[14px] text-white/70 leading-relaxed">
                  Overall score, assessment, radar across the six domains, and the investment thesis at a glance.
                </p>
              </figcaption>
            </figure>

            {/* Supporting domain previews — alternating left/right rows.
                Each domain gets a full-width row so the screenshot reads at
                ~600px wide (vs the previous ~370px cropped tiles). The flip
                via `lg:flex-row-reverse` on even-indexed rows gives the page
                a scanning rhythm — similar to Stripe / Linear / Vercel. */}
            <div className="space-y-16 md:space-y-24">
              {[
                {
                  src: "/design/dashboard-team.png",
                  slug: "team",
                  label: "Team analysis",
                  heading: "Read the team like an analyst.",
                  desc: "Founder cards with backgrounds, strengths, key concerns, and red flags — surfaced explicitly, not buried in prose.",
                  bullets: [
                    "Per-founder background depth + tenure",
                    "Founder-market fit assessed against the deal",
                    "Red flags flagged with severity, not hidden",
                  ],
                },
                {
                  src: "/design/dashboard-market.png",
                  slug: "market",
                  label: "Market analysis",
                  heading: "Sanity-check the market in seconds.",
                  desc: "TAM / SAM / SOM validated against public sources, competitive landscape, and the 'why now' that has to hold up.",
                  bullets: [
                    "Founder claims vs. validated estimates side-by-side",
                    "Variance flagged when numbers don't reconcile",
                    "Competitor threat level per direct rival",
                  ],
                },
                {
                  src: "/design/dashboard-product.png",
                  slug: "product",
                  label: "Product analysis",
                  heading: "Test the moat narrative.",
                  desc: "Problem fit, the '10× better' test, PMF signals, and a structured moat assessment — not a vibe check.",
                  bullets: [
                    "Evidence of pain (real or asserted)",
                    "PMF signals: usage, retention, willingness to pay",
                    "Moat sources scored: data, network, switching cost, regulation",
                  ],
                },
                {
                  src: "/design/dashboard-traction.png",
                  slug: "traction",
                  label: "Traction analysis",
                  heading: "Hold the metrics to the stage.",
                  desc: "Revenue, growth, unit economics, retention — benchmarked against typical numbers for the stage being raised.",
                  bullets: [
                    "Revenue + growth metrics with status icons",
                    "Unit economics: CAC, payback, LTV when disclosed",
                    "Retention cohorts surfaced when data is there",
                  ],
                },
                {
                  src: "/design/dashboard-finance.png",
                  slug: "finance",
                  label: "Financial analysis",
                  heading: "See the cash math, not just the ask.",
                  desc: "Cash on hand, burn, runway, three valuation methods, and the investor-signal read — laid out side-by-side.",
                  bullets: [
                    "Runway computed from disclosed cash + burn",
                    "Valuation: conservative / moderate / aggressive bands",
                    "Deal terms surfaced verbatim from the deck",
                  ],
                },
              ].map((m, i) => {
                const flip = i % 2 === 1
                return (
                  <div
                    key={m.src}
                    className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16"
                  >
                    {/* Screenshot side */}
                    <figure className={`group ${flip ? "lg:order-2" : ""}`}>
                      <div className="rounded-2xl bg-[#0F1B17]/85 ring-1 ring-white/10 shadow-2xl shadow-black/40 overflow-hidden transition-transform group-hover:-translate-y-0.5">
                        <div className="flex items-center gap-2 border-b border-white/10 bg-[#0A1A14]/80 px-4 py-2.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                          <span className="ml-3 flex-1 rounded-md bg-white/5 ring-1 ring-white/10 px-3 py-1 text-[11px] font-mono text-white/40 truncate">
                            sam.ai/deals/nexicon/{m.slug}
                          </span>
                        </div>
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.src}
                            alt={`Sam dashboard — ${m.label}`}
                            className="absolute inset-0 w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F1B17] to-transparent" />
                        </div>
                      </div>
                    </figure>

                    {/* Info side */}
                    <div className={flip ? "lg:order-1" : ""}>
                      <p
                        className="text-[11px] font-mono uppercase tracking-[0.2em]"
                        style={{ color: "#0F3D2E" }}
                      >
                        {m.label}
                      </p>
                      <h3
                        className="mt-3 font-bold tracking-[-0.02em] leading-[1.08]"
                        style={{
                          fontSize: "clamp(26px, 3.2vw, 36px)",
                          color: "#0A0A0A",
                        }}
                      >
                        {m.heading}
                      </h3>
                      <p
                        className="mt-4 text-[15.5px] leading-[1.6]"
                        style={{ color: "rgba(10,10,10,0.62)" }}
                      >
                        {m.desc}
                      </p>
                      <ul className="mt-5 space-y-2.5">
                        {m.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 text-[14px] leading-[1.55]"
                            style={{ color: "rgba(10,10,10,0.78)" }}
                          >
                            <span
                              className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: "#0F3D2E" }}
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
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

            {/* Assessment header — verdict-flavoured chip removed per launch
                feedback ("framed as next-step language rather than verdict
                language"). Score + confidence + first recommended next-step
                replace the EXPLORE/DECLINE/PASS pill. */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-3">Assessment</p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-white border px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                      Confidence · {es.confidence}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-mono font-bold text-primary leading-none">{es.overallScore}</span>
                    <span className="text-sm font-mono text-muted-foreground">/100</span>
                  </div>
                </div>
                {es.recommendedNextSteps?.[0] && (
                  <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mr-2">
                      Recommended next step
                    </span>
                    {es.recommendedNextSteps[0]}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Domain scores */}
            <Card>
              <CardHeader className="pb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Investment scorecard</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-xs">
                  {es.scorecard.map((row) => (
                    <div key={row.domain} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-4">
                      <span className="text-muted-foreground tracking-wider uppercase">{row.domain}</span>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${row.score}%` }} />
                      </div>
                      <span className="font-semibold text-primary text-right tabular-nums">{row.score}</span>
                    </div>
                  ))}
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

        {/* Long-form prose — excerpt from a real Sam memo */}
        <section className="py-20 border-t bg-gradient-to-b from-white to-slate-50/60">
          <div className="mx-auto max-w-4xl px-4">
            <div className="max-w-2xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-primary">From a sample assessment</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold font-heading tracking-tight">
                Sam&rsquo;s writing voice.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Assessments are written in the same disciplined style an analyst would use — direct, evidence-led, and frank about gaps. Below: excerpts from a Sam-generated assessment on <span className="font-medium text-foreground">Nexicon</span>, a Seed-stage GTM productivity company that scored 24/100. Company details have been changed.
              </p>
            </div>

            {/* Magazine-style pull quote */}
            <figure
              className="relative mt-10 rounded-3xl text-white p-8 md:p-10 overflow-hidden"
              style={{ background: "#0A0A0A" }}
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-25 pointer-events-none"
                style={{ background: "radial-gradient(closest-side, #B5D33C, transparent 70%)" }}
              />
              <Quote className="h-8 w-8 mb-4" style={{ color: "#B5D33C", opacity: 0.7 }} />
              <blockquote
                className="relative text-lg md:text-2xl leading-snug tracking-tight font-medium"
                style={{ color: "#FFF" }}
              >
                &ldquo;This is not investable in its current form — not necessarily because the
                opportunity is bad, but because there is virtually{" "}
                <span className="font-serif italic font-normal" style={{ color: "#B5D33C" }}>
                  no information
                </span>{" "}
                upon which to base an investment decision.&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(181,211,60,0.85)" }}>
                <span>Investment thesis</span>
                <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
                <span>Nexicon · 24/100 · Pass with feedback</span>
              </figcaption>
            </figure>

            {/* Prose excerpts — editorial cards */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Team — founder-market fit</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-[15px] leading-relaxed text-foreground/85">
                    &ldquo;Founder-market fit is the single most important signal at seed stage, and it is entirely unassessable here. The GTM productivity space requires founders with deep, lived experience inside Go-to-Market organizations — as SDRs, AEs, sales leaders, marketing ops professionals, or RevOps builders. There is zero evidence that either co-founder has any such experience. In a market this competitive, with billions deployed across well-funded incumbents, the burden of proof is on the founding team to demonstrate why they have a right to win — and that burden is entirely unmet.&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Market — &lsquo;Why Now?&rsquo;</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-[15px] leading-relaxed text-foreground/85">
                    &ldquo;The most plausible timing catalyst is the explosion of generative AI capabilities creating a window for AI-native GTM tools. However, this timing argument cuts both ways: AI enables new entrants but also enables incumbents (Outreach, Salesloft, HubSpot, Salesforce) to rapidly add AI features to existing platforms with massive distribution advantages. The window for AI-native GTM startups may be narrowing, not widening. Every competitor in the space is citing the same AI tailwind. Without an explicit, differentiated timing thesis, Nexicon has no discernible timing edge.&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Traction assessment — score 12</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-[15px] leading-relaxed text-foreground/85">
                    &ldquo;Traction scores 12/100 — Weak. This is the lowest-scoring domain, reflecting the complete absence of any traction signal. At seed stage, even pre-revenue, we expect some evidence of market pull: pilot customers, LOIs, a waitlist, design partners, or at minimum customer discovery insights. None is present. Combined with a hyper-competitive market and no articulated product differentiation, the traction picture provides zero basis for investment conviction.&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="mt-8 text-xs text-muted-foreground max-w-2xl">
              Excerpted from a Sam-generated assessment. Company details have been changed. Numbers and prose are produced by the same pipeline that runs on every deck you upload.
            </p>
          </div>
        </section>

        {/* CTA — INK card on light field */}
        <section className="py-24 md:py-28 border-t" style={{ borderColor: "rgba(10,10,10,0.10)" }}>
          <div className="mx-auto max-w-[1100px] px-6">
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-14 md:py-16"
              style={{ background: "#0A0A0A", color: "#FFF" }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(0,168,107,0.35), transparent 70%)" }}
              />
              <div className="relative text-center">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "#B5D33C" }}>
                  Your assessment
                </p>
                <h2
                  className="mt-4 font-bold tracking-[-0.025em] leading-[1.04]"
                  style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                >
                  Run the same analysis on{" "}
                  <span className="font-serif italic font-normal" style={{ color: "#B5D33C" }}>
                    your next deck.
                  </span>
                </h2>
                <p className="mt-5 mx-auto max-w-xl text-[15.5px] leading-[1.55] text-white/70">
                  Upload a pitch deck and get a structured, scored assessment back. No onboarding,
                  no integrations.
                </p>
                <div className="mt-9 flex justify-center">
                  <Link
                    href="/register?tier=professional"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                    style={{ background: "#B5D33C", color: "#0A0A0A" }}
                  >
                    Analyse a deck
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/55">
                  <span>No credit card</span>
                  <span className="text-white/20">·</span>
                  <span>EU-hosted</span>
                  <span className="text-white/20">·</span>
                  <span>GDPR by design</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
