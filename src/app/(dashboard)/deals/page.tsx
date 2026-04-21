"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, FileText, Upload, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DealCreateDialog } from "@/components/deals/deal-create-dialog"
import { useDeals } from "@/hooks/use-deals"
import { STAGE_BADGE_COLORS, STATUS_BADGE_COLORS, VERDICT_COLORS } from "@/lib/constants"

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dealroom</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${deals.length} deal${deals.length === 1 ? "" : "s"}`}
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
            const verdict = deal.analysis?.executiveSummary.verdict
            const score = deal.analysis?.executiveSummary.overallScore
            return (
              <Link key={deal.id} href={`/deals/${deal.id}/summary`}>
                <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{deal.companyName}</CardTitle>
                      {verdict && (
                        <Badge className={`${VERDICT_COLORS[verdict].bg} ${VERDICT_COLORS[verdict].text} border-0`}>
                          {verdict}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={STAGE_BADGE_COLORS[deal.stage]}>
                        {deal.stage}
                      </Badge>
                      <Badge variant="outline" className={STATUS_BADGE_COLORS[deal.status]}>
                        {deal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{deal.documents.length} doc{deal.documents.length !== 1 ? "s" : ""}</span>
                      </div>
                      {score !== undefined && (
                        <span className="font-medium tabular-nums">{score}/100</span>
                      )}
                      {!deal.analysis && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Upload className="h-3.5 w-3.5" />
                          Awaiting analysis
                        </span>
                      )}
                    </div>
                    {deal.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {deal.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                        ))}
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
