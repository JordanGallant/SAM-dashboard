import { Users, Globe2, Package, TrendingUp, Landmark, Layers } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const domains = [
  { icon: Users, name: "Team", focus: "Founder-market fit, backgrounds, red flags" },
  { icon: Globe2, name: "Market", focus: "TAM / SAM / SOM validation, competitors, why now" },
  { icon: Package, name: "Product", focus: "10x test, PMF signals, moat" },
  { icon: TrendingUp, name: "Traction", focus: "Revenue, retention, capital efficiency" },
  { icon: Landmark, name: "Financials", focus: "Valuation, deal terms, investor signals" },
]

export function Framework() {
  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-[#F4FAF6] via-white to-[#F4FAF6]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,168,107,0.10),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_10%_100%,rgba(212,255,107,0.15),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
            <Layers className="h-3 w-3" />
            The framework
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
            Five domains.
            <br />
            <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
              One framework.
            </span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every memo covers the same five domains, scored the same way. Stage-aware weights ensure a pre-seed deck is judged on pre-seed criteria — not Series A benchmarks.
          </p>
        </Reveal>

        <div className="relative">
          {/* Connecting line behind cards */}
          <div className="hidden md:block absolute top-[4.5rem] left-[6%] right-[6%] h-px bg-gradient-to-r from-transparent via-[#0F3D2E]/15 to-transparent -z-10" />

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" stagger={0.08}>
            {domains.map((d, i) => {
              const Icon = d.icon
              return (
                <RevealItem key={d.name} className="relative">
                  <div className="group relative rounded-2xl p-5 md:p-6 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 bg-white border border-[#0F3D2E]/10 shadow-sm hover:border-primary/30 hover:shadow-xl">
                    {/* Step number */}
                    <div className="relative flex items-center justify-between mb-5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        0{i + 1}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">
                        · Domain
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/5 ring-1 ring-[#0F3D2E]/10 group-hover:from-[#0F3D2E]/10 group-hover:to-[#00A86B]/15 group-hover:ring-primary/30 transition-all">
                      <Icon className="h-6 w-6 text-[#0F3D2E]" />
                    </div>

                    {/* Name */}
                    <h3 className="font-heading font-bold text-lg mb-2 tracking-tight text-[#0A2E22]">
                      {d.name}
                    </h3>

                    {/* Focus */}
                    <p className="text-[13px] leading-relaxed flex-1 text-muted-foreground">
                      {d.focus}
                    </p>

                    {/* Footer score chip */}
                    <div className="mt-5 pt-4 border-t flex items-center justify-between border-[#0F3D2E]/10">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                        Scored
                      </span>
                      <span className="font-mono text-sm font-bold text-[#0F3D2E]">
                        0 — 100
                      </span>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Weighted by stage
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Validated against benchmarks
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Flagged by severity
          </span>
        </Reveal>
      </div>
    </section>
  )
}
