// SAM landing — mockup3.
// Off-white field with full-bleed accent slabs. Oversized geometric-sans hero,
// asymmetric bento, near-black AI section, big-stat strip on green, alternating
// feature slabs, closing CTA. Uses SAM's green palette (#0F3D2E / #00A86B)
// and Geist throughout — no external typefaces. Animations via framer-motion.

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
} from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Brain,
  FileText,
  ScanLine,
  Target,
  Users,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

// ----- design tokens -----
const FIELD = "#F7F7F2" // off-white field
const INK = "#0F3D2E" // primary text
const NEAR_BLACK = "#0A0E14"
const ACCENT = "#0F3D2E" // forest
const ACCENT_HI = "#00A86B" // bright
const ACCENT_LIME = "#B5D33C"
const RULE = "rgba(10,46,34,0.10)"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

// =====================================================================
// page
// =====================================================================
export default function Mockup3() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: FIELD, color: INK }}>
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        <BigStatStrip />
        <BentoGrid />
        <DarkAIBanner />
        <FeatureSlab
          eyebrow="01 · INTAKE"
          title={<>Drop in a deck. <em className="not-italic font-serif italic">Sam reads it.</em></>}
          body="Upload a pitch deck and SAM extracts the company, stage, raise, founders, and metrics. No forms, no manual tagging. The whole memo starts from the file."
          bullets={[
            "PDF, DOCX, or pasted text",
            "Founders + roles + LinkedIn",
            "TAM / SAM / SOM with sources",
          ]}
          screenshot={<ScreenshotIntake />}
          flip={false}
        />
        <FeatureSlab
          eyebrow="02 · ANALYSIS"
          title={<>Five domains, <em className="not-italic font-serif italic">one verdict.</em></>}
          body="Team, Market, Product, Traction, Finance. Each scored 0–100 with a one-line key finding. The Executive Summary rolls them up into Strong Buy / Explore / Conditional Pass / Deny."
          bullets={[
            "Domain scorecards with verdict + confidence",
            "Strengths and risks tagged by severity",
            "Recommended next steps for the partner call",
          ]}
          screenshot={<ScreenshotScorecard />}
          flip={true}
        />
        <FeatureSlab
          eyebrow="03 · FUND FIT"
          title={<>Built around <em className="not-italic font-serif italic">your mandate.</em></>}
          body="Set sector, stage, geography, ticket size. SAM scores every deal against your own thesis and tells you exactly which criteria pass — and which don't."
          bullets={[
            "Mandate uploaded once, applied to every deal",
            "Pass / fail per criterion with reasoning",
            "Portfolio conflict detection",
          ]}
          screenshot={<ScreenshotFundFit />}
          flip={false}
        />
        <QuoteSpotlight />
        <CaseStudyRow />
        <Comparison />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  )
}

