// User-facing labels for the four investment verdicts.
//
// We keep the internal Verdict type as "Strong Buy" / "Explore" / "Conditional
// Pass" / "Deny" so nothing else has to move (colour maps, n8n mapping,
// constants, types). Compliance flagged "STRONG BUY" / "DENY" as advice-coded
// language; these labels are deliberately neutral and process-oriented.
//
// Use VERDICT_DISPLAY[v] (or verdictLabel(v)) wherever the value is rendered.

import type { Verdict } from "./types/analysis"

export const VERDICT_DISPLAY: Record<Verdict, string> = {
  "Strong Buy": "Proceed to IC",
  Explore: "Investigate Further",
  "Conditional Pass": "Pass with Conditions",
  Deny: "Decline",
}

export function verdictLabel(v: Verdict | string | undefined | null): string {
  if (!v) return ""
  return (VERDICT_DISPLAY as Record<string, string>)[v] ?? String(v)
}
