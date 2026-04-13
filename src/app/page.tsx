import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
