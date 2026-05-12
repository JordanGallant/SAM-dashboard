"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle2, Sparkles, Globe, AlertCircle } from "lucide-react"
import { useFundProfile } from "@/hooks/use-fund-profile"
import { upsertFund } from "@/app/actions/funds"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"
import { FundDocUploader } from "@/components/settings/fund-doc-uploader"

// Cheap client-side check — server still validates. Lets us disable the
// Scrape button until the user has typed something that looks URL-shaped,
// without being so strict we reject "indexventures.com" (no scheme).
function looksLikeUrl(s: string): boolean {
  const t = s.trim()
  if (t.length < 4) return false
  // Allow bare domain or full URL.
  return /^(https?:\/\/)?[^\s.]+\.[^\s]+/i.test(t)
}

const FIELD_LABELS: Record<string, string> = {
  name: "fund name",
  website: "website",
  thesis: "thesis",
  stageFocus: "stage focus",
  sectorFocus: "sector focus",
  geoFocus: "geography",
  ticketSizeMin: "min ticket",
  ticketSizeMax: "max ticket",
  additional: "restrictions",
}

export default function FundProfilePage() {
  const { fund, loading, refetch } = useFundProfile()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [prefillKey, setPrefillKey] = useState(0)
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [thesis, setThesis] = useState("")
  const [stageFocus, setStageFocus] = useState<string[]>([])
  const [sectorFocus, setSectorFocus] = useState<string[]>([])
  const [geoFocus, setGeoFocus] = useState<string[]>([])
  const [ticketMin, setTicketMin] = useState("")
  const [ticketMax, setTicketMax] = useState("")
  const [additional, setAdditional] = useState("")

  // Website-scrape state. Separate from the Save flow because scraping is a
  // one-shot enrichment action, not a save.
  const [scraping, setScraping] = useState(false)
  const [scrapeNote, setScrapeNote] = useState<string | null>(null)
  const [scrapeError, setScrapeError] = useState<string | null>(null)

  useEffect(() => {
    if (fund) {
      // Re-key on prefillKey so we re-pull from the fund row after a doc
      // upload populates new fields server-side.
      void prefillKey
      const looksPlaceholder = fund.name === "(awaiting fund details)"
      setName(looksPlaceholder ? "" : fund.name)
      setWebsite(fund.website ?? "")
      setThesis(fund.thesis ?? "")
      setStageFocus(fund.stageFocus ?? [])
      setSectorFocus(fund.sectorFocus ?? [])
      setGeoFocus(fund.geoFocus ?? [])
      setTicketMin(fund.ticketSizeMin ? String(fund.ticketSizeMin) : "")
      setTicketMax(fund.ticketSizeMax ? String(fund.ticketSizeMax) : "")
      setAdditional(fund.additional ?? "")
    }
  }, [fund, prefillKey])

  function toggle(arr: string[], value: string, setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    setSaved(false)

    const result = await upsertFund({
      name,
      website,
      thesis,
      stageFocus,
      sectorFocus,
      geoFocus,
      ticketSizeMin: ticketMin ? parseInt(ticketMin) : undefined,
      ticketSizeMax: ticketMax ? parseInt(ticketMax) : undefined,
      additional,
    })

    if (result.error) setError(result.error)
    else {
      setSaved(true)
      await refetch()
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  async function handleScrape() {
    if (!looksLikeUrl(website)) return
    setScraping(true)
    setScrapeError(null)
    setScrapeNote(null)
    try {
      const res = await fetch("/api/fund-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: website.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Could not scrape that site")

      const auto: string[] = Array.isArray(data.autoFilledFields) ? data.autoFilledFields : []
      const additionalUpdated: boolean = Boolean(data.additionalUpdated)
      // Pull the freshly-merged values back into the form. Re-keying
      // prefillKey forces the useEffect to re-read fund state after refetch.
      await refetch()
      setPrefillKey((k) => k + 1)

      const parts: string[] = []
      if (auto.length) parts.push(`Auto-filled: ${auto.map((k) => FIELD_LABELS[k] ?? k).join(", ")}`)
      if (additionalUpdated) parts.push("Added to additional info")
      setScrapeNote(parts.join(" · ") || "Scraped — nothing new to fill in")
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "Could not scrape that site")
    } finally {
      setScraping(false)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Prefer the guided setup?</p>
              <p className="text-xs text-muted-foreground">Walk through the 3-step wizard instead of editing fields directly.</p>
            </div>
          </div>
          <Link href="/setup" className={buttonVariants({ variant: "outline", size: "sm", className: "shrink-0" })}>
            Use guided setup
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Mandate document</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload your fund 1-pager. SAM treats it as the authoritative source on your thesis, restrictions, and stage focus — much richer than checkboxes.
          </p>
        </CardHeader>
        <CardContent>
          <FundDocUploader
            onUploaded={async () => {
              await refetch()
              setPrefillKey((k) => k + 1)
            }}
            onRemoved={async () => {
              await refetch()
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Fund Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-2">
            <Label>Fund Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourfund.com"
                className="flex-1"
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={scraping || !looksLikeUrl(website)}
                title={
                  !looksLikeUrl(website)
                    ? "Enter a valid URL first"
                    : "Read your homepage and auto-fill the fields below"
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] px-4 py-2 text-[12.5px] font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm sm:shrink-0"
              >
                {scraping ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Globe className="h-3.5 w-3.5" />
                )}
                {scraping ? "Scraping…" : "Scrape website"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              SAM will read your homepage and fill in any empty fields below — and add the page summary to Additional info so Fund Fit has the context.
            </p>
            {scrapeNote && (
              <div className="rounded-md bg-emerald-50 ring-1 ring-emerald-200 p-2.5 text-[12.5px] text-emerald-800 flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-700" />
                <span>{scrapeNote}</span>
              </div>
            )}
            {scrapeError && (
              <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-2.5 text-[12.5px] text-red-700 flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{scrapeError}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Investment Thesis</Label>
            <Textarea value={thesis} onChange={(e) => setThesis(e.target.value)} rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Investment Focus</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stage Focus</Label>
            <div className="flex flex-wrap gap-3">
              {DEAL_STAGES.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={stageFocus.includes(s)} onCheckedChange={() => toggle(stageFocus, s, setStageFocus)} /> {s}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sector Focus</Label>
            <div className="flex flex-wrap gap-3">
              {SECTORS.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sectorFocus.includes(s)} onCheckedChange={() => toggle(sectorFocus, s, setSectorFocus)} /> {s}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Geography</Label>
            <div className="flex flex-wrap gap-3">
              {GEOS.map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={geoFocus.includes(g)} onCheckedChange={() => toggle(geoFocus, g, setGeoFocus)} /> {g}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ticket size (EUR)</Label>
            <p className="text-xs text-muted-foreground">
              The range you typically invest per deal. Used to flag deals where the raise size is a poor fit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal text-muted-foreground">Minimum</Label>
                <Input type="number" placeholder="250000" value={ticketMin} onChange={(e) => setTicketMin(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal text-muted-foreground">Maximum</Label>
                <Input type="number" placeholder="2000000" value={ticketMax} onChange={(e) => setTicketMax(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Additional mandate detail
              <span className="ml-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                used in fund-fit + Ask Sam
              </span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Restrictions, side-letter constraints, conviction notes — anything outside the
              standard fields. Sam sends this verbatim into Fund Fit scoring (Flow 10) and the
              Ask Sam co-pilot context, so it directly influences the assessment.
              Examples: &quot;no defense or gambling&quot;, &quot;must be GDPR-ready&quot;,
              &quot;EU-only LPs&quot;, &quot;avoid B2C marketplaces&quot;.
            </p>
            <Textarea
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              rows={4}
              placeholder="e.g. No defense, no gambling. EU-only LPs. Open to deeptech with clear regulatory pathway. Pass on anything pre-product."
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#B5D33C] text-[#0F3D2E] hover:bg-[#B5D33C]/90 [a]:hover:bg-[#B5D33C]/90 rounded-full px-5 py-2.5 font-semibold"
      >
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {saved && <CheckCircle2 className="mr-2 h-4 w-4 text-[#0F3D2E]" />}
        {saved ? "Saved" : "Save Changes"}
      </Button>
    </div>
  )
}
