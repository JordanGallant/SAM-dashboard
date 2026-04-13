export type Tier = "starter" | "professional" | "fund"

export interface UserProfile {
  id: string
  email: string
  fullName: string
  tier: Tier
  trialEndsAt: string | null
  stripeCustomerId: string | null
  twoFactorEnabled: boolean
  createdAt: string
}
