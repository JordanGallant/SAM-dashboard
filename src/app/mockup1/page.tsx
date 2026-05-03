import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Variant 1 — Institutional Editorial
// Carta UK / Stripe Press DNA. Off-white paper, pure black ink, deep navy
// accent. Editorial serif H1, geometric sans body, mono numerals. Hairline
// 1px borders only. No shadows, no gradients, no rounded corners > 4px.

const PAPER = "#FAFAF7"
const INK = "#0A0A0A"
const NAVY = "#1B2A4E"
const RULE = "#1C1C1C"

export default function Mockup1() {
  return (
    <div style={{ background: PAPER, color: INK }} className="min-h-screen font-sans">
      {/* Mockup chooser bar */}
      <ChooserBar current={1} />

      {/* Top brand strip */}
      <div className="border-b" style={{ borderColor: RULE }}>
        <div className="mx-auto max-w-[1240px] px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-serif text-[22px] font-bold tracking-[-0.01em]">SAM</div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/55">
              Investment Memo, Audited
            </span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px]">
            <a className="hover:underline underline-offset-4">Product</a>
            <a className="hover:underline underline-offset-4">Pricing</a>
            <a className="hover:underline underline-offset-4">Method</a>
            <a className="hover:underline underline-offset-4">Sign in</a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="border-b" style={{ borderColor: RULE }}>
        <div className="mx-auto max-w-[1240px] px-8 py-20 md:py-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em]" style={{ color: NAVY }}>
              Vol. I · Issue 03 · Spring 2026
            </p>
            <h1
              className="mt-6 font-serif font-bold tracking-[-0.02em]"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(48px, 6vw, 76px)",
                lineHeight: 1.02,
              }}
            >
              Time is money.
              <br />
              <em className="not-italic" style={{ color: NAVY }}>Save both.</em>
            </h1>
            <p
              className="mt-7 text-[18px] leading-[1.55] max-w-[40ch]"
              style={{ color: "rgba(10,10,10,0.7)", fontFamily: "Georgia, serif" }}
            >
              Structured investment memos, scored across five domains. Twelve minutes from
              deck to IC. Built for partners who read twenty decks a week and decide on five.
            </p>

            <form className="mt-9 flex items-stretch max-w-[460px] border" style={{ borderColor: RULE }}>
              <input
                type="email"
                placeholder="your.work@email.com"
                className="flex-1 bg-transparent px-4 py-3.5 text-[14px] outline-none placeholder:text-black/35"
              />
              <button
                className="px-5 text-[12px] font-mono uppercase tracking-[0.2em] font-semibold border-l text-white"
                style={{ background: INK, borderColor: RULE }}
              >
                Begin
              </button>
            </form>

            <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.18em] text-black/55">
              No card · 14-day trial · GDPR by design
            </p>
          </div>

          {/* Memo specimen */}
          <figure
            className="border bg-white"
            style={{ borderColor: RULE }}
          >
            <div className="border-b px-5 py-3 flex items-center justify-between" style={{ borderColor: RULE }}>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                Memo · VREY · 03.MAR.2026
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: NAVY }}>
                Proceed to IC
              </span>
            </div>
            <div className="p-7">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-black/55">
                Overall Score
              </p>
              <p className="mt-2 font-serif text-[64px] leading-none font-bold tabular-nums" style={{ fontFamily: "Georgia, serif" }}>
                78<span className="text-[24px] text-black/45">/100</span>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-3 text-[12px]">
                {[
                  ["Team", 82],
                  ["Market", 71],
                  ["Product", 75],
                  ["Traction", 80],
                  ["Finance", 76],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
                    <span className="text-black/65">{k}</span>
                    <span className="font-mono tabular-nums font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-[12.5px] leading-[1.6] text-black/70 max-w-[44ch]" style={{ fontFamily: "Georgia, serif" }}>
                European agritech vertical. Founders ex-Cargill, Bayer R&D. Validated TAM
                €4.2B, undisclosed capital efficiency, asks 12 follow-ups before first call.
              </p>
            </div>
          </figure>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="border-b" style={{ borderColor: RULE }}>
        <div className="mx-auto max-w-[1240px] grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: RULE }}>
          {[
            ["12", "min", "Deck → IC-ready memo"],
            ["5", "domains", "Scored, weighted, audited"],
            ["1,000", "+ memos", "Generated to date"],
            ["€250", "k", "Average decision at stake"],
          ].map(([num, unit, label], i) => (
            <div
              key={i}
              className={`px-8 py-12 ${i > 0 ? "border-l" : ""}`}
              style={{ borderColor: "rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-bold tabular-nums text-[64px] leading-none">
                  {num}
                </span>
                <span className="font-mono text-[16px] text-black/55">{unit}</span>
              </div>
              <p className="mt-3 text-[12px] font-mono uppercase tracking-[0.18em] text-black/55">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="border-b" style={{ borderColor: RULE }}>
        <div className="mx-auto max-w-[1240px] px-8 py-20 grid md:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em]" style={{ color: NAVY }}>
              § The Problem
            </p>
            <h2 className="mt-5 font-serif font-bold tracking-[-0.02em] text-[36px] leading-[1.05]" style={{ fontFamily: "Georgia, serif" }}>
              Pitch decks lie. Memos don&apos;t.
            </h2>
          </div>
          <div className="text-[16px] leading-[1.7] text-black/75 columns-1 md:columns-2 gap-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              A 36-slide deck takes ninety minutes to read carefully and then it&apos;s
              forgotten by Wednesday. SAM produces a structured memo from the same deck
              in twelve minutes — scored across team, market, product, traction, finance.
            </p>
            <p className="mt-5">
              The memo is the artifact. It travels through your IC, sits in your archive,
              and answers the question your future self will ask: <em>why did we pass on
              this</em>?
            </p>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section>
        <div className="mx-auto max-w-[1240px] px-8 py-20">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em]" style={{ color: NAVY }}>
                § Subscription
              </p>
              <h2 className="mt-5 font-serif font-bold tracking-[-0.02em] text-[36px]" style={{ fontFamily: "Georgia, serif" }}>
                Three tiers. Plain pricing.
              </h2>
            </div>
            <Link href="/" className="text-[12px] font-mono uppercase tracking-[0.2em] hover:underline underline-offset-4">
              Full pricing →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 border" style={{ borderColor: RULE }}>
            {[
              { name: "Angel", price: "149", desc: "10 memos / mo · 1 seat" },
              { name: "Pro", price: "299", desc: "30 memos / mo · 3 seats" },
              { name: "Fund", price: "—", desc: "Unlimited · custom terms" },
            ].map((t, i) => (
              <div key={t.name} className={`p-8 ${i > 0 ? "border-l" : ""}`} style={{ borderColor: RULE }}>
                <p className="text-[11px] font-mono uppercase tracking-[0.25em]" style={{ color: NAVY }}>
                  Tier {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-serif font-bold text-[28px]" style={{ fontFamily: "Georgia, serif" }}>
                  {t.name}
                </h3>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-mono text-[16px] text-black/55">€</span>
                  <span className="font-mono font-bold tabular-nums text-[44px] leading-none">
                    {t.price}
                  </span>
                  {t.price !== "—" && (
                    <span className="font-mono text-[13px] text-black/55 ml-1">/mo</span>
                  )}
                </div>
                <p className="mt-3 text-[12px] font-mono uppercase tracking-[0.18em] text-black/55">
                  {t.desc}
                </p>
                <button
                  className="mt-7 inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.2em] border px-4 py-2.5 hover:bg-black hover:text-white transition-colors"
                  style={{ borderColor: RULE }}
                >
                  {t.price === "—" ? "Book walkthrough" : "Begin"}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-10" style={{ borderColor: RULE }}>
        <div className="mx-auto max-w-[1240px] px-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-black/55">
          <span>© SAM · Built for partners</span>
          <span>Privacy · Terms · Method</span>
        </div>
      </footer>
    </div>
  )
}

function ChooserBar({ current }: { current: number }) {
  return (
    <div className="border-b bg-white text-[11px] font-mono uppercase tracking-[0.18em]" style={{ borderColor: "rgba(0,0,0,0.15)" }}>
      <div className="mx-auto max-w-[1240px] px-8 py-2 flex items-center gap-5">
        <span className="text-black/45">Mockups · pick one</span>
        {[1, 2, 3].map((n) => (
          <Link
            key={n}
            href={`/mockup${n}`}
            className={`px-2 py-0.5 ${
              n === current
                ? "bg-black text-white"
                : "text-black/65 hover:text-black"
            }`}
          >
            {n === 1 ? "Editorial" : n === 2 ? "Ramp Operator" : "Terminal"}
          </Link>
        ))}
      </div>
    </div>
  )
}
