import type { Confidence } from "@/lib/types/analysis"

const tones: Record<Confidence, string> = {
  High: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-red-50 text-red-700 ring-red-200",
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest ring-1 ${tones[confidence]}`}
    >
      <span className="opacity-60">Confidence</span>
      <span>·</span>
      {confidence}
    </span>
  )
}
