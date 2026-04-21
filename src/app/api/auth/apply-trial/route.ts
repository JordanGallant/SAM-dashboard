import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createSbClient } from "@supabase/supabase-js"
import type { Tier } from "@/lib/types/user"

// Portal-side promo codes — no Stripe involvement.
// Redeeming one grants a dashboard trial with no card required.
const TRIAL_CODES: Record<string, { days: number; maxTier: Tier }> = {
  FOUNDER90: { days: 14, maxTier: "professional" },
}

export const VALID_CODES = Object.keys(TRIAL_CODES)

export async function POST(request: Request) {
  try {
    const { code, tier } = (await request.json()) as { code: string; tier: Tier }

    const normalized = code?.trim().toUpperCase()
    const trial = TRIAL_CODES[normalized]

    if (!trial) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Enforce max tier allowed by code
    const tierOrder: Record<Tier, number> = { starter: 0, professional: 1, fund: 2 }
    const grantedTier: Tier =
      tierOrder[tier] <= tierOrder[trial.maxTier] ? tier : trial.maxTier

    // Use admin client to update profile (bypasses RLS for initial setup)
    const admin = createSbClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const trialEnd = new Date(Date.now() + trial.days * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await admin
      .from("profiles")
      .update({
        tier: grantedTier,
        subscription_status: "trial",
        trial_ends_at: trialEnd,
        pending_tier: null,
      })
      .eq("id", user.id)

    if (error) {
      console.error("Apply trial error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tier: grantedTier,
      trialEndsAt: trialEnd,
      daysGranted: trial.days,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// Client-side validation (doesn't apply, just checks)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")?.trim().toUpperCase()
  if (!code) return NextResponse.json({ valid: false })
  const trial = TRIAL_CODES[code]
  if (!trial) return NextResponse.json({ valid: false })
  return NextResponse.json({
    valid: true,
    days: trial.days,
    maxTier: trial.maxTier,
  })
}
