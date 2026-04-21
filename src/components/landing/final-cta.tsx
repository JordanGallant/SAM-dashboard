import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-24 border-t bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
          Your next deck is on its way.
        </h2>
        <p className="mt-3 text-muted-foreground">
          No integrations, no onboarding call. Upload a deck, get a memo.
        </p>
        <div className="mt-8">
          <Link href="/register?tier=professional" className={buttonVariants({ size: "lg", className: "text-base px-8" })}>
            Analyse a deck
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
