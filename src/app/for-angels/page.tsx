import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

const bullets = [
  "Defensible verdicts on every deck, not reactions",
  "A searchable record of every evaluation you've made",
  "First-call prep without the weekend homework",
]

export default function ForAnglesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">For angels</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold font-heading tracking-tight">
              You&apos;re the analyst.
              <br />
              <span className="text-muted-foreground">Sam is the second opinion.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Fifty decks a month, no associate, no framework. Sam gives you a structured memo on every deck you want to evaluate — before you take the first call.
            </p>
          </div>
        </section>

        {/* Problem + Solution */}
        <section className="py-20 bg-muted/20 border-b">
          <div className="mx-auto max-w-3xl px-4 space-y-10">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">The problem</h2>
              <p className="mt-3 text-base md:text-lg text-muted-foreground">
                Angel investing is a solo sport. The deck volume keeps increasing. The tools don&apos;t. You pass on a deal in March, and by September you can&apos;t remember whether it was because of the team, the market, or the terms. Your memory is not a filing system.
              </p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">How Sam helps</h2>
              <p className="mt-3 text-base md:text-lg text-muted-foreground">
                Sam writes the memo you would have written if you had time. Every deck you upload comes back with a scored verdict, red flags, and a structured thesis — in under five minutes. Months later, you can pull up deal nineteen and know exactly why you walked away.
              </p>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight text-center">
              What changes on your desk.
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
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
              €49 per month. Fifteen memos.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cancel anytime. Servers in the EU. No model training on your data.
            </p>
            <Link href="/register?tier=starter" className={buttonVariants({ size: "lg", className: "mt-6 text-base px-8" })}>
              Start with a deck
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
