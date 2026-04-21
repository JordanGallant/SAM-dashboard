import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
          That memo doesn&apos;t exist.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you tried to reach isn&apos;t here. The rest of Sam is still where you left it.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
