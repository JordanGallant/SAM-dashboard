import Link from "next/link"
import { ArrowRight, User, Network, Building2, Users, FileText, MessagesSquare, Layers3 } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const audiences = [
  {
    icon: User,
    label: "For angels",
    badge: "Best for solo deal flow",
    cta: "See the Angels workflow",
    workflow: "Solo · deck only",
    bigStat: "50+",
    bigStatLabel: "decks / month",
    workflowIcon: FileText,
    body: "You see fifty decks a month and meet with five. Sam gives you a structured second opinion before the first call. Six months later, you can still explain why you passed.",
    href: "/for-angels",
  },
  {
    icon: Network,
    label: "For syndicates & scouts",
    badge: "Best for shared notes",
    cta: "See the Pro workflow",
    workflow: "Shared notes · supporting docs",
    bigStat: "3–10",
    bigStatLabel: "partners aligned",
    workflowIcon: MessagesSquare,
    body: "Your deal notes live across three tools and two heads. Sam produces a consistent memo per deal that your syndicate partners can actually compare and reference.",
    href: "/#pricing",
    featured: true,
  },
  {
    icon: Building2,
    label: "For VC funds",
    badge: "Best for institutional teams",
    cta: "See the VC workflow",
    workflow: "Team seats · shared library",
    bigStat: "5+",
    bigStatLabel: "analysts · shared memos",
    workflowIcon: Layers3,
    body: "First-screening capacity is the bottleneck in every fund. Sam handles the triage layer so your analysts spend their time on the deals that matter, not on the ones they'll pass.",
    href: "/for-vc-funds",
  },
]

export function Audiences() {
  return (
    <section className="relative py-24 md:py-28 border-t overflow-hidden bg-gradient-to-b from-white via-[#F4FAF6] to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(0,168,107,0.08),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_10%_10%,rgba(212,255,107,0.15),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
            <Users className="h-3 w-3" />
            Who it&apos;s for
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-[-0.025em] leading-[1.02] text-[#0A2E22]">
            Different roles.
            <br />
            <span className="bg-gradient-to-r from-[#0F3D2E] via-[#1A6B47] to-[#00A86B] bg-clip-text text-transparent">
              Same framework.
            </span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            One evaluation layer, three workflows. Pick the one that matches the way you screen deals today.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-5 md:gap-6 md:grid-cols-3" stagger={0.1}>
          {audiences.map((a) => {
            const Icon = a.icon
            const WorkflowIcon = a.workflowIcon
            const featured = a.featured
            return (
              <RevealItem key={a.label}>
                <Link
                  href={a.href}
                  className={`group relative flex flex-col h-full rounded-3xl p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 ${
                    featured
                      ? "bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#1A6B47] text-white shadow-2xl shadow-[#0F3D2E]/30 hover:shadow-[#0F3D2E]/50 md:-translate-y-2 md:scale-[1.02]"
                      : "bg-white border border-[#0F3D2E]/10 shadow-sm hover:border-[#0F3D2E]/25 hover:shadow-xl"
                  }`}
                >
                  {featured && (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#D4FF6B]/20 blur-3xl" />
                      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                      <div className="absolute inset-x-6 top-0 h-0.5 rounded-b-full bg-gradient-to-r from-transparent via-[#D4FF6B] to-transparent" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="relative flex items-start justify-between mb-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        featured
                          ? "bg-[#D4FF6B]/15 ring-1 ring-[#D4FF6B]/30"
                          : "bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/5 ring-1 ring-[#0F3D2E]/10 group-hover:from-[#0F3D2E]/10 group-hover:to-[#00A86B]/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          featured ? "text-[#D4FF6B]" : "text-[#0F3D2E]"
                        }`}
                      />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest shadow-md ${
                        featured
                          ? "bg-[#D4FF6B] text-[#0A2E22] shadow-[#D4FF6B]/30"
                          : "bg-[#0F3D2E]/8 text-[#0F3D2E] shadow-[#0F3D2E]/10 ring-1 ring-[#0F3D2E]/15"
                      }`}
                    >
                      {a.badge}
                    </span>
                  </div>

                  {/* Label */}
                  <p
                    className={`relative text-[11px] font-mono font-semibold uppercase tracking-widest mb-3 ${
                      featured ? "text-[#D4FF6B]/90" : "text-primary"
                    }`}
                  >
                    {a.label}
                  </p>

                  {/* Body */}
                  <p
                    className={`relative text-[14px] leading-relaxed flex-1 mb-6 ${
                      featured ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {a.body}
                  </p>

                  {/* Audience-specific stat (no price!) */}
                  <div
                    className={`relative flex items-center gap-3 mb-5 pb-5 border-b ${
                      featured ? "border-white/10" : "border-[#0F3D2E]/10"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        featured
                          ? "bg-white/5 ring-1 ring-white/10"
                          : "bg-[#0F3D2E]/5 ring-1 ring-[#0F3D2E]/10"
                      }`}
                    >
                      <WorkflowIcon
                        className={`h-4 w-4 ${
                          featured ? "text-[#D4FF6B]" : "text-[#0F3D2E]"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-mono text-xl font-bold leading-tight ${
                          featured
                            ? "bg-gradient-to-br from-white to-[#D4FF6B] bg-clip-text text-transparent"
                            : "text-[#0A2E22]"
                        }`}
                      >
                        {a.bigStat}
                      </p>
                      <p
                        className={`text-[10px] font-mono uppercase tracking-widest ${
                          featured ? "text-white/50" : "text-muted-foreground"
                        }`}
                      >
                        {a.bigStatLabel}
                      </p>
                    </div>
                    <span
                      className={`ml-auto text-[9px] font-mono uppercase tracking-widest ${
                        featured ? "text-white/40" : "text-muted-foreground/70"
                      }`}
                    >
                      {a.workflow}
                    </span>
                  </div>

                  {/* CTA */}
                  <div
                    className={`relative flex items-center justify-between text-sm font-semibold transition-colors ${
                      featured
                        ? "text-[#D4FF6B] group-hover:text-white"
                        : "text-[#0F3D2E] group-hover:text-primary"
                    }`}
                  >
                    <span>{a.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
