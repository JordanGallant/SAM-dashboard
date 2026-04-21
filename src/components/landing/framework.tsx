import { Users, Globe2, Package, TrendingUp, Landmark } from "lucide-react"
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
    <section className="py-24 border-t">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">The framework</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Five domains. One framework.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Every memo covers the same five domains, scored the same way. Stage-aware weights ensure a pre-seed deck is judged on pre-seed criteria — not Series A benchmarks.
          </p>
        </Reveal>

        <div className="relative">
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-border -z-10" />

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" stagger={0.08}>
            {domains.map((d, i) => {
              const Icon = d.icon
              return (
                <RevealItem key={d.name} className="relative">
                  <div className="rounded-xl border bg-white p-5 h-full flex flex-col items-center text-center space-y-3 transition-shadow hover:shadow-md">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      0{i + 1}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm">{d.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {d.focus}
                    </p>
                    <div className="pt-2 border-t w-full">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Scored</p>
                      <p className="text-base font-mono font-semibold text-amber-600 mt-0.5">0 — 100</p>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <span>weighted by stage</span>
          <span className="text-border">·</span>
          <span>validated against benchmarks</span>
          <span className="text-border">·</span>
          <span>flagged by severity</span>
        </Reveal>
      </div>
    </section>
  )
}
