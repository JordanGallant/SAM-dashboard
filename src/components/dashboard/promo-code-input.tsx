"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, Tag } from "lucide-react"
import type { Tier } from "@/lib/types/user"

interface PromoCodeInputProps {
  defaultTier?: Tier
}

export function PromoCodeInput({ defaultTier = "professional" }: PromoCodeInputProps) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState("")

  async function handleApply() {
    if (!code.trim()) return
    setApplying(true)
    setError("")

    try {
      const res = await fetch("/api/auth/apply-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), tier: defaultTier }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid promo code")
        setApplying(false)
        return
      }

      setApplied(true)
      setTimeout(() => {
        router.push("/setup")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
      setApplying(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Promo code</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Redeem an invitation code to start a free trial instead of paying.
        </p>
        {applied ? (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
            <Check className="h-4 w-4" />
            Trial activated. Taking you to setup...
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="promo" className="sr-only">Promo code</Label>
                <Input
                  id="promo"
                  placeholder="e.g. FOUNDER90"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="font-mono"
                  autoComplete="off"
                />
              </div>
              <Button
                onClick={handleApply}
                disabled={!code || applying}
                className="bg-primary hover:bg-primary text-white"
              >
                {applying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Apply
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
