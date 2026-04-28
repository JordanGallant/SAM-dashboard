"use client"

import type { FindingItem } from "@/lib/types/analysis"
import { TrendingUp, TriangleAlert } from "lucide-react"

export function FindingsBalance({
  strengths,
  risks,
}: {
  strengths: FindingItem[]
  risks: FindingItem[]
}) {
  const strengthsBySeverity = groupBySeverity(strengths)
  const risksBySeverity = groupBySeverity(risks)
  const total = strengths.length + risks.length || 1
  const strengthPct = (strengths.length / total) * 100
  const riskPct = (risks.length / total) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Strengths
          </span>
          <span className="text-base font-mono font-bold text-emerald-700 tabular-nums">
            {strengths.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-mono font-bold text-red-700 tabular-nums">
            {risks.length}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Risks
          </span>
          <TriangleAlert className="h-3.5 w-3.5 text-red-600" />
        </div>
      </div>

      {/* Proportion bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-[#0F3D2E]/5">
        <div className="bg-emerald-500 transition-all" style={{ width: `${strengthPct}%` }} />
        <div className="bg-red-500 transition-all" style={{ width: `${riskPct}%` }} />
      </div>

      {/* Severity breakdown */}
      <div className="grid grid-cols-2 gap-5 text-[11px] font-mono">
        <SeverityBreakdown kind="strengths" groups={strengthsBySeverity} />
        <SeverityBreakdown kind="risks" groups={risksBySeverity} />
      </div>
    </div>
  )
}

function groupBySeverity(items: FindingItem[]) {
  const groups: Record<string, number> = { Critical: 0, Major: 0, Minor: 0, Info: 0 }
  for (const it of items) {
    const key = it.severity ?? "Info"
    groups[key] = (groups[key] ?? 0) + 1
  }
  return groups
}

function SeverityBreakdown({ kind, groups }: { kind: "strengths" | "risks"; groups: Record<string, number> }) {
  const severities: { key: string; label: string }[] = [
    { key: "Critical", label: "Critical" },
    { key: "Major", label: "Major" },
    { key: "Minor", label: "Minor" },
    { key: "Info", label: "Info" },
  ]
  const color = kind === "strengths" ? "bg-emerald-500" : "bg-red-500"
  return (
    <div className="space-y-1.5">
      {severities.map(({ key, label }) => {
        const count = groups[key] ?? 0
        if (count === 0) return null
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-12 text-muted-foreground uppercase tracking-widest">{label}</span>
            <div className="flex-1 h-1 rounded-full bg-[#0F3D2E]/5 overflow-hidden">
              <div className={color} style={{ width: `${Math.min(100, count * 20)}%`, height: "100%" }} />
            </div>
            <span className="w-4 text-right tabular-nums font-bold text-[#0A2E22]">{count}</span>
          </div>
        )
      })}
    </div>
  )
}
