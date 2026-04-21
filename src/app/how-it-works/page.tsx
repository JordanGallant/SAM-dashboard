import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Gauge, FileText, Scale, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Submit the deck",
    body: "Upload a PDF, or forward the deck to your Sam intake address. Supporting documents — founder memos, data-room exports, financial models — can be attached alongside.",
  },
  {
    icon: Gauge,
    title: "Framework analysis across five domains",
    body: "Sam evaluates the deck across Team, Market, Product, Traction, and Financials. Each domain applies the same scoring rubric with stage-aware weights, so a pre-seed deck is judged on pre-seed criteria.",
  },
  {
    icon: FileText,
    title: "Structured memo delivered",
    body: "The memo arrives in your account — executive summary on page one, full analysis below. PDF export is available. Shareable link if your team works across accounts.",
  },
  {
    icon: Scale,
    title: "Compare, track, decide",
    body: "Every memo follows the same structure. Compare deal twelve to deal two. Reference the thesis you wrote six months ago. Walk into your IC with evidence, not impressions.",
  },
]

const domains = [
  {
    name: "Team",
    body: "Sam evaluates founder backgrounds, complementarity, domain expertise, and execution signals. It scrapes LinkedIn and public sources for prior roles, identifies gaps in team composition, and flags founder-market fit with specifics — not \"strong team\", but \"two-thirds of the team has domain tenure, the commercial lead does not.\"",
  },
  {
    name: "Market",
    body: "TAM, SAM, and SOM are validated against independent sources — not accepted as stated. Sam identifies the competitive landscape, maps direct and adjacent players, and assesses market timing. The output includes a \"why now\" verdict, flagged if the thesis depends on a trend that may have already passed.",
  },
  {
    name: "Product",
    body: "Sam runs the 10x test: is this a meaningful improvement on the current state, or a marginal one? Product-market fit signals are weighted — early revenue, retention curves, pilot-to-paid conversion. Moat assessment looks for defensibility: network effects, data advantage, technical depth, or distribution.",
  },
  {
    name: "Traction",
    body: "Revenue figures are cross-checked against deck claims. Unit economics — CAC, LTV, payback — are calculated where data is available. Retention and capital efficiency are evaluated against stage-appropriate benchmarks. If the numbers don't reconcile, Sam flags it.",
  },
  {
    name: "Financials",
    body: "Sam reviews the deal structure, use of funds, prior round terms, and investor signals. Valuation is benchmarked against comparable recent rounds. Deal terms are scrutinised for anomalies — unusual liquidation preferences, unrealistic multiples, aggressive dilution.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
              From deck to decision, in four steps.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Sam processes pitch decks through a fixed evaluation pipeline. Every deck follows the same path. Every memo has the same structure.
            </p>
          </div>
        </section>

        {/* 4 steps */}
        <section className="py-20 bg-muted/20 border-b">
          <div className="mx-auto max-w-4xl px-4">
            <ol className="space-y-6">
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <li key={s.title}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex gap-4 md:gap-6">
                          <div className="flex flex-col items-center gap-2 shrink-0">
                            <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-lg">{s.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* Framework */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-center">
              The framework is the product.
            </h2>
            <div className="mt-8 space-y-4 text-base md:text-lg text-muted-foreground">
              <p>
                Sam&apos;s output quality is not a function of the model. It is a function of the framework applied to the model. The framework itself draws from academic research in founder-market fit, early-stage venture returns, and unit economics at each investment stage.
              </p>
              <p>
                Each domain has a weighted scoring rubric that adjusts for stage — a pre-seed deck is not judged against Series A traction standards. Red flags are classified by severity, not volume. The output would remain consistent even if the underlying model changed.
              </p>
              <p className="font-medium text-foreground">
                That is the point: the framework stays constant, so your memos stay comparable.
              </p>
            </div>
          </div>
        </section>

        {/* Domain deep-dives */}
        <section className="py-24 bg-muted/20 border-b">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
                Five domains, scored 0 – 100.
              </h2>
              <p className="mt-3 text-muted-foreground">
                What Sam looks at in each part of your deck.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {domains.map((d, i) => (
                <Card key={d.name}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                      <h3 className="font-heading font-semibold text-lg">{d.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
              See what a Sam memo looks like.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Upload a deck, get a memo. No onboarding call required.
            </p>
            <Link href="/register?tier=professional" className={buttonVariants({ size: "lg", className: "mt-6 text-base px-8" })}>
              Analyse a deck
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
