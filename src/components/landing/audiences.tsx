import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, User, Network, Building2 } from "lucide-react"

const audiences = [
  {
    icon: User,
    label: "For angels",
    stat: "1 user · deck only",
    body: "You see fifty decks a month and meet with five. Sam gives you a structured second opinion before the first call. Six months later, you can still explain why you passed.",
    href: "/for-angels",
  },
  {
    icon: Network,
    label: "For syndicates and scouts",
    stat: "1 user · supporting docs",
    body: "Your deal notes live across three tools and two heads. Sam produces a consistent memo per deal that your syndicate partners can actually compare and reference.",
    href: "/#pricing",
  },
  {
    icon: Building2,
    label: "For VC funds",
    stat: "5 seats · shared library",
    body: "First-screening capacity is the bottleneck in every fund. Sam handles the triage layer so your analysts spend their time on the deals that matter, not on the ones they'll pass.",
    href: "/for-vc-funds",
  },
]

export function Audiences() {
  return (
    <section className="py-24 border-t">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">Who it's for</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Different roles. Same framework.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((a) => {
            const Icon = a.icon
            return (
              <Card key={a.label}>
                <CardContent className="pt-6 space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{a.stat}</p>
                  </div>
                  <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-amber-600">{a.label}</p>
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{a.body}</p>
                  <Link href={a.href} className="text-sm font-medium text-primary hover:underline flex items-center gap-1 pt-2 border-t">
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
