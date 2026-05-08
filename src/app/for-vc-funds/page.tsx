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
  "Partner-ready first screens your team can actually compare.",
  "Framework consistency across every deal, every analyst.",
  "Shared assessment library so institutional knowledge stays institutional.",
  "Associates focus on the deals that matter, not the ones they'll pass.",
  "Save analyst hours on deals that never reach partner review.",
]

const currentState = [
  "Analyst time goes to the wrong layer — repetitive first-screens.",
  "Every analyst screens slightly differently — assessments aren't comparable.",
  "Institutional knowledge walks out the door when juniors rotate.",
]

export default function ForVCFundsPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — light field */}
        <section className="relative pt-16 md:pt-24 pb-20">
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              For VC funds
            </p>
            <h1
              className="mt-5 font-bold leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: "clamp(40px, 7vw, 88px)" }}
            >
              First-screening is your bottleneck.{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                Sam structures the first pass.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] md:text-[17px] leading-[1.55]" style={{ color: SUBINK }}>
              Your analysts&apos; time is the most expensive input in your fund. Sam runs the
              structured first pass on every deck that enters your inbox, so your team spends time
              on the deals that deserve deeper work.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register?tier=fund"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                style={{ background: INK, color: "#FFF" }}
              >
                Book a fund walkthrough
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
                    <p className="text-[15px] font-bold mt-0.5">The misallocation</p>
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
                      First-pass layer
                    </p>
                    <p className="text-[15px] font-bold mt-0.5">Same framework, every analyst</p>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.65] text-white/80">
                  Sam produces a consistent first-pass assessment for every deck your team forwards.
                  Same six-domain framework, same structure, same scoring rubric. Associates spend
                  their time on the deals that warrant deeper work, and your IC reviews a consistent
                  document regardless of who handled intake. The standardisation itself is the
                  product.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Outcomes — bone band */}
        <section
          className="relative py-24 md:py-28 border-t"
          style={{ borderColor: RULE, background: BONE }}
        >
          <div className="relative mx-auto max-w-[1000px] px-6">
            <Reveal className="text-center mb-12">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                What the fund gets
              </p>
              <h2
                className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                Partner-ready first screens,{" "}
                <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                  end-to-end consistency.
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
                  Fund tier
                </p>
                <h2
                  className="mt-4 font-bold tracking-[-0.025em] leading-[1.02]"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                  Walkthrough with a founder,{" "}
                  <span className="font-serif italic font-normal" style={{ color: LIME }}>
                    not a sales rep.
                  </span>
                </h2>
                <p className="mt-5 mx-auto max-w-xl text-[15.5px] leading-[1.55] text-white/70">
                  Custom pricing — based on team size and deal flow.
                </p>

                <ul className="mt-9 grid gap-2.5 sm:grid-cols-2 max-w-2xl mx-auto text-left">
                  {[
                    "Turn every inbound deck into a consistent first-screen assessment.",
                    "Free up analyst time before partner review.",
                    "Apply your fund's own scoring logic across every deal.",
                    "Keep a searchable record of why you advanced, paused or passed.",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-white/80 leading-snug">
                      <span
                        className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "rgba(201,230,59,0.12)", border: "1px solid rgba(201,230,59,0.30)" }}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" style={{ color: LIME }} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register?tier=fund"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
                    style={{ background: LIME, color: INK }}
                  >
                    Book a fund walkthrough
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
