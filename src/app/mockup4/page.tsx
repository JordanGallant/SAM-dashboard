// SAM landing — mockup4 (rewrite).
// Centered hero with email capture + lime CTA, big rounded preview card,
// black live-stats ticker bar, logo wall + lime stat card pair, "before
// chaos → after order" two-section visual, two-column feature cards with
// annotated UI shots, dark AI banner, comparison, closing CTA, footer.
// Restrained palette: off-white field, near-black text, ONE lime accent.

"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  FileText,
  Mail,
  Sparkles,
  PlayCircle,
} from "lucide-react"

// ---------- design tokens ----------
const FIELD = "#FFFFFF"
const SOFT_FIELD = "#F7F7F2"
const BONE = "#DDD8C8"     // warm bone tint, lifted from mockup1
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const SOFT = "rgba(10,10,10,0.06)"
const LIME = "#D7FE3F"
const ACCENT = "#0F3D2E"   // forest, used sparingly (icons, stat values)
const ACCENT_HI = "#00A86B"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

// ============================================================
export default function Mockup4() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans" style={{ background: FIELD, color: INK }}>
      <Nav />
      <main>
        <Hero />
        <TickerBar />
        <LimeMarquee />
        <LogoBand />
        <OnePlatform />
        <Framework />
        <DarkAI />
        <SourceAttribution />
        <MissingInfo />
        <AskSamSection />
        <FeatureCards />
        <Audiences />
        <Quotes />
        <Trust />
        <Pricing />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />
      <MarqueeStyles />
    </div>
  )
}

// ============================================================
// nav
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <header
      className="sticky top-0 z-50 transition-all backdrop-blur"
      style={{
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        borderBottom: scrolled ? `1px solid ${RULE}` : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-[1240px] px-6 h-14 flex items-center justify-between">
        <Link href="/mockup4" className="flex items-center gap-1.5 font-bold text-[16px] tracking-tight">
          sam<span className="opacity-50">/</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[14px]">
          {["Product", "Solutions", "Customers", "Resources", "Pricing"].map((l) => (
            <button key={l} className="relative group inline-flex items-center gap-1">
              <span className="hover:opacity-60 transition">{l}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex text-[14px] hover:opacity-70 transition">
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#0A0A0A] hover:scale-[1.02] transition"
            style={{ background: LIME }}
          >
            See a demo
          </Link>
        </div>
      </div>
    </header>
  )
}

// ============================================================
// hero — centered, email capture + lime CTA, big preview card below
// ============================================================
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section ref={ref} className="relative pt-12 md:pt-20 pb-0 overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="text-center max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#0A0A0A]/55"
          >
            <span>Structured first-screening for investors</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="mt-6 font-bold leading-[0.96] tracking-[-0.04em]"
            style={{ fontSize: "clamp(44px, 7.5vw, 100px)" }}
          >
            From deck{" "}
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              to decision.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className="mt-7 mx-auto max-w-[640px] text-[16px] md:text-[17px] leading-[1.55]"
            style={{ color: SUBINK }}
          >
            Sam turns pitch decks into structured, source-aware investment
            assessments — so every deal is reviewed with the same discipline,
            before you spend partner time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/register?tier=professional"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
              style={{ background: INK, color: "#FFF" }}
            >
              Analyse a deck
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/sample"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold border-[1.5px] hover:bg-foreground/[0.04] transition"
              style={{ borderColor: RULE, color: INK }}
            >
              View sample assessment
            </Link>
          </motion.div>
        </div>

        {/* Big rounded preview card — SAM UI inside */}
        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="relative mt-16 mx-auto max-w-[1080px]"
        >
          <PreviewCard />
        </motion.div>
      </div>
    </section>
  )
}

function DotGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 opacity-50"
      style={{
        backgroundImage: "radial-gradient(rgba(10,10,10,0.10) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black, transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black, transparent)",
      }}
    />
  )
}

// Rolling number chip in the eyebrow — like ramp's tiny stat chip in the hero.
function RollingStat() {
  const [n, setN] = useState(247)
  useEffect(() => {
    const t = setInterval(() => setN((x) => x + Math.floor(Math.random() * 3)), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10.5px] font-bold tabular-nums"
      style={{ background: SOFT, color: INK }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT_HI }} />
      <CountUp to={n} start className="tabular-nums" /> decks today
    </span>
  )
}

function EmailCapture() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative flex items-center w-full rounded-full border bg-white pr-1.5 pl-5 py-1.5"
      style={{ borderColor: RULE }}
    >
      <Mail className="h-4 w-4 mr-2.5 shrink-0" style={{ color: SUBINK }} />
      <input
        type="email"
        placeholder="What's your work email?"
        className="flex-1 bg-transparent outline-none text-[14px] py-2 placeholder:text-[#0A0A0A]/40"
      />
      <button
        type="submit"
        className="rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#0A0A0A] hover:scale-[1.02] transition shrink-0"
        style={{ background: LIME }}
      >
        Get started for free
      </button>
    </form>
  )
}

function PreviewCard() {
  return (
    <div
      className="rounded-[28px] bg-[#FAFAF7] border shadow-[0_30px_80px_-30px_rgba(10,10,10,0.20)] overflow-hidden"
      style={{ borderColor: RULE }}
    >
      <div className="px-6 pt-5 pb-4 flex items-center gap-2 border-b" style={{ borderColor: RULE }}>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <p className="ml-3 text-[12px] font-mono text-[#0A0A0A]/45">sam · canaaro · executive summary</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-0">
        {/* sidebar */}
        <aside className="border-b lg:border-b-0 lg:border-r p-5 bg-white" style={{ borderColor: RULE }}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: SUBINK }}>Pipeline</p>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            <li className="flex items-center justify-between p-2 rounded-lg" style={{ background: SOFT }}>
              <span className="font-semibold">Canaaro</span>
              <span className="font-mono text-[11px]" style={{ color: ACCENT }}>84</span>
            </li>
            {[
              { n: "VREY", s: 71 },
              { n: "Vint Labs", s: 62 },
              { n: "Atlas AI", s: 58 },
              { n: "Northbeam", s: 49 },
            ].map((d) => (
              <li key={d.n} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-black/[0.03] transition">
                <span>{d.n}</span>
                <span className="font-mono text-[11px] text-[#0A0A0A]/55">{d.s}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* main */}
        <div className="p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: SUBINK }}>
                canaaro · seed · €1.2M raise
              </p>
              <h3 className="mt-1 font-bold text-[26px] tracking-[-0.02em]">Verdict: Strong Buy</h3>
            </div>
            <ScoreRing score={84} />
          </div>
          <ScorecardRows />
          <RowTicker />
        </div>
      </div>
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" })
  const r = 30, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div ref={ref} className="relative h-[80px] w-[80px] shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke={SOFT} strokeWidth="6" fill="none" />
        <motion.circle
          cx="40" cy="40" r={r}
          stroke={ACCENT_HI} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <CountUp to={score} start={inView} className="font-bold text-[22px] tabular-nums" />
      </div>
    </div>
  )
}

