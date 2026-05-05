import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#F8F8F9] text-[#0A2E22]">
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
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#0A2E22]/70 hover:text-[#0A2E22] transition-colors"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white text-[11px] font-bold">S</span>
            Sam · Investment intelligence
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">{children}</div>
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
