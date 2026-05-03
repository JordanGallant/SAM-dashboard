"use client"

import { useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { DataCompleteness } from "@/components/dashboard/data-completeness"
import { SectionLabel } from "@/components/dashboard/section-label"
import { EditorialCard } from "@/components/dashboard/editorial"
import { useDeal } from "@/hooks/use-deal"
import { CircleDot, MessageSquareText, Info, Loader2 } from "lucide-react"

export default function MissingInfoPage() {
  const params = useParams()
  const dealId = params.dealId as string
  const { deal, refetch } = useDeal(dealId)
  const analysis = deal?.analysis
  const missing = analysis?.missingInfo
  const triggeredRef = useRef(false)

  // Backfill for deals that completed BEFORE the n8n Flow 9 → Flow 11 fan-out
  // shipped. For new deals this never runs because Flow 9 already populates
  // missing-info before the user lands here. One-shot per page lifetime.
  useEffect(() => {
    if (!analysis || triggeredRef.current) return
    if (missing && missing.sections.length > 0) return
    triggeredRef.current = true
    fetch("/api/analysis/missing-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId }),
    })
      .then((r) => r.ok ? null : r.json().then((d) => { throw new Error(d.error || "Trigger failed") }))
      .catch((err) => {
        console.error("Auto missing-info trigger failed:", err)
      })
    // Realtime + safety-net polls picks up the result.
    const t1 = setTimeout(() => refetch(), 15000)
    const t2 = setTimeout(() => refetch(), 45000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [analysis, missing, dealId, refetch])

  if (!missing) return <p className="text-sm text-muted-foreground">No missing info analysis available.</p>

  const isPending = missing.sections.length === 0 && analysis

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Analysis</SectionLabel>
        <h2 className="mt-1 text-lg font-semibold font-heading">Missing Information</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-[60ch]">
          Data gaps identified in the materials provided. Use these as follow-up questions before the first call.
        </p>
        <div className="mt-4">
          <DataCompleteness percentage={missing.overallCompleteness} />
        </div>
      </div>

      {isPending && (
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-muted/30 p-6 md:p-8 text-center">
          <Loader2 className="mx-auto h-5 w-5 text-muted-foreground/60 animate-spin" />
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Identifying data gaps and follow-up questions… this usually takes about 30 seconds.
          </p>
        </div>
      )}

      <div className="rounded-2xl ring-1 ring-primary/30 bg-primary/5 p-5 md:p-6">
        <div className="flex gap-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Missing information does not affect scores.</p>
            <p className="mt-1 text-xs text-primary leading-relaxed max-w-[60ch]">
              Data gaps are reported separately from domain scoring. &quot;Not found&quot; is never treated as a negative signal — sections with insufficient data are flagged as such, not marked weak.
            </p>
          </div>
        </div>
      </div>

      {missing.sections.map((section) => (
        <EditorialCard key={section.section} label={section.section}>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
            <p className="text-xs text-muted-foreground mb-5 max-w-[60ch]">{section.impact}</p>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <CircleDot className="h-3 w-3" /> Data gaps
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-5 border-t border-foreground/10">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <MessageSquareText className="h-3 w-3" /> Suggested follow-up questions
              </p>
              <ol className="space-y-1.5">
                {section.followUpQuestions.map((q, j) => (
                  <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-primary shrink-0">0{j + 1}</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </EditorialCard>
      ))}
    </div>
  )
}
