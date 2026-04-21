import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // If a specific next URL was provided, use it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Otherwise, route based on profile state
      const userId = data.session.user.id
      const { data: profile } = await supabase
        .from("profiles")
        .select("pending_tier, subscription_status, tier")
        .eq("id", userId)
        .maybeSingle()

      // User had a tier selected at signup but hasn't paid yet → send to checkout
      if (profile?.pending_tier && profile.subscription_status === "inactive") {
        return NextResponse.redirect(`${origin}/checkout-redirect?tier=${profile.pending_tier}`)
      }

      // Active/trial user → dashboard
      if (profile?.subscription_status === "active" || profile?.subscription_status === "trial") {
        return NextResponse.redirect(`${origin}/deals`)
      }

      // Default: go to billing to pick a plan
      return NextResponse.redirect(`${origin}/settings/billing?subscribe=true`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
