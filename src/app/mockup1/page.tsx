import Link from "next/link"
import { ArrowRight, Check, X, Plus, Sparkles, Shield, MapPin, Lock, UserCheck, ShieldCheck, Users, Globe2, Package, TrendingUp, Landmark, User, Network, Building2, FileText, MessagesSquare, Layers3, BarChart3, HelpCircle, Mail, Tag, Clock, Layers, Scale, AlertTriangle, CheckCircle2, FileCheck, Timer } from "lucide-react"

// Mockup 1 — Queercom merge.
// SAM content, queercom skeleton (grid hero, accent-underline, tile grids,
// dark inverted band, marquee tickers). Dark navy ink #0A2E22 + lime
// accent #D4FF6B on warm paper #ECE8DC. Geist + JetBrains Mono.
// Self-contained: no imports from src/components/landing.

const PAPER = "#ECE8DC"
const BONE = "#DDD8C8"
const INK = "#0A2E22"
const FOREST = "#0F3D2E"
const LIME = "#D4FF6B"
const RULE = "rgba(10,46,34,0.18)"

// ─────────────────────────────────────────────────────────────────────────────
// Content (every word lifted verbatim from src/components/landing/*.tsx)
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

const tickerTop = [
  "Time is money",
  "Save both",
  "12 min · deck → memo",
  "5 domains",
  "Scored 0–100",
  "EU-hosted",
  "GDPR by design",
  "1.000+ memos generated"
]

const tickerLow = [
  "Team",
  "Market",
  "Product",
  "Traction",
  "Financials",
  "Stage-aware",
  "Defensible"
]

const domains = [
  { n: "01", icon: Users, name: "Team", focus: "Founder-market fit, backgrounds, red flags" },
  { n: "02", icon: Globe2, name: "Market", focus: "TAM / SAM / SOM validation, competitors, why now" },
  { n: "03", icon: Package, name: "Product", focus: "10x test, PMF signals, moat" },
  { n: "04", icon: TrendingUp, name: "Traction", focus: "Revenue, retention, capital efficiency" },
  { n: "05", icon: Landmark, name: "Financials", focus: "Valuation, deal terms, investor signals" }
]

