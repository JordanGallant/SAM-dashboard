import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function FontV1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${spaceGrotesk.variable}`}
      style={{
        // Override global font vars for this subtree only
        ["--font-geist-sans" as string]: "var(--font-space-grotesk)",
      }}
    >
      {/* Badge shows which variant is rendering */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-foreground text-background px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest shadow-lg">
        V1 · Space Grotesk
      </div>
      {children}
    </div>
  )
}
