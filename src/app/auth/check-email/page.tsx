import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function CheckEmailContent({ email }: { email: string | null }) {
  return (
    <div className="relative min-h-screen bg-[#F8F8F9] text-[#0F3D2E]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,168,107,0.12),transparent_60%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,255,107,0.18),transparent_60%)] blur-2xl"
      />

      <div className="relative flex min-h-screen flex-col">
        <header className="px-6 pt-6 md:px-10 md:pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E]/70 hover:text-[#0F3D2E] transition-colors"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white text-[11px] font-bold">S</span>
            Sam · Investment intelligence
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-7 md:p-8 shadow-sm">
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-md shadow-primary/20">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] font-bold">
                Confirm email
              </p>
              <h1 className="mt-1 text-center font-heading text-2xl font-bold tracking-[-0.02em] text-[#0F3D2E]">
                Check your inbox
              </h1>
              <p className="mt-1.5 text-center text-sm text-muted-foreground">
                {email ? (
                  <>We sent a confirmation link to <span className="font-medium text-foreground">{email}</span></>
                ) : (
                  "We sent you a confirmation link."
                )}
              </p>

              <div className="mt-7 space-y-3">
                <p className="text-center text-[13px] text-muted-foreground">
                  Click the link in the email to verify your account. You&apos;ll then be taken through to complete checkout.
                </p>
                <div className="rounded-xl bg-foreground/[0.03] ring-1 ring-foreground/10 px-3 py-2.5 text-[12px] text-muted-foreground text-center">
                  Didn&apos;t get it? Check your spam folder or try registering again.
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-6 pb-6 md:px-10 md:pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span className="font-mono">© Sam</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  return (
    <Suspense>
      <CheckEmailContent email={email ?? null} />
    </Suspense>
  )
}
