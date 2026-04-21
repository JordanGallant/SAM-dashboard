import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Framework } from "@/components/landing/framework"
import { Comparison } from "@/components/landing/comparison"
import { Audiences } from "@/components/landing/audiences"
import { Trust } from "@/components/landing/trust"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { CookieBanner } from "@/components/landing/cookie-banner"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Framework />
        <Comparison />
        <Audiences />
        <Trust />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
