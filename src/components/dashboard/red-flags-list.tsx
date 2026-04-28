import { SeverityBadge } from "./severity-badge"
import { AlertTriangle } from "lucide-react"
import type { FindingItem } from "@/lib/types/analysis"

export function RedFlagsList({ items }: { items: FindingItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="relative rounded-3xl border border-red-200 bg-gradient-to-br from-red-50/50 via-white to-white p-6 md:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-700/80">
            Attention
          </p>
          <p className="text-base font-heading font-bold text-[#0A2E22]">Red flags</p>
        </div>
        <span className="ml-auto text-sm font-mono font-bold text-red-700 tabular-nums">
          {items.length}
        </span>
      </div>
      <ol className="space-y-4">
        {items.map((item) => (
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
  )
}
