import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"

export function FinalCTA() {
  return (
    <section className="py-24 px-4 border-t bg-gradient-to-b from-white to-[#F4FAF6]">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#1A6B47] px-8 py-16 md:px-16 md:py-20 shadow-2xl shadow-[#0F3D2E]/30">
          {/* Ambient glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00A86B]/20 blur-3xl" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-primary/90">
              <Sparkles className="h-3 w-3" />
              Start today
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-bold font-heading tracking-tight text-white">
              Step into due diligence
              <br />
              with <span className="bg-gradient-to-r from-[#7FD9AA] to-[#00A86B] bg-clip-text text-transparent">Sam.</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              No integrations, no onboarding call. Upload a deck, get a scored, defensible memo in minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
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

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-white/50 uppercase tracking-widest">
              <span>No credit card</span>
              <span className="text-white/20">·</span>
              <span>EU-hosted</span>
              <span className="text-white/20">·</span>
              <span>GDPR by design</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
