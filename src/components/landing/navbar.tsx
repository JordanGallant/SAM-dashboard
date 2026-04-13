import Link from "next/link"
import { BarChart3 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold font-heading tracking-tight">SAM</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">
            Pricing
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log In
          </Link>
          <Link href="/register" className={buttonVariants({ size: "sm" })}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  )
}
