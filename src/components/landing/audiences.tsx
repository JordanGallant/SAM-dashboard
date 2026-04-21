import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Network, Building2 } from "lucide-react"

const audiences = [
  {
    icon: Users,
    label: "For angels",
    body: "You see fifty decks a month and meet with five. Sam gives you a structured second opinion before the first call. Six months later, you can still explain why you passed.",
    href: "/for-angels",
  },
  {
    icon: Network,
    label: "For syndicates and scouts",
    body: "Your deal notes live across three tools and two heads. Sam produces a consistent memo per deal that your syndicate partners can actually compare and reference.",
    href: "/pricing",
  },
  {
    icon: Building2,
    label: "For VC funds",
    body: "First-screening capacity is the bottleneck in every fund. Sam handles the triage layer so your analysts spend their time on the deals that matter, not on the ones they'll pass.",
    href: "/for-vc-funds",
  },
]

export function Audiences() {
  return (
    <section className="py-24 border-t">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-center">
          Different roles. Same framework.
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-xl mx-auto">
          Sam adapts to how you work — but evaluates every deck the same way.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => {
            const Icon = a.icon
            return (
              <Card key={a.label}>
                <CardContent className="pt-6 space-y-3 h-full flex flex-col">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-heading font-semibold">{a.label}</p>
                  <p className="text-sm text-muted-foreground flex-1">{a.body}</p>
                  <Link href={a.href} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