// =====================================================================
// nav
// =====================================================================
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
      className={`sticky top-0 z-50 transition-all backdrop-blur ${
        scrolled ? "bg-[#F7F7F2]/85 border-b" : "bg-transparent"
      }`}
      style={{ borderColor: RULE }}
    >
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <Link href="/mockup3" className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
          <span
            className="grid place-items-center h-6 w-6 rounded-md text-white text-[11px] font-bold"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HI})` }}
          >
            S
          </span>
          Sam
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[13.5px]">
          <NavItem label="Product" />
          <NavItem label="Solutions" />
          <NavItem label="Customers" />
          <NavItem label="Resources" />
          <NavItem label="Pricing" />
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-[13.5px] hover:opacity-70 transition"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-[#0F3D2E] hover:scale-[1.02] transition"
            style={{ background: ACCENT_LIME }}
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavItem({ label }: { label: string }) {
  return (
    <button className="hover:opacity-60 transition relative group">
      <span>{label}</span>
      <span
        className="absolute -bottom-1 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition origin-left"
        style={{ background: INK }}
      />
    </button>
  )
}

// =====================================================================
// hero
// =====================================================================
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={ref} className="relative pt-12 md:pt-20 pb-24 md:pb-28 overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-end">
          {/* LEFT — copy */}
          <motion.div style={{ y }}>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0F3D2E]/55"
            >
              The investment memo, generated.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="mt-5 font-bold leading-[0.95] tracking-[-0.035em]"
              style={{
                fontSize: "clamp(44px, 8.5vw, 116px)",
                color: INK,
              }}
            >
              Decks in.
              <br />
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                Memos out.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
              className="mt-7 max-w-[540px] text-[17px] leading-[1.55] text-[#0F3D2E]/70"
            >
              SAM reads pitch decks the way an analyst would — five domains, scorecards,
              a partner-ready memo with verdict and next steps. Five minutes, not five hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-[#0F3D2E] hover:scale-[1.02] transition shadow-sm"
                style={{ background: ACCENT_LIME }}
              >
                Try Sam free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium border hover:bg-white/60 transition"
                style={{ borderColor: RULE }}
              >
                See a sample memo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — floating product mock */}
          <motion.div style={{ y: cardY }} className="relative">
            <FloatingCard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DotGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 opacity-[0.55]"
      style={{
        backgroundImage:
          "radial-gradient(rgba(10,46,34,0.10) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
      }}
    />
  )
}

function FloatingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      className="relative origin-bottom-left will-change-transform"
    >
      {/* shadow card */}
      <div
        className="absolute -inset-x-6 -inset-y-6 -z-10 rounded-[28px] blur-2xl opacity-40"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${ACCENT_LIME}, transparent 65%)` }}
      />
      <div
        className="rounded-[20px] bg-white shadow-[0_20px_60px_-20px_rgba(10,46,34,0.25)] ring-1 overflow-hidden"
        style={{ borderColor: RULE, borderWidth: 1 }}
      >
        {/* top bar */}
        <div className="flex items-center gap-2 px-4 h-9 border-b" style={{ borderColor: RULE }}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-[11px] font-mono text-[#0F3D2E]/50">canaaro · executive summary</span>
        </div>
        {/* card body */}
        <div className="p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E]/55">Verdict</p>
              <p className="font-bold text-[20px] tracking-tight mt-1" style={{ color: ACCENT }}>
                Strong Buy
              </p>
            </div>
            <ScoreRing score={84} />
          </div>
          <ScorecardRows />
          <RowTicker />
        </div>
      </div>
    </motion.div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" })
  const r = 26
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div ref={ref} className="relative h-[68px] w-[68px]">
      <svg viewBox="0 0 68 68" className="h-full w-full -rotate-90">
        <circle cx="34" cy="34" r={r} stroke={RULE} strokeWidth="5" fill="none" />
        <motion.circle
          cx="34"
          cy="34"
          r={r}
          stroke={ACCENT_HI}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <CountUp to={score} start={inView} className="font-bold text-[18px] tabular-nums" />
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
    <div ref={ref} className="grid grid-cols-1 gap-1.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.05 * i + 0.5 }}
          className="grid grid-cols-[80px_1fr_36px] items-center gap-3 text-[12px]"
        >
          <span className="font-mono uppercase tracking-widest text-[10px] text-[#0F3D2E]/55">
            {r.label}
          </span>
          <span className="text-[#0F3D2E]/85 truncate">{r.finding}</span>
          <span className="font-bold tabular-nums text-right" style={{ color: ACCENT }}>
            {r.score}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

// rolling-counter ticker — small "live" flair like ramp's transaction feed
function RowTicker() {
  const items = [
    "› Founder LinkedIn verified",
    "› Sources: 14",
    "› Strengths: 3 · Risks: 2",
    "› Memo ready · 4m 12s",
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 1800)
    return () => clearInterval(t)
  }, [items.length])
  return (
    <div
      className="rounded-md px-3 py-2 font-mono text-[11px] overflow-hidden"
      style={{ background: "rgba(0,168,107,0.06)", color: ACCENT }}
    >
      <motion.div key={idx} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
        {items[idx]}
      </motion.div>
    </div>
  )
}

