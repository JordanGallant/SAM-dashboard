"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

const DARK_GRADIENT =
  "linear-gradient(135deg, #050B15 0%, #0B1124 50%, #1E3A8A 100%)"
const DARK_RULE_STRONG = "rgba(255,255,255,0.18)"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

// Inline CountUp — uses framer-motion spring; activates only when `start` flips true
function CountUp({
  to,
  duration = 1.4,
  start,
  className,
}: {
  to: number
  duration?: number
  start: boolean
  className?: string
}) {
  const [display, setDisplay] = useState(0)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    damping: 30,
    stiffness: 110,
    duration: duration * 1000,
  })

  useEffect(() => {
    if (start) motionValue.set(to)
  }, [start, to, motionValue])

  useEffect(() => {
    return spring.on("change", (latest) => setDisplay(Math.round(latest)))
  }, [spring])

  return <span className={className}>{display}</span>
}

// Tiny mono-style typewriter — reveals one character at a time
function Typewriter({
  text,
  start,
  startDelayMs = 0,
  stepMs = 28,
  className,
}: {
  text: string
  start: boolean
  startDelayMs?: number
  stepMs?: number
  className?: string
}) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!start) return
    let i = 0
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i += 1
        setShown(i)
        if (i >= text.length) clearInterval(interval)
      }, stepMs)
    }, startDelayMs)
    return () => clearTimeout(startTimer)
  }, [start, text, startDelayMs, stepMs])

  return (
    <span className={className}>
      {text.slice(0, shown)}
      <span
        aria-hidden
        className="inline-block w-[6px] h-[10px] -mb-[1px] bg-[#A5B4FC]/70 ml-[2px] align-middle animate-pulse"
      />
    </span>
  )
}