const memoDomainScores = [
  { domain: "TEAM", icon: Users, score: 88 },
  { domain: "MARKET", icon: Globe2, score: 76 },
  { domain: "PRODUCT", icon: Package, score: 84 },
  { domain: "TRACTION", icon: TrendingUp, score: 72 },
  { domain: "FINANCE", icon: Landmark, score: 90 }
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
    label: "For angels",
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
    label: "For syndicates & scouts",
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
    label: "For VC funds",
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
  { icon: FileCheck, value: "2400+", label: "Decks analysed" },
  { icon: Users, value: "180+", label: "European investors" },
  { icon: Timer, value: "12 min", label: "Avg. deck → memo" },
  { icon: Globe2, value: "24", label: "EU countries served" }
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
    key: "starter" as const,
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
    key: "professional" as const,
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
    key: "fund" as const,
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

export default function Mockup1() {
  return (
    <div style={{ background: PAPER, color: INK }} className="min-h-screen font-sans antialiased">
      <ChooserBar current={1} />
      <Nav />

      <main>
        <Hero />
        <Marquee items={tickerTop} variant="ink" />
        <Domains />
        <Marquee items={tickerLow} variant="lime" reverse />
        <SamSits />
        <Problem />
        <Audiences />
        <StatsBand />
        <Trust />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sections
// ─────────────────────────────────────────────────────────────────────────────

function ChooserBar({ current }: { current: number }) {
  return (
    <div className="border-b text-[11px] font-mono uppercase tracking-[0.18em]" style={{ borderColor: RULE, background: PAPER }}>
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 py-2 flex items-center gap-5">
        <span className="opacity-50">Mockups · pick one</span>
        {[1, 2, 3].map((n) => (
          <Link
            key={n}
            href={`/mockup${n}`}
            className={`px-2 py-0.5 ${
              n === current
                ? "text-white"
                : "opacity-65 hover:opacity-100"
            }`}
            style={n === current ? { background: INK } : undefined}
          >
            {n === 1 ? "Queercom" : n === 2 ? "Iris" : "Terminal"}
          </Link>
        ))}
      </div>
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: RULE, background: "rgba(236,232,220,0.85)" }}>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-8">
        <Link href="/mockup1" className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ background: INK }}
          >
            <BarChart3 className="h-4 w-4" style={{ color: LIME }} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: INK }}>Sam</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] opacity-55 md:inline">/ investment memo, audited</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.22em]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-70 hover:opacity-100 transition">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:inline-flex font-mono text-[11px] uppercase tracking-[0.22em] opacity-65 hover:opacity-100 px-3 py-2">
            Log in
          </Link>
          <Link
            href="/register?tier=professional"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] font-semibold transition hover:scale-[1.03]"
            style={{ background: INK, color: LIME }}
          >
            Analyse a deck
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="brief" className="relative overflow-hidden pt-20 md:pt-28">
      {/* faint grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`,
          backgroundSize: "48px 48px"
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8 pb-20">
        {/* pill row */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5" style={{ borderColor: RULE }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: LIME, filter: "saturate(1.4)" }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} />
            </span>
            1.000+ memos generated
          </span>
          <span className="inline-flex items-center rounded-full border px-3 py-1.5" style={{ borderColor: RULE }}>
            EU-hosted · GDPR by design
          </span>
          <span className="inline-flex items-center rounded-full border px-3 py-1.5" style={{ borderColor: RULE }}>
            Pre-seed → Series A
          </span>
        </div>

        {/* big title */}
        <h1
          className="mt-10 font-bold tracking-[-0.025em]"
          style={{ fontSize: "clamp(56px, 9vw, 124px)", lineHeight: 0.94, color: INK }}
        >
          Time is money.
          <br />
          <span
            style={{
              background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`,
              padding: "0 0.05em"
            }}
          >
            Save both.
          </span>
        </h1>

        {/* subtitle + bullets + CTA */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="text-[18px] leading-[1.55] opacity-85 max-w-2xl">
              Structured investment memos, scored across five domains — IC-ready in twelve minutes. Sam analyses pitch decks across five investment domains and returns a scored, IC-ready memo — built for European investors who need consistent, defensible evaluation.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {heroBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] leading-relaxed opacity-90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: LIME }}>
                    <Check className="h-3 w-3 stroke-[3]" style={{ color: INK }} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <form action="/register" method="GET" className="mt-9 flex max-w-[480px] items-stretch border" style={{ borderColor: RULE, background: "rgba(255,255,255,0.4)" }}>
              <input
                type="email"
                name="email"
                placeholder="What's your work email?"
                className="flex-1 bg-transparent px-4 py-3.5 text-[14px] outline-none placeholder:opacity-45"
              />
              <button
                type="submit"
                className="px-5 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold transition hover:opacity-90"
                style={{ background: INK, color: LIME }}
              >
                Get started
              </button>
            </form>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] opacity-55">
              No card · 14-day trial · GDPR by design
            </p>
          </div>

          {/* memo specimen — quiet single-column lift from Comparison */}
          <figure className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[14px] border" style={{ borderColor: RULE, background: INK, color: "rgba(255,255,255,0.92)" }}>
              <div className="flex items-center justify-between border-b px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded" style={{ background: "rgba(212,255,107,0.15)" }}>
                    <span className="font-mono text-[10px] font-bold" style={{ color: LIME }}>S</span>
                  </span>
                  Executive Memo · Fintech · Series A
                </span>
                <span style={{ color: LIME, opacity: 0.7 }}>#0042</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-5">
                  {/* mini score ring (CSS only, no animation to keep it static + reliable) */}
                  <div className="relative h-[112px] w-[112px] shrink-0">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(${LIME} 0% 82%, rgba(255,255,255,0.08) 82% 100%)`
                      }}
                    />
                    <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full" style={{ background: INK }}>
                      <span className="font-mono text-[8px] uppercase tracking-[0.25em] opacity-50">Sam Score</span>
                      <span className="font-mono text-[36px] font-bold leading-none tabular-nums" style={{ color: LIME }}>82</span>
                      <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] opacity-50">/ 100</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ background: "rgba(212,255,107,0.15)", color: LIME }}>
                      High Priority
                    </span>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] opacity-50">Verdict</p>
                    <p className="mt-1 text-[13px] leading-relaxed opacity-85">
                      Experienced team, regulatory tailwinds, strong unit economics.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: LIME, opacity: 0.7 }}>
                    Domain scores
                  </p>
                  {memoDomainScores.map((d) => (
                    <div key={d.domain} className="grid grid-cols-[1rem_5rem_1fr_2rem] items-center gap-3 font-mono text-[11px]">
                      <d.icon className="h-3 w-3 opacity-50" />
                      <span className="opacity-65 tracking-[0.22em]">{d.domain}</span>
                      <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: LIME }} />
                      </div>
                      <span className="text-right tabular-nums font-semibold" style={{ color: LIME }}>{d.score}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" style={{ color: LIME }} />
                    Generated in 12 min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" style={{ color: LIME }} />
                    IC-ready
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 opacity-65" />
                    2 risks · 5 strengths
                  </span>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] opacity-50">
              Specimen · sam.ai/deals/mystartup/summary
            </figcaption>
          </figure>
        </div>

        {/* status strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t pt-8 font-mono text-[10px] uppercase tracking-[0.22em] opacity-80 md:grid-cols-4" style={{ borderColor: RULE }}>
          <div>
            <div className="opacity-55">Domains</div>
            <div className="mt-1">5 · Team / Market / Product / Traction / Finance</div>
          </div>
          <div>
            <div className="opacity-55">Scoring</div>
            <div className="mt-1">0 — 100 · stage-aware weights</div>
          </div>
          <div>
            <div className="opacity-55">Region</div>
            <div className="mt-1">EU · EEA · GDPR by design</div>
          </div>
          <div>
            <div className="opacity-55">Status</div>
            <div className="mt-1">Available · pre-seed → Series A</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marquee({ items, reverse, variant }: { items: string[]; reverse?: boolean; variant: "ink" | "lime" }) {
  const loop = [...items, ...items, ...items]
  const bg = variant === "lime" ? LIME : INK
  const fg = variant === "lime" ? INK : "#FAFAF7"
  return (
    <div className="relative overflow-hidden border-y" style={{ borderColor: RULE, background: bg, color: fg }}>
      <div
        className={`flex w-max ${reverse ? "animate-[mq-rev_30s_linear_infinite]" : "animate-[mq_28s_linear_infinite]"}`}
        style={{ willChange: "transform" }}
      >
        {loop.map((it, i) => (
          <div key={i} className="flex shrink-0 items-center gap-6 px-6 font-bold" style={{ fontSize: "clamp(28px, 5vw, 56px)", lineHeight: 1 }}>
            <span>{it}</span>
            <span className="opacity-50">×</span>
          </div>
        ))}
      </div>
      {/* keyframes injected once */}
      <style>{`
        @keyframes mq { from { transform: translateX(0) } to { transform: translateX(-33.3333%) } }
        @keyframes mq-rev { from { transform: translateX(-33.3333%) } to { transform: translateX(0) } }
      `}</style>
    </div>
  )
}

