"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { useFundProfile } from "@/hooks/use-fund-profile"
import { upsertFund } from "@/app/actions/funds"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"
import { FundDocUploader } from "@/components/settings/fund-doc-uploader"

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
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
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
            <Label>Additional</Label>
            <p className="text-xs text-muted-foreground">
              Restrictions, side-letter constraints, or anything else SAM should weigh when scoring fund fit (e.g. &quot;no defense or gambling&quot;, &quot;must be GDPR-ready&quot;, &quot;EU-only LPs&quot;).
            </p>
            <Textarea
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              rows={4}
              placeholder="Anything outside the standard fields…"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {saved && <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />}
        {saved ? "Saved" : "Save Changes"}
      </Button>
    </div>
  )
}
