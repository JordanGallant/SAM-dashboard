"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, X, Plus, Mail, Shield, ShieldCheck, MapPin, Lock, UserCheck, Users, Globe2, Package, TrendingUp, Landmark, User, Network, Building2, FileText, MessagesSquare, Layers3, Sparkles, BarChart3, AlertTriangle } from "lucide-react"

// Mockup 2 — Iris.
// Modern dark-mode tech aesthetic. Linear / Anthropic-marketing / Vercel DNA.
// Geist sans throughout (no serif imports, no editorial moves). Single
// sophisticated accent: electric iris #7C7AFF. Soft halos, hairline borders,
// tabular mono numbers. Self-contained — no imports from src/components/landing.

const BG = "#0A0B0E"          // near-black, slight cool tint
const SURFACE = "#13151B"     // card / inset
const SURFACE_HI = "#1A1D24"  // hover / elevated
const FG = "#FAFAFA"
const MUTED = "#A1A1AA"       // zinc-400
const FAINT = "rgba(255,255,255,0.06)"
const RULE = "rgba(255,255,255,0.10)"
const RULE_STRONG = "rgba(255,255,255,0.16)"
const ACCENT = "#7C7AFF"      // iris indigo
const ACCENT_SOFT = "rgba(124,122,255,0.18)"

// ─────────────────────────────────────────────────────────────────────────────
// Content (every word verbatim from src/components/landing/*.tsx)
// ─────────────────────────────────────────────────────────────────────────────

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-angels", label: "Angels" },
  { href: "/for-vc-funds", label: "VC Funds" },
  { href: "/#pricing", label: "Pricing" }
]

const heroBullets = [
  "Every deck scored across 5 investment domains",
  "IC-ready memos — not LLM summaries",
  "Consistent framework, stage-aware weights",
  "EU-hosted, GDPR by design, zero model training"
]

const memoDomainScores = [
  { domain: "Team", score: 88 },
  { domain: "Market", score: 76 },
  { domain: "Product", score: 84 },
  { domain: "Traction", score: 72 },
  { domain: "Finance", score: 90 }
]

const domains = [
  { n: "01", icon: Users, name: "Team", focus: "Founder-market fit, backgrounds, red flags" },
  { n: "02", icon: Globe2, name: "Market", focus: "TAM / SAM / SOM validation, competitors, why now" },
  { n: "03", icon: Package, name: "Product", focus: "10x test, PMF signals, moat" },
  { n: "04", icon: TrendingUp, name: "Traction", focus: "Revenue, retention, capital efficiency" },
  { n: "05", icon: Landmark, name: "Financials", focus: "Valuation, deal terms, investor signals" }
]

const samIs = [
  "The evaluation layer — sits between the deck and the decision",
  "Built for venture due diligence, not generalist summarisation",
  "Designed by investors who have screened real deals, not by LLM generalists",
  "Replaces the 10-minute screen, not your deal-flow tools"
]

const currentState = [
  "Deck opened at 11pm, scanned in 8 minutes",
  "\"Good team — I think?\" scribbled in a notebook",
  "Passed on a deal last March, can't remember why",
  "Every partner screens slightly differently",
  "No memory, no comparability, no defensible verdict"
]

const withSam = [
  "From scribbled notes → a structured, searchable memo",
  "From \"good team — I think?\" → evidence-backed verdicts",
  "From a 10-minute screen → a defensible decision record",
  "From inconsistent judgement → memos your partners can compare",
  "From lost context → ask any deal \"why did we pass?\" six months later"
]

const audiences = [
  {
    icon: User,
    label: "Angels",
    badge: "Best for solo deal flow",
    cta: "See the Angels workflow",
    workflow: "Solo · deck only",
    bigStat: "50+",
    bigStatLabel: "decks / month",
    workflowIcon: FileText,
    body: "You see fifty decks a month and meet with five. Sam gives you a structured second opinion before the first call. Six months later, you can still explain why you passed.",
    href: "/for-angels"
  },
  {
    icon: Network,
    label: "Syndicates & scouts",
    badge: "Best for shared notes",
    cta: "See the Pro workflow",
    workflow: "Shared notes · supporting docs",
    bigStat: "3–10",
    bigStatLabel: "partners aligned",
    workflowIcon: MessagesSquare,
    body: "Your deal notes live across three tools and two heads. Sam produces a consistent memo per deal that your syndicate partners can actually compare and reference.",
    href: "/how-it-works",
    featured: true
  },
  {
    icon: Building2,
    label: "VC funds",
    badge: "Best for institutional teams",
    cta: "See the VC workflow",
    workflow: "Team seats · shared library",
    bigStat: "5+",
    bigStatLabel: "analysts · shared memos",
    workflowIcon: Layers3,
    body: "First-screening capacity is the bottleneck in every fund. Sam handles the triage layer so your analysts spend their time on the deals that matter, not on the ones they'll pass.",
    href: "/for-vc-funds"
  }
]

