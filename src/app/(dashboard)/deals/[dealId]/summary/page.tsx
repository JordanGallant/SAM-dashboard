"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileDown, Mail, Loader2, CheckCircle2, Lock, Sparkles } from "lucide-react"
import { VerdictBadge } from "@/components/dashboard/verdict-badge"
import { ConfidenceBadge } from "@/components/dashboard/confidence-badge"
import { SectionLabel } from "@/components/dashboard/section-label"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import { DomainRadar } from "@/components/dashboard/domain-radar"
import { DealUpload } from "@/components/deals/deal-upload"
import { useDeal } from "@/hooks/use-deal"
import { useTier } from "@/lib/tier-context"
import { getScoreColor } from "@/lib/constants"
import type { FindingItem, Confidence } from "@/lib/types/analysis"

const SEVERITY_WEIGHT: Record<string, number> = { Critical: 3, Warning: 2, Info: 1 }
const CONFIDENCE_PCT: Record<Confidence, number> = { High: 85, Medium: 55, Low: 25 }
function weightedTotal(items: FindingItem[]) {
  return items.reduce((s, it) => s + (SEVERITY_WEIGHT[it.severity] ?? 1), 0)
}

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
  const metaBits = [es.stage, es.sector, es.geography, es.raising && `raising ${es.raising}`, es.mrr && `${es.mrr} MRR`].filter(Boolean)

  const sWeight = weightedTotal(es.strengths)
  const rWeight = weightedTotal(es.risks)
  const wTotal = sWeight + rWeight || 1
  const sPct = (sWeight / wTotal) * 100
  const rPct = (rWeight / wTotal) * 100

  // Decision matrix position: X = confidence (0-100), Y = score (0-100)
  const confX = CONFIDENCE_PCT[es.confidence]
  const scoreY = es.overallScore

  const scoreColor = getScoreColor(es.overallScore)

  // Severity counts
  const sevCounts = (items: FindingItem[]) =>
    items.reduce<Record<string, number>>((acc, it) => {
      acc[it.severity] = (acc[it.severity] ?? 0) + 1
      return acc
    }, {})
  const strSev = sevCounts(es.strengths)
  const riskSev = sevCounts(es.risks)

  return (
    <div className="space-y-6">
      {/* Meta strip */}
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        {metaBits.join(" · ")}
      </p>

      {/* Row 1: Score Gauge · Domain Radar · Verdict/Data */}
      <section className="grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-3">
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <SectionLabel className="self-start">Score</SectionLabel>
            <ScoreGauge score={es.overallScore} />
            <div className="flex flex-col items-center gap-1 mt-1">
              <VerdictBadge verdict={es.verdict} />
              <ConfidenceBadge confidence={es.confidence} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-6">
          <CardContent>
            <SectionLabel>Domain Radar</SectionLabel>
            <DomainRadar scorecard={es.scorecard} height={260} />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardContent className="space-y-4">
            <div>
              <SectionLabel>Data Completeness</SectionLabel>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`font-mono text-3xl font-bold tabular-nums ${scoreColor.text}`}>
                  {es.dataCompleteness}
                </span>
                <span className="text-xs font-mono text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${es.dataCompleteness}%` }} />
              </div>
            </div>
            <div className="border-t pt-3 space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Findings</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-emerald-600 font-bold tabular-nums">{es.strengths.length}</span>
                <span className="text-[10px] font-mono text-muted-foreground">STRENGTHS / RISKS</span>
                <span className="font-mono text-red-600 font-bold tabular-nums">{es.risks.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Row 2: Decision Matrix · Findings */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            <SectionLabel>Decision Matrix · Score × Confidence</SectionLabel>
            <svg width="100%" viewBox="0 0 420 280" className="mt-2">
              <line x1="0" y1="140" x2="420" y2="140" stroke="#E7E5E4"/>
              <line x1="210" y1="0" x2="210" y2="280" stroke="#E7E5E4"/>
              <text x="105" y="20" fontFamily="monospace" fontSize="9" fill="#B45309" textAnchor="middle" fontWeight="700">DIG DEEPER</text>
              <text x="105" y="32" fontFamily="monospace" fontSize="8" fill="#78716C" textAnchor="middle">HIGH SCORE · LOW CONF</text>
              <text x="315" y="20" fontFamily="monospace" fontSize="9" fill="#059669" textAnchor="middle" fontWeight="700">CONVICTION BUY</text>
              <text x="315" y="32" fontFamily="monospace" fontSize="8" fill="#78716C" textAnchor="middle">HIGH SCORE · HIGH CONF</text>
              <text x="105" y="270" fontFamily="monospace" fontSize="9" fill="#78716C" textAnchor="middle">DEFER</text>
              <text x="105" y="258" fontFamily="monospace" fontSize="8" fill="#78716C" textAnchor="middle">LOW SCORE · LOW CONF</text>
              <text x="315" y="270" fontFamily="monospace" fontSize="9" fill="#B91C1C" textAnchor="middle" fontWeight="700">PASS / BURY</text>
              <text x="315" y="258" fontFamily="monospace" fontSize="8" fill="#78716C" textAnchor="middle">LOW SCORE · HIGH CONF</text>
              <circle
                cx={(confX / 100) * 420}
                cy={280 - (scoreY / 100) * 280}
                r="9"
                fill={es.overallScore >= 70 ? "#059669" : es.overallScore >= 40 ? "#D97706" : "#DC2626"}
                stroke="#fff"
                strokeWidth="3"
              />
            </svg>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <SectionLabel>Findings · Strengths vs Risks</SectionLabel>

            {/* Weighted bar */}
            <div>
              <div className="flex h-6 rounded-md overflow-hidden ring-1 ring-border">
                <div
                  className="flex items-center justify-center bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ width: `${sPct}%` }}
                >
                  {sPct >= 12 && sWeight}
                </div>
                <div
                  className="flex items-center justify-center bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ width: `${rPct}%` }}
                >
                  {rPct >= 12 && `W ${rWeight}`}
                </div>
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="text-emerald-700">Strengths · {es.strengths.length}</span>
                <span className="text-red-700">Risks · {es.risks.length}</span>
              </div>
            </div>

            {/* Two-column headline list */}
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2.5">
                {es.strengths.slice(0, 3).map((s) => (
                  <li key={s.id} className="text-[12.5px] leading-snug">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold text-foreground line-clamp-1">{s.text.split(":")[0] ?? s.text}</span>
                    </div>
                    {s.text.includes(":") && (
                      <p className="ml-3.5 mt-0.5 text-muted-foreground line-clamp-2">
                        {s.text.split(":").slice(1).join(":").trim()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {es.risks.slice(0, 3).map((r) => (
                  <li key={r.id} className="text-[12.5px] leading-snug">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <span className="font-semibold text-foreground line-clamp-1">{r.text.split(":")[0] ?? r.text}</span>
                    </div>
                    {r.text.includes(":") && (
                      <p className="ml-3.5 mt-0.5 text-muted-foreground line-clamp-2">
                        {r.text.split(":").slice(1).join(":").trim()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Row 3: Score × Completeness · Severity */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            <SectionLabel>Score × Data Completeness</SectionLabel>
            <div className="mt-3 space-y-2.5">
              <div className="grid grid-cols-[5rem_1fr_1fr] gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground pb-1.5 border-b">
                <span>Domain</span><span>Score</span><span>Data %</span>
              </div>
              {es.scorecard.map((row) => {
                const sc = getScoreColor(row.score)
                const dcLow = row.dataCompleteness < 20
                const barBg = row.score >= 70 ? "bg-emerald-500" : row.score >= 40 ? "bg-amber-500" : "bg-red-500"
                return (
                  <div key={row.domain} className="grid grid-cols-[5rem_1fr_1fr] gap-3 items-center text-sm">
                    <span className="font-medium text-[13px]">{row.domain}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded bg-muted overflow-hidden">
                        <div className={`h-full ${barBg}`} style={{ width: `${row.score}%` }} />
                      </div>
                      <span className={`font-mono text-xs tabular-nums ${sc.text}`}>{row.score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded bg-muted overflow-hidden">
                        <div className="h-full bg-stone-400" style={{ width: `${row.dataCompleteness}%` }} />
                      </div>
                      <span className={`font-mono text-xs tabular-nums ${dcLow ? "text-red-700 font-bold" : "text-muted-foreground"}`}>
                        {row.dataCompleteness}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionLabel>Severity Distribution</SectionLabel>
            <div className="mt-3 grid grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 mb-2">
                  Strengths · {es.strengths.length}
                </p>
                <div className="space-y-1.5">
                  {(["Critical", "Warning", "Info"] as const).map((sev) => {
                    const count = strSev[sev] ?? 0
                    return (
                      <div key={sev} className={`flex items-center gap-2 text-xs ${count === 0 ? "opacity-30" : ""}`}>
                        <span className="w-14 font-mono text-[10px] uppercase text-muted-foreground">{sev}</span>
                        <div className="flex-1 h-4 rounded bg-muted overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, count * 33)}%` }} />
                        </div>
                        <span className="w-4 font-mono text-xs font-bold text-emerald-700 tabular-nums">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-red-700 mb-2">
                  Risks · {es.risks.length}
                </p>
                <div className="space-y-1.5">
                  {(["Critical", "Warning", "Info"] as const).map((sev) => {
                    const count = riskSev[sev] ?? 0
                    return (
                      <div key={sev} className={`flex items-center gap-2 text-xs ${count === 0 ? "opacity-30" : ""}`}>
                        <span className="w-14 font-mono text-[10px] uppercase text-muted-foreground">{sev}</span>
                        <div className="flex-1 h-4 rounded bg-muted overflow-hidden">
                          <div className="h-full bg-red-600" style={{ width: `${Math.min(100, count * 33)}%` }} />
                        </div>
                        <span className="w-4 font-mono text-xs font-bold text-red-700 tabular-nums">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Thesis — compact pull quote */}
      <Card>
        <CardContent>
          <SectionLabel className="mb-2">Investment Thesis</SectionLabel>
          <p className="text-[15px] leading-[1.65] text-foreground/85 max-w-prose">
            {es.thesis}
          </p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent>
          <SectionLabel className="mb-3">Recommended Next Steps</SectionLabel>
          <ol className="space-y-2 max-w-prose">
            {es.recommendedNextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="font-mono text-[11px] text-amber-600 tabular-nums pt-1 shrink-0 w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground/85">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Export actions */}
      <section className="pt-4 border-t">
        <SectionLabel className="mb-3">Share this memo</SectionLabel>
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
              {downloading ? "Generating..." : downloadDone ? "Downloaded" : "Generate Word doc"}
            </Button>
          ) : (
            <Button variant="outline" disabled className="opacity-60">
              <Lock className="mr-2 h-4 w-4" />
              Word export
              <Badge variant="secondary" className="ml-2 text-[10px]">Pro+</Badge>
            </Button>
          )}

          {canEmail ? (
            <Button variant="outline" onClick={() => { setEmailOpen(true); setEmailSent(false); setEmailError("") }}>
              <Mail className="mr-2 h-4 w-4" />
              Email to a partner
            </Button>
          ) : (
            <Button variant="outline" disabled className="opacity-60">
              <Lock className="mr-2 h-4 w-4" />
              Email summary
              <Badge variant="secondary" className="ml-2 text-[10px]">Pro+</Badge>
            </Button>
          )}
          {!canExportWord && (
            <a href="/settings/billing" className="ml-auto inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors self-center">
              On {tierConfig.label} · upgrade to Professional →
            </a>
          )}
        </div>
      </section>

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
