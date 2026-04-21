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
    const publicRoutes = ["/", "/login", "/register", "/reset-password"]
    const isPublic =
      publicRoutes.some((route) => pathname === route) ||
      pathname.startsWith("/auth/") ||
      pathname.startsWith("/checkout/")

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

    const billingAllowed =
      pathname === "/settings/billing" || pathname.startsWith("/settings/billing/") || pathname === "/setup"

    if (billingAllowed) return supabaseResponse

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

    return supabaseResponse
  } catch (err) {
    console.error("Middleware error:", err)
    return NextResponse.next({ request })
  }
}
