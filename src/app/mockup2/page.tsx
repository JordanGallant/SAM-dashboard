import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Variant 2 — Ramp Operator
// Pure Ramp.com DNA. Stark white, high-contrast black, single electric lime
// accent on primary CTA only. Bold geometric sans throughout. Visible vertical
// grid lines as structural backdrop. No shadows, no gradients, max 6px radius.
// Aggressive whitespace.

const LIME = "#C5E847"
const INK = "#0A0A0A"

export default function Mockup2() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans relative overflow-hidden" style={{ fontFamily: "'Inter Tight', Inter, system-ui, sans-serif" }}>
      <ChooserBar current={2} />

      {/* Vertical grid lines backdrop */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "calc(100%/12) 100%",
        }}
      />

      <div className="relative z-10">
        {/* NAV */}
        <nav className="border-b border-black/15">
          <div className="mx-auto max-w-[1320px] px-10 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-black" />
              <span className="font-bold tracking-[-0.02em] text-[18px]">Sam</span>
            </div>
            <div className="hidden md:flex items-center gap-9 text-[14px] font-medium">
              <a className="text-black/70 hover:text-black">Product</a>
              <a className="text-black/70 hover:text-black">Pricing</a>
              <a className="text-black/70 hover:text-black">Customers</a>
              <a className="text-black/70 hover:text-black">Sign in</a>
              <button
                className="px-4 py-2 border-2 border-black text-[13px] font-bold hover:bg-black hover:text-white transition-colors"
                style={{ borderRadius: "4px" }}
              >
                Get started
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="border-b border-black/15">
          <div className="mx-auto max-w-[1320px] px-10 py-32">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-20 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-black/20 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ borderRadius: "4px" }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME }} />
                  1,000+ memos generated
                </span>

                <h1
                  className="mt-8 font-extrabold tracking-[-0.045em]"
                  style={{
                    fontSize: "clamp(56px, 7.5vw, 104px)",
                    lineHeight: 0.92,
                    fontFamily: "'Inter Tight', Inter, system-ui, sans-serif",
                  }}
                >
                  Time is money.
                  <br />
                  Save both.
                </h1>

                <p className="mt-9 max-w-[42ch] text-[19px] leading-[1.45] text-black/65 font-medium">
                  Structured investment memos, scored across five domains. IC-ready in
                  twelve minutes. Built for VCs and angels who refuse to miss the deal.
                </p>

                <div className="mt-12 flex flex-wrap items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-bold border-2 border-black hover:-translate-y-0.5 transition-transform"
                    style={{ background: LIME, color: INK, borderRadius: "6px" }}
                  >
                    Get started for free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-bold border-2 border-black hover:bg-black hover:text-white transition-colors"
                    style={{ borderRadius: "6px" }}
                  >
                    Book a walkthrough
                  </button>
                </div>

                <div className="mt-10 flex items-center gap-7 text-[12px] font-mono uppercase tracking-[0.12em] text-black/55">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-black" />
                    No card · 14-day trial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-black" />
                    EU-based · GDPR
                  </span>
                </div>
              </div>

              {/* Memo specimen */}
              <div className="border-2 border-black bg-white" style={{ borderRadius: "6px" }}>
                <div className="flex items-center justify-between border-b-2 border-black px-5 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-bold">
                    SAM / VREY MEMO
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.18em] font-extrabold px-2 py-0.5"
                    style={{ background: LIME, color: INK, borderRadius: "3px" }}
                  >
                    Proceed to IC
                  </span>
                </div>
                <div className="p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/55 font-bold">
                    Overall Score
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span
                      className="font-extrabold tabular-nums tracking-[-0.04em] leading-none"
                      style={{ fontSize: "84px", fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      78
                    </span>
                    <span className="text-[20px] font-bold text-black/35">/100</span>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-3 text-[13px] font-medium">
                    {[
                      ["Team", 82, true],
                      ["Market", 71, true],
                      ["Product", 75, true],
                      ["Traction", 80, true],
                      ["Finance", 76, true],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex items-baseline justify-between border-b-2 border-black/10 pb-2">
                        <span className="text-black/65">{k as string}</span>
                        <span className="font-bold tabular-nums">{v as number}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-7 w-full text-center px-4 py-3 border-2 border-black text-[13px] font-bold hover:bg-black hover:text-white transition-colors"
                    style={{ borderRadius: "4px" }}
                  >
                    Read the full memo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAND */}
        <section className="border-b border-black/15">
          <div className="mx-auto max-w-[1320px] grid grid-cols-2 md:grid-cols-4">
            {[
              ["12", "min", "Deck → IC-ready memo"],
              ["5", "domains", "Scored, weighted, audited"],
              ["1,000+", "memos", "Generated to date"],
              ["€250k", "decision", "Average value at stake"],
            ].map(([num, unit, label], i) => (
              <div
                key={i}
                className={`px-8 py-14 ${i > 0 ? "md:border-l border-black/15" : ""} ${i % 2 === 1 ? "border-l border-black/15 md:border-l" : ""}`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold tabular-nums tracking-[-0.04em] leading-none" style={{ fontSize: "60px" }}>
                    {num}
                  </span>
                  <span className="text-[15px] font-bold text-black/45">{unit}</span>
                </div>
                <p className="mt-3 text-[13px] text-black/55 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM / VALUE PROPS */}
        <section className="border-b border-black/15">
          <div className="mx-auto max-w-[1320px] px-10 py-32">
            <div className="max-w-[760px]">
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] font-bold text-black/55">
                Why Sam
              </span>
              <h2 className="mt-5 font-extrabold tracking-[-0.04em] text-[56px] leading-[0.95]">
                Pitch decks lie.
                <br />
                Memos don&apos;t.
              </h2>
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-px border border-black/15 bg-black/15">
              {[
                {
                  k: "01",
                  t: "Read fewer decks",
                  b: "Sam produces a memo in 12 minutes. Read the memo, not the deck. Walk into every founder call already prepared.",
                },
                {
                  k: "02",
                  t: "Score every domain",
                  b: "Team, market, product, traction, finance. Weighted, audited, side-by-side comparable across your entire pipeline.",
                },
                {
                  k: "03",
                  t: "Remember everything",
                  b: "Every memo lands in your archive. Months later, pull up deal nineteen and know exactly why you walked away.",
                },
              ].map((item) => (
                <div key={item.k} className="bg-white p-9">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-bold text-black/40">
                    {item.k}
                  </span>
                  <h3 className="mt-5 font-extrabold tracking-[-0.025em] text-[24px] leading-[1.1]">
                    {item.t}
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.55] text-black/65 font-medium">
                    {item.b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING TEASER */}
        <section>
          <div className="mx-auto max-w-[1320px] px-10 py-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] font-bold text-black/55">
                  Pricing
                </span>
                <h2 className="mt-5 font-extrabold tracking-[-0.04em] text-[48px] leading-[0.95]">
                  Pick a tier.
                  <br />
                  Cancel anytime.
                </h2>
              </div>
              <Link href="/" className="text-[14px] font-bold border-b-2 border-black hover:text-black/60">
                Full pricing →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-px border border-black/15 bg-black/15">
              {[
                { name: "Angel", price: "149", quota: "10 memos/mo · 1 seat", popular: false },
                { name: "Pro", price: "299", quota: "30 memos/mo · 3 seats", popular: true },
                { name: "Fund", price: "Custom", quota: "Unlimited · Unlimited seats", popular: false },
              ].map((t) => (
                <div key={t.name} className="bg-white p-9 relative">
                  {t.popular && (
                    <span
                      className="absolute -top-3 left-9 font-mono text-[10px] uppercase tracking-[0.18em] font-extrabold px-2 py-0.5"
                      style={{ background: LIME, color: INK, borderRadius: "3px" }}
                    >
                      Most popular
                    </span>
                  )}
                  <h3 className="font-extrabold tracking-[-0.025em] text-[26px]">{t.name}</h3>
                  <div className="mt-5 flex items-baseline gap-1">
                    {t.price === "Custom" ? (
                      <span className="font-extrabold tracking-[-0.04em] text-[56px] leading-none">
                        Custom
                      </span>
                    ) : (
                      <>
                        <span className="text-[16px] font-bold text-black/45">€</span>
                        <span className="font-extrabold tabular-nums tracking-[-0.04em] text-[64px] leading-none">
                          {t.price}
                        </span>
                        <span className="text-[14px] font-bold text-black/45 ml-1">/mo</span>
                      </>
                    )}
                  </div>
                  <p className="mt-4 text-[12px] font-mono uppercase tracking-[0.15em] text-black/55 font-bold">
                    {t.quota}
                  </p>
                  <button
                    className="mt-8 w-full px-4 py-3.5 text-[14px] font-bold border-2 border-black hover:-translate-y-0.5 transition-transform"
                    style={{
                      background: t.popular ? LIME : "transparent",
                      borderRadius: "6px",
                    }}
                  >
                    {t.price === "Custom" ? "Book a walkthrough" : "Get started"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-black/15 py-10">
          <div className="mx-auto max-w-[1320px] px-10 flex items-center justify-between text-[12px] font-medium text-black/55">
            <span>© Sam · 2026</span>
            <span>Privacy · Terms · Status</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

function ChooserBar({ current }: { current: number }) {
  return (
    <div className="border-b border-black/15 bg-white text-[11px] font-mono uppercase tracking-[0.15em] relative z-20">
      <div className="mx-auto max-w-[1320px] px-10 py-2 flex items-center gap-5">
        <span className="text-black/45 font-bold">Mockups · pick one</span>
        {[1, 2, 3].map((n) => (
          <Link
            key={n}
            href={`/mockup${n}`}
            className={`px-2 py-0.5 font-bold ${
              n === current ? "bg-black text-white" : "text-black/65 hover:text-black"
            }`}
          >
            {n === 1 ? "Editorial" : n === 2 ? "Ramp Operator" : "Terminal"}
          </Link>
        ))}
      </div>
    </div>
  )
}
