"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function SuccessContent() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "active" | "timeout">("loading")

  useEffect(() => {
    const supabase = createClient()
    let attempts = 0
    const maxAttempts = 20 // ~40 seconds

    const interval = setInterval(async () => {
      attempts++
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setStatus("timeout")
        clearInterval(interval)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, tier")
        .eq("id", user.id)
        .single()

      if (profile?.subscription_status === "active" && profile.tier) {
        setStatus("active")
        clearInterval(interval)
        // Wait a moment so user sees the success state
        setTimeout(() => {
          router.push("/setup")
          router.refresh()
        }, 1800)
        return
      }

      if (attempts >= maxAttempts) {
        setStatus("timeout")
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <h2 className="text-lg font-semibold">Confirming payment</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Stripe is processing your subscription. This usually takes a few seconds.
              </p>
            </>
          )}
          {status === "active" && (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold">Welcome to SAM</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Subscription active. Redirecting you to set up your fund profile...
              </p>
            </>
          )}
          {status === "timeout" && (
            <>
              <h2 className="text-lg font-semibold">Taking longer than expected</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Your payment might still be processing. Head to billing to check status.
              </p>
              <Link href="/settings/billing" className={buttonVariants({ className: "mt-4" })}>
                Go to Billing
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
