"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { useTier } from "@/lib/tier-context"

interface TierGateProps {
  feature: string
  requiredTier: "professional" | "fund"
  children: React.ReactNode
}

export function TierGate({ feature, requiredTier, children }: TierGateProps) {
  const { tier } = useTier()

  const tierOrder = { starter: 0, professional: 1, fund: 2 }
  const hasAccess = tierOrder[tier] >= tierOrder[requiredTier]

  if (hasAccess) return <>{children}</>

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 border border-amber-200 mb-3">
          <Lock className="h-4 w-4 text-amber-700" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-1">
          {requiredTier === "professional" ? "Pro plan" : "Fund plan"}
        </p>
        <h3 className="font-heading font-semibold text-sm">{feature}</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          This feature is available on the {requiredTier === "professional" ? "Professional" : "Fund"} plan and above.
        </p>
        <Link href="/settings/billing" className={buttonVariants({ size: "sm", className: "mt-4 bg-amber-600 hover:bg-amber-700 text-white" })}>
          Upgrade plan
        </Link>
      </CardContent>
    </Card>
  )
}
