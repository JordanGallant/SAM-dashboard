import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase not configured, skip auth (lets landing page work)
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
    const publicRoutes = ["/", "/login", "/register", "/reset-password", "/auth/callback"]
    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith("/auth/"))

    if (!user && !isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    if (user && (pathname === "/login" || pathname === "/register")) {
      const url = request.nextUrl.clone()
      url.pathname = "/deals"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (err) {
    console.error("Middleware error:", err)
    // Don't 500 the entire site — let the page load
    return NextResponse.next({ request })
  }
}
