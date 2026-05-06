import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  Upload, Gauge, FileText, Scale,
  ArrowRight, Users, Globe2, Package, TrendingUp, Landmark, Building2,
} from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

// Light-field aesthetic aligned to mockup4 + design briefing v4 (May 2026):
// off-white field, INK headlines with serif-italic accents, hairline borders,
// Geist sans, BONE band for the framework section.
const FIELD = "#FFFFFF"
const SOFT_FIELD = "#F7F7F2"
const BONE = "#DDD8C8"
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const ACCENT = "#0F3D2E"
const LIME = "#D7FE3F"

const steps = [
  {
    icon: Upload,
    title: "Submit the deck",
    body: "Upload a PDF, or forward the deck to your Sam intake address. Supporting documents — founder memos, data-room exports, financial models — can be attached alongside.",
  },
  {
    icon: Gauge,
    title: "Six-domain assessment runs",
    body: "Sam evaluates the deck across Team, Market, Product, Traction, Finance, and Exit. Each domain applies the same scoring rubric with stage-aware weights, so a pre-seed deck is judged on pre-seed criteria.",
  },
  {
    icon: FileText,
    title: "Structured assessment delivered",
    body: "The assessment arrives in your account — executive summary on top, six-domain breakdown below, source-tagged claims, missing-info checklist and Ask Sam co-pilot in context. Word + PDF export available.",
  },
  {
    icon: Scale,
    title: "Compare, track and decide",
    body: "Every assessment follows the same structure. Compare deal twelve to deal two. Reference the thesis you wrote six months ago. Walk into your IC with evidence, not impressions.",
  },
]

