// SAM landing — Terminal Minimalist style.
// Linear / Vercel / Reflect DNA. Cool off-white, Geist throughout, monochrome
// hero, no card boxes, sections separated by edge-to-edge hairline rules,
// 1px ring buttons, no shadows, no gradients. Quietly confident, technical,
// restrained — the opposite of the previous gradient-heavy SaaS look.
//
// Self-contained on purpose: every section is rendered inline so the visual
// language stays consistent. If we want to extract sections later, do it then.

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { CookieBanner } from "@/components/landing/cookie-banner"

const BG = "#F8F8F9"
const INK = "#0A0E14"
const RULE = "rgba(10,14,20,0.10)"
const RULE_STRONG = "rgba(10,14,20,0.18)"

export default function Home() {
  return (
    <div style={{ background: BG, color: INK }} className="min-h-screen font-sans">
      <Header />
      <Hero />
      <StatsBand />
      <Problem />
      <Framework />
      <Position />
      <Audiences />
      <Trust />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
      <CookieBanner />
    </div>
  )
}

// -----------------------------------------------------------------------------
// Header
// -----------------------------------------------------------------------------

function Header() {
  return (
    <header className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-4 w-4 rounded-sm" style={{ background: INK }} />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">sam</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-[13px] text-black/65">
          <Link href="/how-it-works" className="hover:text-black">
            Method
          </Link>
          <Link href="/for-angels" className="hover:text-black">
            For angels
          </Link>
          <Link href="/for-vc-funds" className="hover:text-black">
            For funds
          </Link>
          <Link href="/#pricing" className="hover:text-black">
            Pricing
          </Link>
          <Link href="/sample" className="hover:text-black">
            Sample memo
          </Link>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <Link href="/login" className="text-black/65 hover:text-black px-2">
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 ring-1 hover:bg-black hover:text-white transition-colors"
            style={{ borderRadius: 0 }}
          >
            <span>Get started</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  )
}

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

