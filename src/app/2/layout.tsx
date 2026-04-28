import { Inter } from "next/font/google"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function FontV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable}`}
      style={{
        ["--font-geist-sans" as string]: "var(--font-inter)",
      }}
    >
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-foreground text-background px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest shadow-lg">
        V2 · Inter
      </div>
      {children}
    </div>
  )
}
