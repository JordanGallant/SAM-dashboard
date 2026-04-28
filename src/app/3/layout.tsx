import { Newsreader, Inter } from "next/font/google"

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function FontV3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${newsreader.variable} ${inter.variable}`}
      style={{
        // Editorial memo feel: serif headings, Inter body
        ["--font-geist-sans" as string]: "var(--font-inter)",
        ["--font-heading" as string]: "var(--font-newsreader)",
      }}
    >
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-foreground text-background px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest shadow-lg">
        V3 · Newsreader + Inter
      </div>
      {children}
    </div>
  )
}