function Domains() {
  return (
    <section id="concept" className="relative px-5 md:px-8 py-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
              <Layers className="h-3 w-3" />
              [01] The framework
            </span>
            <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.95 }}>
              Five domains.{" "}
              <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
                One framework.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed opacity-80">
              Every memo covers the same five domains, scored the same way. Stage-aware weights ensure a pre-seed deck is judged on pre-seed criteria — not Series A benchmarks.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border sm:grid-cols-2 lg:grid-cols-5" style={{ borderColor: RULE, background: RULE }}>
          {domains.map((d) => {
            const Icon = d.icon
            return (
              <article key={d.n} className="flex flex-col gap-4 p-6 transition" style={{ background: PAPER }}>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">
                  <span>{d.n}</span>
                  <span>· Domain</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: BONE, border: `1px solid ${RULE}` }}>
                  <Icon className="h-5 w-5" style={{ color: FOREST }} />
                </div>
                <h3 className="font-bold text-[20px] tracking-tight">{d.name}</h3>
                <p className="text-[13px] leading-relaxed opacity-75 flex-1">{d.focus}</p>
                <div className="mt-2 flex items-center justify-between border-t pt-3 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65" style={{ borderColor: RULE }}>
                  <span>Scored</span>
                  <span className="font-bold" style={{ color: FOREST }}>0 — 100</span>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} /> Weighted by stage</span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} /> Validated against benchmarks</span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} /> Flagged by severity</span>
        </div>
      </div>
    </section>
  )
}

