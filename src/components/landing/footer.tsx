import Link from "next/link"
import { BarChart3 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-heading font-bold">Sam</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Sam helps investors decide.
              <br />
              Built in Europe, for European investors.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/how-it-works" className="hover:text-foreground">How it works</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/for-angels" className="hover:text-foreground">For angels</Link></li>
              <li><Link href="/for-vc-funds" className="hover:text-foreground">For VC funds</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Trust</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">GDPR &amp; privacy</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Sam. All rights reserved.</p>
          <p>Built in Europe. Hosted in Europe.</p>
        </div>
      </div>
    </footer>
  )
}
