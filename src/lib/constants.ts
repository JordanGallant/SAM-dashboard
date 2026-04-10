export const VERDICT_COLORS = {
  "Strong Buy": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  Explore: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  "Conditional Pass": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  Pass: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
} as const

export const DOMAIN_VERDICT_COLORS = {
  Strong: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Moderate: { bg: "bg-amber-100", text: "text-amber-700" },
  Weak: { bg: "bg-red-100", text: "text-red-700" },
  "Insufficient Data": { bg: "bg-gray-100", text: "text-gray-500" },
} as const

export const SEVERITY_COLORS = {
  Critical: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  Warning: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  Info: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
} as const

export const THREAT_COLORS = {
  "Very High": { bg: "bg-red-100", text: "text-red-700" },
  High: { bg: "bg-orange-100", text: "text-orange-700" },
  Medium: { bg: "bg-amber-100", text: "text-amber-700" },
  Low: { bg: "bg-green-100", text: "text-green-700" },
} as const

export function getScoreColor(score: number) {
  if (score >= 70) return { bg: "bg-emerald-100", text: "text-emerald-700" }
  if (score >= 40) return { bg: "bg-amber-100", text: "text-amber-700" }
  return { bg: "bg-red-100", text: "text-red-700" }
}

export function getCompletenessColor(pct: number) {
  if (pct >= 70) return "bg-emerald-500"
  if (pct >= 40) return "bg-amber-500"
  return "bg-red-500"
}

export const PIPELINE_STAGES = ["New", "Reviewing", "First Call", "DD", "Passed", "Invested"] as const
export const DEAL_STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"] as const
export const SECTORS = ["SaaS", "Fintech", "DeepTech", "HealthTech", "CleanTech", "PropTech", "EdTech", "Other"] as const
export const GEOS = ["Netherlands", "DACH", "Nordics", "UK", "US", "Europe", "Global"] as const

export const STAGE_BADGE_COLORS: Record<string, string> = {
  "Pre-seed": "bg-violet-100 text-violet-700",
  Seed: "bg-sky-100 text-sky-700",
  "Series A": "bg-indigo-100 text-indigo-700",
  "Series B+": "bg-purple-100 text-purple-700",
}

export const STATUS_BADGE_COLORS: Record<string, string> = {
  New: "bg-gray-100 text-gray-700",
  Reviewing: "bg-blue-100 text-blue-700",
  "First Call": "bg-cyan-100 text-cyan-700",
  DD: "bg-amber-100 text-amber-700",
  Passed: "bg-red-100 text-red-700",
  Invested: "bg-emerald-100 text-emerald-700",
}

export const ANALYSIS_TABS = [
  { key: "summary", label: "Executive Summary" },
  { key: "team", label: "Team" },
  { key: "market", label: "Market" },
  { key: "product", label: "Product" },
  { key: "traction", label: "Traction" },
  { key: "finance", label: "Finance" },
  { key: "exit", label: "Exit Potential" },
  { key: "fund-fit", label: "Fund Fit" },
  { key: "missing-info", label: "Missing Info" },
] as const
