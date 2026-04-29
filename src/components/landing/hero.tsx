"use client"

import Link from "next/link"
import { ArrowRight, Check, Sparkles, FileText, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { CountUp } from "@/components/motion/count-up"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const bullets = [
  "Every deck scored across 5 investment domains",
  "IC-ready memos — not LLM summaries",
  "Consistent framework, stage-aware weights",
  "EU-hosted, GDPR by design, zero model training",
]

// Fake slide content — abstract bars on a dark slide
function DeckSlide({ label, tone }: { label: string; tone: "a" | "b" | "c" }) {
  const tones = {
    a: "bg-[#142E24]/90 border-white/10",
    b: "bg-[#0F2A1F]/95 border-white/10",
    c: "bg-[#0A2418]/95 border-white/10",
  }
  return (
    <div className={`rounded-xl ${tones[tone]} ring-1 shadow-2xl shadow-black/40 backdrop-blur overflow-hidden aspect-[4/3] w-44 md:w-52`}>
      <div className="border-b border-white/10 px-3 py-2 flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="ml-2 text-[8px] font-mono uppercase tracking-widest text-white/40">{label}</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-2 w-3/4 rounded bg-white/20" />
        <div className="h-1.5 w-full rounded bg-white/10" />
        <div className="h-1.5 w-5/6 rounded bg-white/10" />
        <div className="flex gap-1 mt-3">
          <div className="h-8 w-4 rounded bg-[#D4FF6B]/40" />
          <div className="h-6 w-4 rounded bg-[#D4FF6B]/30" />
          <div className="h-10 w-4 rounded bg-[#D4FF6B]/50" />
          <div className="h-7 w-4 rounded bg-[#D4FF6B]/30" />
          <div className="h-9 w-4 rounded bg-[#D4FF6B]/40" />
        </div>
      </div>
    </div>
  )
}

// Big circular score medallion with animated lime-gradient ring
function ScoreMedallion({ score = 82, size = 260 }: { score?: number; size?: number }) {
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (c * score) / 100

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow behind medallion */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-radial from-[#D4FF6B]/25 via-primary/15 to-transparent blur-2xl" style={{ background: "radial-gradient(circle, rgba(212,255,107,0.35) 0%, rgba(0,168,107,0.12) 40%, transparent 70%)" }} />

      <svg width={size} height={size} className="-rotate-90 relative">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#hero-medallion-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ duration: 1.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Tick marks around the ring */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 360
          const inner = r + stroke / 2 + 6
          const outer = inner + (i % 5 === 0 ? 8 : 4)
          const x1 = size / 2 + Math.cos((angle * Math.PI) / 180) * inner
          const y1 = size / 2 + Math.sin((angle * Math.PI) / 180) * inner
          const x2 = size / 2 + Math.cos((angle * Math.PI) / 180) * outer
          const y2 = size / 2 + Math.sin((angle * Math.PI) / 180) * outer
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          )
        })}
        <defs>
          <linearGradient id="hero-medallion-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D4FF6B" />
            <stop offset="0.5" stopColor="#C8F25F" />
            <stop offset="1" stopColor="#00A86B" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/40 mb-2">Sam Score</p>
        <CountUp
          to={score}
          duration={1.8}
          className="text-[88px] md:text-[96px] font-mono font-bold bg-gradient-to-br from-white via-white to-[#D4FF6B] bg-clip-text text-transparent tabular-nums leading-none"
        />
        <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">/ 100</p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#133F2E] text-white">
      {/* Ambient glows */}
      <div className="absolute -top-48 -right-48 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#D4FF6B]/15 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <motion.div initial="hidden" animate="visible" variants={container} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT — custom deck-to-memo transformation visual */}
          <motion.div variants={item} className="relative order-2 md:order-1">
            <div className="relative aspect-[5/5] sm:aspect-[6/5]">

              {/* Animated diagonal connector line from decks to medallion */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 500 500"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 100 370 C 180 320, 260 250, 360 140"
                  stroke="url(#hero-flow-grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                  <linearGradient id="hero-flow-grad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(212,255,107,0.1)" />
                    <stop offset="0.5" stopColor="rgba(212,255,107,0.7)" />
                    <stop offset="1" stopColor="rgba(212,255,107,0.9)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Deck stack — bottom-left */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -12 }}
                animate={{ opacity: 1, y: 0, rotate: -10 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-6 left-0 sm:left-2 origin-bottom-left"
              >
                <DeckSlide label="SLIDE 01" tone="c" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-2 left-8 sm:left-14 origin-bottom-left"
              >
                <DeckSlide label="SLIDE 02" tone="b" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-16 sm:left-24 origin-bottom-left z-10"
              >
                <DeckSlide label="SLIDE 03" tone="a" />
              </motion.div>

              {/* Label under deck stack */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute bottom-[-1.75rem] left-4 sm:left-8 flex items-center gap-1.5"
              >
                <FileText className="h-3 w-3 text-white/40" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">pitch_deck.pdf</span>
              </motion.div>

              {/* Score medallion — top-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-4 right-0 sm:top-0 md:right-4 flex items-center justify-center"
              >
                <ScoreMedallion score={82} size={260} />
              </motion.div>

              {/* STRONG BUY chip — above medallion */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 right-6 md:right-10 z-20"
              >
                <div className="rounded-full bg-[#D4FF6B] shadow-xl shadow-[#D4FF6B]/30 px-3.5 py-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0A2E22]" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#0A2E22] font-bold">
                    High Priority
                  </span>
                </div>
              </motion.div>

              {/* IC-ready chip — right of medallion */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-24 md:top-32 -right-2 md:right-0 z-20 hidden sm:flex"
              >
                <div className="rounded-full bg-[#0A2E22] ring-1 ring-[#D4FF6B]/20 shadow-xl px-3 py-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-[#D4FF6B]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white font-semibold">IC-ready</span>
                </div>
              </motion.div>

              {/* 2 risks chip — below medallion */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-24 md:bottom-28 right-16 md:right-20 z-20 hidden sm:flex"
              >
                <div className="rounded-full bg-white/10 backdrop-blur ring-1 ring-white/15 shadow-lg px-3 py-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-amber-300" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-semibold">2 risks · 5 strengths</span>
                </div>
              </motion.div>

              {/* "Sam analyses" label above flow path */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute top-[58%] left-[28%] flex items-center gap-1.5"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF6B] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4FF6B]" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF6B]/80">Sam analyses</span>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — copy stack */}
          <motion.div variants={item} className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4FF6B]/30 bg-[#D4FF6B]/10 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#D4FF6B] shadow-sm">
              <Sparkles className="h-3 w-3" />
              Benefits
            </div>

            <motion.h1 variants={item} className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] font-heading leading-[1.05] text-white">
              Saves time, reduces risk,
              <br />
              drives smarter <span className="bg-gradient-to-r from-[#D4FF6B] to-[#C8F25F] bg-clip-text text-transparent">decisions.</span>
            </motion.h1>

            <motion.p variants={item} className="mt-5 text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
              Sam analyses pitch decks across five investment domains and returns a scored, IC-ready memo — built for European investors who need consistent, defensible evaluation.
            </motion.p>

            <motion.ul variants={container} className="mt-8 space-y-3">
              {bullets.map((b) => (
                <motion.li key={b} variants={item} className="flex items-start gap-3 text-white/85 text-sm md:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4FF6B]">
                    <Check className="h-3 w-3 text-[#0A2E22] stroke-[3]" />
                  </span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/register?tier=professional"
                className="group inline-flex items-center gap-2 rounded-full bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#0A2E22] px-6 py-3.5 text-sm font-semibold shadow-xl shadow-[#D4FF6B]/20 hover:shadow-2xl hover:shadow-[#D4FF6B]/30 transition-all hover:-translate-y-0.5"
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur text-white px-6 py-3.5 text-sm font-semibold transition-all"
              >
                See a sample memo
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-white/50 uppercase tracking-widest">
              <span>5 domains</span>
              <span className="text-white/20">·</span>
              <span>scored 0 — 100</span>
              <span className="text-white/20">·</span>
              <span>EU-hosted</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
