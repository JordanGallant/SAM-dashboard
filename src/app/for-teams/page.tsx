import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  ArrowRight, Check, X, Sparkles,
  Upload, Gauge, FileText, Scale,
  Users, GitCompare, History,
} from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const FIELD = "#FFFFFF"
const SOFT_FIELD = "#F7F7F2"
const BONE = "#DDD8C8"
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const ACCENT = "#0F3D2E"
const ACCENT_HI = "#00A86B"
const LIME = "#B5D33C"

const currentState = [
  "Deck opened in WhatsApp. Notes in a notebook. Follow-up in email.",
  "\"Good team — I think?\" scribbled after a 10-minute scan.",
  "One partner focuses on market. Another on valuation. No shared frame.",
  "Three months later: no one can reconstruct why the deal was passed.",
  "Every deal feels like a fresh conversation from zero.",
]

const teamGets = [
  {
    icon: Users,
    title: "Shared workspace",
    body: "Every assessment lands in a shared library. Your team reads the same assessment, in the same structure, regardless of who handled intake.",
  },
  {
    icon: GitCompare,
    title: "Deal comparison",
    body: "Compare deal twelve against deal two. Same domains, same scoring rubric, same confidence levels. Built for team decisions, not individual impressions.",
  },
  {
    icon: History,
    title: "Team memory",
    body: "Every assessment is a record. Six months later, you can explain exactly why a deal was advanced, parked or passed — with evidence, not impressions.",
  },
]

const proWorkflow = [
  {
    icon: Upload,
    title: "Submit the deck",
    body: "Upload a PDF or forward the deck to your Sam intake address. Supporting documents can be attached alongside.",
  },
  {
    icon: Gauge,
    title: "Six-domain assessment runs",
    body: "Sam evaluates Team, Market, Product, Traction, Finance and Exit using a stage-aware scoring rubric. Every deck follows the same path.",
  },
  {
    icon: FileText,
    title: "Your team gets the same assessment",
    body: "The assessment arrives in your shared workspace. Source-tagged claims, missing-info checklist and Ask Sam co-pilot — all in context.",
  },
  {
    icon: Scale,
    title: "Compare, discuss and decide",
    body: "Use the shared library to compare deals. Walk into the team discussion with evidence, not impressions.",
  },
]

const proFeatures = [
  "30 analyses / month",
  "3 seats included",
  "Shared workspace + deal comparison",
  "Source attribution & confidence tagging",
  "Missing info checklist + founder questions",
  "Light fund-fit scoring",
  "Export available",
]

