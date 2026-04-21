import { Card, CardContent } from "@/components/ui/card"
import { FileText, Gauge, Shield } from "lucide-react"

export function Differentiation() {
  return (
    <section className="py-24 border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Generic AI reshuffles your deck.
            <br />
            <span className="text-primary">Sam evaluates it.</span>
          </h2>
          <div className="mt-8 space-y-4 text-base md:text-lg text-muted-foreground text-left">
            <p>
              Ask a chatbot to analyse a pitch deck and it returns the deck back to you, rephrased. There is no framework, no comparability between deals, no score you can defend in an IC meeting. The output is as inconsistent as the prompts that generated it.
            </p>
            <p>
              Sam applies a structured evaluation framework built on academic research in founder assessment and early-stage financial modelling. Five investment domains. Scored zero to one hundred. Verdicts, not summaries. The framework stays constant — so memo number fifty is comparable to memo number one.
            </p>
          </div>
          <p className="mt-8 text-lg md:text-xl font-semibold text-foreground">
            One deck. One decision. One standard.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">Framework-driven, not prompt-driven</h3>
              <p className="text-sm text-muted-foreground">
                The same five-domain framework evaluates every deck. No prompt engineering, no variance between analysts, no guesswork.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">Scored, not summarised</h3>
              <p className="text-sm text-muted-foreground">
                Every domain receives a verdict with evidence — Team 74, strong founder-market fit, one gap flagged. Not a paragraph. A position you can defend.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">European by design</h3>
              <p className="text-sm text-muted-foreground">
                GDPR-compliant architecture. Your deal data never leaves Europe. Built for funds whose LPs ask where the analysis actually runs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
