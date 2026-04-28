"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useDeals } from "@/hooks/use-deals"
import { STAGE_BADGE_COLORS } from "@/lib/constants"

const verdictDotColors: Record<string, string> = {
  "Strong Buy": "bg-emerald-500",
  Explore: "bg-amber-500",
  "Conditional Pass": "bg-orange-500",
  Deny: "bg-red-500",
}

export function AppSidebar() {
  const pathname = usePathname()
  const { deals, loading } = useDeals()

  return (
    <Sidebar className="border-r border-[#0F3D2E]/10 bg-white">
      <SidebarHeader className="border-b border-[#0F3D2E]/10 px-4 py-3.5">
        <Link href="/deals" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] shadow-md shadow-primary/20 ring-1 ring-[#D4FF6B]/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
            <BarChart3 className="h-4 w-4 text-[#D4FF6B]" />
          </div>
          <span className="text-lg font-bold font-heading tracking-tight text-[#0A2E22]">Sam</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2 pt-4 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
              Deals
            </span>
            <Link
              href="/deals?new=true"
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0F3D2E]/5 hover:bg-primary/15 text-[#0F3D2E] hover:text-primary transition-colors"
              aria-label="New deal"
            >
              <Plus className="h-3.5 w-3.5" />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {loading ? (
              <p className="px-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Loading…
              </p>
            ) : deals.length === 0 ? (
              <p className="px-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                No deals yet
              </p>
            ) : (
              <SidebarMenu className="gap-1">
                {deals.map((deal) => {
                  const isActive = pathname.startsWith(`/deals/${deal.id}`)
                  const verdict = deal.analysis?.executiveSummary.verdict
                  const score = deal.analysis?.executiveSummary.overallScore
                  return (
                    <SidebarMenuItem key={deal.id}>
                      <SidebarMenuButton
                        render={<Link href={`/deals/${deal.id}/summary`} />}
                        isActive={isActive}
                        className={`h-auto py-2.5 rounded-xl transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/5 ring-1 ring-primary/30"
                            : "hover:bg-[#F4FAF6]"
                        }`}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                                  verdict ? verdictDotColors[verdict] ?? "bg-gray-300" : "bg-gray-300"
                                }`}
                              />
                              <span className="truncate font-heading font-semibold text-[13px] text-[#0A2E22]">
                                {deal.companyName}
                              </span>
                              {score !== undefined && (
                                <span className="ml-auto text-[10px] font-mono font-bold text-primary tabular-nums">
                                  {score}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0 text-[9px] font-mono font-bold uppercase tracking-widest ${
                                  STAGE_BADGE_COLORS[deal.stage] ?? "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {deal.stage}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {new Date(deal.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