export default function ForTeamsPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-16 md:pt-24 pb-20">
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              For syndicates, family offices &amp; small investment teams
            </p>
            <h1
              className="mt-5 font-bold leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: "clamp(40px, 7vw, 88px)" }}
            >
              Shared dealflow.{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                The same first screen, every time.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] md:text-[17px] leading-[1.55]" style={{ color: SUBINK }}>
              Sam helps syndicates, family offices and small investment teams review every pitch
              deck through the same structured framework — before the discussion starts.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register?tier=professional"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                style={{ background: INK, color: "#FFF" }}
              >
                Start with a deck
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

        {/* Without / With Sam */}
        <section
          className="relative py-24 md:py-28 border-t"
          style={{ borderColor: RULE, background: SOFT_FIELD }}
        >
          <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-2 gap-5 md:gap-6">
            <Reveal direction="left">
              <div
                className="relative h-full rounded-3xl bg-white p-7 md:p-9"
                style={{ border: `1px solid ${RULE}` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.20)" }}
                  >
                    <X className="h-5 w-5 stroke-[2.5]" style={{ color: "#b91c1c" }} />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                      Without Sam
                    </p>
                    <p className="text-[15px] font-bold mt-0.5">The scattered review</p>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {currentState.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-[14px] leading-[1.55]" style={{ color: SUBINK }}>
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)" }}
                      >
                        <X className="h-3 w-3 stroke-[3]" style={{ color: "#b91c1c" }} />
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div
                className="relative h-full rounded-3xl p-7 md:p-9"
                style={{ background: INK, color: "#FFF" }}
              >
                <span
                  className="absolute -top-2.5 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em]"
                  style={{ background: LIME, color: INK }}
                >
                  <Sparkles className="h-3 w-3" />
                  With Sam
                </span>
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "rgba(181,211,60,0.10)", border: "1px solid rgba(181,211,60,0.25)" }}
                  >
                    <Check className="h-5 w-5 stroke-[2.5]" style={{ color: LIME }} />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: LIME }}>
                      One shared starting point
                    </p>
                    <p className="text-[15px] font-bold mt-0.5">Same assessment, every deck</p>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.65] text-white/80">
                  Sam turns every pitch deck into a six-domain structured assessment your whole
                  team can read, compare and build on. The discussion starts where the assessment ends —
                  not at the beginning.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What the team gets */}
        <section
          className="relative py-24 md:py-28 border-t"
          style={{ borderColor: RULE, background: BONE }}
        >
          <div className="relative mx-auto max-w-[1100px] px-6">
            <Reveal className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                What your team gets
              </p>
              <h2
                className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                One platform.{" "}
                <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                  Structured from the first deck.
                </span>
              </h2>
            </Reveal>

            <RevealGroup className="grid gap-4 md:grid-cols-3" stagger={0.06}>
              {teamGets.map((c, i) => {
                const Icon = c.icon
                return (
                  <RevealItem key={c.title}>
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
                          <h3 className="font-bold text-[18px] tracking-[-0.01em]">
                            {c.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[14px] leading-[1.6]" style={{ color: SUBINK }}>
                        {c.body}
                      </p>
                    </div>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </div>
        </section>

        {/* Pro workflow */}
        <section className="relative py-24 md:py-28 border-t" style={{ borderColor: RULE, background: SOFT_FIELD }}>
          <div className="relative mx-auto max-w-[1100px] px-6">
            <Reveal className="max-w-2xl mb-14">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                The Pro workflow
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
              {proWorkflow.map((s, i) => {
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
                          {i < proWorkflow.length - 1 && (
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

        {/* Pro pricing card */}
        <section className="relative py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
          <Reveal className="mx-auto max-w-[920px] px-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-center" style={{ color: SUBINK }}>
              Pro tier
            </p>
            <h2
              className="mt-3 text-center font-bold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: "clamp(34px, 4.6vw, 54px)" }}
            >
              Bring structure to your{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                next team discussion.
              </span>
            </h2>
            <p className="mt-5 text-center mx-auto max-w-2xl text-[15.5px] leading-[1.6]" style={{ color: SUBINK }}>
              30 pitch deck analyses per month. 3 seats. Shared workspace, deal comparison and
              light fund-fit scoring.
            </p>

            <div
              className="relative mt-10 rounded-3xl p-7 md:p-9"
              style={{
                background: INK,
                color: "#FFFFFF",
                boxShadow: "0 30px 80px -30px rgba(10,10,10,0.35)",
              }}
            >
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold"
                style={{ background: LIME, color: INK }}
              >
                Most popular
              </span>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.55)" }}>
                Pro
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className="font-bold tracking-[-0.04em] tabular-nums leading-[0.9]"
                  style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
                >
                  €299
                </span>
                <span className="text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                  /mo
                </span>
              </div>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13.5px]">
                    <span
                      className="grid place-items-center h-4 w-4 rounded-full shrink-0"
                      style={{ background: LIME }}
                    >
                      <Check className="h-2.5 w-2.5 stroke-[3]" style={{ color: INK }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/register?tier=professional"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition hover:scale-[1.02]"
                  style={{ background: LIME, color: INK }}
                >
                  Start Pro trial
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/sample"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold border-[1.5px] hover:bg-white/5 transition"
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: "#FFF" }}
                >
                  View sample assessment
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Bottom CTA */}
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