export default function ScoreShowcase() {
  // Ring geometry — 240px box, ~10px stroke. r and circumference computed
  // once at render time so the dasharray sizes the visible arc.
  const size = 240
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const overall = 82
  const targetOffset = c - (c * overall) / 100

  const domains: { label: string; score: number }[] = [
    { label: "TEAM", score: 88 },
    { label: "MARKET", score: 76 },
    { label: "PRODUCT", score: 84 },
    { label: "TRACTION", score: 72 },
    { label: "FINANCE", score: 90 },
  ]

  const ringRef = useRef<HTMLDivElement>(null)
  const ringInView = useInView(ringRef, { once: true, margin: "-80px" })

  // Confidence: 4 of 5 dots filled
  const confidenceFilled = 4
  const confidenceTotal = 5

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="border-b relative overflow-hidden"
      style={{
        background: DARK_GRADIENT,
        color: "#F8F8F9",
        borderColor: DARK_RULE_STRONG,
      }}
    >
      {/* Hairline grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft blue radial glow — atmosphere, anchored top-right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.18),transparent_60%)]"
      />

      <div className="mx-auto max-w-[1180px] px-8 py-24 relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          {/* LEFT — narrative */}
          <div>
            <div
              aria-hidden
              className="h-1 w-24 bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]"
            />
            <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#A5B4FC]">
              04 / sample output
            </p>
            <h2 className="mt-7 font-bold tracking-[-0.025em] text-[40px] md:text-[52px] leading-[1.05]">
              Every memo gets a{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A5B4FC] bg-clip-text text-transparent">
                score
              </span>
              .
            </h2>
            <p className="mt-7 max-w-[52ch] text-[16px] leading-[1.6] text-white/65">
              An overall verdict, weighted from five domain scores. Comparable across
              deals, defensible six months later.
            </p>
          </div>

          {/* RIGHT — score viz card */}
          <div
            className="relative ring-1 ring-white/10 overflow-hidden bg-white/[0.02]"
            style={{ borderRadius: 0 }}
          >
            {/* Four corner brackets — engineering-blueprint marks */}
            <span aria-hidden className="absolute top-0 left-0 size-2 bg-white/30" />
            <span aria-hidden className="absolute top-0 right-0 size-2 bg-white/30" />
            <span aria-hidden className="absolute bottom-0 left-0 size-2 bg-white/30" />
            <span aria-hidden className="absolute bottom-0 right-0 size-2 bg-white/30" />

            <div className="px-8 py-10 md:px-10 md:py-12">
              {/* Ring gauge block — radial glow sits behind it */}
              <div ref={ringRef} className="relative flex flex-col items-center">
                {/* Radial glow — fades in with the section */}
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={ringInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
                  className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.20),transparent_70%)] blur-2xl"
                />
                <motion.div
                  className="relative inline-flex items-center justify-center"
                  style={{ width: size, height: size }}
                  animate={
                    ringInView
                      ? { scale: [1, 1.04, 1] }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: 1.6,
                    times: [0, 0.5, 1],
                  }}
                >
                  <svg width={size} height={size} className="-rotate-90">
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth={stroke}
                      fill="none"
                    />
                    <motion.circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      stroke="url(#mockup3-ring-grad)"
                      strokeWidth={stroke}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={c}
                      initial={{ strokeDashoffset: c }}
                      animate={
                        ringInView
                          ? { strokeDashoffset: targetOffset }
                          : { strokeDashoffset: c }
                      }
                      transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
                    />
                    <defs>
                      <linearGradient
                        id="mockup3-ring-grad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#A5B4FC" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                    {/* Verdict chip — drops in after the number lands */}
                    <motion.span
                      initial={{ opacity: 0, y: -8 }}
                      animate={
                        ringInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: -8 }
                      }
                      transition={{ duration: 0.45, ease: EASE, delay: 1.6 }}
                      className="mb-2 inline-flex items-center text-[9px] font-mono uppercase tracking-[0.22em] px-1.5 py-0.5 rounded-sm bg-[#3B82F6]/15 ring-1 ring-[#3B82F6]/40 text-[#A5B4FC]"
                    >
                      [ STRONG BUY ]
                    </motion.span>
                    <div className="flex items-baseline">
                      <span className="font-mono font-bold tabular-nums text-[56px] bg-gradient-to-r from-[#3B82F6] to-[#A5B4FC] bg-clip-text text-transparent">
                        <CountUp
                          to={overall}
                          start={ringInView}
                          duration={1.4}
                        />
                      </span>
                      <span className="ml-1 font-mono tabular-nums text-[16px] text-white/55">
                        / 100
                      </span>
                    </div>
                  </div>
                </motion.div>
                <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.22em] text-[#A5B4FC]">
                  Overall score
                </p>

                {/* Confidence dots — staggered fill after the ring draws */}
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/40 mr-1">
                    Confidence
                  </span>
                  {Array.from({ length: confidenceTotal }).map((_, i) => {
                    const filled = i < confidenceFilled
                    return (
                      <motion.span
                        key={i}
                        aria-hidden
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={
                          ringInView
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.6 }
                        }
                        transition={{
                          duration: 0.3,
                          ease: EASE,
                          delay: 1.7 + i * 0.08,
                        }}
                        className={
                          filled
                            ? "block size-1.5 rounded-full bg-[#3B82F6] ring-1 ring-[#3B82F6]/60 shadow-[0_0_6px_rgba(59,130,246,0.7)]"
                            : "block size-1.5 rounded-full ring-1 ring-white/25"
                        }
                      />
                    )
                  })}
                </div>

                {/* Mono ticker — typewriter line of "data" */}
                <div className="mt-5 max-w-full overflow-hidden">
                  <Typewriter
                    text="> EVAL.RUN.ID 0x4c2a89 · 11m42s · CONF 0.91"
                    start={ringInView}
                    startDelayMs={1800}
                    stepMs={26}
                    className="text-[10px] font-mono tracking-[0.06em] text-white/45 whitespace-nowrap"
                  />
                </div>
              </div>

              {/* Domain breakdown — flat bars, hairline-separated rows */}
              <div className="mt-10">
                {domains.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.6 + i * 0.08,
                    }}
                    className={`grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-4 py-2.5 ${
                      i === 0 ? "border-t" : ""
                    } border-b`}
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/60">
                      {d.label}
                    </span>
                    <span
                      aria-hidden
                      className="block h-1.5 w-full bg-white/[0.08] relative overflow-hidden"
                    >
                      <motion.span
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${d.score}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.9,
                          ease: EASE,
                          delay: 0.6 + i * 0.08,
                        }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3B82F6] to-[#A5B4FC]"
                      />
                    </span>
                    <span className="text-[14px] font-mono tabular-nums text-white/90 text-right">
                      <CountUp
                        to={d.score}
                        start={ringInView}
                        duration={0.9}
                      />
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Comparison row — thin gradient hairline + benchmark context */}
              <div className="mt-8">
                <div
                  aria-hidden
                  className="h-px w-full bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: EASE, delay: 1.4 }}
                  className="mt-3 text-[9px] font-mono uppercase tracking-[0.22em] text-white/45 text-center"
                >
                  Top 18% of analyzed deals · 1,000+ memos benchmarked
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
