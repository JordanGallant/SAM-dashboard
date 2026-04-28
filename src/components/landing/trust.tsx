import { Shield, MapPin, Lock, UserCheck, ShieldCheck } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const pillars = [
  {
    icon: MapPin,
    label: "EU servers only",
    desc: "Processing and storage within the European Union — full stack, no exceptions.",
    code: "EU-01",
  },
  {
    icon: Shield,
    label: "GDPR by design",
    desc: "Architectural decision, not a compliance checkbox bolted on at the end.",
    code: "EU-02",
  },
  {
    icon: Lock,
    label: "No model training",
    desc: "Your submitted material is never used to train any model — ours or anyone else's.",
    code: "EU-03",
  },
  {
    icon: UserCheck,
    label: "Built by investors",
    desc: "Framework designed by people who have evaluated deals for a living.",
    code: "EU-04",
  },
]

export function Trust() {
  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white via-[#F4FAF6] to-white">
      {/* Ambient glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(0,168,107,0.07),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_90%_80%,rgba(212,255,107,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-16 items-start">
          {/* LEFT — eyebrow + headline + copy + EU compass graphic */}
          <Reveal direction="left" className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
              <ShieldCheck className="h-3 w-3" />
              EU data sovereignty
            </div>

            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
              Where your data
              <br />
              lives, and{" "}
              <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
                who sees it.
              </span>
            </h2>

            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Sam runs on European servers. Your pitch decks are processed there, stored there, and deleted on your schedule. No submitted material is used to train any model — ours, or anyone else&apos;s.
            </p>

            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              The framework was designed by people who have evaluated early-stage companies for a living — not by people who studied the problem from a distance.
            </p>

            {/* Data-residency compass badge */}
            <div className="mt-10 inline-flex items-stretch rounded-2xl border border-[#0F3D2E]/10 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#0A2E22] to-[#0F3D2E] px-5 py-4 text-white">
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#D4FF6B]/80">Region</p>
                <p className="font-mono text-xl font-bold bg-gradient-to-br from-white to-[#D4FF6B] bg-clip-text text-transparent">
                  EU · EEA
                </p>
              </div>
              <div className="flex flex-col justify-center gap-0.5 px-5 py-4">
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Data in · Data out
                </p>
                <p className="text-sm font-mono font-bold text-[#0A2E22]">
                  Never leaves the EU
                </p>
              </div>
              <div className="flex items-center px-5 bg-[#F4FAF6]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — stronger 2x2 pillar grid */}
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.06}>
            {pillars.map((p, i) => {
              const Icon = p.icon
              return (
                <RevealItem key={p.label}>
                  <div className="group relative h-full rounded-2xl bg-white border border-[#0F3D2E]/10 p-6 md:p-7 shadow-sm hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* Top-right code chip */}
                    <span className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                      {p.code}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/5 ring-1 ring-[#0F3D2E]/10 group-hover:from-[#0F3D2E]/10 group-hover:to-[#00A86B]/15 group-hover:ring-primary/30 transition-all mb-5">
                      <Icon className="h-5 w-5 text-[#0F3D2E]" />
                    </div>

                    <p className="font-heading font-bold text-[15px] text-[#0A2E22] tracking-tight mb-2">
                      {p.label}
                    </p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Bottom accent bar — appears on hover */}
                    <div className="absolute inset-x-6 bottom-3 h-[2px] rounded-full bg-gradient-to-r from-[#7FD9AA] via-[#C8F25F] to-[#D4FF6B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
