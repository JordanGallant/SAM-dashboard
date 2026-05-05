// SAM landing — Terminal Minimalist style.
// Linear / Vercel / Reflect DNA. Cool off-white, Geist throughout, monochrome
// hero, no card boxes, sections separated by edge-to-edge hairline rules,
// 1px ring buttons, no shadows, no gradients. Quietly confident, technical,
// restrained — the opposite of the previous gradient-heavy SaaS look.
//
// Self-contained on purpose: every section is rendered inline so the visual
// language stays consistent. If we want to extract sections later, do it then.

import { Fragment } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import ScoreShowcase from "./score-showcase"

const BG = "#F8F8F9"
const INK = "#0A0E14"
const RULE = "rgba(10,14,20,0.10)"
const RULE_STRONG = "rgba(10,14,20,0.18)"
// Dark-zone tokens — used by sections that flip to the near-black palette.
// `DARK_RULE` is the white-on-dark equivalent of `RULE`; `DARK_RULE_STRONG`
// of `RULE_STRONG`. Background gradient is the diagonal deep-green wash.
const DARK_BG = "#0A0E14"
const DARK_RULE = "rgba(255,255,255,0.10)"
const DARK_RULE_STRONG = "rgba(255,255,255,0.18)"
const DARK_GRADIENT =
  "linear-gradient(135deg, #050B15 0%, #0B1124 50%, #1E3A8A 100%)"
// SAM brand palette is applied inline via Tailwind arbitrary values:
// #1E3A8A (deep green) for eyebrows + price accents, #3B82F6 (bright green)
// for checkmarks + step markers, and a from-[#1E3A8A] to-[#3B82F6] gradient
// for primary CTAs, the logo square, and the hero "Save both" line. On dark
// zones, eyebrows shift to lime #A5B4FC for legibility; gradient is reused.

// Tiny gradient hairline accent — placed above section titles in dark zones
// (and a couple of key light ones) for rhythm. Light = brand gradient on its
// own; dark = same gradient against the dark surface, slightly brighter end.
function GradientHairline({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden
      className={
        tone === "dark"
          ? "block h-px w-12 bg-gradient-to-r from-[#3B82F6] to-[#A5B4FC] mb-5"
          : "block h-px w-12 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] mb-5"
      }
    />
  )
}

// Mono pill chip — `[ NEW ]`-style inline tag. Auto-uppercases, fixed sizing.
function Chip({
  children,
  tone = "light",
}: {
  children: React.ReactNode
  tone?: "light" | "dark"
}) {
  const cls =
    tone === "dark"
      ? "ring-1 ring-white/25 text-white/80"
      : "ring-1 ring-foreground/15 text-black/65"
  return (
    <span
      className={`inline-flex items-center text-[9px] font-mono uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm align-middle ${cls}`}
    >
      [ {children} ]
    </span>
  )
}

