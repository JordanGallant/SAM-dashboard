"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, LogOut } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { mockFundProfile } from "@/lib/mock-data/fund-profile"
import { createClient } from "@/lib/supabase/client"

export function Topbar() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <span className="text-sm font-medium text-muted-foreground">{mockFundProfile.name}</span>
      <div className="ml-auto flex items-center gap-1">
        <Link href="/settings" className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}>
          <Settings className="h-4 w-4" />
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
