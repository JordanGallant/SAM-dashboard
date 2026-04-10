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
      <span className="text-sm text-muted-foreground shrink-0">Data Completeness</span>
      <div className="relative flex h-2 w-full flex-1 items-center overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", getColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums w-10 text-right">{percentage}%</span>
    </div>
  )
}
