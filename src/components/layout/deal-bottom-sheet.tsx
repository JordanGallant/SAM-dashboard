"use client"

/**
 * Mobile-only bottom bar: a Tabs pill (opens nav sheet) and an Ask SAM pill
 * that navigates to /deals/[id]/ask. Chat is its own page now — no overlay.
 */

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"
import { List, MessageSquare, Lock } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useDeal } from "@/hooks/use-deal"
import { useTier } from "@/lib/tier-context"
import { cn } from "@/lib/utils"

const NAV_GROUPS: { label: string; items: { key: string; label: string }[] }[] = [
  { label: "Overview", items: [{ key: "summary", label: "Executive Summary" }] },
  {
    label: "Domains",
    items: [
      { key: "team", label: "Team" },
      { key: "market", label: "Market" },
      { key: "product", label: "Product" },
      { key: "traction", label: "Traction" },
      { key: "finance", label: "Finance" },
      { key: "exit", label: "Exit Potential" },
    ],
  },
  {
    label: "Review",
    items: [
      { key: "fund-fit", label: "Fund Fit" },
      { key: "missing-info", label: "Missing Info" },
    ],
  },
  { label: "Co-pilot", items: [{ key: "ask", label: "Ask SAM" }] },
]

export function DealBottomSheet() {
  const params = useParams()
  const pathname = usePathname()
  const dealId = params.dealId as string | undefined
  const { deal } = useDeal(dealId)
  const { config: tierConfig } = useTier()

  const [open, setOpen] = useState(false)

  if (!dealId || !deal?.analysis) return null

  const analysis = deal.analysis
  const tabKeys = new Set(["summary", "team", "market", "product", "traction", "finance", "exit", "fund-fit", "missing-info", "ask"])
  const activeTab = pathname.split("/").filter(Boolean).reverse().find((s) => tabKeys.has(s)) || "summary"
  const activeLabel = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.key === activeTab)?.label ?? "Summary"

  function getTabScore(tabKey: string): number | undefined {
    const map: Record<string, number | undefined> = {
      summary: analysis.executiveSummary.overallScore,
      team: analysis.team.score,
      market: analysis.market.score,
      product: analysis.product.score,
      traction: analysis.traction.score,
      finance: analysis.finance.score,
      exit: analysis.exitPotential.score,
      "fund-fit": analysis.fundFit.score,
    }
    return map[tabKey]
  }

  const gatedTabs: Record<string, boolean> = { "fund-fit": !tierConfig.fundFit }

  return (
    <>
      {/* Persistent mobile bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch gap-2 px-3 py-2">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-left active:bg-muted/80 transition-colors"
          >
            <List className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground leading-none">
                Current
              </p>
              <p className="text-[12.5px] font-medium truncate mt-0.5 leading-tight">
                {activeLabel}
              </p>
            </div>
          </button>
          <Link
            href={`/deals/${dealId}/ask`}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 active:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="text-[12.5px] font-semibold">Ask SAM</span>
          </Link>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[80dvh] max-h-[80dvh] p-0 flex flex-col"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Deal navigation</SheetTitle>
          {/* Drag handle affordance */}
          <div className="pt-2 pb-0 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <NavList
            dealId={dealId}
            activeTab={activeTab}
            gatedTabs={gatedTabs}
            getTabScore={getTabScore}
            onPick={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

function NavList({
  dealId,
  activeTab,
  gatedTabs,
  getTabScore,
  onPick,
}: {
  dealId: string
  activeTab: string
  gatedTabs: Record<string, boolean>
  getTabScore: (k: string) => number | undefined
  onPick: () => void
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mt-4 first:mt-2">
          <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/80">
            {group.label}
          </p>
          <ul>
            {group.items.map(({ key, label }) => {
              const score = getTabScore(key)
              const isActive = activeTab === key
              const isGated = gatedTabs[key]
              const dotColor =
                score === undefined
                  ? "bg-muted-foreground/25"
                  : score >= 70
                  ? "bg-emerald-500"
                  : score >= 40
                  ? "bg-primary/100"
                  : "bg-red-500"
              return (
                <li key={key}>
                  <Link
                    href={`/deals/${dealId}/${key}`}
                    onClick={onPick}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2 py-3 text-[14px] transition-colors",
                      isActive
                        ? "bg-muted/70 text-foreground font-medium"
                        : "text-foreground/75 active:bg-muted/40",
                      isGated && "opacity-60"
                    )}
                  >
                    <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
                      {isActive && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-current opacity-30" />
                      )}
                    </span>
                    {isGated && <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />}
                    <span className="truncate">{label}</span>
                    {!isGated && key !== "ask" && (
                      <span className="ml-auto font-mono text-[12px] tabular-nums text-muted-foreground">
                        {score ?? "—"}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