function ScorecardRows() {
  const rows = [
    { label: "Team", score: 88, finding: "Repeat ops + technical founders" },
    { label: "Market", score: 79, finding: "€6.2B EU TAM, validated" },
    { label: "Product", score: 86, finding: "Workflow moat plausible" },
    { label: "Traction", score: 72, finding: "€420K ARR, 14% MoM" },
    { label: "Finance", score: 81, finding: "18mo runway · clean cap" },
  ]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  return (
    <div ref={ref} className="grid grid-cols-1 gap-2 mt-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.05 * i + 0.5 }}
          className="grid grid-cols-[80px_1fr_70px_44px] items-center gap-3 text-[12.5px] py-1"
        >
          <span className="font-mono uppercase tracking-widest text-[10px]" style={{ color: SUBINK }}>{r.label}</span>
          <span className="text-[#0A0A0A]/85 truncate">{r.finding}</span>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: SOFT }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_HI})` }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${r.score}%` } : { width: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.6 + 0.05 * i }}
            />
          </div>
          <span className="font-bold tabular-nums text-right" style={{ color: ACCENT }}>{r.score}</span>
        </motion.div>
      ))}
    </div>
  )
}

function RowTicker() {
  const items = [
    "› Founder LinkedIn verified · 3 matches",
    "› Sources: 14 · Strengths: 3 · Risks: 2",
    "› Memo ready · 4m 12s",
    "› Verdict: Strong Buy",
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 2000)
    return () => clearInterval(t)
  }, [items.length])
  return (
    <div
      className="mt-5 rounded-md px-3 py-2 font-mono text-[11.5px] overflow-hidden"
      style={{ background: "rgba(0,168,107,0.07)", color: ACCENT }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {items[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// dark separator — clean brand-pillar strip between hero + logo band
// ============================================================
function TickerBar() {
  const pillars = [
    "Five domains scored",
    "Memo in five minutes",
    "EU-resident",
    "GDPR · SOC 2",
  ]
  return (
    <div className="relative" style={{ background: INK, color: "#FFF" }}>
      <div className="mx-auto max-w-[1240px] px-6 py-4 flex items-center justify-center gap-x-10 gap-y-2 flex-wrap">
        {pillars.map((p, i) => (
          <span
            key={p}
            className="inline-flex items-center gap-2.5 text-[12px] font-mono uppercase tracking-[0.18em] whitespace-nowrap"
          >
            <span className="h-1 w-1 rounded-full" style={{ background: LIME }} />
            <span className="text-white/85">{p}</span>
            {i < pillars.length - 1 && <span aria-hidden className="text-white/20 ml-2">/</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

// Big lime scrolling marquee — borrowed in spirit from mockup1.
// Bold ink text on lime field, items separated by × glyph.
function LimeMarquee() {
  const items = [
    "Time is judgment",
    "Spend it well",
    "5 domains",
    "Scored 0 — 100",
    "12 min · deck → memo",
    "EU-hosted",
    "GDPR by design",
    "1,000+ memos generated",
  ]
  const loop = [...items, ...items, ...items]
  return (
    <div
      className="relative overflow-hidden border-y"
      style={{ borderColor: RULE, background: LIME, color: INK }}
    >
      <div
        className="flex w-max animate-[mq_38s_linear_infinite]"
        style={{ willChange: "transform" }}
      >
        {loop.map((it, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-6 px-6 py-3 font-bold tracking-[-0.01em]"
            style={{ fontSize: "clamp(28px, 5vw, 56px)", lineHeight: 1.1 }}
          >
            <span>{it}</span>
            <span className="opacity-45">×</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// logo band + lime stat card
// ============================================================
function LogoBand() {
  const partners = [
    { name: "Green Whale Smart Capital", logo: "/partners/green-whale.png", invert: true },
    { name: "Heliphant", logo: "/partners/heliphant.png", invert: false },
    { name: "Spotlight Invest", logo: "/partners/spotlight-invest.png", invert: false },
  ]
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0A0A0A]/55">
            Trusted by European VC funds
          </p>
          <h2
            className="mt-4 font-bold tracking-[-0.025em] leading-[1.05] max-w-xl"
            style={{ fontSize: "clamp(28px, 3.4vw, 42px)" }}
          >
            Join the funds screening
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}> 10× faster </span>
            on Sam.
          </h2>
          <div className="mt-9 grid grid-cols-3 gap-8 items-center">
            {partners.map((p) => (
              <div key={p.name} className="flex items-center justify-start h-12">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={180}
                  height={48}
                  unoptimized
                  className={`max-h-10 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition ${p.invert ? "invert" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lime stat card — the only big lime block on the page besides CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-2xl p-7 md:p-8"
          style={{ background: LIME, color: INK }}
        >
          <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] opacity-65">
            From deck to partner-ready memo
          </p>
          <p className="mt-4 font-bold tracking-[-0.04em] tabular-nums leading-[0.9]"
             style={{ fontSize: "clamp(64px, 8vw, 120px)" }}>
            5<span className="opacity-50" style={{ fontSize: "0.5em" }}>min</span>
          </p>
          <p className="mt-5 text-[13.5px] leading-[1.5] opacity-80 max-w-[260px]">
            What used to take an afternoon now happens before your espresso cools.
          </p>
          <Link
            href="/sample"
            className="mt-6 inline-flex items-center gap-1 text-[13px] font-bold border-b pb-0.5"
            style={{ borderColor: INK }}
          >
            Read a sample memo →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// "One platform. Infinite analysts."
// ============================================================
function OnePlatform() {
  return (
    <section className="py-20 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1240px] px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-bold tracking-[-0.04em] leading-[0.95] max-w-4xl mx-auto"
          style={{ fontSize: "clamp(44px, 7.6vw, 110px)" }}
        >
          One platform.
          <br />
          Infinite analysts that never sleep.
        </motion.h2>
        <Link
          href="/register"
          className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold text-[#0A0A0A] hover:scale-[1.02] transition"
          style={{ background: LIME }}
        >
          Make the switch
        </Link>
      </div>
    </section>
  )
}

// ============================================================
// Two-column feature cards with annotated UI shots
// ============================================================
function FeatureCards() {
  return (
    <section className="pb-24 md:pb-28">
      <div className="mx-auto max-w-[1240px] px-6 grid md:grid-cols-2 gap-5">
        <FeatureCard
          eyebrow="Memos"
          title={<>Memos that <span className="font-serif italic font-normal">write themselves.</span></>}
          inner={<MemoUiShot />}
        />
        <FeatureCard
          eyebrow="Fund Fit"
          title={<>Scored against <span className="font-serif italic font-normal">your mandate.</span></>}
          inner={<FundFitUiShot />}
        />
      </div>
    </section>
  )
}

function FeatureCard({
  eyebrow,
  title,
  inner,
}: {
  eyebrow: string
  title: React.ReactNode
  inner: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative rounded-3xl p-7 md:p-9 overflow-hidden"
      style={{ background: SOFT_FIELD, border: `1px solid ${RULE}` }}
    >
      <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
        {eyebrow}
      </p>
      <h3 className="mt-3 font-bold tracking-[-0.025em] leading-[1.05]"
          style={{ fontSize: "clamp(28px, 3.2vw, 40px)" }}>
        {title}
      </h3>
      <div className="mt-8 relative">{inner}</div>
    </motion.div>
  )
}

function MemoUiShot() {
  // Sequence: typewriter the thesis → pop source pills → slide in "Verdict
  // locked" → tick the timer up to 4m 12s. Triggered once when the card
  // scrolls into view; replays each subsequent re-entry would be distracting.
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })

  const thesis =
    "Repeat operator team building workflow software for European mid-market VCs. €420K ARR [Pitch Deck — UNVALIDATED] on €650K pre-seed. Defensible workflow lock-in plausible."

  const [typed, setTyped] = useState("")
  useEffect(() => {
    if (!inView) return
    let i = 0
    const id = setInterval(() => {
      i += 2
      setTyped(thesis.slice(0, i))
      if (i >= thesis.length) clearInterval(id)
    }, 12)
    return () => clearInterval(id)
  }, [inView])

  const PILL_DELAY = 1.6 // start showing pills after typewriter is mostly done
  const VERDICT_DELAY = 2.6
  const TIMER_DELAY = 3.0

  return (
    <div ref={ref} className="relative">
      <div className="rounded-2xl bg-white border p-5 shadow-[0_18px_50px_-20px_rgba(10,10,10,0.18)]"
           style={{ borderColor: RULE }}>
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: SUBINK }}>
          Investment thesis
        </p>
        <p className="mt-3 text-[13px] leading-[1.55] text-[#0A0A0A]/85 min-h-[88px]">
          {typed.split(/(\[Pitch Deck — UNVALIDATED\])/g).map((chunk, i) =>
            chunk === "[Pitch Deck — UNVALIDATED]" ? (
              <span key={i} className="font-mono text-[11px] opacity-60">{chunk}</span>
            ) : (
              <span key={i}>{chunk}</span>
            )
          )}
          {inView && typed.length < thesis.length && (
            <span className="inline-block w-[2px] h-[14px] align-[-2px] ml-[1px] animate-pulse" style={{ background: ACCENT }} />
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["Pitch Deck", "LinkedIn", "McKinsey 2024", "Crunchbase"].map((p, i) => (
            <motion.span
              key={p}
              initial={{ opacity: 0, scale: 0.6, y: 6 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.45, ease: EASE, delay: PILL_DELAY + 0.08 * i, type: "spring", stiffness: 300, damping: 22 }}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border"
              style={{ borderColor: RULE, background: "rgba(0,0,0,0.03)" }}
            >
              {p}
            </motion.span>
          ))}
        </div>
      </div>

      {/* floating annotation: verdict — slides + scales in with a pop */}
      <motion.div
        initial={{ opacity: 0, x: 32, scale: 0.85, rotate: 6 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1, rotate: 0 } : { opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: VERDICT_DELAY, type: "spring", stiffness: 240, damping: 20 }}
        className="absolute -top-4 -right-3 rounded-xl bg-white border p-3 pl-3.5 pr-4 shadow-md flex items-center gap-2.5"
        style={{ borderColor: RULE }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={inView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: VERDICT_DELAY + 0.2 }}
          className="grid place-items-center h-7 w-7 rounded-full text-white text-[12px] font-bold shrink-0"
          style={{ background: ACCENT_HI }}
        >
          ✓
        </motion.span>
        <div>
          <p className="text-[11px] font-bold leading-tight">Verdict locked</p>
          <p className="text-[10px] opacity-60">Strong Buy · 84/100</p>
        </div>
      </motion.div>

      {/* floating annotation: timer — ticks 0:00 → 4:12 */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.85 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: TIMER_DELAY }}
        className="absolute -bottom-5 left-6 rounded-xl bg-white border px-3 py-2 shadow-md"
        style={{ borderColor: RULE }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: SUBINK }}>
          Drafted in
        </p>
        <p className="font-bold text-[15px] tabular-nums" style={{ color: ACCENT }}>
          <ClockTick toSeconds={4 * 60 + 12} start={inView} startDelayMs={TIMER_DELAY * 1000} durationMs={1100} />
        </p>
      </motion.div>
    </div>
  )
}

// 0:00 → m:ss tick used by the Memos card timer.
function ClockTick({
  toSeconds,
  start,
  startDelayMs = 0,
  durationMs = 1200,
}: {
  toSeconds: number
  start: boolean
  startDelayMs?: number
  durationMs?: number
}) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!start) return
    const startTs = performance.now() + startDelayMs
    let raf = 0
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - startTs) / durationMs))
      // Ease-out cubic for a satisfying deceleration
      const e = 1 - Math.pow(1 - t, 3)
      setV(Math.round(toSeconds * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, toSeconds, startDelayMs, durationMs])
  const m = Math.floor(v / 60)
  const s = v % 60
  return <span>{m}m {String(s).padStart(2, "0")}s</span>
}

function FundFitUiShot() {
  // Sequence: rows slide in left-to-right, each check-mark draws via SVG
  // path animation, and the "X / 5 match" counter ticks up as checks land.
  // Last row gets the X (no counter increment).
  const rows = [
    { l: "Sector: B2B SaaS", on: true },
    { l: "Stage: Seed–Series A", on: true },
    { l: "Geography: EU", on: true },
    { l: "Ticket: €500K–€2M", on: true },
    { l: "Solo founder allowed", on: false },
  ]
  const ROW_DELAY = 0.45 // seconds between row reveals
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })

  // Tick the match counter as each "on: true" row lands
  const [matched, setMatched] = useState(0)
  useEffect(() => {
    if (!inView) return
    const timers: ReturnType<typeof setTimeout>[] = []
    let count = 0
    rows.forEach((r, i) => {
      if (!r.on) return
      timers.push(
        setTimeout(() => {
          count++
          setMatched(count)
        }, (i + 1) * ROW_DELAY * 1000)
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <div ref={ref} className="relative">
      <div
        className="rounded-2xl bg-white border p-5 shadow-[0_18px_50px_-20px_rgba(10,10,10,0.18)]"
        style={{ borderColor: RULE }}
      >
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: SUBINK }}>
            Fund Fit · canaaro
          </p>
          <p className="font-bold text-[14px] tabular-nums" style={{ color: ACCENT }}>
            {matched} / 5 match
          </p>
        </div>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <motion.li
              key={r.l}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: (i + 1) * ROW_DELAY - 0.15 }}
              className="flex items-center justify-between text-[12.5px]"
            >
              <span className={r.on ? "" : "line-through opacity-50"}>{r.l}</span>
              {r.on ? (
                <DrawCheck inView={inView} delay={(i + 1) * ROW_DELAY} />
              ) : (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={inView ? { scale: 1, rotate: 0 } : { scale: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: (i + 1) * ROW_DELAY }}
                  className="grid place-items-center h-4 w-4"
                >
                  <X className="h-4 w-4 text-[#0A0A0A]/40" />
                </motion.span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8, x: 10 }}
        animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="absolute -top-4 -left-3 rounded-xl bg-white border p-2.5 pr-3 shadow-md flex items-center gap-2"
        style={{ borderColor: RULE }}
      >
        <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} />
        <p className="text-[11px] font-semibold">Mandate, applied automatically</p>
      </motion.div>
    </div>
  )
}

// Self-drawing SVG check used by Fund Fit rows.
function DrawCheck({ inView, delay = 0 }: { inView: boolean; delay?: number }) {
  return (
    <span className="grid place-items-center h-5 w-5 rounded-full" style={{ background: ACCENT_HI }}>
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <motion.path
          d="M2.5 6.2 L5 8.5 L9.5 3.8"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay }}
        />
      </svg>
    </span>
  )
}

// ============================================================
// Quotes — ramp-style featured case study (image left, editorial right)
// ============================================================
function Quotes() {
  return (
    <section
      className="py-24 md:py-32 border-y"
      style={{ borderColor: RULE, background: BONE }}
    >
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Featured case-study row */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — visual / "watch story" tile */}
          <CaseStudyTile />

          {/* Right — editorial */}
          <div>
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.06]"
              style={{ fontSize: "clamp(34px, 4.2vw, 54px)" }}
            >
              Keep your partners focused on judgment.{" "}
              <span style={{ color: SUBINK }}>
                Let Sam handle the first-pass.
              </span>
            </h2>

            <blockquote
              className="mt-8 text-[16px] md:text-[17px] leading-[1.6]"
              style={{ color: "rgba(10,10,10,0.78)" }}
            >
              &ldquo;Gone are the days of scribbled notes after a 10-minute deck
              scan. Sam delivers a structured memo every partner reads the same
              way — every deck, every time. We pass faster, and we&rsquo;re more
              honest about why.&rdquo;
            </blockquote>

            <div className="mt-7 flex items-center gap-4">
              <span
                className="grid place-items-center h-11 w-11 rounded-full font-semibold text-[12.5px] tracking-[0.04em]"
                style={{ background: ACCENT, color: LIME }}
                aria-hidden
              >
                SB
              </span>
              <div>
                <p className="text-[14.5px] font-semibold leading-tight">
                  Sven Bakker
                </p>
                <p
                  className="text-[12px] mt-1"
                  style={{ color: SUBINK }}
                >
                  Managing Partner, Green Whale Smart Capital
                </p>
              </div>
            </div>

            <Link
              href="/sample"
              className="mt-7 inline-flex items-center gap-1.5 text-[14px] font-semibold border-b-[1.5px] pb-0.5 hover:gap-2.5 transition-all"
              style={{ color: INK, borderColor: INK }}
            >
              Read their story
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Sub-block below — mirrors ramp's "AI that learns from your team..." */}
        <div className="mt-24 md:mt-32 max-w-3xl">
          <h3
            className="font-bold tracking-[-0.02em] leading-[1.1]"
            style={{ fontSize: "clamp(26px, 3.2vw, 40px)" }}
          >
            Memos that learn from your fund.{" "}
            <span style={{ color: SUBINK }}>
              Powered by 1,000+ partners who screened before you.
            </span>
          </h3>
          <Link
            href="/how-it-works"
            className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold border-b-[1.5px] pb-0.5 hover:gap-2.5 transition-all"
            style={{ color: INK, borderColor: INK }}
          >
            Learn about the Sam framework
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Brand-controlled "case study" tile — replaces the missing customer photo.
// Forest panel, floating memo preview, eyebrow + watch-story pill.
function CaseStudyTile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative rounded-3xl overflow-hidden aspect-[5/4] lg:aspect-[6/5] p-7 flex flex-col justify-end"
      style={{ background: ACCENT, color: "white" }}
    >
      {/* faint dotted grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* lime soft halo bottom-right */}
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full opacity-30"
        style={{
          background: `radial-gradient(closest-side, ${LIME} 0%, transparent 70%)`,
        }}
      />

      {/* eyebrow — top-left */}
      <div className="absolute top-7 left-7 right-7 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.2em] opacity-80">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: LIME }}
          />
          Case study · 03
        </span>
        <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] opacity-60">
          1:24
        </span>
      </div>

      {/* floating memo preview — top-right */}
      <motion.div
        initial={{ opacity: 0, y: 10, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        className="absolute top-20 right-7 w-[58%] max-w-[280px] rounded-xl bg-white text-[#0A0A0A] p-4 shadow-2xl"
        style={{ transformOrigin: "top right" }}
      >
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full" style={{ background: ACCENT_HI }} />
            Memo · GW-014
          </span>
          <span style={{ color: ACCENT }}>82</span>
        </div>
        <p className="mt-2 text-[11.5px] font-semibold leading-tight">
          Investment thesis
        </p>
        <p className="mt-1 text-[10px] leading-[1.5]" style={{ color: SUBINK }}>
          Strong founder-market fit, defensible distribution, capital-efficient growth.
        </p>
        <div className="mt-3 space-y-1.5">
          {[
            ["Team", 88],
            ["Market", 76],
            ["Product", 84],
          ].map(([l, v]) => (
            <div key={l as string} className="flex items-center gap-2 text-[9px]">
              <span className="w-12" style={{ color: SUBINK }}>{l}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: SOFT }}>
                <div className="h-full rounded-full" style={{ width: `${v}%`, background: ACCENT }} />
              </div>
              <span className="w-5 text-right tabular-nums font-semibold">{v as number}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* big SAM watermark — bottom-left, behind pill */}
      <div
        aria-hidden
        className="absolute bottom-2 left-5 font-bold leading-none opacity-[0.06] select-none"
        style={{ fontSize: "clamp(120px, 18vw, 200px)" }}
      >
        SAM
      </div>

      {/* watch story pill — bottom-left, in front */}
      <button
        type="button"
        className="relative self-start inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold transition hover:scale-[1.02]"
        style={{ color: ACCENT }}
      >
        <PlayCircle className="h-4 w-4" />
        Watch story
      </button>
    </motion.div>
  )
}

// ============================================================
// After order — clean grid
// ============================================================
function AfterOrder() {
  const tiles = [
    { l: "Team", v: "88" },
    { l: "Market", v: "79" },
    { l: "Product", v: "86" },
    { l: "Traction", v: "72" },
    { l: "Finance", v: "81" },
    { l: "Fund Fit", v: "4/5" },
  ]
  return (
    <section className="py-24 md:py-32" style={{ background: SOFT_FIELD, borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            With Sam
          </p>
          <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: "clamp(36px, 5.6vw, 76px)" }}>
            Now they all read
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              the same memo.
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.55]" style={{ color: SUBINK }}>
            One source of truth. Five domain scores. One verdict your partners actually read.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="mx-auto max-w-[900px] grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {tiles.map((t) => (
            <motion.div
              key={t.l}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: EASE }}
              className="rounded-2xl bg-white border p-6 hover:-translate-y-1 transition"
              style={{ borderColor: RULE }}
            >
              <p className="text-[10.5px] font-mono uppercase tracking-widest" style={{ color: SUBINK }}>
                {t.l}
              </p>
              <p className="mt-3 font-bold tracking-[-0.03em] tabular-nums"
                 style={{ fontSize: "clamp(32px, 4vw, 52px)", color: INK }}>
                {t.v}
              </p>
              <div className="mt-2 h-1 rounded-full" style={{ background: SOFT }}>
                <div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_HI})`, width: t.v.includes("/") ? "80%" : `${t.v}%` }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// "Not a prompt wrapper" banner — design briefing Section 8 / Homepage step 6
// ============================================================
function DarkAI() {
  const proofs = [
    { label: "Fixed framework", body: "Six investment domains, scored the same way every deck. Comparable across the pipeline." },
    { label: "Fund-specific context", body: "Your mandate, thesis and ticket window inform every assessment — not the model." },
    { label: "Knowledge-backed", body: "Curated startup knowledge, sector benchmarks and market data — not what a generic LLM remembers." },
    { label: "Source-aware outputs", body: "Every claim is tagged: pitch-deck, external source, knowledge base, or generated inference. Unverified claims are flagged." },
  ]
  return (
    <section className="relative overflow-hidden" style={{ background: INK, color: "#FFF" }}>
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{ background: `radial-gradient(ellipse 60% 40% at 30% 30%, rgba(0,168,107,0.18), transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-[1240px] px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: LIME }}>
            Not a prompt wrapper
          </p>
          <h2
            className="mt-4 font-bold tracking-[-0.03em] leading-[1.02]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            The model is not the product.{" "}
            <span className="font-serif italic font-normal" style={{ color: LIME }}>
              The investment framework is.
            </span>
          </h2>
          <p className="mt-7 text-[16px] leading-[1.6] text-white/65">
            Generic AI summarises. Sam assesses — using a fixed framework, your fund context,
            curated startup knowledge, and source-aware logic that flags what still needs verification.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {proofs.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.05 * i }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: LIME }}>
                {p.label}
              </p>
              <p className="mt-3 text-[14px] leading-[1.55] text-white/80">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AgentStream() {
  const events = [
    { t: "00:02", msg: "Parsing pitch deck (24 pages)…", tag: "intake" },
    { t: "00:14", msg: "Founders extracted · 3 LinkedIn matches", tag: "team" },
    { t: "00:31", msg: "Validating TAM claim against McKinsey 2024…", tag: "market" },
    { t: "00:47", msg: "Risk flagged: solo founder, no CTO", tag: "team" },
    { t: "01:02", msg: "Moat audit complete · workflow lock-in plausible", tag: "product" },
    { t: "01:18", msg: "Writing executive summary…", tag: "summary" },
    { t: "01:31", msg: "Verdict: Strong Buy · 84/100", tag: "done" },
  ]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" })
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (visible >= events.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 700)
    return () => clearTimeout(t)
  }, [visible, events.length, inView])

  return (
    <div
      ref={ref}
      className="rounded-2xl border p-5 md:p-6 backdrop-blur"
      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/55">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: ACCENT_HI }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: ACCENT_HI }} />
        </span>
        Agent · live
      </div>
      <div className="mt-4 space-y-2 font-mono text-[12.5px]">
        {events.slice(0, visible).map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex items-baseline gap-3"
          >
            <span className="text-white/40 tabular-nums">{e.t}</span>
            <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(215,254,63,0.12)", color: LIME }}>
              {e.tag}
            </span>
            <span className="text-white/85 truncate">{e.msg}</span>
          </motion.div>
        ))}
        {inView && visible < events.length && (
          <div className="text-white/40 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: ACCENT_HI }} />
            <span>thinking…</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// pricing
// ============================================================
function Pricing() {
  // Tier names + pricing aligned to client design briefing v4 (May 2026).
  const tiers = [
    {
      name: "Angel",
      price: "€149",
      blurb: "For active angel investors reviewing decks individually.",
      features: [
        "10 pitch deck analyses / month",
        "1 seat",
        "Six-domain investment assessment",
        "Source attribution & confidence tagging",
        "Missing info checklist + founder questions",
        "Word + PDF export",
      ],
      ctaLabel: "Start free trial",
      ctaHref: "/register?tier=starter",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "€299",
      blurb: "For syndicates, family offices and small investment teams.",
      features: [
        "30 pitch deck analyses / month",
        "3 seats",
        "Everything in Angel",
        "Shared workspace + deal comparison",
        "2-factor authentication",
        "Light fund-fit scoring",
      ],
      ctaLabel: "Start free trial",
      ctaHref: "/register?tier=professional",
      highlighted: true,
    },
    {
      name: "Fund",
      price: "Custom",
      blurb: "For VC funds and professional investment teams.",
      features: [
        "Custom analysis volume",
        "Custom seats",
        "Everything in Pro",
        "Full fund-fit scoring + portfolio conflict",
        "Shared memo library + tailored knowledge base",
        "CRM connections + dedicated support",
      ],
      ctaLabel: "Book a walkthrough",
      ctaHref: "/register?tier=fund",
      highlighted: false,
    },
  ]
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            Pricing
          </p>
          <h2
            className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
            style={{ fontSize: "clamp(40px, 5.4vw, 72px)" }}
          >
            Pricing that scales{" "}
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              with your dealflow.
            </span>
          </h2>
          <p className="mt-5 text-[15.5px] leading-[1.55]" style={{ color: SUBINK }}>
            Start with structured deck assessments. Upgrade when you need full
            fund-fit scoring, shared workflows and higher volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1080px] mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
              className="relative rounded-3xl p-7 md:p-8 flex flex-col"
              style={{
                background: t.highlighted ? INK : "#FFFFFF",
                color: t.highlighted ? "#FFFFFF" : INK,
                border: `1px solid ${t.highlighted ? "transparent" : RULE}`,
                boxShadow: t.highlighted
                  ? "0 30px 80px -30px rgba(10,10,10,0.35)"
                  : "0 18px 50px -30px rgba(10,10,10,0.10)",
              }}
            >
              {t.highlighted && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold"
                  style={{ background: LIME, color: INK }}
                >
                  Most popular
                </span>
              )}
              <p
                className="text-[10.5px] font-mono uppercase tracking-[0.2em]"
                style={{ color: t.highlighted ? "rgba(255,255,255,0.55)" : SUBINK }}
              >
                {t.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className="font-bold tracking-[-0.04em] tabular-nums leading-[0.9]"
                  style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
                >
                  {t.price}
                </span>
                <span
                  className="text-[14px] font-medium"
                  style={{ color: t.highlighted ? "rgba(255,255,255,0.55)" : SUBINK }}
                >
                  /mo
                </span>
              </div>
              <p
                className="mt-4 text-[13.5px] leading-[1.5]"
                style={{ color: t.highlighted ? "rgba(255,255,255,0.7)" : SUBINK }}
              >
                {t.blurb}
              </p>
              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13.5px]">
                    <span
                      className="grid place-items-center h-4 w-4 rounded-full shrink-0"
                      style={{ background: t.highlighted ? LIME : ACCENT_HI }}
                    >
                      <Check
                        className="h-2.5 w-2.5 stroke-[3]"
                        style={{ color: t.highlighted ? INK : "#FFFFFF" }}
                      />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.ctaHref}
                className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition hover:scale-[1.02] ${
                  t.highlighted ? "" : "border"
                }`}
                style={
                  t.highlighted
                    ? { background: LIME, color: INK }
                    : { borderColor: RULE, color: INK, background: "transparent" }
                }
              >
                {t.ctaLabel}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// closing CTA
// ============================================================
function ClosingCTA() {
  return (
    <section className="py-24 md:py-32 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1000px] px-6 text-center">
        <h2 className="font-bold tracking-[-0.04em] leading-[0.95] mx-auto"
            style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
          Make every first screen{" "}
          <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
            sharper.
          </span>
        </h2>
        <p className="mt-6 mx-auto max-w-xl text-[16px] leading-[1.55]" style={{ color: SUBINK }}>
          Upload a pitch deck. Receive a structured, source-aware investment assessment across
          six domains, fund-fit scoring and a missing-info checklist — before you spend partner
          time.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register?tier=professional"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
            style={{ background: INK, color: "#FFF" }}
          >
            Analyse a deck
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold border-[1.5px] hover:bg-foreground/[0.04] transition"
            style={{ borderColor: RULE, color: INK }}
          >
            View sample assessment
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// footer
// ============================================================
function Footer() {
  return (
    <footer style={{ background: INK, color: "#FFF" }}>
      <div className="mx-auto max-w-[1240px] px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-[13px]">
        <div className="col-span-2">
          <div className="flex items-center gap-1.5 font-bold text-[16px]">
            sam<span className="opacity-50">/</span>
          </div>
          <p className="mt-4 text-white/55 max-w-xs leading-[1.6]">
            The AI investment associate for European VC funds.
          </p>
        </div>
        {[
          { h: "Product", l: ["Features", "Pricing", "Sample memo", "Changelog"] },
          { h: "Company", l: ["About", "Customers", "Blog", "Careers"] },
          { h: "Legal", l: ["Privacy", "Security", "GDPR", "Terms"] },
        ].map((c) => (
          <div key={c.h}>
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-3">{c.h}</p>
            <ul className="space-y-2">
              {c.l.map((it) => (
                <li key={it}><a className="hover:text-white transition text-white/70">{it}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-[1240px] px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-[12px] text-white/45">
          <p>© 2026 Sam. EU-based.</p>
          <p className="font-mono uppercase tracking-widest">SOC 2 · GDPR · ISO 27001</p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// Problem — before/after split
// ============================================================
function Problem() {
  const pain = [
    "Deck opened at 11pm, scanned in 8 minutes",
    '"Good team — I think?" scribbled in a notebook',
    "Passed on a deal last March, can't remember why",
    "Every partner screens slightly differently",
    "No memory, no comparability, no defensible verdict",
  ]
  const after = [
    "From scribbled notes → a structured, searchable memo",
    "From a 10-minute screen → a defensible decision record",
    "From inconsistent judgement → memos partners can compare",
    "From lost context → ask any deal \"why did we pass?\" six months later",
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            The screening problem
          </p>
          <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            First-pass screening
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              has been broken for years.
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-3xl p-7 md:p-9 border"
            style={{ background: "#FFFFFF", borderColor: RULE }}
          >
            <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#A11A1A]">
              Before Sam
            </p>
            <ul className="mt-5 space-y-3.5">
              {pain.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[14.5px] leading-[1.45]">
                  <X className="h-4 w-4 mt-0.5 shrink-0 text-[#A11A1A]/70" />
                  <span className="text-[#0A0A0A]/80">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
            className="rounded-3xl p-7 md:p-9 border"
            style={{ background: SOFT_FIELD, borderColor: RULE }}
          >
            <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              With Sam
            </p>
            <ul className="mt-5 space-y-3.5">
              {after.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[14.5px] leading-[1.45]">
                  <span className="grid place-items-center h-4 w-4 mt-0.5 shrink-0 rounded-full" style={{ background: ACCENT_HI }}>
                    <Check className="h-2.5 w-2.5 text-white stroke-[3]" />
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// Framework — six-domain explainer (per design briefing)
// ============================================================
function Framework() {
  const domains = [
    { name: "Team", focus: "Founder-market fit, backgrounds, red flags" },
    { name: "Market", focus: "TAM / SAM / SOM validation, competitors, why now" },
    { name: "Product", focus: "10× test, PMF signals, moat" },
    { name: "Traction", focus: "Revenue, retention, capital efficiency" },
    { name: "Finance", focus: "Valuation, deal terms, investor signals" },
    { name: "Exit", focus: "Exit range, timeline, acquirer landscape" },
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            The framework
          </p>
          <h2 className="mt-3 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Six domains.
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              Same framework, every deck.
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.55] max-w-xl" style={{ color: SUBINK }}>
            Stage-aware scoring, fixed rubric, comparable across the pipeline. The model is just the engine — the framework is the product.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {domains.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.05 * i }}
              className="rounded-2xl bg-white border p-5 hover:-translate-y-1 transition"
              style={{ borderColor: RULE }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest tabular-nums" style={{ color: SUBINK }}>
                0{i + 1}
              </p>
              <p className="mt-3 font-bold text-[18px] tracking-tight">{d.name}</p>
              <p className="mt-2 text-[12.5px] leading-[1.45] text-[#0A0A0A]/65">{d.focus}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// Audiences — three distinct card treatments + workflow visualization
// Card 1 (Angels) light, Card 2 (Syndicates) DARK featured, Card 3 (Funds)
// off-white with forest accent. Each gets a small avatar-stack viz that
// animates in (1 → 3 → 5 dots) to communicate workflow shape.
// ============================================================
function Audiences() {
  type Theme = "light" | "dark" | "tinted"
  const cards: {
    label: string
    badge: string
    workflow: string
    body: string
    cta: string
    href: string
    theme: Theme
    seats: number
  }[] = [
    {
      label: "For angels",
      badge: "Best for solo deal flow",
      workflow: "Solo · deck only",
      body: "You see fifty decks a month and meet with five. Sam gives you a structured second opinion before the first call. Six months later, you can still explain why you passed.",
      cta: "See the Angels workflow",
      href: "/for-angels",
      theme: "light",
      seats: 1,
    },
    {
      label: "For syndicates & scouts",
      badge: "Best for shared notes",
      workflow: "Shared notes · supporting docs",
      body: "Your deal notes live across three tools and two heads. Sam produces a consistent memo per deal that your syndicate partners can actually compare and reference.",
      cta: "See the Pro workflow",
      href: "/sample",
      theme: "dark",
      seats: 3,
    },
    {
      label: "For VC funds",
      badge: "Best for institutional teams",
      workflow: "Team seats · shared library",
      body: "First-screening capacity is the bottleneck in every fund. Sam handles the triage layer so your analysts spend their time on the deals that matter, not on the ones they'll pass.",
      cta: "See the VC workflow",
      href: "/for-vc-funds",
      theme: "tinted",
      seats: 5,
    },
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            Who it's for
          </p>
          <h2 className="mt-3 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Same framework.
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              Different workflows.
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c, i) => {
            const isDark = c.theme === "dark"
            const isTinted = c.theme === "tinted"
            const bg = isDark ? INK : isTinted ? "#F0F4EE" : "#FFFFFF"
            const fg = isDark ? "#FFFFFF" : INK
            const subFg = isDark ? "rgba(255,255,255,0.55)" : SUBINK
            const accent = isDark ? LIME : ACCENT
            const ruleCol = isDark ? "rgba(255,255,255,0.16)" : RULE
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.08 * i }}
                whileHover={{ y: -4 }}
                className="relative rounded-3xl p-7 md:p-8 flex flex-col overflow-hidden"
                style={{
                  background: bg,
                  color: fg,
                  border: `1px solid ${isDark ? "transparent" : RULE}`,
                  boxShadow: isDark
                    ? "0 30px 80px -30px rgba(10,10,10,0.45)"
                    : "0 18px 50px -30px rgba(10,10,10,0.10)",
                }}
              >
                {/* Decorative top-right accent ring (subtle, animates in) */}
                <motion.div
                  aria-hidden
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.4 + 0.08 * i }}
                  className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-2xl pointer-events-none"
                  style={{ background: isDark ? `${LIME}33` : isTinted ? `${ACCENT_HI}33` : `${LIME}55` }}
                />

                {/* Workflow viz: avatar-stack animating in */}
                <SeatStack seats={c.seats} delay={0.18 + 0.08 * i} accent={accent} dark={isDark} />

                <p
                  className="mt-7 text-[10.5px] font-mono uppercase tracking-[0.2em]"
                  style={{ color: subFg }}
                >
                  {c.label}
                </p>
                <p
                  className="mt-2 font-bold tracking-[-0.02em]"
                  style={{ fontSize: "clamp(22px, 2.6vw, 30px)" }}
                >
                  {c.badge}
                </p>
                <p
                  className="mt-2 text-[11px] font-mono uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {c.workflow}
                </p>
                <p
                  className="mt-5 text-[14px] leading-[1.55] flex-1"
                  style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(10,10,10,0.7)" }}
                >
                  {c.body}
                </p>
                <Link
                  href={c.href}
                  className="mt-7 inline-flex items-center gap-1.5 text-[13.5px] font-semibold border-b pb-0.5 self-start hover:gap-2.5 transition-all"
                  style={{ borderColor: fg, color: fg }}
                >
                  {c.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Avatar-stack viz: pops 1, 3, or 5 dots into place to communicate
// workflow shape (solo, syndicate, fund team).
function SeatStack({
  seats,
  delay,
  accent,
  dark,
}: {
  seats: number
  delay: number
  accent: string
  dark: boolean
}) {
  return (
    <div className="flex items-center gap-2 h-10">
      <div className="flex -space-x-2">
        {Array.from({ length: seats }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -8, scale: 0.5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              ease: EASE,
              delay: delay + 0.08 * i,
              type: "spring",
              stiffness: 280,
              damping: 18,
            }}
            className="grid place-items-center h-9 w-9 rounded-full ring-2 font-mono text-[10px] font-bold"
            style={{
              background: i === 0 ? accent : dark ? "rgba(255,255,255,0.12)" : "rgba(10,10,10,0.06)",
              color: i === 0 ? (dark ? INK : "#FFFFFF") : dark ? "#FFFFFF" : INK,
              borderColor: dark ? INK : "#FFFFFF",
              zIndex: seats - i,
            }}
          >
            {i === 0 ? "S" : ""}
          </motion.div>
        ))}
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: delay + 0.08 * seats + 0.1 }}
        className="text-[10px] font-mono uppercase tracking-widest opacity-60"
      >
        {seats === 1 ? "1 seat" : `${seats}${seats >= 5 ? "+" : ""} seats`}
      </motion.span>
    </div>
  )
}

// ============================================================
// Trust — EU data sovereignty
// ============================================================
function Trust() {
  const pillars = [
    { code: "EU-01", label: "Designed for EU processing", desc: "Sam is built around EU-based processing and storage. GDPR is treated as an architectural constraint, not a compliance checkbox." },
    { code: "EU-02", label: "GDPR by design", desc: "Data minimisation, retention rules, and processing scopes are baked into the framework, not bolted on afterwards." },
    { code: "EU-03", label: "No model training on your decks", desc: "Your submitted decks are never used to train any model — ours or anyone else's." },
    { code: "EU-04", label: "Deletion on your schedule", desc: "You set the retention window. When it ends, decks and derived artefacts are removed from storage." },
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            EU data sovereignty
          </p>
          <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: "clamp(36px, 4.6vw, 56px)" }}>
            Where your data lives,
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              and who sees it.
            </span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.6] text-[#0A0A0A]/70 max-w-md">
            EU-based processing. GDPR by design. No model training on submitted decks. Deletion on the schedule you set.
          </p>
          <div className="mt-8 inline-flex items-stretch rounded-2xl border bg-white shadow-sm overflow-hidden"
               style={{ borderColor: RULE }}>
            <div className="px-5 py-3.5 text-white" style={{ background: INK }}>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-65">Region</p>
              <p className="font-bold text-[18px]" style={{ color: LIME }}>EU · EEA</p>
            </div>
            <div className="px-5 py-3.5 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: ACCENT_HI }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: ACCENT_HI }} />
              </span>
              <p className="text-[12px] font-mono font-semibold">EU-based processing</p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.05 * i }}
              className="relative rounded-2xl bg-white border p-5 md:p-6 hover:-translate-y-1 transition"
              style={{ borderColor: RULE }}
            >
              <span className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                {p.code}
              </span>
              <p className="font-bold text-[14.5px] tracking-tight pr-12">{p.label}</p>
              <p className="mt-2 text-[12.5px] leading-[1.5] text-[#0A0A0A]/65">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FAQ
// ============================================================
function FAQ() {
  // FAQ topics aligned to design briefing: not investment advice, no public
  // model training, fund mandate upload, not replacing analysts, PDF export,
  // source attribution explained.
  const items = [
    {
      q: "How is Sam different from using generic AI to analyse a pitch deck?",
      a: "Sam applies a fixed six-domain investment framework to every deck — same structure, scoring rubric, and severity classifications every time. Generic AI returns whatever comes out of a prompt, so the output varies, can't be compared across deals, and lacks a defensible methodology. Sam's framework is the product; the model is just the engine.",
    },
    {
      q: "Does Sam give investment advice or replace partners?",
      a: "No. Sam is decision support, not investment advice. It handles the repetitive first-screening layer — structure, scoring, red flags, follow-up questions — so partners and analysts spend their time on the deals worth deeper work and the calls only humans can run.",
    },
    {
      q: "What does source attribution actually mean?",
      a: "Every claim in a Sam assessment is tagged: Pitch Deck — UNVALIDATED, Source: LinkedIn, Source: Knowledge Base, Source: Future Market Insights 2025, Generated inference. Unvalidated claims are flagged explicitly so you always know what's a confirmed fact versus a founder claim. External references are still yours to verify before an investment decision.",
    },
    {
      q: "Is my pitch deck data secure and confidential?",
      a: "Yes. Sam runs on European servers only. Your deck is processed, analysed, and stored within the EU. Submitted decks are never used to train public models, and data is deleted on your retention schedule.",
    },
    {
      q: "How does fund-fit work? What can I upload?",
      a: "Upload your fund 1-pager, or fill in thesis, stage focus, sector focus, geography and ticket size. Sam matches every deck against your mandate and produces a fund-fit score with per-criterion match indicators. Full fund-fit scoring is included on the Fund tier; lighter fund-fit is available on Pro.",
    },
    {
      q: "Can I export the assessment?",
      a: "Yes. Every assessment exports as a Word or PDF decision record so you can preserve why a deal was advanced, parked or passed. CRM-native pushes (Affinity, Hubspot) are on the roadmap.",
    },
  ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[900px] px-6">
        <div className="text-center mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            FAQ
          </p>
          <h2 className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: "clamp(36px, 4.6vw, 56px)" }}>
            Questions partners ask first.
          </h2>
        </div>
        <div className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor: RULE }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${RULE}` }}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[rgba(10,10,10,0.02)] transition"
              >
                <span className="font-bold text-[15.5px] tracking-tight">{it.q}</span>
                <span
                  className="grid place-items-center h-7 w-7 rounded-full shrink-0 transition-transform"
                  style={{
                    background: SOFT,
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <span className="text-[16px] font-light leading-none">+</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-[14.5px] leading-[1.6] text-[#0A0A0A]/70 max-w-2xl">
                      {it.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// helpers
// ============================================================
function CountUp({
  to,
  duration = 1.2,
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
  const spring = useSpring(motionValue, { damping: 30, stiffness: 110, duration: duration * 1000 })
  useEffect(() => {
    if (start) motionValue.set(to)
  }, [start, to, motionValue])
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring])
  return <span className={className}>{display}</span>
}

function MarqueeStyles() {
  return (
    <style jsx global>{`
      @keyframes mq {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-33.33%); }
      }
    `}</style>
  )
}

// ============================================================
// Source attribution callout — design briefing Section 8 #2
// ============================================================
function SourceAttribution() {
  const tags = [
    { label: "Pitch Deck — UNVALIDATED", tone: "warn" as const, claim: "Founder claim: €4M ARR, 32% MoM growth (Q1 2026)." },
    { label: "Source: LinkedIn", tone: "ok" as const, claim: "CEO: 8 yrs at Adyen, prior exit (Bunq, 2019). Confirmed." },
    { label: "Source: Future Market Insights, 2025", tone: "ok" as const, claim: "EU SMB payments TAM €38B, 12.4% CAGR through 2030." },
    { label: "Generated inference", tone: "neutral" as const, claim: "Stage-implied valuation range €18–24M based on Series A medians." },
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE, background: SOFT_FIELD }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            Source attribution
          </p>
          <h2
            className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
            style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
          >
            Every insight is{" "}
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              source-tagged.
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.55]" style={{ color: SUBINK }}>
            Sam shows you exactly where it got the information — and flags what still needs to be
            verified. Pitch-deck claims are marked UNVALIDATED. External sources are cited. You
            always know what is a confirmed fact versus a founder claim.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tags.map((t, i) => {
            const palette =
              t.tone === "warn"
                ? { bg: "rgba(217, 119, 6, 0.10)", fg: "#92400e", ring: "rgba(217,119,6,0.35)" }
                : t.tone === "ok"
                ? { bg: "rgba(0,168,107,0.10)", fg: "#065f46", ring: "rgba(0,168,107,0.35)" }
                : { bg: "rgba(10,10,10,0.04)", fg: "rgba(10,10,10,0.62)", ring: RULE }
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.05 * i }}
                className="rounded-2xl bg-white p-5 border"
                style={{ borderColor: RULE }}
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-mono uppercase tracking-[0.18em] font-bold ring-1"
                  style={{ background: palette.bg, color: palette.fg, borderColor: "transparent", boxShadow: `inset 0 0 0 1px ${palette.ring}` }}
                >
                  {t.label}
                </span>
                <p className="mt-3 text-[14px] leading-[1.55]">{t.claim}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// Missing information callout — design briefing Section 8 #3
// ============================================================
function MissingInfo() {
  const gaps = [
    { domain: "Team", question: "Who owns customer success today, and at what tenure?" },
    { domain: "Market", question: "What's the SAM (not TAM) — addressable customers in EU only?" },
    { domain: "Traction", question: "Net revenue retention for the last 4 quarters?" },
    { domain: "Finance", question: "Burn multiple and runway after this round closes?" },
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            Missing information
          </p>
          <h2
            className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
            style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
          >
            Know exactly what you still need{" "}
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              to ask.
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.55]" style={{ color: SUBINK }}>
            Sam identifies every data gap in the pitch deck and generates ready-to-use follow-up
            questions per domain — the kind your associates would write before a first call.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-[12.5px] font-mono uppercase tracking-[0.18em] rounded-full px-3 py-1.5"
             style={{ background: "rgba(15,61,46,0.06)", color: ACCENT }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT_HI }} />
            Missing info never reduces the score
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="rounded-3xl bg-white border p-6 md:p-7"
          style={{ borderColor: RULE }}
        >
          <div className="flex items-center gap-2 pb-4 mb-4 border-b" style={{ borderColor: RULE }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT_HI }} />
            <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              Suggested founder follow-ups · 4 domains
            </p>
          </div>
          <ul className="space-y-3.5">
            {gaps.map((g, i) => (
              <motion.li
                key={g.question}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.06 * i }}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[9.5px] font-mono uppercase tracking-[0.2em] font-bold mt-0.5" style={{ background: SOFT_FIELD, color: ACCENT, border: `1px solid ${RULE}` }}>
                  {g.domain}
                </span>
                <span className="text-[14px] leading-[1.5]">{g.question}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// Ask Sam / Co-Pilot section — design briefing Section 8 #1
// ============================================================
function AskSamSection() {
  const prompts = [
    "Why did this company score the way it did?",
    "What are the biggest risks?",
    "Draft a founder follow-up email",
    "Which fund-fit dimension is weakest?",
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE, background: BONE }}>
      <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
            Ask Sam · co-pilot
          </p>
          <h2
            className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
            style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
          >
            Ask Sam anything —{" "}
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              in the context of the deal you just analysed.
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.55]" style={{ color: SUBINK }}>
            The co-pilot panel is always open alongside your analysis. It knows which deal you&apos;re
            viewing and which domain you&apos;re in. Ask about scores, red flags, fund fit, or get a
            draft founder email — without leaving the assessment.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-3xl bg-white border overflow-hidden"
          style={{ borderColor: RULE }}
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: RULE }}>
            <span className="grid place-items-center h-7 w-7 rounded-lg" style={{ background: ACCENT, color: LIME }}>
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              Ask Sam · Team analysis · VREY
            </p>
          </div>
          <div className="p-5 space-y-3">
            <div className="rounded-xl px-4 py-3 text-[14px] leading-[1.5]" style={{ background: SOFT_FIELD }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] block mb-1.5" style={{ color: SUBINK }}>You</span>
              Why does the founder-market fit score sit at 76?
            </div>
            <div className="rounded-xl px-4 py-3 text-[14px] leading-[1.5] border" style={{ borderColor: RULE }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] block mb-1.5" style={{ color: ACCENT }}>Sam</span>
              Strong domain expertise (8 yrs at Adyen) + prior exit. Two flags pull the score: no
              prior B2B SaaS experience, and the technical co-founder joined 4 months pre-launch.
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: SUBINK }}>
              Suggested
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] border"
                  style={{ borderColor: RULE, background: SOFT_FIELD, color: INK }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
