import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Scheduled route that emails users 7 days before their inactive account
 * is deleted. Call from Vercel Cron (vercel.json) or any external scheduler.
 *
 * Protected by a bearer token (CRON_SECRET env). Deletes happen via
 * pg_cron on the Supabase side — this route only sends warnings.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const expected = process.env.CRON_SECRET
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find accounts that are 23+ days inactive (deletion happens at 30d)
  // and haven't been warned yet this cycle.
  const warningCutoff = new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString()

  const { data: candidates, error } = await admin
    .from("profiles")
    .select("id, full_name, warning_sent_at, created_at")
    .eq("subscription_status", "inactive")
    .lte("created_at", warningCutoff)
    .is("warning_sent_at", null)
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ warned: 0 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({
      warned: 0,
      skipped: candidates.length,
      message: "RESEND_API_KEY not configured — skipping email sends",
    })
  }

  const { Resend } = await import("resend")
  const resend = new Resend(resendKey)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sam-dashboard-theta.vercel.app"

  let sent = 0
  for (const profile of candidates) {
    // Look up email from auth.users (service role)
    const { data: userData } = await admin.auth.admin.getUserById(profile.id)
    const email = userData?.user?.email
    if (!email) continue

    try {
      await resend.emails.send({
        from: "Sam <noreply@resend.dev>",
        to: email,
        subject: "Your Sam account will be deleted in 7 days",
        html: `
          <div style="font-family: Calibri, sans-serif; max-width: 560px;">
            <h2 style="margin-bottom: 4px;">Your Sam account is about to expire</h2>
            <p style="color: #666; margin-top: 0;">Hi ${profile.full_name || "there"},</p>
            <p>
              Your Sam account was created over 23 days ago but hasn't been activated.
              It will be automatically removed in 7 days.
            </p>
            <p>
              If you'd still like to try Sam, click below to pick a plan or redeem a promo code:
            </p>
            <p>
              <a href="${appUrl}/settings/billing" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Activate my account
              </a>
            </p>
            <p style="color: #888; font-size: 12px; margin-top: 24px;">
              Sam · Built in Europe, for European investors.
            </p>
          </div>
        `,
      })

      await admin
        .from("profiles")
        .update({ warning_sent_at: new Date().toISOString() })
        .eq("id", profile.id)

      sent++
    } catch (err) {
      console.error(`Failed to warn ${profile.id}:`, err)
    }
  }

  return NextResponse.json({ warned: sent, considered: candidates.length })
}
