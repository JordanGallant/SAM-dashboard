import { X, Check, Clock, Sparkles } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const currentState = [
  "Deck opened at 11pm, scanned in 8 minutes",
  "\"Good team — I think?\" scribbled in a notebook",
  "Passed on a deal last March, can't remember why",
  "Every partner screens slightly differently",
  "No memory, no comparability, no defensible verdict",
]

const withSam = [
  "From scribbled notes → a structured, searchable memo",
  "From \"good team — I think?\" → evidence-backed verdicts",
  "From a 10-minute screen → a defensible decision record",
  "From inconsistent judgement → memos your partners can compare",
  "From lost context → ask any deal \"why did we pass?\" six months later",
]

export function Problem() {
  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white via-[#F4FAF6] to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_20%_40%,rgba(15,61,46,0.06),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(212,255,107,0.10),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
            <Clock className="h-3 w-3" />
            The problem
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
            Most decks get ten minutes.
            <br />
            <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
              Good decisions take longer.
            </span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {/* Current state — muted white card */}
          <Reveal direction="left">
            <div className="relative rounded-3xl border border-[#0F3D2E]/10 bg-white/80 backdrop-blur p-7 md:p-9 h-full shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100">
                  <X className="h-5 w-5 text-red-500 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Current state</p>
                  <p className="text-base font-heading font-semibold text-[#0A2E22]/80">The 10-minute screen</p>
                </div>
              </div>
              <RevealGroup className="space-y-3.5" stagger={0.05}>
                {currentState.map((item) => (
                  <RevealItem key={item} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
                      <X className="h-3 w-3 text-red-400 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>

          {/* With Sam — dark forest card with lime accents */}
          <Reveal direction="right">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] p-7 md:p-9 h-full shadow-2xl shadow-[#0F3D2E]/30">
              {/* Inner decorations — clipped to the card shape so they don't bleed, ribbon stays outside this wrapper */}
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

              {/* "With Sam" ribbon — now sits outside the clipped wrapper, so -top-3 shows fully */}
              <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#D4FF6B] px-3 py-1 shadow-lg shadow-[#D4FF6B]/30 z-10">
                <Sparkles className="h-3 w-3 text-[#0A2E22]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A2E22]">With Sam</span>
              </div>

              <div className="relative flex items-center gap-3 mb-6 mt-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4FF6B]/15 ring-1 ring-[#D4FF6B]/30">
                  <Check className="h-5 w-5 text-[#D4FF6B] stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF6B]/80">Same framework</p>
                  <p className="text-base font-heading font-semibold text-white">Every deck, every time</p>
                </div>
              </div>
              <RevealGroup className="relative space-y-3.5" stagger={0.05}>
                {withSam.map((item) => (
                  <RevealItem key={item} className="flex items-start gap-3 text-[14px] text-white/85 leading-relaxed">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4FF6B] shadow-md shadow-[#D4FF6B]/30">
                      <Check className="h-3 w-3 text-[#0A2E22] stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
