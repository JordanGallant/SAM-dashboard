import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertHubspotContact } from "@/lib/hubspot"
import { acceptInvite } from "@/app/actions/members"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next")
  const invite = searchParams.get("invite")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Capture lead in HubSpot the moment email is confirmed. Fire-and-forget
      // — never block the redirect on a CRM hiccup.
      const email = data.session.user.email
      if (email) {
        void upsertHubspotContact(email, {
          lifecyclestage: "lead",
        }).catch(() => {})
      }

      // Invite acceptance takes priority over the normal post-auth routing.
      // Without this, the user lands on /checkout-redirect because their
      // profile still has pending_tier set from the signup metadata.
      if (invite) {
        const result = await acceptInvite(invite)
        if ("error" in result) {
          return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(result.error)}`,
          )
        }
        return NextResponse.redirect(`${origin}/deals`)
      }

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
