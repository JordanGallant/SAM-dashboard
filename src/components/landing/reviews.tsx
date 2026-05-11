import { Quote, Star } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const quotes = [
  {
    quote:
      "I review 40+ decks a month. Sam cuts my first-pass from hours to minutes, and the report gives me exactly the right questions before a founder call.",
    role: "Partner, Pre-seed fund",
  },
  {
    quote:
      "I thought it would just recap the deck. It doesn't — it challenges it. Red flags I would have found in week three, Sam flags on the first signal.",
    role: "Principal, Seed fund",
  },
  {
    quote:
      "We used to lose deals because internal alignment took too long. Now everyone on the team reads the same thing before we decide to move forward. It's changed how we work.",
    role: "Managing Partner",
  },
  {
    quote:
      "Sam doesn't replace judgment — it sharpens it. We screen twice as many deals without adding headcount.",
    role: "Investment Director",
  },
  {
    quote:
      "The verdict accuracy is impressive. SAM flagged a team issue I would have only found after a second call. Time saved and risk avoided.",
    role: "Senior Associate",
  },
  {
    quote:
      "The Executive Summary gives me everything I need for a first call in two minutes. It used to take an afternoon.",
    role: "Investor, Series A",
  },
]

const metrics = [
  { value: "8.2/10", label: "Average rating" },
  { value: "10×", label: "Faster first-pass screening" },
  { value: "4.0/5", label: "Verdict accuracy" },
]

export function Reviews() {
  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white to-[#FAFAF7]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,168,107,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              What investors are saying
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-bold font-heading tracking-[-0.025em] leading-[1.05] text-[#0F3D2E]">
              From the funds already using Sam
            </h2>
          </div>
        </Reveal>

        {/* Metrics strip */}
        <RevealGroup
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-foreground/10 rounded-2xl overflow-hidden ring-1 ring-foreground/10"
          stagger={0.06}
        >
          {metrics.map((m) => (
            <RevealItem key={m.label}>
              <div className="bg-white px-6 py-7 text-center h-full">
                <p className="font-heading font-bold text-3xl md:text-4xl tracking-tight tabular-nums bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] bg-clip-text text-transparent">
                  {m.value}
                </p>
                <p className="mt-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Quote cards */}
        <RevealGroup
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          stagger={0.05}
        >
          {quotes.map((q, i) => (
            <RevealItem key={i}>
              <figure className="group relative h-full rounded-2xl bg-white border border-[#0F3D2E]/10 p-6 md:p-7 shadow-sm hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Quote className="absolute top-5 right-5 h-4 w-4 text-[#0F3D2E]/15" />
                <blockquote className="text-[14px] leading-relaxed text-[#0F3D2E]">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-[#0F3D2E]/10 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  {q.role}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