// =====================================================================
// logo wall
// =====================================================================
function LogoWall() {
  const partners = [
    { name: "Green Whale Smart Capital", logo: "/partners/green-whale.png", invert: true },
    { name: "Heliphant", logo: "/partners/heliphant.png", invert: false },
    { name: "Spotlight Invest", logo: "/partners/spotlight-invest.png", invert: false },
  ]
  return (
    <section className="border-y" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <p className="text-center text-[11px] font-mono uppercase tracking-[0.18em] text-[#0F3D2E]/55">
          Trusted by European VC funds
        </p>
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 items-center gap-8">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center justify-center h-12">
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
    </section>
  )
}

// =====================================================================
// big stat strip
// =====================================================================
function BigStatStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" })
  const stats = [
    { display: "10×", label: "Faster first-pass screening" },
    { display: "8.2/10", label: "Average rating" },
    { display: "4.0/5", label: "Verdict accuracy" },
  ]
  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: ACCENT, color: "#F7F7F2" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-24">
        <h2 className="font-bold tracking-[-0.025em] leading-[1.02] max-w-3xl"
            style={{ fontSize: "clamp(40px, 5.4vw, 72px)" }}>
          The numbers from the funds
          <br />
          <span className="font-serif italic font-normal" style={{ color: ACCENT_LIME }}>
            already running on Sam.
          </span>
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px"
             style={{ background: "rgba(255,255,255,0.16)" }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 * i }}
              className="px-6 py-10 md:py-12"
              style={{ background: ACCENT }}
            >
              <p className="font-bold tabular-nums tracking-[-0.03em]"
                 style={{ fontSize: "clamp(56px, 7vw, 104px)", color: ACCENT_LIME, lineHeight: 0.95 }}>
                {s.display}
              </p>
              <p className="mt-3 text-[13px] font-mono uppercase tracking-widest opacity-75">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =====================================================================
// bento grid
// =====================================================================
function BentoGrid() {
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0F3D2E]/55">
            What you get
          </p>
          <h2 className="mt-3 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", color: INK }}>
            Everything in the memo,
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
              one place.
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[180px] gap-3">
          <BentoTile className="md:col-span-3 md:row-span-2" eyebrow="Team" title="Founders, scored." icon={Users} accent>
            <FounderRows />
          </BentoTile>
          <BentoTile className="md:col-span-3" eyebrow="Market" title="TAM / SAM / SOM" icon={Target}>
            <MarketBars />
          </BentoTile>
          <BentoTile className="md:col-span-2" eyebrow="Product" title="Moat audit" icon={ShieldCheck}>
            <MoatList />
          </BentoTile>
          <BentoTile className="md:col-span-1" eyebrow="Traction" title="MoM" icon={TrendingUp} dense>
            <Sparkline />
          </BentoTile>
          <BentoTile className="md:col-span-3 md:row-span-2" eyebrow="Fund Fit" title="Scored against your mandate." icon={ScanLine} accent>
            <FundFitMini />
          </BentoTile>
          <BentoTile className="md:col-span-3" eyebrow="Sources" title="Citations on every claim." icon={FileText}>
            <SourcePills />
          </BentoTile>
        </div>
      </div>
    </section>
  )
}

function BentoTile({
  className = "",
  eyebrow,
  title,
  icon: Icon,
  children,
  accent,
  dense,
}: {
  className?: string
  eyebrow: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
  accent?: boolean
  dense?: boolean
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`group relative overflow-hidden rounded-2xl p-5 md:p-6 border ${className}`}
      style={{
        background: accent ? "linear-gradient(135deg, #FFFFFF 0%, #F0FAF4 100%)" : "#FFFFFF",
        borderColor: RULE,
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E]/55">
          {eyebrow}
        </p>
        <Icon className="h-4 w-4 text-[#0F3D2E]/40 group-hover:text-[#0F3D2E] transition" />
      </div>
      <p className={`mt-2 font-bold tracking-tight ${dense ? "text-[15px]" : "text-[18px] md:text-[22px]"}`}>
        {title}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  )
}

