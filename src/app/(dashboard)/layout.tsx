"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { DealChat } from "@/components/layout/deal-chat"
import { TierProvider } from "@/lib/tier-context"
import { UploadProvider } from "@/components/upload-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const inDealsArea = pathname.startsWith("/deals")

  return (
    <TierProvider>
      <UploadProvider>
        <SidebarProvider>
          {!inDealsArea && <AppSidebar />}
          <SidebarInset>
            <Topbar showSidebarTrigger={!inDealsArea} />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </SidebarInset>
          <DealChat />
        </SidebarProvider>
      </UploadProvider>
    </TierProvider>
  )
}
