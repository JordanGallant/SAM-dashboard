import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Variant 3 — Terminal Minimalist
// Linear / Vercel / Reflect DNA. Cool off-white, Geist + Geist Mono, pure ink.
// No accent in hero (monochrome). NO contained card boxes — sections separated
// by horizontal hairline rules edge-to-edge. 1px ring buttons, no fill, no
// shadow. Quietly confident, technical, restrained.

const BG = "#F8F8F9"
const INK = "#0A0E14"
const RULE = "rgba(10,14,20,0.10)"
const RULE_STRONG = "rgba(10,14,20,0.18)"

export default function Mockup3() {
  return (
    <div style={{ background: BG, color: INK }} className="min-h-screen font-sans">
      <ChooserBar current={3} />

      {/* NAV */}
      <header className="border-b" style={{ borderColor: RULE_STRONG }}>
        <div className="mx-auto max-w-[1180px] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-4 rounded-sm" style={{ background: INK }} />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">sam</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] text-black/65">
            <a className="hover:text-black">Product</a>
            <a className="hover:text-black">Method</a>
            <a className="hover:text-black">Pricing</a>
            <a className="hover:text-black">Docs</a>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <a className="text-black/65 hover:text-black px-2">Sign in</a>
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

      {/* HERO */}
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
                <button
                  className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium ring-1 hover:bg-black hover:text-white transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  Get started
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-black/60 hover:text-black transition-colors"
                >
                  Read the docs →
                </button>
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
                    Overall Score
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

      {/* STATS — divided by vertical 1px rules, NO card boxes */}
      <section className="border-b" style={{ borderColor: RULE_STRONG }}>
        <div className="mx-auto max-w-[1180px] grid grid-cols-2 md:grid-cols-4 px-8 py-12">
          {[
            ["12 min", "Deck → IC-ready memo"],
            ["5 domains", "Scored, weighted, audited"],
            ["1,000+", "Memos generated to date"],
            ["€250k", "Average decision at stake"],
          ].map(([n, l], i) => (
            <div
              key={i}
              className={`px-7 ${i > 0 ? "md:border-l" : ""} ${i === 2 ? "md:border-l border-l" : ""} ${i === 1 ? "border-l md:border-l" : ""} ${i === 0 || i === 1 ? "pb-8 md:pb-0" : "pt-8 md:pt-0"}`}
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

      {/* HOW IT WORKS — sections separated by hairlines, no boxes */}
      <section className="border-b" style={{ borderColor: RULE_STRONG }}>
        <div className="mx-auto max-w-[1180px] px-8 py-24">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
            01 / how it works
          </p>
          <h2 className="mt-5 font-bold tracking-[-0.03em] text-[40px] leading-[1.05]">
            Pitch decks lie. <span className="text-black/35">Memos don&apos;t.</span>
          </h2>

          <div className="mt-14 divide-y" style={{ borderColor: RULE }}>
            {[
              {
                step: "STEP 01",
                title: "Upload a deck",
                body: "Drag in a PDF. Or forward to your sam intake address. Auto-extracts company name, stage, sector.",
              },
              {
                step: "STEP 02",
                title: "Sam reads the memo for you",
                body: "Five domains analysed in parallel. Team via LinkedIn. Market via TAM/SAM/SOM validation. Finance via valuation triangulation.",
              },
              {
                step: "STEP 03",
                title: "Read, decide, archive",
                body: "Twelve minutes from deck to verdict. The memo is the artifact — searchable, citable, comparable.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="grid md:grid-cols-[200px_1fr_2fr] gap-8 py-10"
                style={{ borderColor: RULE, borderTopWidth: i === 0 ? "1px" : 0, borderBottomWidth: i === 2 ? "1px" : 0, borderStyle: "solid" }}
              >
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-black/45 pt-1">
                  {s.step}
                </p>
                <h3 className="font-semibold tracking-[-0.02em] text-[20px]">
                  {s.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-black/65">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section>
        <div className="mx-auto max-w-[1180px] px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
                02 / pricing
              </p>
              <h2 className="mt-5 font-bold tracking-[-0.03em] text-[36px]">
                Three tiers.
              </h2>
            </div>
            <Link
              href="/"
              className="text-[13px] font-medium text-black/65 hover:text-black underline-offset-4 hover:underline"
            >
              Full pricing →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 ring-1 divide-y md:divide-y-0 md:divide-x" style={{ borderRadius: 0 }}>
            {[
              { name: "Angel", price: "149", quota: "10 memos / mo · 1 seat" },
              { name: "Pro", price: "299", quota: "30 memos / mo · 3 seats" },
              { name: "Fund", price: "Custom", quota: "Unlimited · Unlimited seats" },
            ].map((t) => (
              <div key={t.name} className="bg-white p-8">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
                  {t.name}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  {t.price === "Custom" ? (
                    <span className="font-bold tracking-[-0.03em] text-[40px] leading-none">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-[14px] text-black/40">€</span>
                      <span className="font-mono font-bold tabular-nums tracking-[-0.03em] text-[48px] leading-none">
                        {t.price}
                      </span>
                      <span className="text-[13px] text-black/40 ml-1">/mo</span>
                    </>
                  )}
                </div>
                <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.18em] text-black/50">
                  {t.quota}
                </p>
                <button
                  className="mt-7 inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium ring-1 hover:bg-black hover:text-white transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  {t.price === "Custom" ? "Book walkthrough" : "Get started"}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: RULE_STRONG }}>
        <div className="mx-auto max-w-[1180px] px-8 py-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-black/45">
          <span>© sam · 2026</span>
          <span>privacy · terms · changelog</span>
        </div>
      </footer>
    </div>
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
            {n === 1 ? "editorial" : n === 2 ? "ramp" : "terminal"}
          </Link>
        ))}
      </div>
    </div>
  )
}
