"use client"

import { useState, Suspense, useMemo } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Upload, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DealCreateDialog } from "@/components/deals/deal-create-dialog"
import { FundProfileBanner } from "@/components/dashboard/fund-profile-banner"
import { useDeals } from "@/hooks/use-deals"
import { VERDICT_COLORS } from "@/lib/constants"

function DealsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(searchParams.get("new") === "true")
  const { deals, loading, refetch } = useDeals()

  function handleDealCreated(dealId: string) {
    refetch()
    setDialogOpen(false)
    router.push(`/deals/${dealId}/summary`)
  }

  const stats = useMemo(() => {
    const analyzed = deals.filter((d) => d.analysis).length
    const awaiting = deals.length - analyzed
    return { analyzed, awaiting }
  }, [deals])

  return (
    <div className="space-y-6">
      <FundProfileBanner />
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600">Your deals</p>
          <h1 className="mt-1 text-2xl font-bold font-heading">Dealroom</h1>
          <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {loading
              ? "loading..."
              : deals.length === 0
                ? "no deals tracked"
                : `${deals.length} deal${deals.length === 1 ? "" : "s"} · ${stats.analyzed} analyzed · ${stats.awaiting} awaiting`}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      {!loading && deals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No deals yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Create a deal for each startup, then upload their pitch deck to get an AI-generated investment analysis.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => {
            const exec = deal.analysis?.executiveSummary
            const verdict = exec?.verdict
            const score = exec?.overallScore
            const thesis = exec?.thesis
            const metaBits = [deal.stage, exec?.sector, exec?.geography].filter(Boolean) as string[]
            return (
              <Link key={deal.id} href={`/deals/${deal.id}/summary`} className="group">
                <Card className="h-full transition-all hover:shadow-sm hover:ring-foreground/20 cursor-pointer flex flex-col">
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-semibold text-base leading-tight truncate">
                          {deal.companyName}
                        </h3>
                        {metaBits.length > 0 && (
                          <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
                            {metaBits.join(" · ")}
                          </p>
                        )}
                      </div>
                      {verdict && (
                        <Badge className={`${VERDICT_COLORS[verdict].bg} ${VERDICT_COLORS[verdict].text} border-0 font-mono text-[10px] tracking-wider shrink-0`}>
                          {verdict}
                        </Badge>
                      )}
                    </div>

                    {thesis ? (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {thesis}
                      </p>
                    ) : (
                      <div className="flex-1 flex items-center justify-center py-6 rounded-md border border-dashed">
                        <span className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                          <Upload className="h-3.5 w-3.5" />
                          Awaiting analysis
                        </span>
                      </div>
                    )}

                    {score !== undefined && (
                      <div className="mt-auto pt-3 border-t border-border flex items-baseline justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Overall score
                        </span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-2xl font-mono font-bold text-amber-600 leading-none tabular-nums">
                            {score}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">/100</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      <DealCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={handleDealCreated} />
    </div>
  )
}

export default function DealsPage() {
  return (
    <Suspense>
      <DealsContent />
    </Suspense>
  )
}