const domains = [
  { icon: Users, name: "Team", body: "Founder backgrounds, complementarity, domain expertise and execution signals. Enriched with LinkedIn and public sources where available, with founder-market fit flagged at specifics — not \"strong team\" but \"two-thirds of the team has domain tenure, the commercial lead does not.\"" },
  { icon: Globe2, name: "Market", body: "TAM / SAM / SOM validated against independent sources, not accepted as stated. Competitive landscape mapped, market timing assessed, with a \"why now\" verdict — flagged if the thesis depends on a trend that may have already passed." },
  { icon: Package, name: "Product", body: "Sam runs the 10× test — meaningful improvement or marginal? PMF signals weighted (early revenue, retention curves, pilot-to-paid). Moat assessment looks for defensibility: network effects, data advantage, technical depth, distribution." },
  { icon: TrendingUp, name: "Traction", body: "Revenue figures cross-checked against deck claims. Unit economics — CAC, LTV, payback — calculated where data is available. Retention and capital efficiency evaluated against stage benchmarks. If numbers don't reconcile, Sam flags it." },
  { icon: Landmark, name: "Finance", body: "Business model, revenue quality, burn, runway, valuation, funding need and use of funds — highlighting what is clear, what is missing, and what needs further diligence." },
  { icon: Building2, name: "Exit", body: "Exit range, timeline, acquirer landscape and exit red flags. Benchmarked against public comparables and recent precedent transactions in the sector and stage." },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — light field with serif-italic accent */}
        <section className="relative pt-16 md:pt-24 pb-20">
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              How it works
            </p>
            <h1
              className="mt-5 font-bold leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: "clamp(40px, 7vw, 88px)" }}
            >
              From deck to decision,{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                in four steps.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] md:text-[17px] leading-[1.55]" style={{ color: SUBINK }}>
              Sam processes pitch decks through a fixed evaluation pipeline. Every deck follows the
              same path. Every assessment has the same structure.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register?tier=professional"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                style={{ background: INK, color: "#FFF" }}
              >
                Analyse a deck
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold border-[1.5px] hover:bg-foreground/[0.04] transition"
                style={{ borderColor: RULE, color: INK }}
              >
                View sample assessment
              </Link>
            </div>
          </div>
        </section>

        {/* 4-step pipeline — light cards on soft field */}
        <section
          className="relative py-24 md:py-28 border-t"
          style={{ borderColor: RULE, background: SOFT_FIELD }}
        >
          <div className="relative mx-auto max-w-[1100px] px-6">
            <Reveal className="max-w-2xl mb-14">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                The pipeline
              </p>
              <h2
                className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                Four steps,{" "}
                <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                  every deck.
                </span>
              </h2>
            </Reveal>

            <RevealGroup className="space-y-4" stagger={0.08}>
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <RevealItem key={s.title}>
                    <div
                      className="group relative rounded-3xl bg-white p-6 md:p-8 transition hover:-translate-y-0.5"
                      style={{ border: `1px solid ${RULE}` }}
                    >
                      <div className="flex gap-5 md:gap-6">
                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <span className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                            0{i + 1}
                          </span>
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl"
                            style={{ background: SOFT_FIELD, border: `1px solid ${RULE}` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                          </div>
                          {i < steps.length - 1 && (
                            <span className="flex-1 w-px min-h-[1.5rem]" style={{ background: RULE }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[18px] md:text-[20px] tracking-[-0.01em]">
                            {s.title}
                          </h3>
                          <p className="mt-2 text-[14.5px] leading-[1.6]" style={{ color: SUBINK }}>
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

        {/* Framework "is the product" — BONE band */}
        <section
          className="relative py-24 md:py-28 border-y"
          style={{ borderColor: RULE, background: BONE }}
        >
          <div className="mx-auto max-w-[900px] px-6 text-center">
            <Reveal>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                The framework
              </p>
              <h2
                className="mt-4 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(40px, 6vw, 76px)" }}
              >
                The model is not the product.{" "}
                <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                  The investment framework is.
                </span>
              </h2>
            </Reveal>
            <Reveal className="mt-10">
              <div
                className="space-y-5 text-[15.5px] md:text-[16.5px] leading-[1.65]"
                style={{ color: "rgba(10,10,10,0.78)" }}
              >
                <p>
                  Sam&apos;s output quality is not a function of the model. It is a function of the
                  framework applied to the model. The framework draws from academic research in
                  founder-market fit, early-stage venture returns, and unit economics at each stage.
                </p>
                <p>
                  Each domain has a weighted scoring rubric that adjusts for stage — a pre-seed
                  deck is not judged against Series A traction standards. Red flags are classified
                  by severity, not volume. The output remains consistent even if the underlying
                  model changes.
                </p>
                <p className="font-semibold" style={{ fontSize: "clamp(17px, 2.2vw, 22px)" }}>
                  That is the point: the framework stays constant, so your assessments stay
                  comparable.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Domain deep-dives — six cards (added Exit per design) */}
        <section className="relative py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
          <div className="relative mx-auto max-w-[1100px] px-6">
            <Reveal className="max-w-2xl mb-14">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                Domain deep-dives
              </p>
              <h2
                className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                Six domains,{" "}
                <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                  scored 0 — 100.
                </span>
              </h2>
              <p className="mt-5 text-[15.5px] leading-[1.55] max-w-xl" style={{ color: SUBINK }}>
                What Sam looks at in each part of your deck.
              </p>
            </Reveal>

            <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.06}>
              {domains.map((d, i) => {
                const Icon = d.icon
                return (
                  <RevealItem key={d.name}>
                    <div
                      className="group relative h-full rounded-3xl bg-white p-6 md:p-7 transition hover:-translate-y-1"
                      style={{ border: `1px solid ${RULE}` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl"
                          style={{ background: SOFT_FIELD, border: `1px solid ${RULE}` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                            0{i + 1}
                          </span>
                          <h3 className="font-bold text-[18px] md:text-[20px] tracking-[-0.01em]">
                            {d.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[14px] leading-[1.6]" style={{ color: SUBINK }}>
                        {d.body}
                      </p>
                    </div>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </div>
        </section>

        {/* CTA — INK card on light */}
        <section className="py-24 md:py-32 border-t" style={{ borderColor: RULE }}>
          <Reveal className="mx-auto max-w-[1100px] px-6">
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20"
              style={{ background: INK, color: "#FFF" }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-25"
                style={{
                  background: `radial-gradient(ellipse 60% 40% at 30% 30%, rgba(0,168,107,0.35), transparent 70%)`,
                }}
              />
              <div className="relative text-center">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: LIME }}>
                  Try Sam
                </p>
                <h2
                  className="mt-4 font-bold tracking-[-0.025em] leading-[1.02]"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                  See what a Sam{" "}
                  <span className="font-serif italic font-normal" style={{ color: LIME }}>
                    assessment looks like.
                  </span>
                </h2>
                <p className="mt-5 mx-auto max-w-xl text-[15.5px] leading-[1.55] text-white/70">
                  Upload a deck, get a structured assessment. No onboarding call required.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register?tier=professional"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                    style={{ background: LIME, color: INK }}
                  >
                    Analyse a deck
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/sample"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold border-[1.5px] hover:bg-white/5 transition"
                    style={{ borderColor: "rgba(255,255,255,0.18)", color: "#FFF" }}
                  >
                    View sample assessment
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
