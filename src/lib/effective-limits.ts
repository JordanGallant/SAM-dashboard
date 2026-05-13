import { TIER_CONFIG } from "./tier-config"
import type { Tier } from "./types/user"

// Effective per-fund caps. Override columns on `funds` (added in
// 009_fund_overrides.sql) win over tier defaults when set. This single
// helper is the only place callers should look up "how many seats / memos
// does this fund actually get" — keeps server enforcement, the customer
// UI, and the /admin/limits editor consistent.
export interface EffectiveLimits {
  /** Effective seat cap. -1 = unlimited. */
  seats: number
  /** Effective monthly memo (analysis) cap. -1 = unlimited. */
  memos: number
  seatsOverridden: boolean
  memosOverridden: boolean
}

export function effectiveLimits(opts: {
  tier: Tier
  seatsOverride?: number | null
  memosOverride?: number | null
}): EffectiveLimits {
  const t = TIER_CONFIG[opts.tier]
  const seatsOverridden = typeof opts.seatsOverride === "number" && opts.seatsOverride > 0
  const memosOverridden = typeof opts.memosOverride === "number" && opts.memosOverride > 0
  return {
    seats: seatsOverridden ? (opts.seatsOverride as number) : t.users,
    memos: memosOverridden ? (opts.memosOverride as number) : t.dealsPerMonth,
    seatsOverridden,
    memosOverridden,
  }
}
