import { BarChart3 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium font-heading">SAM</span>
            <span className="text-xs text-muted-foreground">AI Investment Associate</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SAM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
