"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import type { Tier } from "@/lib/types/user"

function RedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tier = (searchParams.get("tier") as Tier) || "professional"
  const [status, setStatus] = useState<"redirecting" | "error">("redirecting")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function go() {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier }),
        })

        if (res.status === 401) {
          setErrorMessage("Your session expired. Please sign in again.")
          setStatus("error")
          return
        }

        const contentType = res.headers.get("content-type") || ""
        if (!contentType.includes("application/json")) {
          setErrorMessage(`Unexpected response (${res.status}). Please try again.`)
          setStatus("error")
          return
        }

        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
        setErrorMessage(data.error || "Unable to start checkout")
        setStatus("error")
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Network error")
        setStatus("error")
      }
    }
    go()
  }, [tier])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {status === "redirecting" ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <h2 className="text-lg font-semibold">Setting up your subscription</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Redirecting to secure payment...
              </p>
            </>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">{errorMessage}</p>
              <div className="mt-4 flex gap-2">
                <button
                  className={buttonVariants({ variant: "outline" })}
                  onClick={() => router.refresh()}
                >
                  Try again
                </button>
                <Link href="/settings/billing" className={buttonVariants()}>
                  Go to Billing
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutRedirectPage() {
  return (
    <Suspense>
      <RedirectContent />
    </Suspense>
  )
}
