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
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/deals" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight font-heading">SAM</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600">Deals</span>
            <Link href="/deals?new=true" className={buttonVariants({ variant: "ghost", size: "icon", className: "h-5 w-5" })}>
              <Plus className="h-3.5 w-3.5" />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {loading ? (
              <p className="px-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">loading...</p>
            ) : deals.length === 0 ? (
              <p className="px-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">No deals yet</p>
            ) : (
              <SidebarMenu>
                {deals.map((deal) => {
                  const isActive = pathname.startsWith(`/deals/${deal.id}`)
                  const verdict = deal.analysis?.executiveSummary.verdict
                  const score = deal.analysis?.executiveSummary.overallScore
                  return (
                    <SidebarMenuItem key={deal.id}>
                      <SidebarMenuButton
                        render={<Link href={`/deals/${deal.id}/summary`} />}
                        isActive={isActive}
                        className={`h-auto py-2.5 ${isActive ? "border-l-2 border-l-amber-500 rounded-l-none" : ""}`}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${verdict ? verdictDotColors[verdict] ?? "bg-gray-300" : "bg-gray-300"}`} />
                              <span className="truncate font-medium text-sm">{deal.companyName}</span>
                              {score !== undefined && (
                                <span className="ml-auto text-[10px] font-mono font-semibold text-amber-600 tabular-nums">{score}</span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${STAGE_BADGE_COLORS[deal.stage] ?? ""}`}>
                                {deal.stage}
                              </Badge>
                              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                {new Date(deal.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
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
