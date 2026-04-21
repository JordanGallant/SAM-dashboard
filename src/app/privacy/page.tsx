import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, FileLock, ShieldCheck, Mail } from "lucide-react"

const sections = [
  {
    icon: MapPin,
    title: "Where your data lives",
    body: "All pitch decks, analyses, and account data are stored on servers located in the European Union. Nothing transfers outside the EU at any point in the processing pipeline. Our hosting provider, compute providers, and storage providers are all located in Europe and contractually committed to remain so.",
  },
  {
    icon: FileLock,
    title: "What we do with your data",
    body: "Your submitted material is used for one purpose: generating your memo. It is not used to train any model, ours or a third party's. It is not shared with other customers, portfolio companies, or outside parties. We retain it for the minimum period required to deliver the service, which you can shorten in your account settings.",
  },
  {
    icon: ShieldCheck,
    title: "Your rights",
    body: "You have the right to access the data we hold on you, request its correction, request its deletion, and export it in a portable format. Requests are honoured within thirty days. To exercise any of these rights, email our data protection officer at the address below — no legal proceedings required, we'd rather just handle it.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 border-b">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">GDPR &amp; data privacy</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold font-heading tracking-tight">
              Built in Europe. Hosted in Europe.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Sam is built for European investors, on European infrastructure. This page explains where your data lives, what we do with it, and what rights you have over it. No legalese, no hedging.
            </p>
          </div>
        </section>

        {/* Sections */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 space-y-6">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-heading font-semibold text-lg">{s.title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Contact */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-lg">Who to contact</h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      For data protection questions or requests, contact our DPO at{" "}
                      <a href="mailto:privacy@sam.ai" className="text-primary hover:underline font-medium">
                        privacy@sam.ai
                      </a>
                      . Response time: five business days or fewer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
