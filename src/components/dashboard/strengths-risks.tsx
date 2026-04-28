import { SeverityBadge } from "./severity-badge"
import type { FindingItem } from "@/lib/types/analysis"
import { ShieldCheck, AlertTriangle } from "lucide-react"

export function StrengthsRisks({ strengths, risks }: { strengths: FindingItem[]; risks: FindingItem[] }) {
  return (
    <div className="grid gap-4 md:gap-5 md:grid-cols-2">
      {/* Strengths card */}
      <div className="rounded-3xl border border-[#0F3D2E]/10 bg-white p-6 md:p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#0F3D2E]/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Findings
            </p>
            <p className="text-base font-heading font-bold text-[#0A2E22]">Key strengths</p>
          </div>
          <span className="ml-auto text-sm font-mono font-bold text-emerald-700 tabular-nums">
            {strengths.length}
          </span>
        </div>
        <ol className="space-y-4">
          {strengths.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-mono font-bold text-emerald-700 tabular-nums">
                {item.id}
              </span>
              <div className="flex-1 space-y-1.5">
                <SeverityBadge severity={item.severity} />
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Risks card */}
      <div className="rounded-3xl border border-[#0F3D2E]/10 bg-white p-6 md:p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#0F3D2E]/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Findings
            </p>
            <p className="text-base font-heading font-bold text-[#0A2E22]">Key risks</p>
          </div>
          <span className="ml-auto text-sm font-mono font-bold text-red-700 tabular-nums">
            {risks.length}
          </span>
        </div>
        <ol className="space-y-4">
          {risks.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-[10px] font-mono font-bold text-red-700 tabular-nums">
                {item.id}
              </span>
              <div className="flex-1 space-y-1.5">
                <SeverityBadge severity={item.severity} />
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
