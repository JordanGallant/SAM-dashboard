import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase env vars missing — skipping auth middleware")
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // API routes handle their own auth — never redirect them
    if (pathname.startsWith("/api/")) return supabaseResponse

    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/reset-password",
      "/how-it-works",
      "/for-angels",
      "/for-vc-funds",
      "/privacy",
      "/sample",
      "/mockup1",
      "/mockup2",
      "/mockup3",
    ]
    const isPublic =
      publicRoutes.some((route) => pathname === route) ||
      pathname.startsWith("/auth/") ||
      pathname.startsWith("/checkout/") ||
      pathname.startsWith("/design/")

    if (!user) {
      if (isPublic) return supabaseResponse
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    if (user && (pathname === "/login" || pathname === "/register")) {
      const url = request.nextUrl.clone()
      url.pathname = "/deals"
      return NextResponse.redirect(url)
    }

    if (isPublic) return supabaseResponse

    const paymentFlowAllowed =
      pathname === "/settings/billing" ||
      pathname.startsWith("/settings/billing/") ||
      pathname === "/setup" ||
      pathname === "/checkout-redirect" ||
      pathname.startsWith("/checkout/")

    if (paymentFlowAllowed) return supabaseResponse

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, trial_ends_at, tier")
      .eq("id", user.id)
      .maybeSingle()

    const now = new Date()
    const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null
    const trialValid = profile?.subscription_status === "trial" && trialEnd && trialEnd > now
    const active = profile?.subscription_status === "active"

    if (!active && !trialValid) {
      const url = request.nextUrl.clone()
      url.pathname = "/settings/billing"
      if (profile?.subscription_status === "trial" && trialEnd && trialEnd <= now) {
        url.searchParams.set("expired", "true")
      } else {
        url.searchParams.set("subscribe", "true")
      }
      return NextResponse.redirect(url)
    }

    // Ping last_active_at so cleanup jobs don't delete accounts whose
    // owner is actively using the product (even briefly). Fire-and-forget.
    supabase
      .from("profiles")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", user.id)
      .then(() => {})

    // Fund tier requires 2FA. Check Assurance Level — aal2 means MFA verified.
    if (profile?.tier === "fund") {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      const mfaRequired = aal?.nextLevel === "aal2"
      const twoFactorPath =
        pathname === "/settings/security" ||
        pathname === "/settings/security/2fa" ||
        pathname.startsWith("/settings/security/")

      if (mfaRequired && !twoFactorPath) {
        const url = request.nextUrl.clone()
        url.pathname = "/settings/security/2fa"
        url.searchParams.set("required", "true")
        return NextResponse.redirect(url)
      }
    }

    return supabaseResponse
  } catch (err) {
    console.error("Middleware error:", err)
    return NextResponse.next({ request })
  }
}