export default function Home() {
  return (
    <div style={{ background: BG, color: INK }} className="min-h-screen font-sans">
      <ChooserBar current={3} />
      <Header />
      <Hero />
      <StatsBand />
      <Problem />
      <Framework />
      <ScoreShowcase />
      <Position />
      <Audiences />
      <Trust />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
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
          <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]" />
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white ring-1 ring-transparent hover:opacity-90 transition-opacity"
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
    <section
      className="border-b relative bg-gradient-to-b from-white via-[#F8F8F9] to-[#F8F8F9]"
      style={{ borderColor: RULE_STRONG }}
    >
      {/* Faint corner radial wash — reinforces the hero glow without zoning */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_55%)]"
      />
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
                SAM / INVESTMENT MEMO · v1.4
              </p>
              <Chip>EU</Chip>
              <Chip>AI-NATIVE</Chip>
            </div>

            <h1
              className="mt-7 font-bold tracking-[-0.035em]"
              style={{ fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1.0 }}
            >
              Time is money.
              <br />
              <span className="bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#93C5FD] bg-clip-text text-transparent">
                Save both.
              </span>
            </h1>

            {/* Static SVG underline flourish — minimal single-stroke wave that
                hints at "signal" without animating. Sits flush under the H1. */}
            <svg
              aria-hidden
              viewBox="0 0 240 8"
              className="mt-3 h-2 w-[240px]"
              preserveAspectRatio="none"
            >
              <path
                d="M0 4 Q 30 0 60 4 T 120 4 T 180 4 T 240 4"
                fill="none"
                stroke="url(#heroWaveGrad)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="heroWaveGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <p className="mt-7 max-w-[58ch] text-[16.5px] leading-[1.55] text-black/65">
              Structured investment memos, scored across five domains. Twelve minutes
              from deck to IC-ready. Built for partners who read twenty decks a week and
              decide on five.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white ring-1 ring-transparent hover:opacity-90 transition-opacity"
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

          {/* Browser-chrome frame around the dashboard screenshot. Flat ring,
              no shadow, no large radius — keeps the terminal language. The
              radial green glow sits behind the frame to anchor it visually. */}
          <div className="relative">
            <div className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.10),transparent_60%)] blur-2xl" />
            <div className="ring-1 bg-white rounded" style={{ borderColor: RULE_STRONG }}>
              <div
                className="border-b px-3 py-2.5 flex items-center gap-3"
                style={{ borderColor: RULE }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div
                  className="flex-1 ml-2 px-3 py-1 ring-1 text-[11px] font-mono text-black/55 truncate"
                  style={{ borderColor: RULE, borderRadius: 2 }}
                >
                  sam.ai/deals/vrey/summary
                </div>
              </div>
              <img
                src="/design/hero-img-new.png"
                alt="Sam dashboard — deal summary view for Vrey"
                className="block w-full h-auto"
              />
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
  const stats: { n: string; l: string; score?: string }[] = [
    { n: "12 min", l: "Deck → IC-ready memo" },
    { n: "5 domains", l: "Scored, weighted, audited", score: "8.4 / 10" },
    { n: "1,000+", l: "Memos generated to date" },
    { n: "€250k", l: "Average decision at stake" },
  ]
  return (
    <section
      className="border-b relative overflow-hidden"
      style={{
        background: DARK_GRADIENT,
        color: "#F8F8F9",
        borderColor: DARK_RULE_STRONG,
      }}
    >
      {/* Hairline grid backdrop — adds technical texture, very low contrast */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft lime glow bottom-left for asymmetric warmth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,180,252,0.10),transparent_55%)]"
      />
      <div className="mx-auto max-w-[1180px] grid grid-cols-2 md:grid-cols-4 px-8 py-14 relative">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`px-7 ${i % 2 === 1 ? "border-l md:border-l" : ""} ${i >= 2 ? "md:border-l border-l md:pt-0 pt-8" : ""} ${i < 2 ? "md:pb-0 pb-8" : ""}`}
            style={{ borderColor: DARK_RULE_STRONG }}
          >
            <p className="font-mono font-bold tabular-nums tracking-[-0.02em] text-[36px] leading-none bg-gradient-to-r from-[#A5B4FC] to-[#3B82F6] bg-clip-text text-transparent">
              {s.n}
            </p>
            <p className="mt-3 text-[12px] font-mono uppercase tracking-[0.18em] text-white/55">
              {s.l}
            </p>
            {s.score && (
              <div className="mt-4 inline-flex flex-col gap-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono tabular-nums text-[11px] text-white/85">
                    {s.score}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/40">
                    avg
                  </span>
                </div>
                <span
                  aria-hidden
                  className="block h-[3px] w-20 bg-white/10 relative overflow-hidden"
                >
                  <span className="absolute inset-y-0 left-0 w-[84%] bg-gradient-to-r from-[#3B82F6] to-[#A5B4FC]" />
                </span>
              </div>
            )}
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
    <section
      className="border-b bg-gradient-to-b from-white via-[#F8F8F9] to-[#F8F8F9]"
      style={{ borderColor: RULE_STRONG }}
    >
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <GradientHairline />
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
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
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#3B82F6] mb-5">
              With Sam
            </p>
            <ul>
              {withSam.map((line) => (
                <li
                  key={line}
                  className="border-b py-3 text-[14.5px] leading-[1.55] text-black/85 flex items-start gap-3 first:border-t"
                  style={{ borderColor: RULE }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3B82F6] pt-1 shrink-0 w-5">
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
      n: "01",
      title: "Upload a deck",
      body: "Drag in a PDF. Or forward to your sam intake address. Auto-extracts company name, stage, sector.",
      // Slightly taller card — extra detail line for asymmetric rhythm.
      detail: "Works with any deck format. No template required.",
    },
    {
      n: "02",
      title: "Sam reads it for you",
      body: "Five domains analysed in parallel. Team via LinkedIn. Market via TAM/SAM/SOM validation. Finance via valuation triangulation.",
      detail: null,
    },
    {
      n: "03",
      title: "Compare against your fund",
      body: "Drop a 1-pager mandate doc. Sam scores fund-fit against your thesis, stage, sector, geography, and stated restrictions.",
      detail: "Mandate is reused across every future deck.",
    },
    {
      n: "04",
      title: "Decide and archive",
      body: "Twelve minutes from deck to verdict. The memo is the artefact — searchable, citable, comparable, exportable to Word or PDF.",
      detail: null,
    },
  ]
  return (
    <section
      className="border-b bg-gradient-to-b from-[#F8F8F9] to-[#F0EFF0]"
      style={{ borderColor: RULE_STRONG }}
    >
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <GradientHairline />
        {/* Anchor ribbon — short gradient bar above the eyebrow so the section
            opens with a stronger visual mark than the global hairline alone. */}
        <div
          aria-hidden
          className="h-1 w-24 bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]"
        />
        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
          02 / the framework
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[44px] md:text-[56px] leading-[1.02] max-w-3xl">
          Same{" "}
          <span className="bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC] bg-clip-text text-transparent">
            five domains
          </span>
          . <span className="text-black/35">Every deck.</span>
        </h2>
        <p className="mt-5 text-[16px] leading-[1.55] text-black/60 max-w-[58ch]">
          Each deck moves through the same five evaluation domains, in
          parallel, with consistent scoring.
        </p>

        {/* Horizontal 4-step pipeline — large outlined gradient numerals as
            anchors, gradient connector lines between cards on lg, vertical
            connectors on mobile. Cards 1 + 3 carry an extra detail line so
            the row reads as composed, not stamped from a 4-up template.
            Each card has 4 size-2 ink corner brackets for an
            engineering-blueprint feel. */}
        <div className="mt-14 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:gap-0 lg:items-stretch">
          {steps.map((s, i) => (
            <Fragment key={s.n}>
              <div
                className="relative ring-1 bg-white px-7 pt-7 pb-8 flex flex-col"
                style={{ borderColor: RULE, borderRadius: 0 }}
              >
                {/* Top-edge gradient hairline — feature ribbon over each step */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]"
                />
                {/* Four ink corner brackets — engineering-blueprint feel */}
                <span
                  aria-hidden
                  className="absolute top-0 left-0 size-2 bg-[#0A0E14]"
                />
                <span
                  aria-hidden
                  className="absolute top-0 right-0 size-2 bg-[#0A0E14]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 size-2 bg-[#0A0E14]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 right-0 size-2 bg-[#0A0E14]"
                />
                {/* Big outlined gradient numeral — the visual anchor */}
                <p
                  className="font-mono tabular-nums tracking-[-0.04em] text-[64px] leading-none bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC] bg-clip-text text-transparent"
                  style={{
                    WebkitTextStroke: "1px rgba(30,58,138,0.45)",
                  }}
                >
                  {s.n}
                </p>
                <h3 className="mt-5 font-semibold tracking-[-0.02em] text-[18px]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.55] text-black/65">
                  {s.body}
                </p>
                {s.detail ? (
                  <p className="mt-3 text-[13px] leading-[1.55] text-black/45">
                    {s.detail}
                  </p>
                ) : null}
              </div>
              {/* Connector — horizontal on lg, vertical on mobile/tablet.
                  Hidden after the last card. */}
              {i < steps.length - 1 ? (
                <div
                  aria-hidden
                  className="hidden lg:flex items-center justify-center self-center w-8"
                >
                  <div className="h-px w-full bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]" />
                </div>
              ) : null}
              {i < steps.length - 1 ? (
                <div
                  aria-hidden
                  className="lg:hidden flex justify-center py-1"
                >
                  <div className="w-px h-6 bg-gradient-to-b from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]" />
                </div>
              ) : null}
            </Fragment>
          ))}
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
    <section
      className="border-b relative overflow-hidden"
      style={{
        background: DARK_BG,
        color: "#F8F8F9",
        borderColor: DARK_RULE_STRONG,
      }}
    >
      {/* Hairline grid backdrop — slightly stronger here so the position
          statement reads as the page's "manifesto" beat. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Diagonal green wash to hint at the brand without zoning everything */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.18),transparent_60%)]"
      />
      <div className="mx-auto max-w-[1180px] px-8 py-28 relative">
        <GradientHairline tone="dark" />
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#A5B4FC]">
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
          <span className="text-white/40">It&apos;s the </span>
          <span className="bg-gradient-to-r from-[#A5B4FC] via-[#3B82F6] to-[#93C5FD] bg-clip-text text-transparent">
            evaluation layer
          </span>
          <span className="text-white/40"> between the deck and the decision.</span>
        </p>

        {/* Corner-bracket SVG flourish — frames the manifesto block from the
            bottom-right with thin strokes. Single colour, no fills. */}
        <svg
          aria-hidden
          viewBox="0 0 64 64"
          className="absolute bottom-10 right-8 h-10 w-10 text-white/25 hidden md:block"
        >
          <path
            d="M44 4 L60 4 L60 20 M60 44 L60 60 L44 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
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
    <section
      className="border-b bg-gradient-to-b from-white via-[#F8F8F9] to-[#F8F8F9]"
      style={{ borderColor: RULE_STRONG }}
    >
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <GradientHairline />
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
          04 / who it&apos;s for
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          Different roles. <span className="text-black/35">Same framework.</span>
        </h2>

        {/* Three archetype cards — staggered gradient directions create a
            composed grid (not three stamped tiles). Each card carries its
            own gradient hairline accent across the top and a clip-text
            gradient label so the page has rhythm without extra chrome. */}
        <div className="mt-14 grid md:grid-cols-3 gap-3">
          {list.map((a, i) => {
            // Stagger gradient direction + indigo intensity per card.
            const washes = [
              "bg-gradient-to-br from-white via-[#F8F8F9] to-[#EEF2FF]",
              "bg-gradient-to-bl from-white via-[#F4F6FF] to-[#E0E7FF]",
              "bg-gradient-to-tr from-white via-[#F8F7FF] to-[#EDE9FE]",
            ]
            return (
              <article
                key={a.label}
                className={`relative ring-1 flex flex-col ${washes[i]}`}
                style={{ borderColor: RULE_STRONG, borderRadius: 0 }}
              >
                {/* Top-edge gradient hairline — feature ribbon */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]"
                />
                <div className="flex flex-col flex-1 px-7 py-8">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
                    {a.label}
                  </p>
                  <p className="mt-1.5 text-[12px] font-mono uppercase tracking-[0.15em] text-black/65">
                    {a.best}
                  </p>
                  <p className="mt-6 text-[15px] leading-[1.6] text-black/70 flex-1">
                    {a.body}
                  </p>
                  <div className="mt-7 pt-5 border-t flex items-center justify-between" style={{ borderColor: RULE }}>
                    <p className="font-mono text-[12px] text-black">{a.stat}</p>
                    <Link
                      href={a.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium hover:underline underline-offset-4 decoration-black/40"
                    >
                      {a.cta}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
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
    <section
      className="border-b bg-gradient-to-b from-[#F8F8F9] to-[#F0EFF0]"
      style={{ borderColor: RULE_STRONG }}
    >
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        {/* Feature ribbon — slightly heavier than the standard hairline so
            this beat reads as the page's "trust" anchor. */}
        <div className="h-1 w-24 bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC] mb-5" />
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
          05 / data sovereignty
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          European stack. <span className="text-black/35">No exceptions.</span>
        </h2>

        {/* Four pillars — 2x2 grid of staggered gradient-wash cards.
            Each carries a top-edge gradient hairline; the wash direction
            alternates so the grid feels composed, not stamped. */}
        <div className="mt-14 grid md:grid-cols-2 gap-3">
          {pillars.map((p, i) => {
            const washes = [
              "bg-gradient-to-br from-white via-[#F8F8F9] to-[#EEF2FF]",
              "bg-gradient-to-bl from-white via-[#F4F6FF] to-[#E0E7FF]",
              "bg-gradient-to-tr from-white via-[#F8F7FF] to-[#EDE9FE]",
              "bg-gradient-to-tl from-white via-[#F4F6FF] to-[#E0E7FF]",
            ]
            return (
              <div
                key={p.label}
                className={`relative ring-1 ${washes[i]}`}
                style={{ borderColor: RULE_STRONG, borderRadius: 0 }}
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#A5B4FC]"
                />
                <div className="px-7 py-8">
                  <p className="font-semibold tracking-[-0.01em] text-[15px] bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
                    {p.label}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-[1.6] text-black/65 max-w-[60ch]">
                    {p.desc}
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
      featured: true,
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
    <section
      id="pricing"
      className="border-b bg-gradient-to-b from-white via-[#F8F8F9] to-[#F0EFF0]"
      style={{ borderColor: RULE_STRONG }}
    >
      <div className="mx-auto max-w-[1180px] px-8 py-24">
        <GradientHairline />
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
          06 / pricing
        </p>
        <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05] max-w-3xl">
          Three tiers. <span className="text-black/35">Cancel anytime.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-3 ring-1 relative" style={{ borderColor: RULE_STRONG }}>
          {tiers.map((t, i) => {
            const featured = "featured" in t && t.featured
            return (
            <div
              key={t.key}
              className={`relative p-7 md:p-8 flex flex-col bg-gradient-to-b from-white to-[#F4F3F4] ${
                i > 0 ? "border-t md:border-t-0 md:border-l" : ""
              } ${featured ? "ring-2 ring-[#1E3A8A] z-10 -my-px" : ""}`}
              style={{ borderColor: RULE_STRONG }}
            >
              {featured && (
                <span
                  className="absolute -top-3 left-7 px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.22em] bg-[#1E3A8A] text-white z-10"
                  style={{ borderRadius: 0 }}
                >
                  Most popular
                </span>
              )}
              <p className="relative text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
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
                className={
                  featured
                    ? "mt-7 inline-flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium bg-[#1E3A8A] hover:bg-[#152D6E] text-white ring-1 ring-transparent transition-colors"
                    : "mt-7 inline-flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium ring-1 hover:bg-black hover:text-white transition-colors"
                }
                style={{ borderRadius: 0 }}
              >
                {t.cta}
                <ArrowRight className="h-3 w-3" />
              </Link>

              <ul className="mt-7 space-y-2 text-[13px]">
                {FEATURES_ALL.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 stroke-[2.5] mt-0.5 shrink-0 text-[#3B82F6]" />
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
                        t.everything ? "text-[#3B82F6]" : "opacity-30"
                      }`}
                    />
                    <span className={t.everything ? "text-black/85" : "text-black/45"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            )
          })}
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
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1E3A8A]">
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
    <section
      className="border-b relative overflow-hidden"
      style={{
        background: DARK_GRADIENT,
        color: "#F8F8F9",
        borderColor: DARK_RULE_STRONG,
      }}
    >
      {/* Hairline grid backdrop — same density as Position for consistency */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Twin radial glows — green top-right, lime bottom-left — give the band
          atmosphere without competing with the headline. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.22),transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,180,252,0.10),transparent_60%)]"
      />
      <div className="mx-auto max-w-[1180px] px-8 py-28 md:py-32 relative">
        <GradientHairline tone="dark" />
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#A5B4FC]">
          08 / start today
        </p>
        <h2
          className="mt-7 font-bold tracking-[-0.04em] leading-[0.98]"
          style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
        >
          Stop reading
          <br />
          <span className="bg-gradient-to-r from-white via-[#A5B4FC] to-[#3B82F6] bg-clip-text text-transparent">
            decks at 11pm.
          </span>
        </h2>
        <p className="mt-7 max-w-[60ch] text-[17px] leading-[1.55] text-white/70">
          Upload a deck. Twelve minutes later, a structured memo lands in your account.
          Free 14-day trial, no credit card.
        </p>
        <div className="mt-10 flex items-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white hover:opacity-90 transition-opacity"
            style={{ borderRadius: 0, boxShadow: "0 0 0 1px rgba(165,180,252,0.35)" }}
          >
            Get started for free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center gap-2 px-5 py-3.5 text-[14px] font-medium text-white/65 hover:text-white transition-colors ring-1 ring-white/15"
            style={{ borderRadius: 0 }}
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
          <div className="h-3 w-3 rounded-sm bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]" />
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

function ChooserBar({ current }: { current: number }) {
  return (
    <div className="border-b bg-white text-[10px] font-mono uppercase tracking-[0.22em]" style={{ borderColor: "rgba(10,14,20,0.18)" }}>
      <div className="mx-auto max-w-[1180px] px-8 py-2 flex items-center gap-5">
        <span className="text-black/45">Mockups · pick one</span>
        {[1, 2, 3].map((n) => (
          <Link
            key={n}
            href={`/mockup${n}`}
            className={`px-2 py-0.5 ${
              n === current ? "bg-black text-white" : "text-black/65 hover:text-black"
            }`}
          >
            {n === 1 ? "queercom" : n === 2 ? "iris" : "terminal"}
          </Link>
        ))}
      </div>
    </div>
  )
}
