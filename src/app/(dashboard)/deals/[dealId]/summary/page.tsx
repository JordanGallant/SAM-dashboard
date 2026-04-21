"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileDown, Mail, Loader2, CheckCircle2, Lock, Sparkles } from "lucide-react"
import { VerdictBadge } from "@/components/dashboard/verdict-badge"
import { ConfidenceBadge } from "@/components/dashboard/confidence-badge"
import { ScorecardTable } from "@/components/dashboard/scorecard-table"
import { StrengthsRisks } from "@/components/dashboard/strengths-risks"
import { DataCompleteness } from "@/components/dashboard/data-completeness"
import { ScoreBadge } from "@/components/dashboard/score-badge"
import { DealUpload } from "@/components/deals/deal-upload"
import { useDeal } from "@/hooks/use-deal"
import { useTier } from "@/lib/tier-context"

export default function SummaryPage() {
  const params = useParams()
  const dealId = params.dealId as string
  const { deal, loading, refetch, analysisStatus } = useDeal(dealId)
  const { config: tierConfig } = useTier()

  const [downloading, setDownloading] = useState(false)
  const [downloadDone, setDownloadDone] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [emailTo, setEmailTo] = useState("")
  const [emailing, setEmailing] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState("")

  const canExportWord = tierConfig.wordExport
  const canEmail = tierConfig.emailSummary !== 0

  async function handleDownloadWord() {
    if (!deal) return
    setDownloading(true)
    setDownloadDone(false)

    try {
      const res = await fetch("/api/export/word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id }),
      })

      if (!res.ok) throw new Error("Export failed")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `SAM_${deal.companyName.replace(/\s+/g, "_")}_Executive_Summary.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDownloadDone(true)
      setTimeout(() => setDownloadDone(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!deal) return
    setEmailing(true)
    setEmailError("")
    setEmailSent(false)

    try {
      const res = await fetch("/api/export/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id, recipientEmail: emailTo }),
      })

      const data = await res.json()

      if (data.fallbackDownload) {
        setEmailError("Email service not configured yet. Use the download button instead.")
        setEmailing(false)
        return
      }

      if (!res.ok) throw new Error(data.error || "Failed to send")

      setEmailSent(true)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to send email")
    } finally {
      setEmailing(false)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>
  if (!deal) return null

  // Processing state
  if (!deal.analysis && (analysisStatus === "pending" || analysisStatus === "processing")) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <h3 className="font-semibold">Analyzing pitch deck</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              This typically takes 30-45 minutes. You can leave this page — we&apos;ll save the results when done. This page auto-refreshes every 30 seconds.
            </p>
          </CardContent>
        </Card>

        <DealUpload dealId={deal.id} documents={deal.documents} onChange={refetch} />
      </div>
    )
  }

  // Failed state
  if (!deal.analysis && analysisStatus === "failed") {
    return (
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Sparkles className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold">Analysis failed</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              Something went wrong during analysis. You can click &quot;Analyze Pitch Deck&quot; above to try again.
            </p>
          </CardContent>
        </Card>

        <DealUpload dealId={deal.id} documents={deal.documents} onChange={refetch} />
      </div>
    )
  }

  // No analysis yet — show upload + run analysis state
  if (!deal.analysis) {
    const hasDocs = deal.documents.length > 0
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">
              {hasDocs ? "Ready to analyze" : "Upload a pitch deck"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              {hasDocs
                ? 'Click "Analyze Pitch Deck" at the top to start. Analysis takes around 30-45 minutes and runs in the background — you can leave this page.'
                : "Upload your pitch deck below. Once uploaded, click \"Analyze Pitch Deck\" at the top to generate your executive summary."}
            </p>
          </CardContent>
        </Card>

        <DealUpload dealId={deal.id} documents={deal.documents} onChange={refetch} />
      </div>
    )
  }

  const es = deal.analysis.executiveSummary

  return (
    <div className="space-y-6">
      {/* Verdict + Score row */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <VerdictBadge verdict={es.verdict} />
          <ConfidenceBadge confidence={es.confidence} />
          <ScoreBadge score={es.overallScore} label="Overall" />
          <div className="ml-auto flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{es.stage}</Badge>
            <Badge variant="outline">{es.geography}</Badge>
            <Badge variant="outline">Raising: {es.raising}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Investment Scorecard: chart + table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Investment Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <ScorecardTable scorecard={es.scorecard} />
        </CardContent>
      </Card>

      {/* Thesis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Investment Thesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{es.thesis}</p>
        </CardContent>
      </Card>

      {/* Strengths + Risks */}
      <StrengthsRisks strengths={es.strengths} risks={es.risks} />

      {/* Next Steps */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {es.recommendedNextSteps.map((step, i) => (
              <li key={i} className="text-sm text-muted-foreground">{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Data completeness + Export */}
      <div className="space-y-4">
        <DataCompleteness percentage={es.dataCompleteness} />

        <div className="flex flex-col sm:flex-row gap-2">
          {canExportWord ? (
            <Button onClick={handleDownloadWord} disabled={downloading}>
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : downloadDone ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              {downloading ? "Generating..." : downloadDone ? "Downloaded" : "Generate Word Doc"}
            </Button>
          ) : (
            <Button variant="outline" disabled className="opacity-60">
              <Lock className="mr-2 h-4 w-4" />
              Word Export
              <Badge variant="secondary" className="ml-2 text-[10px]">Pro+</Badge>
            </Button>
          )}

          {canEmail ? (
            <Button variant="outline" onClick={() => { setEmailOpen(true); setEmailSent(false); setEmailError("") }}>
              <Mail className="mr-2 h-4 w-4" />
              Email Summary
            </Button>
          ) : (
            <Button variant="outline" disabled className="opacity-60">
              <Lock className="mr-2 h-4 w-4" />
              Email Summary
              <Badge variant="secondary" className="ml-2 text-[10px]">Pro+</Badge>
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Current plan: <Badge variant="outline" className="text-[10px]">{tierConfig.label}</Badge>
          {!canExportWord && (
            <span className="ml-2">
              <a href="/settings/billing" className="text-primary hover:underline">Upgrade to Professional</a> to unlock Word export and unlimited email.
            </span>
          )}
        </p>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Executive Summary</DialogTitle>
          </DialogHeader>
          {emailSent ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="text-sm font-medium">Email sent to {emailTo}</p>
              <p className="text-xs text-muted-foreground">The Word doc is attached to the email.</p>
              <Button variant="outline" size="sm" onClick={() => setEmailOpen(false)}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-4">
              {emailError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{emailError}</div>}
              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email</Label>
                <Input id="email" type="email" placeholder="partner@fund.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} required />
              </div>
              <p className="text-xs text-muted-foreground">
                Sends the {es.companyName} Executive Summary as a formatted Word doc attachment.
              </p>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={emailing}>
                  {emailing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Email
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
