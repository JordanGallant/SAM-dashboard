"use client"

import { cn } from "@/lib/utils"

function getColor(pct: number) {
  if (pct >= 70) return "bg-emerald-500"
  if (pct >= 40) return "bg-amber-500"
  return "bg-red-500"
}

export function DataCompleteness({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground shrink-0">
        Data completeness
      </span>
      <div className="relative flex h-1.5 w-full flex-1 items-center overflow-hidden rounded-full bg-[#0F3D2E]/10">
        <div
          className={cn("h-full rounded-full transition-all", getColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono font-semibold tabular-nums w-10 text-right text-[#0A2E22]">
        {percentage}%
      </span>
    </div>
  )
}
