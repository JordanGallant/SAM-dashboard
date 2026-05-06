import type { Tier } from "./types/user"

export interface TierLimits {
  label: string
  price: number
  dealsPerMonth: number
  docsPerDeal: number
  fundFit: boolean
  wordExport: boolean
  emailSummary: number
  users: number
  priorityProcessing: boolean
  twoFactorRequired: boolean
}

// Pricing aligned to client design briefing v4 (May 2026):
//   Angel €149 / 10 analyses / 1 seat
//   Pro   €299 / 30 analyses / 3 seats
//   Fund  Custom / custom volume / custom seats
// `price: 0` on Fund signals custom-priced; UI renders "Custom".
export const TIER_CONFIG: Record<Tier, TierLimits> = {
  starter: {
    label: "Angel",
    price: 149,
    dealsPerMonth: 10,
    docsPerDeal: 3,
    fundFit: false,
    wordExport: true,
    emailSummary: -1,
    users: 1,
    priorityProcessing: false,
    twoFactorRequired: false,
  },
  professional: {
    label: "Pro",
    price: 299,
    dealsPerMonth: 30,
    docsPerDeal: 6,
    fundFit: true,
    wordExport: true,
    emailSummary: -1,
    users: 3,
    priorityProcessing: false,
    twoFactorRequired: true,
  },
  fund: {
    label: "Fund",
    price: 0,
    dealsPerMonth: -1,
    docsPerDeal: -1,
    fundFit: true,
    wordExport: true,
    emailSummary: -1,
    users: -1,
    priorityProcessing: true,
    twoFactorRequired: true,
  },
}

export const TIER_PRICE_ENV: Record<Tier, string> = {
  starter: "STRIPE_STARTER_PRICE_ID",
  professional: "STRIPE_PROFESSIONAL_PRICE_ID",
  fund: "STRIPE_FUND_PRICE_ID",
}