const trustPillars = [
  { code: "EU-01", icon: MapPin, label: "Designed for EU processing", desc: "Sam is built around EU-based processing and storage. GDPR is treated as an architectural constraint, not a compliance checkbox." },
  { code: "EU-02", icon: Shield, label: "GDPR by design", desc: "Data minimisation, retention rules, and processing scopes are baked into the framework, not bolted on afterwards." },
  { code: "EU-03", icon: Lock, label: "No model training on your decks", desc: "Your submitted decks are never used to train any model — ours or anyone else's." },
  { code: "EU-04", icon: UserCheck, label: "Deletion on your schedule", desc: "You set the retention window. When it ends, decks and derived artefacts are removed from storage." }
]

const stats = [
  { value: "12", unit: "min", label: "Avg. deck → memo" },
  { value: "5", unit: "domains", label: "Scored, weighted" },
  { value: "1,000+", unit: "memos", label: "Generated to date" },
  { value: "€250k", unit: "decision", label: "Average value at stake" },
  { value: "180+", unit: "users", label: "European investors" },
  { value: "24", unit: "EU", label: "Countries served" }
]

const FEATURES_ALL = [
  "Structured memo (verdict + top risks + questions)",
  "Domain scoring",
  "Source review",
  "Stage-aware scoring",
  "First-call diligence questions",
  "Missing info checklist",
  "Export function (PDF + Word)",
  "Deal archive (investment memory)",
  "Fund profile (thesis, sector, stage)"
]

const FEATURES_CUSTOM_ONLY = [
  "Fund fit scoring",
  "Deal comparison (side by side)",
  "Shared workspace",
  "Shared memo library",
  "2-factor authentication",
  "Tailored knowledgebase",
  "CRM connections",
  "Dedicated support"
]

const angelFeatures = [
  ...FEATURES_ALL.map((text) => ({ text, included: true })),
  ...FEATURES_CUSTOM_ONLY.map((text) => ({ text, included: false }))
]
const proFeatures = angelFeatures.slice()
const customFeatures = [
  ...FEATURES_ALL.map((text) => ({ text, included: true })),
  ...FEATURES_CUSTOM_ONLY.map((text) => ({ text, included: true }))
]

const tiers = [
  {
    key: "starter",
    name: "Angel",
    price: 149 as number | null,
    signalsLabel: "10 memos / month",
    seats: "1 seat",
    description: "For individual investors who want a structured second opinion on every deck.",
    cta: "Start free trial",
    ctaHref: "/register?tier=starter",
    popular: false,
    subtitle: "Free trial · no credit card",
    features: angelFeatures
  },
  {
    key: "professional",
    name: "Pro",
    price: 299 as number | null,
    signalsLabel: "30 memos / month",
    seats: "3 seats",
    description: "For syndicates, scouts, and solo GPs running a meaningful pipeline.",
    cta: "Start free trial",
    ctaHref: "/register?tier=professional",
    popular: true,
    subtitle: "Free trial · no credit card",
    features: proFeatures
  },
  {
    key: "fund",
    name: "VC Fund",
    price: null as number | null,
    signalsLabel: "Unlimited memos",
    seats: "Unlimited seats",
    description: "For fund teams running first-screening at scale, with shared memory.",
    cta: "Book a walkthrough",
    ctaHref: "mailto:hello@sam.ai?subject=SAM%20Fund%20-%20Walkthrough%20request",
    popular: false,
    subtitle: "Talk to a founder, not a sales rep",
    features: customFeatures
  }
]

