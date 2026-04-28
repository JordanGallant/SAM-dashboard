"use client"

import { Users, FileCheck, Timer, Globe2 } from "lucide-react"
import { CountUp } from "@/components/motion/count-up"

const stats = [
  { icon: FileCheck, value: 2400, suffix: "+", label: "Decks analysed" },
  { icon: Users, value: 180, suffix: "+", label: "European investors" },
  { icon: Timer, value: 12, suffix: " min", label: "Avg. deck → memo" },
  { icon: Globe2, value: 24, suffix: "", label: "EU countries served" },
]

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#0F3D2E]/10">
      {/* Subtle mint wash + radial glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F4FAF6] via-white to-white" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_60%_at_50%_0%,rgba(212,255,107,0.18),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-2">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className={`flex flex-col items-center text-center md:flex-row md:items-center md:text-left md:gap-5 md:px-6 ${
                  i > 0 ? "md:border-l md:border-[#0F3D2E]/10" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] ring-1 ring-[#0F3D2E]/10 shadow-sm mb-3 md:mb-0">
                  <Icon className="h-5 w-5 text-[#D4FF6B]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-0.5 justify-center md:justify-start">
                    <CountUp
                      to={s.value}
                      duration={1.4}
                      className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-br from-[#0A2E22] to-[#00A86B] bg-clip-text text-transparent tabular-nums"
                    />
                    <span className="text-xl md:text-2xl font-mono font-bold text-primary">
                      {s.suffix}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
