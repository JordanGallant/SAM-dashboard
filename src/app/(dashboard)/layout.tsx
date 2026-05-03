"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { TierProvider } from "@/lib/tier-context"
import { UploadProvider } from "@/components/upload-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = pathname.startsWith("/deals") || pathname.startsWith("/settings")

  return (
    <TierProvider>
      <UploadProvider>
        <SidebarProvider>
          {!hideSidebar && <AppSidebar />}
          <SidebarInset>
            <Topbar showSidebarTrigger={!hideSidebar} />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </UploadProvider>
    </TierProvider>
  )
}
