"use client"

import Link from "next/link"
import { Settings, User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { mockFundProfile } from "@/lib/mock-data/fund-profile"

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <span className="text-sm font-medium text-muted-foreground">{mockFundProfile.name}</span>
      <div className="ml-auto flex items-center gap-1">
        <Link href="/settings" className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}>
          <Settings className="h-4 w-4" />
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}>
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  )
}
