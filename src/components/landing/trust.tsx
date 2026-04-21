import { Shield, MapPin, Lock, UserCheck } from "lucide-react"

const pillars = [
  { icon: MapPin, label: "EU servers only", desc: "Processing and storage within the European Union." },
  { icon: Shield, label: "GDPR by design", desc: "Architectural decision, not a compliance checkbox." },
  { icon: Lock, label: "No model training", desc: "Your submitted material is never used to train any model." },
  { icon: UserCheck, label: "Built by investors", desc: "Framework designed by people who have evaluated deals for a living." },
]

export function Trust() {
  return (
    <section className="py-24 border-t bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text + EU badge */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-amber-100 border border-amber-200 px-2.5 py-1 mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700">EU</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700">data sovereignty</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
              Where your data lives,
              <br />
              <span className="text-muted-foreground">and who sees it.</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Sam runs on European servers. Your pitch decks are processed there, stored there, and deleted on your schedule. No submitted material is used to train any model — ours, or anyone else&apos;s.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The framework was designed by people who have evaluated early-stage companies for a living — not by people who studied the problem from a distance.
            </p>
          </div>

          {/* Right: pillar grid */}
          <div className="grid grid-cols-2 gap-3">
            {pillars.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.label} className="rounded-lg border bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 mb-3">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-heading font-semibold text-xs">{p.label}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
