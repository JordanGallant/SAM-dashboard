import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Check, User, X, Sparkles } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const bullets = [
  "Walk into every founder call with a memo already prepared.",
  "Ask sharper questions, or confidently skip the meeting.",
  "Remember exactly why you passed, even a year later.",
  "Screen more inbound decks without lowering your investment discipline.",
]

const currentState = [
  "You passed on a deal last March. By September, you can't remember why.",
]

export default function ForAnglesPage() {
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
              <User className="h-3 w-3" />
              For angels
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-white">
              You&apos;re the analyst.
              <br />
              <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
                Sam is the second opinion.
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
              Fifty decks a month, no associate, no framework. Sam gives you a structured memo on every deck you want to evaluate — before you take the first call.
            </p>
          </div>
        </section>

        {/* Problem + Solution split */}
        <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white via-[#F4FAF6] to-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_20%_40%,rgba(15,61,46,0.06),transparent_70%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(212,255,107,0.10),transparent_70%)]" />

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              <Reveal direction="left">
                <div className="relative h-full rounded-3xl border border-[#0F3D2E]/10 bg-white/80 backdrop-blur p-7 md:p-9 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100">
                      <X className="h-5 w-5 text-red-500 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Without Sam</p>
                      <p className="text-base font-heading font-semibold text-[#0A2E22]/80">The solo workflow</p>
                    </div>
                  </div>
                  <ul className="space-y-3.5">
                    {currentState.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
                          <X className="h-3 w-3 text-red-400 stroke-[3]" />
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal direction="right">
                <div className="relative h-full rounded-3xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] p-7 md:p-9 shadow-2xl shadow-[#0F3D2E]/30">
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#D4FF6B]/15 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />
                  </div>
                  <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#D4FF6B] px-3 py-1 shadow-lg shadow-[#D4FF6B]/30 z-10">
                    <Sparkles className="h-3 w-3 text-[#0A2E22]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A2E22]">With Sam</span>
                  </div>
                  <div className="relative flex items-center gap-3 mb-6 mt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4FF6B]/15 ring-1 ring-[#D4FF6B]/30">
                      <Check className="h-5 w-5 text-[#D4FF6B] stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF6B]/80">Your structured second opinion</p>
                      <p className="text-base font-heading font-semibold text-white">Memo before the first call</p>
                    </div>
                  </div>
                  <p className="relative text-[15px] text-white/80 leading-relaxed">
                    Sam writes the memo you would have written if you had time. Every deck you upload comes back with a scored verdict, red flags, and a structured thesis. Months later, you can pull up deal nineteen and know exactly why you walked away.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-[#F4FAF6] via-white to-[#F4FAF6]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,168,107,0.08),transparent_70%)]" />

          <div className="relative mx-auto max-w-4xl px-4">
            <Reveal className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
                What changes
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
                On your desk
                <br />
                <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
                  before your next founder call.
                </span>
              </h2>
            </Reveal>

            <RevealGroup className="grid gap-3 md:gap-4" stagger={0.06}>
              {bullets.map((b) => (
                <RevealItem key={b}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-[#0F3D2E]/10 bg-white p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4FF6B] shadow-md shadow-[#D4FF6B]/30">
                      <Check className="h-4 w-4 text-[#0A2E22] stroke-[3]" />
                    </span>
                    <span className="text-[15px] text-[#0A2E22] font-medium">{b}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* CTA — dark forest callout */}
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
                  Angel plan
                </span>
                <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-white">
                  <span className="bg-gradient-to-br from-white to-[#D4FF6B] bg-clip-text text-transparent">€49</span>
                  {" "}/ month.
                </h2>
                <p className="mt-4 text-white/65 max-w-xl mx-auto">
                  Start with your first deck and let SAM support you. Cancel anytime · EU-based processing · no model training on your decks.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register?tier=starter"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#0A2E22] px-7 py-3.5 text-sm font-semibold shadow-xl shadow-[#D4FF6B]/25 hover:shadow-2xl hover:shadow-[#D4FF6B]/40 transition-all hover:-translate-y-0.5"
                  >
                    Start with a deck
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