function FounderRows() {
  const founders = [
    { name: "Jordan A.", role: "CEO", score: 92 },
    { name: "Marie K.", role: "CTO", score: 84 },
    { name: "Tomás R.", role: "Head of Growth", score: 76 },
  ]
  return (
    <div className="space-y-2.5">
      {founders.map((f) => (
        <div key={f.name} className="flex items-center gap-3 text-[12.5px]">
          <span
            className="grid place-items-center h-8 w-8 rounded-full font-bold text-[12px] text-white"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HI})` }}
          >
            {f.name[0]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{f.name}</p>
            <p className="text-[10.5px] font-mono uppercase tracking-widest text-[#0F3D2E]/55">
              {f.role}
            </p>
          </div>
          <span className="font-bold tabular-nums" style={{ color: ACCENT }}>
            {f.score}
          </span>
        </div>
      ))}
    </div>
  )
}

function MarketBars() {
  const data = [
    { l: "TAM", v: "€6.2B", w: 100 },
    { l: "SAM", v: "€1.4B", w: 60 },
    { l: "SOM", v: "€180M", w: 22 },
  ]
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.l} className="flex items-center gap-3 text-[12px]">
          <span className="w-9 font-mono uppercase text-[10px] tracking-widest text-[#0F3D2E]/55">
            {d.l}
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(10,46,34,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${d.w}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_HI})` }}
            />
          </div>
          <span className="font-mono font-semibold tabular-nums w-14 text-right">{d.v}</span>
        </div>
      ))}
    </div>
  )
}

function MoatList() {
  const items = [
    { l: "Workflow lock-in", on: true },
    { l: "Network effects", on: false },
    { l: "Data moat", on: true },
  ]
  return (
    <ul className="space-y-2 text-[12.5px]">
      {items.map((i) => (
        <li key={i.l} className="flex items-center gap-2">
          {i.on ? (
            <span className="grid place-items-center h-4 w-4 rounded-full" style={{ background: ACCENT_HI }}>
              <Check className="h-2.5 w-2.5 text-white stroke-[3]" />
            </span>
          ) : (
            <span className="grid place-items-center h-4 w-4 rounded-full" style={{ background: "rgba(10,46,34,0.06)" }}>
              <X className="h-2.5 w-2.5 text-[#0F3D2E]/40 stroke-[2.5]" />
            </span>
          )}
          <span className={i.on ? "" : "text-[#0F3D2E]/40"}>{i.l}</span>
        </li>
      ))}
    </ul>
  )
}

