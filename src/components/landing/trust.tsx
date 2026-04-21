import { Shield, MapPin, Lock, UserCheck } from "lucide-react"

const pillars = [
  { icon: MapPin, label: "EU servers only", desc: "Processing and storage within the European Union." },
  { icon: Shield, label: "GDPR by design", desc: "Not a compliance checkbox — an architectural decision." },
  { icon: Lock, label: "No model training", desc: "Your submitted material is never used to train any model." },
  { icon: UserCheck, label: "Built by investors", desc: "Framework designed by people who have evaluated deals for a living." },
]

export function Trust() {
  return (
    <section className="py-24 border-t bg-muted/20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Where your data lives, and who sees it.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sam runs on European servers. Your pitch decks are processed there, stored there, and deleted on your schedule. No submitted material is used to train any model, ours or anyone else&apos;s. The framework was designed by people who have evaluated early-stage companies for a living — not by people who studied the problem from a distance.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.label} className="rounded-lg border bg-card p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="font-heading font-semibold text-sm">{p.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
