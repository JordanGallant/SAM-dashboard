import { X, Check } from "lucide-react"

export function Problem() {
  return (
    <section className="py-24 border-t bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600">The problem</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
            Most decks get ten minutes.
            <br />
            <span className="text-muted-foreground">Good decisions take longer.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* Current state */}
          <div className="rounded-xl border bg-white p-6 md:p-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Current state
            </p>
            <ul className="space-y-3">
              {[
                "Deck opened at 11pm, scanned in 8 minutes",
                "\"Good team — I think?\" scribbled in a notebook",
                "Passed on a deal last March, can't remember why",
                "Every partner screens slightly differently",
                "No memory, no comparability, no defensible verdict",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Sam */}
          <div className="rounded-xl border bg-white p-6 md:p-8 relative">
            <div className="absolute -top-3 left-6 inline-flex items-center rounded-md bg-amber-100 border border-amber-200 px-2 py-0.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-700">With Sam</span>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4 mt-1">
              Same framework, every deck
            </p>
            <ul className="space-y-3">
              {[
                "Memo structured the same way every time",
                "All five domains scored 0 — 100 with evidence",
                "Strengths, risks, and red flags flagged by severity",
                "Searchable record — find deal #19 in two seconds",
                "IC-ready document your partners can compare",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
