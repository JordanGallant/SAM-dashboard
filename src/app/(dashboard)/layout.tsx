import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { DealChat } from "@/components/layout/deal-chat"
import { TierProvider } from "@/lib/tier-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TierProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
        <DealChat />
      </SidebarProvider>
    </TierProvider>
  )
}