function Hero() {
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-start">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
              SAM / INVESTMENT MEMO · v1.4
            </p>

            <h1
              className="mt-7 font-bold tracking-[-0.035em]"
              style={{ fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1.0 }}
            >
              Time is money.
              <br />
              <span className="text-black/40">Save both.</span>
            </h1>

            <p className="mt-7 max-w-[58ch] text-[16.5px] leading-[1.55] text-black/65">
              Structured investment memos, scored across five domains. Twelve minutes
              from deck to IC-ready. Built for partners who read twenty decks a week and
              decide on five.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium ring-1 hover:bg-black hover:text-white transition-colors"
                style={{ borderRadius: 0 }}
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-black/60 hover:text-black transition-colors"
              >
                See a sample memo →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md text-[12px] font-mono uppercase tracking-[0.15em] text-black/45">
              <div>
                <span className="block text-black">No credit card</span>
                <span>14-day trial</span>
              </div>
              <div>
                <span className="block text-black">EU-based</span>
                <span>GDPR by design</span>
              </div>
              <div>
                <span className="block text-black">Cancel anytime</span>
                <span>Self-serve</span>
              </div>
            </div>
          </div>

          {/* Memo specimen — sits in a 1px ring, NO chrome */}
          <div className="ring-1 bg-white" style={{ borderRadius: 0 }}>
            <div
              className="border-b px-5 py-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em]"
              style={{ borderColor: RULE }}
            >
              <span className="text-black/55">memo / vrey · 2026-03-04</span>
              <span className="text-black">proceed-to-ic</span>
            </div>
            <div className="p-7">
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
                  Overall score
                </p>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
                  Confidence · High
                </p>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono font-bold tabular-nums text-[64px] leading-none tracking-[-0.04em]">
                  78
                </span>
                <span className="text-[16px] font-mono text-black/35">/100</span>
              </div>

              <div className="mt-7 border-t" style={{ borderColor: RULE }}>
                {[
                  ["Team", 82],
                  ["Market", 71],
                  ["Product", 75],
                  ["Traction", 80],
                  ["Finance", 76],
                ].map(([k, v]) => (
                  <div
                    key={k as string}
                    className="flex items-baseline justify-between border-b py-2.5 text-[13px]"
                    style={{ borderColor: RULE }}
                  >
                    <span className="text-black/65 font-mono">{k as string}</span>
                    <div className="flex items-center gap-3">
                      <span className="h-1 w-24 bg-black/8 relative overflow-hidden">
                        <span
                          className="absolute inset-y-0 left-0 bg-black"
                          style={{ width: `${v as number}%` }}
                        />
                      </span>
                      <span className="font-mono font-semibold tabular-nums w-7 text-right">
                        {v as number}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[12.5px] leading-[1.55] text-black/60">
                European agritech, ex-Cargill founders, validated TAM €4.2B. Asks 12
                follow-ups before first call.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Stats band
// -----------------------------------------------------------------------------

function StatsBand() {
  const stats: [string, string][] = [
    ["12 min", "Deck → IC-ready memo"],
    ["5 domains", "Scored, weighted, audited"],
    ["1,000+", "Memos generated to date"],
    ["€250k", "Average decision at stake"],
  ]
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] grid grid-cols-2 md:grid-cols-4 px-8 py-12">
        {stats.map(([n, l], i) => (
          <div
            key={i}
            className={`px-7 ${i % 2 === 1 ? "border-l md:border-l" : ""} ${i >= 2 ? "md:border-l border-l md:pt-0 pt-8" : ""} ${i < 2 ? "md:pb-0 pb-8" : ""}`}
            style={{ borderColor: RULE_STRONG }}
          >
            <p className="font-mono font-bold tabular-nums tracking-[-0.02em] text-[36px] leading-none">
              {n}
            </p>
            <p className="mt-3 text-[12px] font-mono uppercase tracking-[0.18em] text-black/50">
              {l}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Problem — Without / With as hairline-divided columns (no cards)
// -----------------------------------------------------------------------------

function Problem() {
  const without = [
    "Deck opened at 11pm, scanned in 8 minutes",
    "\"Good team — I think?\" scribbled in a notebook",
    "Passed on a deal last March, can't remember why",
    "Every partner screens slightly differently",
    "No memory, no comparability, no defensible verdict",
  ]
  const withSam = [
    "From scribbled notes → a structured, searchable memo",
    "From \"good team — I think?\" → evidence-backed verdicts",
    "From a 10-minute screen → a defensible decision record",
    "From inconsistent judgement → memos your partners can compare",
    "From lost context → ask any deal \"why did we pass?\" six months later",
  ]
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          01 / the problem
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          Pitch decks lie. <span className="text-black/35">Memos don&apos;t.</span>
        </h2>
        <p className="mt-5 text-[16px] text-black/60 max-w-[60ch] leading-relaxed">
          The first-screen workflow today is improvised, inconsistent, and forgotten by
          Wednesday. Sam replaces it with a structured artefact you can compare, search,
          and defend.
        </p>

        <div className="mt-14 grid md:grid-cols-2 gap-px bg-[rgba(10,14,20,0.10)]">
          <div className="bg-[#F8F8F9] p-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45 mb-5">
              Without Sam
            </p>
            <ul>
              {without.map((line) => (
                <li
                  key={line}
                  className="border-b py-3 text-[14.5px] leading-[1.55] text-black/55 flex items-start gap-3 first:border-t"
                  style={{ borderColor: RULE }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30 pt-1 shrink-0 w-5">
                    ✕
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#F8F8F9] p-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary mb-5">
              With Sam
            </p>
            <ul>
              {withSam.map((line) => (
                <li
                  key={line}
                  className="border-b py-3 text-[14.5px] leading-[1.55] text-black/85 flex items-start gap-3 first:border-t"
                  style={{ borderColor: RULE }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black pt-1 shrink-0 w-5">
                    →
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Framework — 4-step pipeline, hairline rows
// -----------------------------------------------------------------------------

function Framework() {
  const steps = [
    {
      step: "STEP 01",
      title: "Upload a deck",
      body: "Drag in a PDF. Or forward to your sam intake address. Auto-extracts company name, stage, sector.",
    },
    {
      step: "STEP 02",
      title: "Sam reads it for you",
      body: "Five domains analysed in parallel. Team via LinkedIn. Market via TAM/SAM/SOM validation. Finance via valuation triangulation.",
    },
    {
      step: "STEP 03",
      title: "Compare against your fund",
      body: "Drop a 1-pager mandate doc. Sam scores fund-fit against your thesis, stage, sector, geography, and stated restrictions.",
    },
    {
      step: "STEP 04",
      title: "Decide and archive",
      body: "Twelve minutes from deck to verdict. The memo is the artefact — searchable, citable, comparable, exportable to Word or PDF.",
    },
  ]
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          02 / the framework
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          Same five domains. <span className="text-black/35">Every deck.</span>
        </h2>

        <div className="mt-14 divide-y" style={{ borderColor: RULE }}>
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="grid md:grid-cols-[200px_1fr_2fr] gap-8 py-10"
              style={{
                borderColor: RULE,
                borderTopWidth: i === 0 ? "1px" : 0,
                borderBottomWidth: i === steps.length - 1 ? "1px" : 0,
                borderStyle: "solid",
              }}
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-black/45 pt-1">
                {s.step}
              </p>
              <h3 className="font-semibold tracking-[-0.02em] text-[20px]">{s.title}</h3>
              <p className="text-[15px] leading-[1.6] text-black/65">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45 mb-4">
            The five domains
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[rgba(10,14,20,0.10)] ring-1" style={{ borderColor: RULE }}>
            {[
              ["Team", "Founder-market fit, backgrounds, red flags"],
              ["Market", "TAM / SAM / SOM, competitors, why now"],
              ["Product", "10x test, PMF signals, moat"],
              ["Traction", "Revenue, retention, capital efficiency"],
              ["Finance", "Valuation, deal terms, investor signals"],
            ].map(([name, focus]) => (
              <div key={name} className="bg-[#F8F8F9] p-5">
                <p className="font-semibold tracking-[-0.01em] text-[14px]">{name}</p>
                <p className="mt-2 text-[12px] text-black/55 leading-[1.5]">{focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Position statement — the "Sam is not a database" line, promoted
// -----------------------------------------------------------------------------

function Position() {
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          03 / where sam sits
        </p>
        <p className="mt-7 font-bold tracking-[-0.025em] text-[32px] md:text-[42px] leading-[1.1] max-w-[24ch]">
          Sam is not a startup database.
          <br />
          Not a CRM.
          <br />
          Not a data platform.
        </p>
        <p className="mt-7 font-bold tracking-[-0.025em] text-[32px] md:text-[42px] leading-[1.1] max-w-[24ch]">
          <span className="text-black/35">It&apos;s the </span>evaluation layer
          <span className="text-black/35"> between the deck and the decision.</span>
        </p>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Audiences — 3 archetypes, list-style
// -----------------------------------------------------------------------------

function Audiences() {
  const list = [
    {
      label: "For angels",
      best: "Best for solo deal flow",
      stat: "50+ decks / month",
      body: "You see fifty decks a month and meet with five. Sam gives you a structured second opinion before the first call. Six months later, you can still explain why you passed.",
      href: "/for-angels",
      cta: "See the angel workflow",
    },
    {
      label: "For syndicates & scouts",
      best: "Best for shared notes",
      stat: "3–10 partners aligned",
      body: "Your deal notes live across three tools and two heads. Sam produces a consistent memo per deal that your syndicate partners can actually compare and reference.",
      href: "/how-it-works",
      cta: "See the pro workflow",
    },
    {
      label: "For VC funds",
      best: "Best for institutional teams",
      stat: "5+ analysts · shared memos",
      body: "First-screening capacity is the bottleneck in every fund. Sam handles the triage layer so your analysts spend their time on the deals that matter, not on the ones they'll pass.",
      href: "/for-vc-funds",
      cta: "See the fund workflow",
    },
  ]
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          04 / who it&apos;s for
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          Different roles. <span className="text-black/35">Same framework.</span>
        </h2>

        <div className="mt-14 divide-y ring-1" style={{ borderColor: RULE_STRONG }}>
          {list.map((a) => (
            <article
              key={a.label}
              className="grid md:grid-cols-[200px_1fr_220px] gap-8 px-8 py-10 items-start hover:bg-black/[0.015] transition-colors"
              style={{ borderColor: RULE_STRONG }}
            >
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
                  {a.label}
                </p>
                <p className="mt-1.5 text-[12px] font-mono uppercase tracking-[0.15em] text-black/65">
                  {a.best}
                </p>
              </div>
              <p className="text-[15px] leading-[1.6] text-black/70 max-w-[58ch]">{a.body}</p>
              <div className="md:text-right">
                <p className="font-mono text-[13px] text-black mb-3">{a.stat}</p>
                <Link
                  href={a.href}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium hover:underline underline-offset-4 decoration-black/40"
                >
                  {a.cta}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Trust — EU pillars, hairline list
// -----------------------------------------------------------------------------

function Trust() {
  const pillars = [
    {
      label: "Designed for EU processing",
      desc: "Sam is built around EU-based processing and storage. GDPR is treated as an architectural constraint, not a compliance checkbox.",
    },
    {
      label: "GDPR by design",
      desc: "Data minimisation, retention rules, and processing scopes are baked into the framework, not bolted on afterwards.",
    },
    {
      label: "No model training on your decks",
      desc: "Your submitted decks are never used to train any model — ours or anyone else's.",
    },
    {
      label: "Deletion on your schedule",
      desc: "You set the retention window. When it ends, decks and derived artefacts are removed from storage.",
    },
  ]
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          05 / data sovereignty
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          European stack. <span className="text-black/35">No exceptions.</span>
        </h2>

        <div className="mt-14 divide-y ring-1" style={{ borderColor: RULE_STRONG }}>
          {pillars.map((p) => (
            <div
              key={p.label}
              className="grid md:grid-cols-[300px_1fr] gap-6 px-8 py-7"
              style={{ borderColor: RULE_STRONG }}
            >
              <p className="font-semibold tracking-[-0.01em] text-[15px]">{p.label}</p>
              <p className="text-[14.5px] leading-[1.6] text-black/65 max-w-[60ch]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Pricing — terminal-style 3 tier picker
// -----------------------------------------------------------------------------

function Pricing() {
  const tiers = [
    {
      key: "starter",
      name: "Angel",
      price: "149",
      memos: "10 / month",
      seats: "1 seat",
      desc: "For individual investors who want a structured second opinion on every deck.",
      cta: "Start free trial",
      href: "/register?tier=starter",
      everything: false,
    },
    {
      key: "professional",
      name: "Pro",
      price: "299",
      memos: "30 / month",
      seats: "3 seats",
      desc: "For syndicates, scouts, and solo GPs running a meaningful pipeline.",
      cta: "Start free trial",
      href: "/register?tier=professional",
      everything: false,
    },
    {
      key: "fund",
      name: "Fund",
      price: "Custom",
      memos: "Unlimited",
      seats: "Unlimited",
      desc: "For fund teams running first-screening at scale, with shared memory.",
      cta: "Book a walkthrough",
      href: "mailto:hello@sam.ai?subject=SAM%20Fund%20-%20Walkthrough%20request",
      everything: true,
    },
  ] as const

  const FEATURES_ALL = [
    "Structured memo (verdict + top risks + questions)",
    "Domain scoring",
    "Source review",
    "Stage-aware scoring",
    "First-call diligence questions",
    "Missing info checklist",
    "Export (PDF + Word)",
    "Deal archive",
    "Fund profile (thesis, sector, stage)",
  ]
  const FEATURES_FUND_ONLY = [
    "Fund fit scoring",
    "Deal comparison (side by side)",
    "Shared workspace",
    "Shared memo library",
    "2-factor authentication",
    "Tailored knowledgebase",
    "CRM connections",
    "Dedicated support",
  ]

  return (
    <section id="pricing" className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          06 / pricing
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          Three tiers. <span className="text-black/35">Cancel anytime.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-3 ring-1" style={{ borderColor: RULE_STRONG }}>
          {tiers.map((t, i) => (
            <div
              key={t.key}
              className={`p-7 md:p-8 flex flex-col bg-[#F8F8F9] ${
                i > 0 ? "border-t md:border-t-0 md:border-l" : ""
              }`}
              style={{ borderColor: RULE_STRONG }}
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
                Tier 0{i + 1}
              </p>
              <h3 className="mt-2 font-bold tracking-[-0.02em] text-[24px]">{t.name}</h3>
              <p className="mt-2 text-[13px] text-black/55 leading-[1.55] min-h-[40px]">
                {t.desc}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                {t.price === "Custom" ? (
                  <span className="font-bold tracking-[-0.03em] text-[44px] leading-none">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="text-[15px] text-black/40">€</span>
                    <span className="font-mono font-bold tabular-nums tracking-[-0.03em] text-[52px] leading-none">
                      {t.price}
                    </span>
                    <span className="text-[13px] text-black/40 ml-1">/mo</span>
                  </>
                )}
              </div>

              <div
                className="mt-5 flex flex-col gap-1 px-3 py-2.5 ring-1"
                style={{ borderColor: RULE }}
              >
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-mono uppercase tracking-[0.18em] text-[10px] text-black/45">
                    Memos
                  </span>
                  <span className="font-semibold">{t.memos}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-mono uppercase tracking-[0.18em] text-[10px] text-black/45">
                    Seats
                  </span>
                  <span className="font-semibold">{t.seats}</span>
                </div>
              </div>

              <Link
                href={t.href}
                className="mt-7 inline-flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium ring-1 hover:bg-black hover:text-white transition-colors"
                style={{ borderRadius: 0 }}
              >
                {t.cta}
                <ArrowRight className="h-3 w-3" />
              </Link>

              <ul className="mt-7 space-y-2 text-[13px]">
                {FEATURES_ALL.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 stroke-[2.5] mt-0.5 shrink-0" />
                    <span className="text-black/85">{f}</span>
                  </li>
                ))}
                {FEATURES_FUND_ONLY.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 ${t.everything ? "" : "opacity-40"}`}
                  >
                    <Check
                      className={`h-3.5 w-3.5 stroke-[2.5] mt-0.5 shrink-0 ${
                        t.everything ? "" : "opacity-30"
                      }`}
                    />
                    <span className={t.everything ? "text-black/85" : "text-black/45"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// FAQ — clean accordion via <details>
// -----------------------------------------------------------------------------

function FAQ() {
  const faqs = [
    {
      q: "How is Sam different from using generic AI to analyse a pitch deck?",
      a: "Sam applies a fixed five-domain evaluation framework to every deck — the same structure, scoring rubric, and severity classifications every time. Generic AI returns whatever comes out of a prompt, so the output varies, can't be compared across deals, and lacks a defensible methodology. Sam's framework is the product; the model is just the engine behind it.",
    },
    {
      q: "Is my pitch deck data secure and confidential?",
      a: "Yes. Sam runs on European servers only. Your deck is processed, analysed, and stored within the EU. No submitted material is used to train any model, and data is deleted on your retention schedule.",
    },
    {
      q: "What does a Sam investment memo actually include?",
      a: "Executive summary, overall score and confidence rating, per-domain verdicts across Team, Market, Product, Traction, and Financials, investment thesis, red flags, due diligence questionnaire, and IC-ready next steps. Structured the same way every time.",
    },
    {
      q: "How long does it take to generate a memo?",
      a: "Analysis runs in the background. You can close the browser — the memo appears in your account when ready, and you'll get an email notification.",
    },
    {
      q: "Can Sam replace a human analyst or associate?",
      a: "No. Sam handles the repetitive first-screening layer — consistent structure, scoring, red flags — so your analyst can focus on the deals worth deeper work. It is infrastructure, not a substitute for judgment.",
    },
    {
      q: "What stage of startups does Sam work best for?",
      a: "Pre-seed through Series A. The framework is stage-aware: traction weighs less at pre-seed, more at Series A. Later-stage evaluation is available and benchmarked against public comparables, but pre-seed to Series A is where Sam's framework delivers the most differentiation.",
    },
    {
      q: "Do I need any technical setup to use Sam?",
      a: "No. Upload a PDF, or forward a deck by email. The memo appears in your account. No CRM integration required, no data warehouse, no IT project.",
    },
    {
      q: "Is Sam suitable for a solo angel investor, or only for funds?",
      a: "Both. The Angel tier is priced for individual investors handling their own deal flow. The Fund tier adds team accounts, priority processing, and shared memo libraries. Same framework, different workflow.",
    },
    {
      q: "Can I export memos to my CRM, Notion, or Word?",
      a: "Yes. Memos export as a Word document or PDF, plus a shareable link. CRM-native pushes (Affinity, HubSpot) are on the roadmap.",
    },
    {
      q: "What happens to my pitch deck after the analysis runs?",
      a: "It stays in your account, encrypted at rest in the EU, until you delete it or it expires under your retention policy. It is never used for model training.",
    },
  ]
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          07 / faq
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          The questions <span className="text-black/35">we get most.</span>
        </h2>

        <div className="mt-14 divide-y ring-1" style={{ borderColor: RULE_STRONG }}>
          {faqs.map((f) => (
            <details key={f.q} className="group" style={{ borderColor: RULE_STRONG }}>
              <summary className="cursor-pointer flex items-start justify-between gap-6 px-8 py-6 list-none hover:bg-black/[0.015] transition-colors">
                <span className="font-semibold tracking-[-0.01em] text-[16px]">{f.q}</span>
                <span className="font-mono text-[18px] text-black/45 group-open:rotate-45 transition-transform shrink-0">
                  +
                </span>
              </summary>
              <div className="px-8 pb-7 text-[14.5px] leading-[1.65] text-black/65 max-w-[68ch]">
                {f.a}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-10 text-[13px] text-black/55">
          More questions?{" "}
          <a
            href="mailto:hello@sam.ai"
            className="text-black underline underline-offset-4 decoration-black/40 hover:decoration-black"
          >
            hello@sam.ai
          </a>
        </p>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Final CTA
// -----------------------------------------------------------------------------

function FinalCTA() {
  return (
    <section className="border-b" style={{ borderColor: RULE_STRONG }}>
      <div className="mx-auto max-w-[1180px] px-8 py-28 md:py-32">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          08 / start today
        </p>
        <h2
          className="mt-7 font-bold tracking-[-0.04em] leading-[0.98]"
          style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
        >
          Stop reading
          <br />
          decks at 11pm.
        </h2>
        <p className="mt-7 max-w-[60ch] text-[17px] leading-[1.55] text-black/65">
          Upload a deck. Twelve minutes later, a structured memo lands in your account.
          Free 14-day trial, no credit card.
        </p>
        <div className="mt-10 flex items-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium bg-black text-white hover:bg-black/85 transition-colors"
            style={{ borderRadius: 0 }}
          >
            Get started for free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center gap-2 px-5 py-3.5 text-[14px] font-medium text-black/60 hover:text-black transition-colors"
          >
            See a sample memo →
          </Link>
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-[1180px] px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.18em] text-black/45">
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-3 rounded-sm" style={{ background: INK }} />
          <span className="text-black">© sam · 2026</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-black">
            Privacy
          </Link>
          <Link href="/how-it-works" className="hover:text-black">
            Method
          </Link>
          <a href="mailto:hello@sam.ai" className="hover:text-black">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
