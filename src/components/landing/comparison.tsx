"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Scale, Users, Globe2, Package, TrendingUp, Landmark } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { CountUp } from "@/components/motion/count-up"
import { AnimatedBar } from "@/components/motion/animated-bar"

const samIs = [
  "The evaluation layer — sits between the deck and the decision",
  "Built for venture due diligence, not generalist summarisation",
  "Designed by investors who have screened real deals, not by LLM generalists",
  "Replaces the 10-minute screen, not your deal-flow tools",
]

const domains = [
  { domain: "TEAM", icon: Users, score: 88 },
  { domain: "MARKET", icon: Globe2, score: 76 },
  { domain: "PRODUCT", icon: Package, score: 84 },
  { domain: "TRACTION", icon: TrendingUp, score: 72 },
  { domain: "FINANCE", icon: Landmark, score: 90 },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

// Animated conic-ring as score gauge
function RingGauge({ score, size = 112 }: { score: number; size?: number }) {
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (c * score) / 100

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#wss-ring-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${c}` }}
          whileInView={{ strokeDasharray: `${dash} ${c}` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="wss-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D4FF6B" />
            <stop offset="1" stopColor="#00A86B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <CountUp to={score} className="text-3xl font-mono font-bold bg-gradient-to-br from-white to-[#D4FF6B] bg-clip-text text-transparent tabular-nums" />
        <span className="mt-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">/ 100</span>
      </div>
    </div>
  )
}

export function Comparison() {
  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] text-white">
      {/* Ambient glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#D4FF6B]/10 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4FF6B]/30 bg-[#D4FF6B]/10 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#D4FF6B]">
            Where Sam sits
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-white">
            Structured analysis,
            <br />
            <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
              not freeform summaries.
            </span>
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          {/* LEFT — copy + checklist */}
          <motion.div variants={item} className="order-2 md:order-1">
            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
              Sam is the evaluation layer that sits between the deck and the decision. Other tools help you find deals or store them — Sam is what tells you whether to invest.
            </p>

            <motion.ul variants={container} className="space-y-4">
              {samIs.map((b) => (
                <motion.li key={b} variants={item} className="flex items-start gap-3 text-white/90 text-[15px] md:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4FF6B] shadow-md shadow-[#D4FF6B]/30">
                    <Check className="h-3 w-3 text-[#0A2E22] stroke-[3]" />
                  </span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={item}
              className="mt-10 pt-6 border-t border-white/10"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF6B]/70 mb-3">
                Position statement
              </p>
              <p className="text-xl md:text-2xl font-heading font-bold leading-snug text-white tracking-[-0.01em]">
                Sam is not a startup database. Not a CRM. Not a data platform.{" "}
                <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
                  Sam is the evaluation layer between the deck and the decision.
                </span>
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT — lime panel + memo passport + floating chips (the composition moved from hero) */}
          <motion.div variants={item} className="relative order-1 md:order-2">
            <div className="relative rounded-[2rem] bg-gradient-to-br from-[#D4FF6B] via-[#C8F25F] to-[#9ED44D] p-5 md:p-7 shadow-2xl shadow-black/50">
              {/* Inner shines & grain */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#0F3D2E]/10 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(15,61,46,0.6) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />
              </div>

              {/* Memo "passport" card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] p-5 md:p-6 shadow-2xl shadow-black/50 ring-1 ring-white/10 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <div className="relative flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4FF6B]/20 ring-1 ring-[#D4FF6B]/30">
                      <span className="text-xs font-mono font-bold text-[#D4FF6B]">S</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">Executive Memo</p>
                      <p className="text-[11px] font-mono font-semibold text-white">Fintech · Series A</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4FF6B]/70">#0042</span>
                </div>

                <div className="relative flex items-center gap-5 mb-5">
                  <RingGauge score={82} size={112} />
                  <div className="flex-1">
                    <div className="inline-flex items-center rounded-md bg-[#D4FF6B]/15 ring-1 ring-[#D4FF6B]/30 px-2.5 py-1 mb-2">
                      <span className="text-xs font-bold font-heading text-[#D4FF6B]">HIGH PRIORITY</span>
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-0.5">Verdict</p>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      Experienced team, regulatory tailwinds, strong unit economics.
                    </p>
                  </div>
                </div>

                <div className="relative space-y-2 pt-4 border-t border-white/10">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#D4FF6B]/70 mb-2">Domain scores</p>
                  {domains.map((d, i) => {
                    const Icon = d.icon
                    return (
                      <div key={d.domain} className="grid grid-cols-[1rem_4.5rem_1fr_2rem] items-center gap-2.5 text-[10px] font-mono">
                        <Icon className="h-3 w-3 text-white/40" />
                        <span className="text-white/50 tracking-widest">{d.domain}</span>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <AnimatedBar
                            percent={d.score}
                            delay={0.5 + i * 0.08}
                            className="h-full rounded-full bg-gradient-to-r from-[#7FD9AA] via-[#C8F25F] to-[#D4FF6B]"
                          />
                        </div>
                        <CountUp to={d.score} duration={0.9} className="font-semibold text-[#D4FF6B] text-right tabular-nums" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Floating bottom-left chip */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-5 -left-3 md:-left-6 z-10"
              >
                <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/10 px-3.5 py-2.5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B]">
                    <Sparkles className="h-4 w-4 text-[#D4FF6B]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Generated in</p>
                    <p className="text-sm font-mono font-bold text-[#0F3D2E]">12 min</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating top-right chip */}
              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-3 -right-3 md:-right-5 z-10"
              >
                <div className="rounded-full bg-[#0A2E22] shadow-xl ring-1 ring-[#D4FF6B]/20 px-3.5 py-2 flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-[#D4FF6B]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white font-semibold">
                    Comparable
                  </span>
                </div>
              </motion.div>

              {/* Floating mid-right confidence card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-1/2 -right-3 md:-right-8 -translate-y-1/2 z-10 hidden lg:flex"
              >
                <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/10 px-3 py-2 flex flex-col items-center gap-0.5">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground">Confidence</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base font-mono font-bold text-[#0F3D2E]">HIGH</span>
                  </div>
                  <div className="flex gap-0.5 mt-0.5">
                    <span className="h-1 w-3 rounded-full bg-[#00A86B]" />
                    <span className="h-1 w-3 rounded-full bg-[#00A86B]" />
                    <span className="h-1 w-3 rounded-full bg-[#00A86B]" />
                    <span className="h-1 w-3 rounded-full bg-slate-200" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
