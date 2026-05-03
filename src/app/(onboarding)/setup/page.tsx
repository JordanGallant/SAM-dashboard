"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"
import { upsertFund } from "@/app/actions/funds"
import { enrichLead } from "@/app/actions/lead-enrichment"
import { useFundProfile } from "@/hooks/use-fund-profile"

const steps = ["Fund Details", "Investment Focus", "Portfolio"]

export default function SetupPage() {
  const router = useRouter()
  const { fund, loading: fundLoading } = useFundProfile()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [prefilled, setPrefilled] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [thesis, setThesis] = useState("")
  const [stageFocus, setStageFocus] = useState<string[]>([])
  const [sectorFocus, setSectorFocus] = useState<string[]>([])
  const [geoFocus, setGeoFocus] = useState<string[]>([])
  const [ticketMin, setTicketMin] = useState("")
  const [ticketMax, setTicketMax] = useState("")
  const [additional, setAdditional] = useState("")
  const [portfolio, setPortfolio] = useState<string[]>(["", "", ""])

  // Pre-fill from existing fund profile if present (user returning to wizard)
  useEffect(() => {
    if (fundLoading || !fund || prefilled) return
    setName(fund.name ?? "")
    setWebsite(fund.website ?? "")
    setThesis(fund.thesis ?? "")
    setStageFocus(fund.stageFocus ?? [])
    setSectorFocus(fund.sectorFocus ?? [])
    setGeoFocus(fund.geoFocus ?? [])
    setTicketMin(fund.ticketSizeMin ? String(fund.ticketSizeMin) : "")
    setTicketMax(fund.ticketSizeMax ? String(fund.ticketSizeMax) : "")
    setAdditional(fund.additional ?? "")
    if (fund.portfolioCompanies && fund.portfolioCompanies.length > 0) {
      setPortfolio(fund.portfolioCompanies.concat(["", "", ""]).slice(0, Math.max(3, fund.portfolioCompanies.length)))
    }
    setPrefilled(true)
  }, [fund, fundLoading, prefilled])

  function toggle(arr: string[], value: string, setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  async function handleComplete() {
    if (!name.trim()) {
      setError("Fund name is required")
      setStep(0)
      return
    }
    setSaving(true)
    setError("")

    const result = await upsertFund({
      name,
      website: website || undefined,
      thesis: thesis || undefined,
      stageFocus,
      sectorFocus,
      geoFocus,
      ticketSizeMin: ticketMin ? parseInt(ticketMin) : undefined,
      ticketSizeMax: ticketMax ? parseInt(ticketMax) : undefined,
      additional: additional || undefined,
      portfolioCompanies: portfolio.filter((p) => p.trim()),
    })

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    // Sync personal details + fund context to HubSpot. Fire-and-forget on the
    // server side; never blocks routing.
    void enrichLead({ firstName, lastName, phone, role }).catch(() => {})

    router.push("/deals")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Tell us about your fund"}
            {step === 1 && "What do you invest in?"}
            {step === 2 && "Add your current portfolio companies"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          {step === 0 && (
            <>
              <div className="rounded-md bg-muted/40 px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                About you
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Jordan" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Gallant" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Partner, Analyst, Angel, …" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+31 6 …" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="rounded-md bg-muted/40 px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-3">
                Your fund
              </div>
              <div className="space-y-2">
                <Label htmlFor="fund-name">Fund Name *</Label>
                <Input id="fund-name" placeholder="e.g. Horizon Ventures" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourfund.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thesis">Investment Thesis</Label>
                <Textarea id="thesis" placeholder="What do you look for in investments?" rows={4} value={thesis} onChange={(e) => setThesis(e.target.value)} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
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
                <Label>Geography Focus</Label>
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
                  The range you typically invest per deal.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-min" className="text-xs font-normal text-muted-foreground">Minimum</Label>
                    <Input id="ticket-min" type="number" placeholder="250000" value={ticketMin} onChange={(e) => setTicketMin(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-max" className="text-xs font-normal text-muted-foreground">Maximum</Label>
                    <Input id="ticket-max" type="number" placeholder="2000000" value={ticketMax} onChange={(e) => setTicketMax(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional">Additional</Label>
                <p className="text-xs text-muted-foreground">
                  Restrictions, side-letter constraints, or anything else SAM should weigh when scoring fund fit (e.g. &quot;no defense or gambling&quot;, &quot;must be GDPR-ready&quot;, &quot;EU-only LPs&quot;). Optional.
                </p>
                <Textarea
                  id="additional"
                  rows={4}
                  placeholder="Anything outside the standard fields…"
                  value={additional}
                  onChange={(e) => setAdditional(e.target.value)}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                Add portfolio companies to enable conflict checking. You can skip this and add them later.
              </p>
              {portfolio.map((p, i) => (
                <Input
                  key={i}
                  placeholder={`Company ${i + 1}`}
                  value={p}
                  onChange={(e) => {
                    const next = [...portfolio]
                    next[i] = e.target.value
                    setPortfolio(next)
                  }}
                />
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => setPortfolio([...portfolio, ""])}>+ Add another</Button>
            </>
          )}

          <div className="flex gap-2 pt-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={saving}>Back</Button>
            )}
            <div className="flex-1" />
            <Link href="/deals" className={buttonVariants({ variant: "ghost" })}>Skip</Link>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleComplete} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
