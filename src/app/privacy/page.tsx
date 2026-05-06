import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { MapPin, FileLock, ShieldCheck, Mail } from "lucide-react"

const FIELD = "#FFFFFF"
const SOFT_FIELD = "#F7F7F2"
const BONE = "#DDD8C8"
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const ACCENT = "#0F3D2E"

const sections = [
  {
    icon: MapPin,
    title: "Where your data lives",
    body: "All pitch decks, assessments, and account data are stored on servers located in the European Union. Nothing transfers outside the EU at any point in the processing pipeline. Our hosting provider, compute providers, and storage providers are all located in Europe and contractually committed to remain so.",
  },
  {
    icon: FileLock,
    title: "What we do with your data",
    body: "Your submitted material is used for one purpose: generating your assessment. It is not used to train any public model, ours or a third party's. It is not shared with other customers, portfolio companies, or outside parties. We retain it for the minimum period required to deliver the service, which you can shorten in your account settings.",
  },
  {
    icon: ShieldCheck,
    title: "Your rights",
    body: "You have the right to access the data we hold on you, request its correction, request its deletion, and export it in a portable format. Requests are honoured within thirty days. To exercise any of these rights, email our data protection officer at the address below — no legal proceedings required, we'd rather just handle it.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — light field */}
        <section className="relative pt-16 md:pt-24 pb-16">
          <div className="mx-auto max-w-[900px] px-6 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              GDPR &amp; data privacy
            </p>
            <h1
              className="mt-5 font-bold leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: "clamp(40px, 6.5vw, 80px)" }}
            >
              Built in Europe.{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                Hosted in Europe.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] md:text-[17px] leading-[1.6]" style={{ color: SUBINK }}>
              Sam is built for European investors, on European infrastructure. This page explains
              where your data lives, what we do with it, and what rights you have over it. No
              legalese, no hedging.
            </p>
          </div>
        </section>

        {/* Sections — three cards on soft field */}
        <section
          className="py-24 md:py-28 border-y"
          style={{ borderColor: RULE, background: SOFT_FIELD }}
        >
          <div className="mx-auto max-w-[900px] px-6 space-y-5">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <article
                  key={s.title}
                  className="rounded-3xl bg-white p-7 md:p-8"
                  style={{ border: `1px solid ${RULE}` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{ background: SOFT_FIELD, border: `1px solid ${RULE}` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-[18px] md:text-[20px] tracking-[-0.01em]">
                        {s.title}
                      </h2>
                      <p className="mt-3 text-[14.5px] md:text-[15px] leading-[1.65]" style={{ color: SUBINK }}>
                        {s.body}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Contact — bone band */}
        <section className="py-20 md:py-24" style={{ background: BONE }}>
          <div className="mx-auto max-w-[900px] px-6 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              Contact
            </p>
            <h2
              className="mt-3 font-bold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Privacy questions or requests?{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                Email us.
              </span>
            </h2>
            <a
              href="mailto:privacy@sam.ai"
              className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition hover:scale-[1.02]"
              style={{ background: INK, color: "#FFF" }}
            >
              <Mail className="h-3.5 w-3.5" />
              privacy@sam.ai
            </a>
            <p className="mt-4 text-[13px]" style={{ color: SUBINK }}>
              Response time: five business days or fewer.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
