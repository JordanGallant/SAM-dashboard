import { Resend } from "resend"

const FROM = process.env.RESEND_FROM_EMAIL || "Sam <hello@samvc.ai>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.samvc.ai"

interface InviteEmailArgs {
  to: string
  inviterName: string
  fundName: string
  token: string
}

export async function sendInviteEmail({
  to,
  inviterName,
  fundName,
  token,
}: InviteEmailArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" }
  }

  const acceptUrl = `${APP_URL}/register?invite=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`
  const safeFund = escapeHtml(fundName)
  const safeInviter = escapeHtml(inviterName || "A teammate")

  const subject = `${safeInviter} invited you to ${safeFund} on Sam`

  const html = `<!doctype html>
<html><body style="font-family: -apple-system,Segoe UI,Helvetica,Arial,sans-serif; background:#FAFAF7; padding:32px; color:#0A0A0A;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E8E8E0;border-radius:16px;padding:32px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#0F3D2E;margin:0 0 8px 0;font-weight:700;">Sam · Team invite</p>
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px 0;color:#0F3D2E;">${safeInviter} invited you to ${safeFund}</h1>
    <p style="font-size:15px;line-height:1.55;color:#3A3A3A;margin:0 0 24px 0;">
      You've been added as a teammate on Sam — the structured first-screen workspace for VC dealflow.
      Accept the invite to get shared access to ${safeFund}'s deals and assessments.
    </p>
    <p style="margin:0 0 28px 0;">
      <a href="${acceptUrl}" style="display:inline-block;background:#0F3D2E;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:600;">Accept invite</a>
    </p>
    <p style="font-size:12px;color:#888;margin:0 0 4px 0;">This link expires in 14 days.</p>
    <p style="font-size:12px;color:#888;margin:0;">If you weren't expecting this, you can safely ignore the email.</p>
  </div>
  <p style="text-align:center;font-size:11px;color:#999;margin-top:16px;">Sam · samvc.ai</p>
</body></html>`

  const text = `${safeInviter} invited you to join ${safeFund} on Sam.\n\nAccept the invite: ${acceptUrl}\n\nThis link expires in 14 days. If you weren't expecting this, you can ignore the email.`

  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      text,
    })
    if (result.error) {
      return { ok: false, error: result.error.message }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" }
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
