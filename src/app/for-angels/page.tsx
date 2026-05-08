import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Check, X, Sparkles } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const FIELD = "#FFFFFF"
const SOFT_FIELD = "#F7F7F2"
const BONE = "#DDD8C8"
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const ACCENT = "#0F3D2E"
const ACCENT_HI = "#00A86B"
const LIME = "#C9E63B"

const bullets = [
  "Walk into every founder call with a structured assessment already prepared.",
  "Ask sharper questions — or confidently skip the meeting.",
  "Remember exactly why you passed, even a year later.",
  "Screen more inbound decks without lowering your investment discipline.",
]

const currentState = [
  "Deck opened at 11pm, scanned in 8 minutes.",
  "\"Good team — I think?\" scribbled in a notebook.",
  "You passed on a deal last March. By September, you can't remember why.",
  "Every deal is screened slightly differently.",
]

export default function ForAngelsPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — light field */}
        <section className="relative pt-16 md:pt-24 pb-20">
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              For angel investors
            </p>
            <h1
              className="mt-5 font-bold leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: "clamp(40px, 7vw, 88px)" }}
            >
              You&apos;re the analyst.{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                Sam is the second opinion.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] md:text-[17px] leading-[1.55]" style={{ color: SUBINK }}>
              Fifty decks a month, no associate, no framework. Sam gives you a structured
              assessment on every deck you want to evaluate — before you take the first call.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register?tier=starter"
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

        {/* Without / With Sam — two-column ramp-style band on soft field */}
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
                    <p className="text-[15px] font-bold mt-0.5">The solo workflow</p>
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
                    style={{ background: "rgba(201,230,59,0.10)", border: "1px solid rgba(201,230,59,0.25)" }}
                  >
                    <Check className="h-5 w-5 stroke-[2.5]" style={{ color: LIME }} />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: LIME }}>
                      Your structured second opinion
                    </p>
                    <p className="text-[15px] font-bold mt-0.5">Assessment before the first call</p>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.65] text-white/80">
                  Sam writes the assessment you would have written if you had time. Every deck you
                  upload comes back with a six-domain scored assessment, source-tagged claims, red
                  flags, and a structured thesis. Months later, you can pull up deal nineteen and
                  know exactly why you walked away.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Outcomes */}
        <section
          className="relative py-24 md:py-28 border-t"
          style={{ borderColor: RULE, background: BONE }}
        >
          <div className="relative mx-auto max-w-[1000px] px-6">
            <Reveal className="text-center mb-12">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                What changes
              </p>
              <h2
                className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                On your desk{" "}
                <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                  before your next founder call.
                </span>
              </h2>
            </Reveal>

            <RevealGroup className="grid gap-3" stagger={0.06}>
              {bullets.map((b) => (
                <RevealItem key={b}>
                  <div
                    className="group flex items-center gap-4 rounded-2xl bg-white p-5 transition hover:-translate-y-0.5"
                    style={{ border: `1px solid ${RULE}` }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: ACCENT_HI }}
                    >
                      <Check className="h-4 w-4 text-white stroke-[3]" />
                    </span>
                    <span className="text-[15px] font-medium">{b}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* CTA */}
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
                  Angel plan
                </p>
                <h2
                  className="mt-4 font-bold tracking-[-0.025em] leading-[1.02]"
                  style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
                >
                  <span style={{ color: LIME }}>€149</span>
                  {" "}/ month.
                </h2>
                <p className="mt-5 mx-auto max-w-xl text-[15.5px] leading-[1.55] text-white/70">
                  10 pitch deck analyses every month. Cancel anytime · EU-based processing · no
                  model training on your decks.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register?tier=starter"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                    style={{ background: LIME, color: INK }}
                  >
                    Start with a deck
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
