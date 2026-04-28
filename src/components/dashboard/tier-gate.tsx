"use client"

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
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

  const label = requiredTier === "professional" ? "Pro" : "Fund"

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E22] via-[#0F3D2E] to-[#1A6B47] text-white py-14 px-6 text-center shadow-xl shadow-[#0F3D2E]/20">
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#D4FF6B]/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative inline-flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4FF6B]/15 ring-1 ring-[#D4FF6B]/30 mb-4">
          <Lock className="h-5 w-5 text-[#D4FF6B]" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#D4FF6B] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A2E22] shadow-md shadow-[#D4FF6B]/30 mb-3">
          {label} plan
        </span>
        <h3 className="font-heading font-bold text-xl md:text-2xl text-white tracking-[-0.02em]">
          {feature}
        </h3>
        <p className="mt-2 text-sm text-white/65 max-w-sm leading-relaxed">
          Available on the {label} plan and above.
        </p>
        <Link
          href="/settings/billing"
          className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#0A2E22] px-5 py-2.5 text-xs font-semibold shadow-md shadow-[#D4FF6B]/25 hover:shadow-lg transition-all"
        >
          Upgrade plan
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
