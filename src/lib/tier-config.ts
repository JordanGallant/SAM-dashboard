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

export const TIER_CONFIG: Record<Tier, TierLimits> = {
  starter: {
    label: "Starter",
    price: 49,
    dealsPerMonth: 5,
    docsPerDeal: 1,
    fundFit: false,
    wordExport: false,
    emailSummary: 3,
    users: 1,
    priorityProcessing: false,
    twoFactorRequired: false,
  },
  professional: {
    label: "Professional",
    price: 149,
    dealsPerMonth: 25,
    docsPerDeal: 6,
    fundFit: true,
    wordExport: true,
    emailSummary: -1,
    users: 1,
    priorityProcessing: false,
    twoFactorRequired: false,
  },
  fund: {
    label: "Fund",
    price: 399,
    dealsPerMonth: -1,
    docsPerDeal: -1,
    fundFit: true,
    wordExport: true,
    emailSummary: -1,
    users: 5,
    priorityProcessing: true,
    twoFactorRequired: true,
  },
}

export const TIER_PRICE_ENV: Record<Tier, string> = {
  starter: "STRIPE_STARTER_PRICE_ID",
  professional: "STRIPE_PROFESSIONAL_PRICE_ID",
  fund: "STRIPE_FUND_PRICE_ID",
}