const faqItems = [
  { q: "How is Sam different from using generic AI to analyse a pitch deck?", a: "Sam applies a fixed five-domain evaluation framework to every deck — the same structure, scoring rubric, and severity classifications every time. Generic AI returns whatever comes out of a prompt, so the output varies, can't be compared across deals, and lacks a defensible methodology. Sam's framework is the product; the model is just the engine behind it." },
  { q: "Is my pitch deck data secure and confidential?", a: "Yes. Sam runs on European servers only. Your deck is processed, analysed, and stored within the EU. No submitted material is used to train any model, and data is deleted on your retention schedule." },
  { q: "What does a Sam investment memo actually include?", a: "Executive summary, overall score and confidence rating, per-domain verdicts across Team, Market, Product, Traction, and Financials, investment thesis, red flags, due diligence questionnaire, and IC-ready next steps. Structured the same way every time." },
  { q: "How long does it take to generate a memo?", a: "Analysis runs in the background. You can close the browser — the memo appears in your account when ready, and you'll get an email notification." },
  { q: "Can Sam replace a human analyst or associate?", a: "No. Sam handles the repetitive first-screening layer — consistent structure, scoring, red flags — so your analyst can focus on the deals worth deeper work. It is infrastructure, not a substitute for judgment." },
  { q: "What stage of startups does Sam work best for?", a: "Pre-seed through Series A. The framework is stage-aware: traction weighs less at pre-seed, more at Series A. Later-stage evaluation is available and benchmarked against public comparables, but pre-seed to Series A is where Sam's framework delivers the most differentiation." },
  { q: "Do I need any technical setup to use Sam?", a: "No. Upload a PDF, or forward a deck by email. The memo appears in your account. No CRM integration required, no data warehouse, no IT project." },
  { q: "Is Sam suitable for a solo angel investor, or only for funds?", a: "Both. The Angel tier is priced for individual investors handling their own deal flow. The Fund tier adds team accounts, priority processing, and shared memo libraries. Same framework, different workflow." },
  { q: "What stages and sectors does Sam support?", a: "Pre-seed through Series A across most sectors. The framework is stage-aware — pre-seed is judged on team and market signal, Series A weights traction and unit economics more heavily. Deeply regulated verticals (healthtech, defence) work, but sector-specific diligence still belongs with the human." },
  { q: "Can I export memos to my CRM, Notion, or Word?", a: "Yes. Memos export as a Word document and as a shareable link. CRM-native pushes (Affinity, Hubspot) are on the roadmap." },
  { q: "What happens to my pitch deck after the analysis runs?", a: "It stays in your account, encrypted at rest in the EU, until you delete it or it expires under your retention policy. It is never used for model training." }
]

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Mockup2() {
  return (
    <div style={{ background: BG, color: FG }} className="min-h-screen antialiased">
      <ChooserBar current={2} />
      <Nav />

      <main>
        <Hero />
        <LogoStrip />
        <Benefits />
        <Domains />
        <Position />
        <Problem />
        <Audiences />
        <Trust />
        <Pricing />
        <FAQ />
        <Closing />
      </main>

      <FootBar />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Building blocks
// ─────────────────────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
      {children}
    </p>
  )
}