function Sparkline() {
  const points = [10, 18, 14, 22, 28, 24, 36, 42, 48, 56]
  const max = Math.max(...points)
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${100 - (p / max) * 100}`)
    .join(" L ")
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12">
      <motion.path
        d={`M ${path}`}
        fill="none"
        stroke={ACCENT_HI}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </svg>
  )
}

function FundFitMini() {
  const rows = [
    { l: "Sector: B2B SaaS", on: true },
    { l: "Stage: Seed–Series A", on: true },
    { l: "Geography: EU", on: true },
    { l: "Ticket: €500K–€2M", on: true },
    { l: "Solo founder allowed", on: false },
  ]
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.l} className="flex items-center justify-between text-[12.5px]">
          <span className={r.on ? "" : "text-[#0F3D2E]/40 line-through"}>{r.l}</span>
          {r.on ? (
            <Check className="h-4 w-4" style={{ color: ACCENT_HI }} />
          ) : (
            <X className="h-4 w-4 text-[#0F3D2E]/40" />
          )}
        </div>
      ))}
    </div>
  )
}

function SourcePills() {
  const pills = [
    "Pitch Deck",
    "Crunchbase",
    "LinkedIn",
    "Companies House",
    "Founder website",
    "McKinsey 2024",
  ]
  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map((p) => (
        <span
          key={p}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border"
          style={{ borderColor: RULE, background: "rgba(10,46,34,0.03)" }}
        >
          {p}
        </span>
      ))}
    </div>
  )
}

// =====================================================================
// dark AI banner — full-bleed near-black with animated agent stream
// =====================================================================
function DarkAIBanner() {
  return (
    <section className="relative overflow-hidden" style={{ background: NEAR_BLACK, color: "#F7F7F2" }}>
      {/* glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 30% 30%, rgba(0,168,107,0.18), transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32 grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: ACCENT_LIME }}>
            Built for the AI era of venture
          </p>
          <h2 className="mt-4 font-bold tracking-[-0.03em] leading-[0.98]"
              style={{ fontSize: "clamp(40px, 6.4vw, 88px)" }}>
            An analyst that
            <br />
            <span className="font-serif italic font-normal" style={{ color: ACCENT_LIME }}>
              never gets tired.
            </span>
          </h2>
          <p className="mt-7 max-w-xl text-[16px] leading-[1.6] text-white/65">
            SAM reads the deck, fact-checks the founders, validates the market, and drafts the
            memo. You spend your judgment where it matters — the partner call.
          </p>
        </div>
        <AgentStream />
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
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (visible >= events.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 700)
    return () => clearTimeout(t)
  }, [visible, events.length])

  return (
    <div className="rounded-2xl border p-5 md:p-6 backdrop-blur"
         style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
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
                  style={{ background: "rgba(212,255,107,0.12)", color: ACCENT_LIME }}>
              {e.tag}
            </span>
            <span className="text-white/85 truncate">{e.msg}</span>
          </motion.div>
        ))}
        {visible < events.length && (
          <div className="text-white/40 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: ACCENT_HI }} />
            <span>thinking…</span>
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================================
// alternating feature slabs
// =====================================================================
function FeatureSlab({
  eyebrow,
  title,
  body,
  bullets,
  screenshot,
  flip,
}: {
  eyebrow: string
  title: React.ReactNode
  body: string
  bullets: string[]
  screenshot: React.ReactNode
  flip: boolean
}) {
  return (
    <section className="py-20 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
              {eyebrow}
            </p>
            <h3 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05]"
                style={{ fontSize: "clamp(34px, 4.8vw, 60px)", color: INK }}>
              {title}
            </h3>
            <p className="mt-6 text-[16px] leading-[1.65] text-[#0F3D2E]/70 max-w-xl">{body}</p>
            <ul className="mt-7 space-y-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-[14px]">
                  <span className="grid place-items-center h-4 w-4 rounded-full" style={{ background: ACCENT_HI }}>
                    <Check className="h-2.5 w-2.5 text-white stroke-[3]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/sample"
              className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold border-b pb-0.5 transition"
              style={{ color: ACCENT, borderColor: ACCENT }}
            >
              See it in a real memo
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {screenshot}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ScreenshotIntake() {
  return (
    <div className="rounded-2xl bg-white border p-5 shadow-[0_20px_60px_-20px_rgba(10,46,34,0.20)]"
         style={{ borderColor: RULE }}>
      <div className="rounded-xl border-2 border-dashed p-7 text-center"
           style={{ borderColor: RULE }}>
        <FileText className="h-6 w-6 mx-auto mb-3" style={{ color: ACCENT }} />
        <p className="font-bold text-[15px]">Drop your pitch deck</p>
        <p className="text-[12px] text-[#0F3D2E]/55 mt-1">PDF, DOCX, up to 25MB</p>
      </div>
      <div className="mt-4 space-y-2 text-[12px] font-mono">
        {["✓ canaaro_deck.pdf · 24 pages", "✓ Founders extracted (3)", "✓ Stage: Seed · Raising €1.2M"].map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.15 * i }}
            className="text-[#0F3D2E]/75"
          >
            {l}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ScreenshotScorecard() {
  const rows = [
    { l: "Team", s: 88, v: "Strong" },
    { l: "Market", s: 79, v: "Strong" },
    { l: "Product", s: 86, v: "Strong" },
    { l: "Traction", s: 72, v: "Moderate" },
    { l: "Finance", s: 81, v: "Strong" },
  ]
  return (
    <div className="rounded-2xl bg-white border p-6 shadow-[0_20px_60px_-20px_rgba(10,46,34,0.20)]"
         style={{ borderColor: RULE }}>
      <p className="text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E]/55">Scorecard</p>
      <div className="mt-3 space-y-3">
        {rows.map((r, i) => (
          <motion.div
            key={r.l}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 * i }}
            className="grid grid-cols-[80px_1fr_60px_28px] items-center gap-3 text-[13px]"
          >
            <span className="font-mono uppercase tracking-widest text-[10px] text-[#0F3D2E]/55">{r.l}</span>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(10,46,34,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_HI})` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${r.s}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 * i }}
              />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>{r.v}</span>
            <span className="font-bold tabular-nums text-right">{r.s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ScreenshotFundFit() {
  return (
    <div className="rounded-2xl bg-white border p-6 shadow-[0_20px_60px_-20px_rgba(10,46,34,0.20)]"
         style={{ borderColor: RULE }}>
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E]/55">
          Fund Fit · canaaro
        </p>
        <p className="font-bold text-[16px]" style={{ color: ACCENT }}>4 / 5 match</p>
      </div>
      <FundFitMini />
    </div>
  )
}