function SamSits() {
  return (
    <section id="position" className="relative overflow-hidden border-y px-5 md:px-8 py-24" style={{ borderColor: RULE, background: BONE }}>
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
            <Scale className="h-3 w-3" />
            [02] Where Sam sits
          </span>
          <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.95 }}>
            Structured analysis,{" "}
            <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
              not freeform summaries.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed opacity-80">
            Sam is the evaluation layer that sits between the deck and the decision. Other tools help you find deals or store them — Sam is what tells you whether to invest.
          </p>

          <ul className="mt-8 space-y-3">
            {samIs.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed opacity-90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: LIME }}>
                  <Check className="h-3 w-3 stroke-[3]" style={{ color: INK }} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t pt-6" style={{ borderColor: RULE }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">Position statement</p>
            <p className="mt-3 text-[18px] md:text-[22px] font-bold leading-snug tracking-[-0.01em]">
              Sam is not a startup database. Not a CRM. Not a data platform.{" "}
              <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
                Sam is the evaluation layer between the deck and the decision.
              </span>
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-[14px] border p-6" style={{ borderColor: RULE, background: PAPER }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">From the dashboard</p>
            <h3 className="mt-3 font-bold text-[24px] leading-tight">MyStartup · pitch_deck.pdf → IC-ready memo</h3>
            <p className="mt-3 text-[13.5px] leading-relaxed opacity-80">
              The dashboard at <span className="font-mono opacity-90">sam.ai/deals/mystartup/summary</span> renders the memo with overall score, radar, domain breakdowns, top risks and questions. The memo travels through your IC and lives in your archive — answer your future self&apos;s question: <em>why did we pass on this</em>?
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
              {["Strong Buy", "Explore", "Deny"].map((v) => (
                <span key={v} className="rounded-full border px-2.5 py-1 opacity-75" style={{ borderColor: RULE }}>
                  {v}
                </span>
              ))}
            </div>
            <Link
              href="/sample"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] hover:underline underline-offset-4"
              style={{ color: FOREST }}
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
    <section id="problem" className="relative px-5 md:px-8 py-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
              <Clock className="h-3 w-3" />
              [03] The problem
            </span>
            <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.95 }}>
              Most decks get ten minutes.{" "}
              <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
                Good decisions take longer.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed opacity-80">
              Two cards, plainly read. The 10-minute screen on the left, what changes with Sam on the right. Same five domains, every time.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border md:grid-cols-2" style={{ borderColor: RULE, background: RULE }}>
              {/* Current state */}
              <div className="p-6 md:p-7" style={{ background: PAPER }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border" style={{ borderColor: RULE }}>
                    <X className="h-4 w-4 stroke-[2.5]" style={{ color: "#9A1B1B" }} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">Current state</p>
                    <p className="font-bold text-[14px]">The 10-minute screen</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-3">
                  {currentState.map((item, i) => (
                    <li key={item} className="flex gap-3 text-[13px] leading-relaxed opacity-80 font-mono uppercase tracking-[0.04em]">
                      <span className="opacity-50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="normal-case tracking-normal">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* With Sam — accent */}
              <div className="relative p-6 md:p-7" style={{ background: INK, color: "rgba(255,255,255,0.92)" }}>
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ background: LIME, color: INK }}>
                  <Sparkles className="h-3 w-3" />
                  With Sam
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "rgba(212,255,107,0.15)", border: `1px solid rgba(212,255,107,0.3)` }}>
                    <Check className="h-4 w-4 stroke-[2.5]" style={{ color: LIME }} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: LIME, opacity: 0.8 }}>Same framework</p>
                    <p className="font-bold text-[14px]">Every deck, every time</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-3">
                  {withSam.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] leading-relaxed opacity-90">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: LIME }}>
                        <Check className="h-2.5 w-2.5 stroke-[3]" style={{ color: INK }} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Audiences() {
  return (
    <section id="audiences" className="relative border-y px-5 md:px-8 py-24" style={{ borderColor: RULE, background: BONE }}>
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
              <Users className="h-3 w-3" />
              [04] Who it&apos;s for
            </span>
            <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.95 }}>
              Different roles.{" "}
              <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
                Same framework.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed opacity-80">
              One evaluation layer, three workflows. Pick the one that matches the way you screen deals today.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border" style={{ borderColor: RULE, background: RULE }}>
              {audiences.map((a, i) => {
                const Icon = a.icon
                const WorkflowIcon = a.workflowIcon
                const featured = a.featured
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="group flex flex-col gap-4 p-6 transition"
                    style={{ background: featured ? INK : PAPER, color: featured ? "rgba(255,255,255,0.92)" : INK }}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${featured ? "" : "border"}`} style={{ background: featured ? "rgba(212,255,107,0.12)" : BONE, borderColor: RULE }}>
                        <Icon className="h-5 w-5" style={{ color: featured ? LIME : FOREST }} />
                      </span>
                      <span className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em]" style={{ borderColor: featured ? "rgba(212,255,107,0.3)" : RULE, color: featured ? LIME : FOREST, background: featured ? "rgba(212,255,107,0.08)" : "rgba(255,255,255,0.4)" }}>
                        {a.badge}
                      </span>
                    </div>

                    <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: featured ? LIME : FOREST, opacity: featured ? 0.85 : 1 }}>
                      0{i + 1} · {a.label}
                    </p>

                    <p className="text-[14px] leading-relaxed opacity-85">{a.body}</p>

                    <div className="mt-2 flex items-center gap-3 border-t pt-4" style={{ borderColor: featured ? "rgba(255,255,255,0.1)" : RULE }}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: featured ? "rgba(255,255,255,0.05)" : BONE, border: `1px solid ${featured ? "rgba(255,255,255,0.1)" : RULE}` }}>
                        <WorkflowIcon className="h-4 w-4" style={{ color: featured ? LIME : FOREST }} />
                      </span>
                      <div>
                        <p className="font-mono text-[18px] font-bold leading-tight tabular-nums" style={{ color: featured ? LIME : INK }}>{a.bigStat}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">{a.bigStatLabel}</p>
                      </div>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] opacity-55">{a.workflow}</span>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: featured ? LIME : FOREST }}>
                      <span>{a.cta}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBand() {
  return (
    <section className="border-y px-5 md:px-8 py-12" style={{ borderColor: RULE, background: PAPER }}>
      <div className="mx-auto max-w-[1240px] grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4" style={{ background: RULE }}>
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="flex items-center gap-4 px-6 py-6" style={{ background: PAPER }}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: INK }}>
                <Icon className="h-5 w-5" style={{ color: LIME }} />
              </span>
              <div>
                <p className="font-mono text-[28px] md:text-[32px] font-bold leading-none tabular-nums" style={{ color: INK }}>{s.value}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section id="trust" className="relative px-5 md:px-8 py-24" style={{ background: INK, color: "rgba(255,255,255,0.92)" }}>
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ borderColor: "rgba(212,255,107,0.3)", color: LIME, background: "rgba(212,255,107,0.08)" }}>
              <ShieldCheck className="h-3 w-3" />
              [05] EU data sovereignty
            </span>
            <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 0.95 }}>
              Where your data lives, and{" "}
              <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em", color: INK }}>
                who sees it.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed opacity-80">
              Sam is designed for EU-based processing. GDPR by design. No model training on submitted decks. Decks and derived artefacts are deleted on the retention schedule you set.
            </p>

            <div className="mt-10 inline-flex items-stretch overflow-hidden rounded-[14px] border" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              <div className="flex flex-col items-center justify-center gap-1 px-5 py-4" style={{ background: FOREST }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: LIME, opacity: 0.8 }}>Region</p>
                <p className="font-mono text-[20px] font-bold" style={{ color: LIME }}>EU · EEA</p>
              </div>
              <div className="flex flex-col justify-center gap-0.5 px-5 py-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-65">Data in · Data out</p>
                <p className="font-mono text-[14px] font-bold">EU-based processing</p>
              </div>
              <div className="flex items-center px-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: LIME }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: LIME }} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border sm:grid-cols-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.12)" }}>
              {trustPillars.map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.code} className="relative p-6" style={{ background: INK }}>
                    <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.22em] opacity-50">{p.code}</span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4" style={{ background: "rgba(212,255,107,0.08)", border: `1px solid rgba(212,255,107,0.2)` }}>
                      <Icon className="h-5 w-5" style={{ color: LIME }} />
                    </div>
                    <p className="font-bold text-[15px] tracking-tight">{p.label}</p>
                    <p className="mt-2 text-[13px] leading-relaxed opacity-75">{p.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="relative px-5 md:px-8 py-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
            <Tag className="h-3 w-3" />
            [06] Pricing
          </span>
          <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 0.95 }}>
            Priced against the value{" "}
            <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
              of a decision.
            </span>
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-[16px] leading-relaxed opacity-80">
            One memo can validate or prevent a €250k check. Pick the tier that matches your deal flow — cancel any time.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border md:grid-cols-3" style={{ borderColor: RULE, background: RULE }}>
          {tiers.map((tier) => {
            const popular = tier.popular
            return (
              <div key={tier.key} className="flex flex-col p-7" style={{ background: popular ? INK : PAPER, color: popular ? "rgba(255,255,255,0.92)" : INK, position: "relative" }}>
                {popular && (
                  <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ background: LIME, color: INK }}>
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </span>
                )}
                <h3 className="font-bold text-[22px]">{tier.name}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed opacity-75">{tier.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  {tier.price === null ? (
                    <span className="font-mono font-bold leading-none tracking-tight" style={{ fontSize: 56, color: popular ? LIME : INK }}>Custom</span>
                  ) : (
                    <>
                      <span className="font-mono text-[18px] opacity-60">€</span>
                      <span className="font-mono font-bold leading-none tracking-tight tabular-nums" style={{ fontSize: 64, color: popular ? LIME : INK }}>{tier.price}</span>
                      <span className="font-mono text-[13px] ml-1 opacity-60">/ month</span>
                    </>
                  )}
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-55">
                  {tier.price === null ? "Based on team size and deal flow" : "Billed monthly · cancel anytime"}
                </p>

                <div className="mt-5 grid gap-1 rounded-xl px-3 py-2.5 border" style={{ borderColor: popular ? "rgba(255,255,255,0.1)" : RULE, background: popular ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.4)" }}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-mono uppercase tracking-[0.22em] text-[10px] opacity-65">Memos</span>
                    <span className="font-bold">{tier.signalsLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-mono uppercase tracking-[0.22em] text-[10px] opacity-65">Seats</span>
                    <span className="font-bold">{tier.seats}</span>
                  </div>
                </div>

                <Link
                  href={tier.ctaHref}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold transition hover:scale-[1.02]"
                  style={popular ? { background: LIME, color: INK } : { background: INK, color: LIME }}
                >
                  {tier.cta}
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] opacity-55">{tier.subtitle}</p>

                <ul className="mt-6 space-y-2.5 border-t pt-5" style={{ borderColor: popular ? "rgba(255,255,255,0.1)" : RULE }}>
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-[12.5px]">
                      {f.included ? (
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: popular ? LIME : "rgba(15,61,46,0.15)" }}>
                          <Check className="h-2.5 w-2.5 stroke-[3]" style={{ color: popular ? INK : FOREST }} />
                        </span>
                      ) : (
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: popular ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}>
                          <X className="h-2.5 w-2.5 stroke-[2.5] opacity-40" />
                        </span>
                      )}
                      <span className={f.included ? "" : "opacity-40"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} /> 14-day free trial</span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} /> Cancel anytime</span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, filter: "saturate(1.4)" }} /> EU-invoiced VAT incl.</span>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section id="faq" className="relative border-t px-5 md:px-8 py-24" style={{ borderColor: RULE, background: BONE }}>
      <div className="mx-auto max-w-[1240px] grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
            <HelpCircle className="h-3 w-3" />
            [07] Reference
          </span>
          <h2 className="mt-4 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 0.95 }}>
            Questions,{" "}
            <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
              answered.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed opacity-80">
            Everything investors have asked us during pilots and preview calls. If your question isn&apos;t here, we&apos;ll answer it personally.
          </p>
          <a
            href="mailto:hello@sam.ai"
            className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold hover:scale-[1.02] transition"
            style={{ borderColor: RULE, background: PAPER }}
          >
            <Mail className="h-3 w-3" />
            hello@sam.ai
          </a>
        </div>

        <div className="lg:col-span-8 space-y-3">
          {faqItems.map((item, i) => (
            <details key={i} className="group rounded-[14px] border p-5 transition open:shadow-md" style={{ borderColor: RULE, background: PAPER }}>
              <summary className="flex cursor-pointer items-start gap-4 list-none">
                <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-[11px] font-bold tabular-nums" style={{ background: BONE, color: FOREST, border: `1px solid ${RULE}` }}>
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="flex-1 font-bold text-[15px] md:text-[16px] leading-snug">{item.q}</span>
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition group-open:rotate-45" style={{ background: BONE }}>
                  <Plus className="h-4 w-4 stroke-[2.5]" style={{ color: FOREST }} />
                </span>
              </summary>
              <p className="mt-3 ml-[3.25rem] text-[14px] leading-relaxed opacity-80 pr-8">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden px-5 md:px-8 py-24" style={{ background: PAPER }}>
      <div className="absolute inset-0 grain pointer-events-none" />
      <span className="absolute left-6 top-6 h-3 w-3" style={{ background: LIME }} />
      <span className="absolute right-6 top-6 h-3 w-3" style={{ background: LIME }} />
      <span className="absolute left-6 bottom-6 h-3 w-3" style={{ background: LIME }} />
      <span className="absolute right-6 bottom-6 h-3 w-3" style={{ background: LIME }} />

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
          <Sparkles className="h-3 w-3" />
          [08] Start today
        </span>
        <h2 className="mt-6 font-bold tracking-[-0.025em]" style={{ fontSize: "clamp(48px, 9vw, 110px)", lineHeight: 0.92 }}>
          Step into due diligence with{" "}
          <span style={{ background: `linear-gradient(transparent 64%, ${LIME} 64%, ${LIME} 92%, transparent 92%)`, padding: "0 0.05em" }}>
            Sam.
          </span>
        </h2>
        <p className="mt-6 mx-auto max-w-xl text-[16px] leading-relaxed opacity-80">
          No integrations, no onboarding call. Upload a deck, get a scored, defensible memo in minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register?tier=professional"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.22em] font-semibold transition hover:scale-[1.03]"
            style={{ background: INK, color: LIME }}
          >
            Analyse a deck
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.22em] font-semibold transition hover:bg-white"
            style={{ borderColor: RULE, color: INK }}
          >
            See a sample memo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">
          <span>No credit card</span>
          <span className="opacity-40">·</span>
          <span>EU-hosted</span>
          <span className="opacity-40">·</span>
          <span>GDPR by design</span>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 md:px-8 py-16" style={{ background: INK, color: "rgba(255,255,255,0.85)" }}>
      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "rgba(212,255,107,0.12)" }}>
                <BarChart3 className="h-4 w-4" style={{ color: LIME }} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em]">Sam · investment memo, audited</span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed opacity-65">
              Sam helps investors decide.<br />
              Built in Europe, for European investors.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3 w-3" style={{ color: LIME }} />
                GDPR by design
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" style={{ color: LIME }} />
                EU-hosted
              </span>
            </div>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: LIME }}>Product</p>
            <ul className="space-y-3 text-[13px] opacity-75">
              <li><Link href="/how-it-works" className="hover:opacity-100">How it works</Link></li>
              <li><Link href="/#pricing" className="hover:opacity-100">Pricing</Link></li>
              <li><Link href="/for-angels" className="hover:opacity-100">For angels</Link></li>
              <li><Link href="/for-vc-funds" className="hover:opacity-100">For VC funds</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: LIME }}>Trust</p>
            <ul className="space-y-3 text-[13px] opacity-75">
              <li><Link href="/privacy" className="hover:opacity-100">GDPR &amp; privacy</Link></li>
              <li><Link href="/login" className="hover:opacity-100">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t pt-6 font-mono text-[10px] uppercase tracking-[0.22em] opacity-55 md:flex-row md:justify-between" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p>© {new Date().getFullYear()} Sam · All rights reserved</p>
          <p>Built in Europe · Hosted in Europe</p>
        </div>
      </div>
    </footer>
  )
}