function ChooserBar({ current }: { current: number }) {
  const labels = ["queercom", "iris", "terminal"]
  return (
    <div className="border-b text-[10px] font-mono uppercase tracking-[0.22em]" style={{ borderColor: FAINT, background: BG }}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-2 flex items-center gap-5">
        <span style={{ color: MUTED }}>Mockups · pick one</span>
        {[1, 2, 3].map((n) => (
          <Link
            key={n}
            href={`/mockup${n}`}
            className={`px-2 py-0.5 transition-colors ${n === current ? "" : "hover:text-white"}`}
            style={{ background: n === current ? ACCENT : "transparent", color: n === current ? "#0A0B0E" : MUTED }}
          >
            {labels[n - 1]}
          </Link>
        ))}
      </div>
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ borderColor: FAINT, background: "rgba(10,11,14,0.78)" }}>
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Link href="/mockup2" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_SOFT}` }}>
            <BarChart3 className="h-4 w-4" style={{ color: ACCENT }} />
          </span>
          <span className="font-bold text-[18px] tracking-[-0.02em]">Sam</span>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>/ investment memo, audited</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-[13px]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-2 rounded-md transition-colors hover:bg-white/[0.04]" style={{ color: "rgba(250,250,250,0.78)" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:inline-flex text-[13px] px-3 py-2 transition-colors hover:text-white" style={{ color: MUTED }}>
            Log in
          </Link>
          <Link
            href="/register?tier=professional"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all hover:brightness-110"
            style={{ background: ACCENT, color: "#0A0B0E", boxShadow: `0 4px 30px ${ACCENT_SOFT}` }}
          >
            Analyse a deck
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* iris radial halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[680px] w-[1200px] -z-10"
        style={{ background: `radial-gradient(60% 50% at 50% 50%, ${ACCENT_SOFT} 0%, transparent 60%)` }}
      />
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px"
        }}
      />

      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 md:px-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-18">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ borderColor: RULE, background: SURFACE, color: MUTED }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: ACCENT }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
            </span>
            1,000+ memos generated
          </span>

          <h1
            className="mt-7 font-bold tracking-[-0.035em]"
            style={{ fontSize: "clamp(56px, 8vw, 112px)", lineHeight: 0.94 }}
          >
            Time is money.
            <br />
            <span style={{ color: ACCENT }}>Save both.</span>
          </h1>

          <p className="mt-7 max-w-[58ch] text-[18px] leading-[1.55]" style={{ color: "rgba(250,250,250,0.72)" }}>
            Structured investment memos, scored across five domains — IC-ready in twelve minutes. Sam analyses pitch decks across five investment domains and returns a scored, IC-ready memo, built for European investors who need consistent, defensible evaluation.
          </p>

          <form action="/register" method="GET" className="mt-9 flex max-w-[480px] items-stretch overflow-hidden rounded-xl" style={{ border: `1px solid ${RULE}`, background: SURFACE }}>
            <input
              type="email"
              name="email"
              placeholder="What's your work email?"
              className="flex-1 bg-transparent px-4 py-3.5 text-[14px] outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              className="px-5 text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: ACCENT, color: "#0A0B0E" }}
            >
              Get started
            </button>
          </form>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
            No card · 14-day trial · GDPR by design
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
            <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> 5 domains</span>
            <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
            <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> Scored 0 — 100</span>
            <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
            <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> EU-hosted</span>
          </div>
        </div>

        {/* Memo specimen — dark sleek card with iris glow */}
        <aside className="lg:col-span-5">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] opacity-50"
              style={{ background: `radial-gradient(60% 60% at 50% 50%, ${ACCENT_SOFT} 0%, transparent 70%)` }}
            />
            <figure className="rounded-2xl overflow-hidden backdrop-blur" style={{ border: `1px solid ${RULE}`, background: SURFACE }}>
              <header className="flex items-center justify-between px-5 py-3 border-b font-mono text-[10px] uppercase tracking-[0.22em]" style={{ borderColor: FAINT }}>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded" style={{ background: ACCENT_SOFT }}>
                    <span className="font-bold text-[10px]" style={{ color: ACCENT }}>S</span>
                  </span>
                  Memo · MyStartup · Series A
                </span>
                <span style={{ color: ACCENT }}>#0042</span>
              </header>
              <div className="p-7">
                <div className="flex items-center gap-6">
                  <div className="relative h-[120px] w-[120px] shrink-0">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{ background: `conic-gradient(${ACCENT} 0% 82%, rgba(255,255,255,0.08) 82% 100%)` }}
                    />
                    <div className="absolute inset-[6px] flex flex-col items-center justify-center rounded-full" style={{ background: SURFACE }}>
                      <span className="font-mono text-[8px] uppercase tracking-[0.25em]" style={{ color: MUTED }}>Sam Score</span>
                      <span className="font-mono font-bold leading-none tabular-nums tracking-[-0.04em]" style={{ fontSize: 42, color: FG }}>82</span>
                      <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>/ 100</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ background: ACCENT_SOFT, color: ACCENT }}>
                      High Priority
                    </span>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>Verdict</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "rgba(250,250,250,0.85)" }}>
                      Experienced team, regulatory tailwinds, strong unit economics.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t pt-5" style={{ borderColor: FAINT }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>Domain scores</p>
                  {memoDomainScores.map((d) => (
                    <div key={d.domain} className="grid grid-cols-[1fr_auto_2.5rem] items-center gap-3 font-mono text-[11px]">
                      <span style={{ color: MUTED }}>{d.domain}</span>
                      <div className="h-1 w-32 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: ACCENT }} />
                      </div>
                      <span className="text-right tabular-nums font-semibold" style={{ color: FG }}>{d.score}</span>
                    </div>
                  ))}
                </div>

                <footer className="mt-5 flex items-center justify-between border-t pt-4 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ borderColor: FAINT, color: MUTED }}>
                  <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" style={{ color: ACCENT }} /> 12 min</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" style={{ color: ACCENT }} /> IC-ready</span>
                  <span className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> 2R · 5S</span>
                </footer>
              </div>
            </figure>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
              Specimen · sam.ai/deals/mystartup/summary
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function LogoStrip() {
  return (
    <section className="border-y" style={{ borderColor: FAINT, background: BG }}>
      <div className="mx-auto max-w-[1280px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`px-6 py-10 ${i > 0 && i % 3 !== 0 ? "border-l" : ""} ${i >= 3 ? "border-t md:border-t-0" : ""} ${i >= 3 && i % 3 === 0 ? "lg:border-l" : ""}`}
            style={{ borderColor: FAINT }}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold leading-none tabular-nums tracking-[-0.04em]" style={{ fontSize: "clamp(36px, 4.4vw, 52px)", color: FG }}>
                {s.value}
              </span>
              <span className="font-mono text-[12px]" style={{ color: MUTED }}>{s.unit}</span>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-28">
      <div className="mx-auto max-w-[1280px] grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>02 / 09 — Benefits</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.5vw, 68px)", lineHeight: 0.98 }}>
            Saves time, reduces risk,{" "}
            <span style={{ color: ACCENT }}>drives smarter decisions.</span>
          </h2>
          <p className="mt-7 max-w-[48ch] text-[16.5px] leading-[1.6]" style={{ color: "rgba(250,250,250,0.72)" }}>
            The same five domains, scored the same way every time, and a defensible record of why a decision went the way it did. The memo is the artefact — not the slide it came from.
          </p>
        </div>

        <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {heroBullets.map((b, i) => (
            <li key={b} className="flex flex-col justify-between gap-5 rounded-xl p-6 transition-colors hover:bg-white/[0.02]" style={{ border: `1px solid ${FAINT}`, background: SURFACE }}>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
                <span style={{ color: MUTED }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: ACCENT }}>·</span>
              </div>
              <p className="text-[16px] leading-[1.5] font-medium tracking-[-0.005em]">{b}</p>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md self-start" style={{ background: ACCENT_SOFT }}>
                <Check className="h-3 w-3 stroke-[2.5]" style={{ color: ACCENT }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Domains() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[820px]">
          <Eyebrow>03 / 09 — The framework</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.5vw, 76px)", lineHeight: 0.98 }}>
            Five domains.{" "}
            <span style={{ color: ACCENT }}>One framework.</span>
          </h2>
          <p className="mt-6 max-w-[60ch] text-[16.5px] leading-[1.6]" style={{ color: "rgba(250,250,250,0.72)" }}>
            Every memo covers the same five domains, scored the same way. Stage-aware weights ensure a pre-seed deck is judged on pre-seed criteria — not Series A benchmarks.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {domains.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.n} className="group relative flex flex-col gap-5 rounded-xl p-6 transition-all hover:-translate-y-0.5" style={{ border: `1px solid ${FAINT}`, background: SURFACE }}>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
                  <span style={{ color: MUTED }}>{d.n}</span>
                  <span style={{ color: MUTED }}>· Domain</span>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: ACCENT_SOFT }}>
                  <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                </span>
                <h3 className="font-bold text-[18px] tracking-[-0.01em]">{d.name}</h3>
                <p className="text-[13px] leading-relaxed flex-1" style={{ color: "rgba(250,250,250,0.65)" }}>{d.focus}</p>
                <div className="mt-1 flex items-center justify-between border-t pt-3 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ borderColor: FAINT }}>
                  <span style={{ color: MUTED }}>Scored</span>
                  <span style={{ color: ACCENT }}>0 — 100</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> Weighted by stage</span>
          <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> Validated against benchmarks</span>
          <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> Flagged by severity</span>
        </div>
      </div>
    </section>
  )
}

function Position() {
  return (
    <section className="relative overflow-hidden px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      {/* halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] -z-10 opacity-40"
        style={{ background: `radial-gradient(50% 50% at 50% 50%, ${ACCENT_SOFT} 0%, transparent 70%)` }}
      />

      <div className="mx-auto max-w-[1280px] grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>04 / 09 — Where Sam sits</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 0.98 }}>
            Structured analysis,{" "}
            <span style={{ color: ACCENT }}>not freeform summaries.</span>
          </h2>
          <p className="mt-6 max-w-[60ch] text-[16.5px] leading-[1.6]" style={{ color: "rgba(250,250,250,0.72)" }}>
            Sam is the evaluation layer that sits between the deck and the decision. Other tools help you find deals or store them — Sam is what tells you whether to invest.
          </p>

          <ul className="mt-8 space-y-3">
            {samIs.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed" style={{ color: "rgba(250,250,250,0.85)" }}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md" style={{ background: ACCENT_SOFT }}>
                  <Check className="h-3 w-3 stroke-[2.5]" style={{ color: ACCENT }} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl p-6" style={{ border: `1px solid ${RULE}`, background: SURFACE }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>Position</p>
            <p className="mt-3 font-bold tracking-[-0.01em] text-[20px] md:text-[22px] leading-snug">
              Sam is not a startup database. Not a CRM. Not a data platform.{" "}
              <span style={{ color: ACCENT }}>Sam is the evaluation layer between the deck and the decision.</span>
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-2xl p-7" style={{ border: `1px solid ${RULE}`, background: SURFACE_HI }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>From the dashboard</p>
            <h3 className="mt-3 font-bold text-[22px] tracking-[-0.01em]">MyStartup · pitch_deck.pdf → IC-ready memo</h3>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "rgba(250,250,250,0.72)" }}>
              The dashboard at <span className="font-mono" style={{ color: FG }}>sam.ai/deals/mystartup/summary</span> renders the memo with overall score, radar, domain breakdowns, top risks and questions. The memo travels through your IC and lives in your archive — answering the question your future self will ask: <em>why did we pass on this</em>?
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
              {["Strong Buy", "Explore", "Deny"].map((v) => (
                <span key={v} className="rounded-full border px-2.5 py-1" style={{ borderColor: RULE, color: MUTED }}>
                  {v}
                </span>
              ))}
            </div>
            <Link
              href="/sample"
              className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] hover:translate-x-0.5 transition-transform"
              style={{ color: ACCENT }}
            >
              See a sample memo
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[820px]">
          <Eyebrow>05 / 09 — The problem</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.5vw, 76px)", lineHeight: 0.98 }}>
            Most decks get ten minutes.{" "}
            <span style={{ color: ACCENT }}>Good decisions take longer.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2">
          {/* Current state */}
          <div className="rounded-2xl p-7" style={{ border: `1px solid ${FAINT}`, background: SURFACE }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${FAINT}` }}>
                  <X className="h-4 w-4 stroke-[2.5]" style={{ color: MUTED }} />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>Current state</p>
                  <p className="font-semibold text-[14px]">The 10-minute screen</p>
                </div>
              </div>
            </div>
            <ol className="mt-7 space-y-3.5">
              {currentState.map((item, i) => (
                <li key={item} className="flex items-start gap-4 text-[13.5px] leading-relaxed" style={{ color: "rgba(250,250,250,0.65)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] tabular-nums shrink-0 pt-0.5" style={{ color: MUTED }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* With Sam — accent treatment */}
          <div className="relative rounded-2xl p-7 overflow-hidden" style={{ border: `1px solid ${ACCENT_SOFT}`, background: SURFACE_HI }}>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-24 h-60 w-60 rounded-full opacity-50"
              style={{ background: `radial-gradient(closest-side, ${ACCENT_SOFT} 0%, transparent 70%)` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_SOFT}` }}>
                  <Check className="h-4 w-4 stroke-[2.5]" style={{ color: ACCENT }} />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>With Sam</p>
                  <p className="font-semibold text-[14px]">Same framework, every deck</p>
                </div>
              </div>
            </div>
            <ol className="relative mt-7 space-y-3.5">
              {withSam.map((item, i) => (
                <li key={item} className="flex items-start gap-4 text-[13.5px] leading-relaxed" style={{ color: "rgba(250,250,250,0.85)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] tabular-nums shrink-0 pt-0.5" style={{ color: ACCENT }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function Audiences() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[820px]">
          <Eyebrow>06 / 09 — Who it&apos;s for</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 0.98 }}>
            Different roles.{" "}
            <span style={{ color: ACCENT }}>Same framework.</span>
          </h2>
          <p className="mt-6 max-w-[60ch] text-[16.5px] leading-[1.6]" style={{ color: "rgba(250,250,250,0.72)" }}>
            One evaluation layer, three workflows. Pick the one that matches the way you screen deals today.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
          {audiences.map((a, i) => {
            const Icon = a.icon
            const WorkflowIcon = a.workflowIcon
            const featured = a.featured
            return (
              <Link
                key={a.label}
                href={a.href}
                className="group relative flex flex-col gap-5 rounded-2xl p-7 transition-all hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${featured ? ACCENT_SOFT : FAINT}`,
                  background: featured ? SURFACE_HI : SURFACE
                }}
              >
                {featured && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-50"
                    style={{ background: `radial-gradient(closest-side, ${ACCENT_SOFT} 0%, transparent 70%)` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: ACCENT_SOFT }}>
                    <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                  </span>
                  <span className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em]" style={{ borderColor: featured ? "rgba(124,122,255,0.35)" : RULE, color: featured ? ACCENT : MUTED }}>
                    {a.badge}
                  </span>
                </div>

                <p className="relative font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: featured ? ACCENT : MUTED }}>
                  0{i + 1} · {a.label}
                </p>

                <h3 className="relative font-bold text-[24px] tracking-[-0.01em] -mt-3">{a.label}</h3>

                <p className="relative text-[14px] leading-relaxed flex-1" style={{ color: "rgba(250,250,250,0.7)" }}>
                  {a.body}
                </p>

                <div className="relative flex items-center gap-3 border-t pt-4" style={{ borderColor: FAINT }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${FAINT}` }}>
                    <WorkflowIcon className="h-4 w-4" style={{ color: ACCENT }} />
                  </span>
                  <div>
                    <p className="font-bold tabular-nums tracking-[-0.02em] leading-tight" style={{ fontSize: 22, color: FG }}>{a.bigStat}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>{a.bigStatLabel}</p>
                  </div>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-right" style={{ color: MUTED }}>
                    {a.workflow}
                  </span>
                </div>

                <div className="relative flex items-center justify-between text-[13px] font-semibold" style={{ color: featured ? ACCENT : FG }}>
                  <span>{a.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1280px] grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>07 / 09 — Trust</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.4vw, 64px)", lineHeight: 0.98 }}>
            Where your data lives, and{" "}
            <span style={{ color: ACCENT }}>who sees it.</span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.6]" style={{ color: "rgba(250,250,250,0.72)" }}>
            Sam is designed for EU-based processing. GDPR by design. No model training on submitted decks. Decks and derived artefacts are deleted on the retention schedule you set.
          </p>

          <div className="mt-10 inline-flex items-stretch overflow-hidden rounded-xl" style={{ border: `1px solid ${RULE}`, background: SURFACE }}>
            <div className="flex flex-col gap-1 px-5 py-4" style={{ background: ACCENT_SOFT }}>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>Region</p>
              <p className="font-bold text-[18px]" style={{ color: ACCENT }}>EU · EEA</p>
            </div>
            <div className="flex flex-col gap-0.5 px-5 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>Data in · Data out</p>
              <p className="font-mono text-[14px] font-semibold">EU-based processing</p>
            </div>
            <div className="flex items-center px-5 border-l" style={{ borderColor: FAINT }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: ACCENT }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: ACCENT }} />
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trustPillars.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.code} className="relative rounded-xl p-6" style={{ border: `1px solid ${FAINT}`, background: SURFACE }}>
                <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>{p.code}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg mb-4" style={{ background: ACCENT_SOFT }}>
                  <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                </span>
                <h3 className="font-bold text-[15px] tracking-[-0.005em]">{p.label}</h3>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(250,250,250,0.65)" }}>{p.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="relative px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <Eyebrow>08 / 09 — Pricing</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 0.98 }}>
            Priced against the value{" "}
            <span style={{ color: ACCENT }}>of a decision.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-[16px] leading-[1.6]" style={{ color: "rgba(250,250,250,0.72)" }}>
            One memo can validate or prevent a €250k check. Pick the tier that matches your deal flow — cancel any time.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
          {tiers.map((tier) => {
            const popular = tier.popular
            return (
              <article
                key={tier.key}
                className="relative flex flex-col rounded-2xl p-7 overflow-hidden"
                style={{
                  border: `1px solid ${popular ? ACCENT_SOFT : FAINT}`,
                  background: popular ? SURFACE_HI : SURFACE,
                  boxShadow: popular ? `0 30px 80px -30px ${ACCENT_SOFT}` : "none"
                }}
              >
                {popular && (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full opacity-50"
                      style={{ background: `radial-gradient(closest-side, ${ACCENT_SOFT} 0%, transparent 70%)` }}
                    />
                    <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ background: ACCENT, color: "#0A0B0E" }}>
                      <Sparkles className="h-3 w-3" />
                      Most popular
                    </span>
                  </>
                )}
                <h3 className="relative font-bold text-[22px] tracking-[-0.01em]">{tier.name}</h3>
                <p className="relative mt-2 text-[13.5px] leading-relaxed" style={{ color: "rgba(250,250,250,0.7)" }}>{tier.description}</p>

                <div className="relative mt-7 flex items-baseline gap-1">
                  {tier.price === null ? (
                    <span className="font-bold leading-none tracking-[-0.04em]" style={{ fontSize: 56, color: popular ? ACCENT : FG }}>Custom</span>
                  ) : (
                    <>
                      <span className="text-[18px] font-bold opacity-50">€</span>
                      <span className="font-bold leading-none tabular-nums tracking-[-0.04em]" style={{ fontSize: 72, color: popular ? ACCENT : FG }}>{tier.price}</span>
                      <span className="ml-1 text-[13px] opacity-65">/ month</span>
                    </>
                  )}
                </div>
                <p className="relative mt-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
                  {tier.price === null ? "Based on team size and deal flow" : "Billed monthly · cancel anytime"}
                </p>

                <div className="relative mt-5 grid gap-1 rounded-lg px-3 py-3" style={{ border: `1px solid ${FAINT}`, background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-mono uppercase tracking-[0.22em] text-[10px]" style={{ color: MUTED }}>Memos</span>
                    <span className="font-semibold tabular-nums">{tier.signalsLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-mono uppercase tracking-[0.22em] text-[10px]" style={{ color: MUTED }}>Seats</span>
                    <span className="font-semibold tabular-nums">{tier.seats}</span>
                  </div>
                </div>

                <Link
                  href={tier.ctaHref}
                  className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[13px] font-semibold transition-all hover:brightness-110"
                  style={popular ? { background: ACCENT, color: "#0A0B0E", boxShadow: `0 10px 30px -10px ${ACCENT_SOFT}` } : { background: "rgba(255,255,255,0.06)", color: FG, border: `1px solid ${RULE}` }}
                >
                  {tier.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="relative mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>{tier.subtitle}</p>

                <ul className="relative mt-6 space-y-2.5 border-t pt-5 text-[12.5px]" style={{ borderColor: FAINT }}>
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      {f.included ? (
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded" style={{ background: ACCENT_SOFT }}>
                          <Check className="h-2.5 w-2.5 stroke-[3]" style={{ color: ACCENT }} />
                        </span>
                      ) : (
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <X className="h-2.5 w-2.5 stroke-[2.5]" style={{ color: MUTED, opacity: 0.6 }} />
                        </span>
                      )}
                      <span style={{ color: f.included ? "rgba(250,250,250,0.85)" : "rgba(250,250,250,0.35)" }}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> 14-day free trial</span>
          <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> Cancel anytime</span>
          <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} /> EU-invoiced VAT incl.</span>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative px-6 md:px-10 py-24 md:py-28 border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1280px] grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>09 / 09 — Reference</Eyebrow>
          <h2 className="mt-5 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 5vw, 60px)", lineHeight: 0.98 }}>
            Questions,{" "}
            <span style={{ color: ACCENT }}>answered.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.65]" style={{ color: "rgba(250,250,250,0.72)" }}>
            Everything investors have asked us during pilots and preview calls. If your question isn&apos;t here, we&apos;ll answer it personally.
          </p>
          <a
            href="mailto:hello@sam.ai"
            className="mt-7 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-white/[0.04]"
            style={{ border: `1px solid ${RULE}`, background: SURFACE }}
          >
            <Mail className="h-3.5 w-3.5" style={{ color: ACCENT }} />
            hello@sam.ai
          </a>
        </div>

        <div className="lg:col-span-8 space-y-2.5">
          {faqItems.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="rounded-xl transition-all"
                style={{
                  border: `1px solid ${isOpen ? ACCENT_SOFT : FAINT}`,
                  background: isOpen ? SURFACE_HI : SURFACE
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start gap-5 p-5 md:p-6 text-left"
                >
                  <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg font-mono text-[11px] font-semibold tabular-nums" style={{ background: isOpen ? ACCENT_SOFT : "rgba(255,255,255,0.04)", color: isOpen ? ACCENT : MUTED }}>
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-semibold tracking-[-0.005em] text-[15px] md:text-[16px] leading-snug">{item.q}</span>
                  <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg transition-transform" style={{ background: isOpen ? ACCENT_SOFT : "rgba(255,255,255,0.04)", transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}>
                    <Plus className="h-4 w-4 stroke-[2.5]" style={{ color: isOpen ? ACCENT : MUTED }} />
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 md:px-6 pb-5 md:pb-6 pl-[5rem] text-[14px] leading-[1.7]" style={{ color: "rgba(250,250,250,0.7)" }}>
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="relative overflow-hidden border-t" style={{ borderColor: FAINT }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(60% 60% at 50% 50%, ${ACCENT_SOFT} 0%, transparent 70%)` }}
      />
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-24 md:py-32 text-center">
        <Eyebrow>Closing — start today</Eyebrow>
        <h2 className="mt-7 font-bold tracking-[-0.03em] mx-auto max-w-[18ch]" style={{ fontSize: "clamp(48px, 7.5vw, 110px)", lineHeight: 0.96 }}>
          Step into due diligence with{" "}
          <span style={{ color: ACCENT }}>Sam.</span>
        </h2>
        <p className="mt-7 mx-auto max-w-[52ch] text-[16.5px] leading-[1.65]" style={{ color: "rgba(250,250,250,0.72)" }}>
          No integrations, no onboarding call. Upload a deck, get a scored, defensible memo in minutes.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register?tier=professional"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-4 text-[14px] font-semibold transition-all hover:brightness-110"
            style={{ background: ACCENT, color: "#0A0B0E", boxShadow: `0 14px 50px -10px ${ACCENT_SOFT}` }}
          >
            Analyse a deck
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-4 text-[14px] font-semibold transition-colors hover:bg-white/[0.04]"
            style={{ border: `1px solid ${RULE}`, color: FG }}
          >
            See a sample memo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
          <span>No credit card</span>
          <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
          <span>EU-hosted</span>
          <span style={{ width: 14, height: 1, background: RULE, display: "inline-block" }} />
          <span>GDPR by design</span>
        </div>
      </div>
    </section>
  )
}

function FootBar() {
  return (
    <footer className="border-t" style={{ borderColor: FAINT, background: BG }}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_SOFT}` }}>
              <BarChart3 className="h-5 w-5" style={{ color: ACCENT }} />
            </span>
            <span className="font-bold text-[20px] tracking-[-0.02em]">Sam</span>
          </div>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed" style={{ color: "rgba(250,250,250,0.65)" }}>
            Sam helps investors decide.<br />
            Built in Europe, for European investors.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3 w-3" style={{ color: ACCENT }} />
              GDPR by design
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" style={{ color: ACCENT }} />
              EU-hosted
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>Product</p>
          <ul className="space-y-3 text-[13.5px]" style={{ color: "rgba(250,250,250,0.78)" }}>
            <li><Link href="/how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/for-angels" className="hover:text-white">For angels</Link></li>
            <li><Link href="/for-vc-funds" className="hover:text-white">For VC funds</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>Trust</p>
          <ul className="space-y-3 text-[13.5px]" style={{ color: "rgba(250,250,250,0.78)" }}>
            <li><Link href="/privacy" className="hover:text-white">GDPR &amp; privacy</Link></li>
            <li><Link href="/login" className="hover:text-white">Log in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: FAINT }}>
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-5 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.22em] md:flex-row md:justify-between" style={{ color: MUTED }}>
          <p>© {new Date().getFullYear()} Sam · All rights reserved</p>
          <p>Built in Europe · Hosted in Europe</p>
        </div>
      </div>
    </footer>
  )
}