// =====================================================================
// quote spotlight
// =====================================================================
function QuoteSpotlight() {
  return (
    <section className="py-24 md:py-32" style={{ background: ACCENT_LIME }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0F3D2E]/65">
          What investors say
        </p>
        <blockquote className="mt-6 font-bold tracking-[-0.025em] leading-[1.08]"
                    style={{ fontSize: "clamp(30px, 4.4vw, 56px)", color: "#0F3D2E" }}>
          <span className="font-serif italic font-normal opacity-50 mr-2">“</span>
          I review 40+ decks a month. Sam cuts my first-pass from hours to minutes,
          and the report gives me <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
            exactly the right questions
          </span> before a founder call.
          <span className="font-serif italic font-normal opacity-50 ml-2">”</span>
        </blockquote>
        <p className="mt-8 text-[12px] font-mono uppercase tracking-widest text-[#0F3D2E]/65">
          Partner · Pre-seed fund
        </p>
      </div>
    </section>
  )
}

// =====================================================================
// case study cards
// =====================================================================
function CaseStudyRow() {
  const cards = [
    {
      quote: "I thought it would just recap the deck. It doesn't — it challenges it. Red flags I would have found in week three, Sam flags on the first signal.",
      role: "Principal · Seed fund",
      metric: { value: "Week 3 → Day 1", label: "Risk detection" },
    },
    {
      quote: "We used to lose deals because internal alignment took too long. Now everyone reads the same memo before we decide. It's changed how we work.",
      role: "Managing Partner",
      metric: { value: "1 source", label: "of truth" },
    },
    {
      quote: "Sam doesn't replace judgment — it sharpens it. We screen twice as many deals without adding headcount.",
      role: "Investment Director",
      metric: { value: "2×", label: "deals screened" },
    },
  ]
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0F3D2E]/55">Stories</p>
          <h2 className="mt-3 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(34px, 4.4vw, 56px)" }}>
            How partners are using Sam.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
              className="rounded-2xl bg-white border p-6 md:p-7 hover:-translate-y-1 transition shadow-sm"
              style={{ borderColor: RULE }}
            >
              <div className="flex items-baseline justify-between gap-4 mb-5">
                <p className="font-bold tracking-tight"
                   style={{ fontSize: "clamp(22px, 2.4vw, 30px)", color: ACCENT }}>
                  {c.metric.value}
                </p>
                <p className="text-[10.5px] font-mono uppercase tracking-widest text-[#0F3D2E]/55 text-right">
                  {c.metric.label}
                </p>
              </div>
              <p className="text-[14px] leading-[1.55] text-[#0F3D2E]/85">{c.quote}</p>
              <p className="mt-5 pt-5 border-t text-[10.5px] font-mono uppercase tracking-widest text-[#0F3D2E]/55"
                 style={{ borderColor: RULE }}>
                {c.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =====================================================================
// comparison checklist
// =====================================================================
function Comparison() {
  const rows = [
    { feat: "Reads pitch decks", sam: true, sheets: false, llm: true },
    { feat: "Five-domain scorecard with verdict", sam: true, sheets: false, llm: false },
    { feat: "Citations on every claim", sam: true, sheets: false, llm: false },
    { feat: "Mandate-aware fund fit", sam: true, sheets: false, llm: false },
    { feat: "EU-resident, no model training on your decks", sam: true, sheets: true, llm: false },
    { feat: "Partner-ready memo in five minutes", sam: true, sheets: false, llm: false },
  ]
  return (
    <section className="py-24 md:py-28 border-t" style={{ borderColor: RULE }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0F3D2E]/55">
            Sam vs. the alternatives
          </p>
          <h2 className="mt-3 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(34px, 4.4vw, 56px)" }}>
            Why partners are switching.
          </h2>
        </div>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: RULE }}>
          <div className="grid grid-cols-[1fr_120px_120px_140px] text-[11px] font-mono uppercase tracking-widest"
               style={{ background: "rgba(10,46,34,0.03)" }}>
            <div className="px-5 py-3.5 text-[#0F3D2E]/55">Capability</div>
            <div className="px-3 py-3.5 text-center font-bold" style={{ color: ACCENT }}>Sam</div>
            <div className="px-3 py-3.5 text-center text-[#0F3D2E]/55">Spreadsheets</div>
            <div className="px-3 py-3.5 text-center text-[#0F3D2E]/55">Generic LLM</div>
          </div>
          {rows.map((r, i) => (
            <div key={r.feat}
                 className={`grid grid-cols-[1fr_120px_120px_140px] items-center text-[13.5px] ${i % 2 === 1 ? "bg-white" : ""}`}
                 style={{ borderTop: `1px solid ${RULE}` }}>
              <div className="px-5 py-4">{r.feat}</div>
              <CheckCell on={r.sam} accent />
              <CheckCell on={r.sheets} />
              <CheckCell on={r.llm} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CheckCell({ on, accent }: { on: boolean; accent?: boolean }) {
  return (
    <div className="px-3 py-4 grid place-items-center">
      {on ? (
        <span className="grid place-items-center h-5 w-5 rounded-full"
              style={{ background: accent ? ACCENT_HI : "rgba(10,46,34,0.6)" }}>
          <Check className="h-3 w-3 text-white stroke-[3]" />
        </span>
      ) : (
        <span className="grid place-items-center h-5 w-5 rounded-full"
              style={{ background: "rgba(10,46,34,0.06)" }}>
          <X className="h-3 w-3 text-[#0F3D2E]/35 stroke-[2.5]" />
        </span>
      )}
    </div>
  )
}

// =====================================================================
// closing CTA
// =====================================================================
function ClosingCTA() {
  return (
    <section className="relative overflow-hidden" style={{ background: ACCENT, color: "#F7F7F2" }}>
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 80% 50%, rgba(212,255,107,0.4), transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 py-24 md:py-32 text-center">
        <h2 className="font-bold tracking-[-0.03em] leading-[0.98] mx-auto max-w-3xl"
            style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
          Ready to read your next deck
          <br />
          <span className="font-serif italic font-normal" style={{ color: ACCENT_LIME }}>
            in five minutes?
          </span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14.5px] font-semibold text-[#0F3D2E] hover:scale-[1.02] transition shadow-md"
            style={{ background: ACCENT_LIME }}
          >
            Try Sam free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-medium border hover:bg-white/10 transition"
            style={{ borderColor: "rgba(247,247,242,0.3)" }}
          >
            See a sample memo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// =====================================================================
// footer
// =====================================================================
function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: RULE, background: NEAR_BLACK, color: "#F7F7F2" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-[13px]">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-bold text-[15px]">
            <span
              className="grid place-items-center h-6 w-6 rounded-md text-white text-[11px] font-bold"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HI})` }}
            >
              S
            </span>
            Sam
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
        <div className="mx-auto max-w-[1200px] px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-[12px] text-white/45">
          <p>© 2026 Sam. EU-based.</p>
          <p className="font-mono uppercase tracking-widest">SOC 2 · GDPR · ISO 27001</p>
        </div>
      </div>
    </footer>
  )
}

// =====================================================================
// helpers
// =====================================================================
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
  const spring = useSpring(motionValue, { damping: 30, stiffness: 110, duration: duration * 1000 })

  useEffect(() => {
    if (start) motionValue.set(to)
  }, [start, to, motionValue])

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)))
  }, [spring])

  return <span className={className}>{display}</span>
}
