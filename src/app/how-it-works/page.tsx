import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Upload, Gauge, FileText, Scale, ArrowRight, Users, Globe2, Package, TrendingUp, Landmark, Sparkles, Workflow } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const steps = [
  {
    icon: Upload,
    title: "Submit the deck",
    body: "Upload a PDF, or forward the deck to your Sam intake address — based on your tier. Supporting documents — founder memos, data-room exports, financial models — can be attached alongside.",
  },
  {
    icon: Gauge,
    title: "Framework analysis across five domains",
    body: "Sam evaluates the deck across Team, Market, Product, Traction, and Financials. Each domain applies the same scoring rubric with stage-aware weights, so a pre-seed deck is judged on pre-seed criteria.",
  },
  {
    icon: FileText,
    title: "Structured memo delivered",
    body: "The memo arrives in your account — executive summary on page one, full analysis below. PDF export is available. Shareable link if your team works across accounts.",
  },
  {
    icon: Scale,
    title: "Compare, Track and prepare your next decision",
    body: "Every memo follows the same structure. Compare deal twelve to deal two. Reference the thesis you wrote six months ago. Walk into your IC with evidence, not impressions.",
  },
]

const domains = [
  {
    icon: Users,
    name: "Team",
    body: "Sam evaluates founder backgrounds, complementarity, domain expertise, and execution signals. It can enrich with LinkedIn and public sources for prior roles, identifies gaps in team composition, and flags founder-market fit with specifics — not \"strong team\", but \"two-thirds of the team has domain tenure, the commercial lead does not.\"",
  },
  {
    icon: Globe2,
    name: "Market",
    body: "TAM, SAM, and SOM are validated against independent sources — not accepted as stated. Sam identifies the competitive landscape, maps direct and adjacent players, and assesses market timing. The output includes a \"why now\" verdict, flagged if the thesis depends on a trend that may have already passed.",
  },
  {
    icon: Package,
    name: "Product",
    body: "Sam runs the 10x test: is this a meaningful improvement on the current state, or a marginal one? Product-market fit signals are weighted — early revenue, retention curves, pilot-to-paid conversion. Moat assessment looks for defensibility: network effects, data advantage, technical depth, or distribution.",
  },
  {
    icon: TrendingUp,
    name: "Traction",
    body: "Revenue figures are cross-checked against deck claims. Unit economics — CAC, LTV, payback — are calculated where data is available. Retention and capital efficiency are evaluated against stage-appropriate benchmarks. If the numbers don't reconcile, Sam flags it.",
  },
  {
    icon: Landmark,
    name: "Financials",
    body: "Sam reviews the financial narrative behind the company: business model, revenue quality, burn, runway, valuation, funding need and use of funds — highlighting what is clear, what is missing, and what needs further diligence.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero — dark forest */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] text-white">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#D4FF6B]/15 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-4 py-24 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4FF6B]/30 bg-[#D4FF6B]/10 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#D4FF6B]">
              <Workflow className="h-3 w-3" />
              How it works
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-white">
              From deck to decision,
              <br />
              <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
                in four steps.
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
              Sam processes pitch decks through a fixed evaluation pipeline. Every deck follows the same path. Every memo has the same structure.
            </p>
          </div>
        </section>

        {/* 4 steps */}
        <section className="relative py-24 md:py-28 border-t bg-gradient-to-b from-white via-[#F4FAF6] to-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_20%_40%,rgba(15,61,46,0.06),transparent_70%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(212,255,107,0.10),transparent_70%)]" />

          <div className="relative mx-auto max-w-5xl px-4">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
                The pipeline
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
                Four steps,
                <br />
                <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
                  every deck.
                </span>
              </h2>
            </Reveal>

            <RevealGroup className="space-y-4 md:space-y-5" stagger={0.08}>
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <RevealItem key={s.title}>
                    <div className="group relative rounded-3xl border border-[#0F3D2E]/10 bg-white p-6 md:p-8 shadow-sm hover:border-primary/30 hover:shadow-xl transition-all">
                      <div className="flex gap-5 md:gap-6">
                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            0{i + 1}
                          </span>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/5 ring-1 ring-[#0F3D2E]/10 group-hover:from-[#0F3D2E]/10 group-hover:to-[#00A86B]/15 group-hover:ring-primary/30 transition-all">
                            <Icon className="h-5 w-5 text-[#0F3D2E]" />
                          </div>
                          {i < steps.length - 1 && (
                            <span className="flex-1 w-px bg-gradient-to-b from-[#0F3D2E]/20 via-[#0F3D2E]/10 to-transparent min-h-[1.5rem]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-bold text-lg md:text-xl text-[#0A2E22] tracking-tight">
                            {s.title}
                          </h3>
                          <p className="mt-2 text-[14px] md:text-[15px] text-muted-foreground leading-relaxed">
                            {s.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </div>
        </section>

        {/* "Framework is the product" — dark forest */}
        <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] text-white">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#D4FF6B]/10 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-4">
            <Reveal className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4FF6B]/30 bg-[#D4FF6B]/10 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#D4FF6B]">
                The framework
              </div>
              <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-white">
                The framework
                <br />
                <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
                  is the product.
                </span>
              </h2>
            </Reveal>
            <Reveal className="mt-10 space-y-5 text-base md:text-lg text-white/75 leading-relaxed">
              <p>
                Sam&apos;s output quality is not a function of the model. It is a function of the framework applied to the model. The framework itself draws from academic research in founder-market fit, early-stage venture returns, and unit economics at each investment stage.
              </p>
              <p>
                Each domain has a weighted scoring rubric that adjusts for stage — a pre-seed deck is not judged against Series A traction standards. Red flags are classified by severity, not volume. The output would remain consistent even if the underlying model changed.
              </p>
              <p className="font-semibold text-white text-lg md:text-xl">
                That is the point: the framework stays constant, so your memos stay comparable.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Domain deep-dives */}
        <section className="relative py-24 md:py-28 border-t bg-gradient-to-b from-[#F4FAF6] via-white to-[#F4FAF6]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,168,107,0.10),transparent_70%)]" />

          <div className="relative mx-auto max-w-5xl px-4">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
                Domain deep-dives
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
                Five domains,
                <br />
                <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
                  scored 0 — 100.
                </span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                What Sam looks at in each part of your deck.
              </p>
            </Reveal>

            <RevealGroup className="grid gap-4 md:gap-5 md:grid-cols-2" stagger={0.08}>
              {domains.map((d, i) => {
                const Icon = d.icon
                return (
                  <RevealItem key={d.name}>
                    <div className="group relative h-full rounded-3xl border border-[#0F3D2E]/10 bg-white p-6 md:p-7 shadow-sm hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/5 ring-1 ring-[#0F3D2E]/10 group-hover:ring-primary/30 transition-all">
                          <Icon className="h-5 w-5 text-[#0F3D2E]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            0{i + 1}
                          </span>
                          <h3 className="font-heading font-bold text-lg md:text-xl text-[#0A2E22] tracking-tight">
                            {d.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[14px] text-muted-foreground leading-relaxed">
                        {d.body}
                      </p>
                    </div>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </div>
        </section>

        {/* CTA — dark forest block */}
        <section className="py-24 md:py-28 px-4 border-t bg-gradient-to-b from-white to-[#F4FAF6]">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#1A6B47] px-8 py-16 md:px-16 md:py-20 shadow-2xl shadow-[#0F3D2E]/30">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00A86B]/20 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="relative text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#D4FF6B]">
                  <Sparkles className="h-3 w-3" />
                  Try Sam
                </span>
                <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-white">
                  See what a Sam memo
                  <br />
                  looks like.
                </h2>
                <p className="mt-4 text-white/65 max-w-xl mx-auto">
                  Upload a deck, get a memo. No onboarding call required.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register?tier=professional"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#0A2E22] px-7 py-3.5 text-sm font-semibold shadow-xl shadow-[#D4FF6B]/25 hover:shadow-2xl hover:shadow-[#D4FF6B]/40 transition-all hover:-translate-y-0.5"
                  >
                    Analyse a deck
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/sample"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur text-white px-7 py-3.5 text-sm font-semibold transition-all"
                  >
                    See a sample memo
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}
