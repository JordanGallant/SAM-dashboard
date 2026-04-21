import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

const bullets = [
  "IC-ready memos your partners can actually compare",
  "Framework consistency across every deal, every analyst",
  "Shared memo library so institutional knowledge stays institutional",
]

export default function ForVCFundsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">For VC funds</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold font-heading tracking-tight">
              First-screening capacity is your bottleneck.
              <br />
              <span className="text-muted-foreground">Sam handles it.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Your analysts&apos; time is the most expensive input in your fund. Sam runs the structured first pass on every deck that enters your inbox, so your team spends their hours on the deals that move to IC.
            </p>
          </div>
        </section>

        {/* Problem + Solution */}
        <section className="py-20 bg-muted/20 border-b">
          <div className="mx-auto max-w-3xl px-4 space-y-10">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">The problem</h2>
              <p className="mt-3 text-base md:text-lg text-muted-foreground">
                Analyst time goes to the wrong layer. Most of the decks your team receives get passed on, and the screening time is first-year associate capacity redirected to repetitive work. Worse: every analyst screens slightly differently, so the memos your partners read are not comparable.
              </p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">How Sam helps</h2>
              <p className="mt-3 text-base md:text-lg text-muted-foreground">
                Sam produces a consistent first-pass memo for every deck your team forwards it. Same framework, same structure, same scoring rubric. Your associates spend their time on the deals that warrant deeper work, and your IC reviews a consistent document regardless of who handled intake. The standardisation itself is the product.
              </p>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight text-center">
              What the fund gets.
            </h2>
            <ul className="mt-10 space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-base">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
              Walkthrough with a founder, not a sales rep.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Fund tier is €399 / month for 5 seats. Unlimited memos, shared library, priority processing.
            </p>
            <Link href="/register?tier=fund" className={buttonVariants({ size: "lg", className: "mt-6 text-base px-8" })}>
              Book a fund walkthrough
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
