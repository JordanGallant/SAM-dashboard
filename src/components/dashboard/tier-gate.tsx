"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-sm">{feature}</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          This feature is available on the {requiredTier === "professional" ? "Professional" : "Fund"} plan and above.
        </p>
        <Badge variant="secondary" className="mt-2 mb-3">
          {requiredTier === "professional" ? "Pro+" : "Fund"}
        </Badge>
        <Link href="/settings/billing" className={buttonVariants({ size: "sm" })}>
          Upgrade Plan
        </Link>
      </CardContent>
    </Card>
  )
}
