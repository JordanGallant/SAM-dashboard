"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useFundProfile } from "@/hooks/use-fund-profile"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { upsertFund } from "@/app/actions/funds"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"

export default function FundProfilePage() {
  const { fund, loading, refetch } = useFundProfile()
  const { isAdmin } = useIsAdmin()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [thesis, setThesis] = useState("")
  const [stageFocus, setStageFocus] = useState<string[]>([])
  const [sectorFocus, setSectorFocus] = useState<string[]>([])
  const [geoFocus, setGeoFocus] = useState<string[]>([])
  const [ticketMin, setTicketMin] = useState("")
  const [ticketMax, setTicketMax] = useState("")

  useEffect(() => {
    if (fund) {
      setName(fund.name)
      setWebsite(fund.website ?? "")
      setThesis(fund.thesis ?? "")
      setStageFocus(fund.stageFocus ?? [])
      setSectorFocus(fund.sectorFocus ?? [])
      setGeoFocus(fund.geoFocus ?? [])
      setTicketMin(fund.ticketSizeMin ? String(fund.ticketSizeMin) : "")
      setTicketMax(fund.ticketSizeMax ? String(fund.ticketSizeMax) : "")
    }
  }, [fund])

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
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">Fund Profile</h1>

      {isAdmin && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
          Admin account uses demo data. Changes save but won&apos;t be visible on the admin view.
        </div>
      )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Ticket (EUR)</Label>
              <Input type="number" value={ticketMin} onChange={(e) => setTicketMin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Max Ticket (EUR)</Label>
              <Input type="number" value={ticketMax} onChange={(e) => setTicketMax(e.target.value)} />
            </div>
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
