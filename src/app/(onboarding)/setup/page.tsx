"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Briefcase,
} from "lucide-react"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"
import { upsertFund } from "@/app/actions/funds"
import { enrichLead } from "@/app/actions/lead-enrichment"
import { useFundProfile } from "@/hooks/use-fund-profile"
import { FundDocUploader } from "@/components/settings/fund-doc-uploader"
import { cn } from "@/lib/utils"

// Two steps, fund fields mandatory (pilot feedback #5). State persists to
// sessionStorage so a stray navigation/refresh during signup doesn't drop
// the user back to step 0 with an empty form (pilot feedback #46).

const STEPS = ["About you", "About your fund"] as const
const STORAGE_KEY = "sam:setup-wizard:v1"

type Persisted = {
  step: number
  firstName: string
  lastName: string
  phone: string
  role: string
  name: string
  website: string
  thesis: string
  stageFocus: string[]
  sectorFocus: string[]
  geoFocus: string[]
  ticketMin: string
  ticketMax: string
  additional: string
}

function readPersisted(): Partial<Persisted> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<Persisted>) : {}
  } catch {
    return {}
  }
}

export default function SetupPage() {
  const router = useRouter()
  const { fund, loading: fundLoading, refetch: refetchFund } = useFundProfile()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [prefilled, setPrefilled] = useState(false)
  const [hydratedFromStorage, setHydratedFromStorage] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [scrapeNote, setScrapeNote] = useState<string | null>(null)
  const [scrapeError, setScrapeError] = useState<string | null>(null)

  // Personal
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")

  // Fund
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [thesis, setThesis] = useState("")
  const [stageFocus, setStageFocus] = useState<string[]>([])
  const [sectorFocus, setSectorFocus] = useState<string[]>([])
  const [geoFocus, setGeoFocus] = useState<string[]>([])
  const [ticketMin, setTicketMin] = useState("")
  const [ticketMax, setTicketMax] = useState("")
  const [additional, setAdditional] = useState("")

  // Hydrate once from sessionStorage (covers tab-restore / accidental nav).
  useEffect(() => {
    if (hydratedFromStorage) return
    const saved = readPersisted()
    if (saved.step !== undefined) setStep(Math.min(saved.step, STEPS.length - 1))
    if (saved.firstName) setFirstName(saved.firstName)
    if (saved.lastName) setLastName(saved.lastName)
    if (saved.phone) setPhone(saved.phone)
    if (saved.role) setRole(saved.role)
    if (saved.name) setName(saved.name)
    if (saved.website) setWebsite(saved.website)
    if (saved.thesis) setThesis(saved.thesis)
    if (saved.stageFocus) setStageFocus(saved.stageFocus)
    if (saved.sectorFocus) setSectorFocus(saved.sectorFocus)
    if (saved.geoFocus) setGeoFocus(saved.geoFocus)
    if (saved.ticketMin) setTicketMin(saved.ticketMin)
    if (saved.ticketMax) setTicketMax(saved.ticketMax)
    if (saved.additional) setAdditional(saved.additional)
    setHydratedFromStorage(true)
  }, [hydratedFromStorage])

  // Persist on every change (after hydration to avoid clobbering with empties).
  useEffect(() => {
    if (!hydratedFromStorage || typeof window === "undefined") return
    const data: Persisted = {
      step, firstName, lastName, phone, role,
      name, website, thesis, stageFocus, sectorFocus, geoFocus,
      ticketMin, ticketMax, additional,
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // sessionStorage full / disabled — non-fatal.
    }
  }, [
    hydratedFromStorage, step, firstName, lastName, phone, role,
    name, website, thesis, stageFocus, sectorFocus, geoFocus,
    ticketMin, ticketMax, additional,
  ])

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
    setPrefilled(true)
  }, [fund, fundLoading, prefilled])

  function toggle(arr: string[], value: string, setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  // Pilot #2: scrape the fund website during onboarding to autofill the
  // checkboxes — the existing /api/fund-website handler writes the fund row
  // directly, so we just need to refetch and let prefill copy values back.
  function looksLikeUrl(s: string) {
    if (!s) return false
    return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\/?#].*)?$/i.test(s.trim())
  }
  async function handleScrape() {
    if (!looksLikeUrl(website)) {
      setScrapeError("Enter a valid website URL first")
      return
    }
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
      const additionalUpdated = Boolean(data.additionalUpdated)

      // Re-prefill from the freshly-written fund row.
      setPrefilled(false)
      await refetchFund()

      const parts: string[] = []
      if (auto.length) parts.push(`Auto-filled: ${auto.join(", ")}`)
      if (additionalUpdated) parts.push("Added to additional info")
      setScrapeNote(parts.join(" · ") || "Scraped — nothing new to fill in")
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "Could not scrape that site")
    } finally {
      setScraping(false)
    }
  }

  async function handleComplete() {
    // Pilot #5: validate the fund essentials before letting the user finish —
    // these drive Fund Fit scoring and were too easy to skip before.
    const missing: string[] = []
    if (!name.trim()) missing.push("fund name")
    if (!thesis.trim()) missing.push("investment thesis")
    if (stageFocus.length === 0) missing.push("stage focus")
    if (sectorFocus.length === 0) missing.push("sector focus")
    if (geoFocus.length === 0) missing.push("geography")
    if (!ticketMin || !ticketMax) missing.push("ticket size (min + max)")
    if (missing.length > 0) {
      setError(`Please complete: ${missing.join(", ")}.`)
      setStep(1)
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
    })

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    // Clear the wizard cache once the fund profile is committed.
    if (typeof window !== "undefined") {
      try { window.sessionStorage.removeItem(STORAGE_KEY) } catch {}
    }

    void enrichLead({ firstName, lastName, phone, role }).catch(() => {})
    router.push("/deals")
  }

  return (
    <div className="space-y-7">
      {/* Step indicator — clickable for back-nav (pilot #4). */}
      <div className="flex items-center justify-center gap-3">
        {STEPS.map((label, i) => {
          const active = i === step
          const done = i < step
          const clickable = i < step
          const inner = (
            <>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-mono text-[12px] font-bold transition-all",
                  active
                    ? "bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-[#D4FF6B] shadow-md shadow-primary/20 ring-2 ring-primary/20 ring-offset-2"
                    : done
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase tracking-widest",
                  active ? "text-primary font-bold" : "text-muted-foreground",
                  clickable && "underline-offset-4 group-hover:underline"
                )}
              >
                {label}
              </span>
            </>
          )
          return (
            <div key={label} className="flex items-center gap-3">
              {clickable ? (
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className="group flex items-center gap-3 rounded-md px-1 -mx-1 hover:bg-foreground/5 transition-colors cursor-pointer"
                  aria-label={`Back to ${label}`}
                >
                  {inner}
                </button>
              ) : (
                <div className="flex items-center gap-3">{inner}</div>
              )}
              {i < STEPS.length - 1 && (
                <div className="h-px w-12 bg-border ml-1" />
              )}
            </div>
          )
        })}
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white ring-1 ring-foreground/10 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
            {step === 0 ? (
              <User className="h-5 w-5 text-[#0F3D2E]" />
            ) : (
              <Briefcase className="h-5 w-5 text-[#0F3D2E]" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Step {step + 1} of {STEPS.length}
            </p>
            <h1 className="font-heading text-[20px] font-bold tracking-[-0.01em] leading-tight text-[#0A2E22]">
              {STEPS[step]}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-5">
            <p className="text-[13.5px] text-muted-foreground max-w-md leading-relaxed">
              Just so we know who&apos;s on the other side. Skip anything you don&apos;t want to share — only your name + role help us tailor follow-ups.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Jordan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Gallant"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="Partner · Analyst · Angel · …"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  Phone{" "}
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    optional
                  </span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+31 6 …"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-7">
            {/* Fast path: 1-pager upload */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                  Fast path
                </span>
              </div>
              <FundDocUploader />
            </div>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-foreground/10" />
              <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                or fill it in
              </span>
              <div className="flex-1 border-t border-foreground/10" />
            </div>

            {/* All fund essentials — required for Fund Fit scoring (pilot #5). */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="fund-name">
                  Fund name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="fund-name"
                  placeholder="e.g. Horizon Ventures"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="flex items-center gap-2">
                  Website{" "}
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    autofills the rest
                  </span>
                </Label>
                <div className="flex items-stretch gap-2">
                  <Input
                    id="website"
                    placeholder="https://yourfund.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleScrape}
                    disabled={scraping || !looksLikeUrl(website)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-foreground/[0.04] hover:bg-foreground/[0.08] ring-1 ring-foreground/15 px-3 text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {scraping ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    )}
                    {scraping ? "Scraping…" : "Scrape"}
                  </button>
                </div>
                {scrapeNote && (
                  <p className="text-[11.5px] text-emerald-700 font-medium">{scrapeNote}</p>
                )}
                {scrapeError && (
                  <p className="text-[11.5px] text-red-700">{scrapeError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="thesis">
                  Investment thesis <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="thesis"
                  placeholder="What do you look for in investments?"
                  rows={3}
                  value={thesis}
                  onChange={(e) => setThesis(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Stage focus <span className="text-red-600">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {DEAL_STAGES.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={stageFocus.includes(s)}
                        onCheckedChange={() => toggle(stageFocus, s, setStageFocus)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Sector focus <span className="text-red-600">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {SECTORS.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={sectorFocus.includes(s)}
                        onCheckedChange={() => toggle(sectorFocus, s, setSectorFocus)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Geography <span className="text-red-600">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {GEOS.map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={geoFocus.includes(g)}
                        onCheckedChange={() => toggle(geoFocus, g, setGeoFocus)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Ticket size (EUR) <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-min" className="text-xs font-normal text-muted-foreground">
                      Minimum
                    </Label>
                    <Input
                      id="ticket-min"
                      type="number"
                      placeholder="250000"
                      value={ticketMin}
                      onChange={(e) => setTicketMin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-max" className="text-xs font-normal text-muted-foreground">
                      Maximum
                    </Label>
                    <Input
                      id="ticket-max"
                      type="number"
                      placeholder="2000000"
                      value={ticketMax}
                      onChange={(e) => setTicketMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="additional">
                  Anything else?{" "}
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    optional
                  </span>
                </Label>
                <Textarea
                  id="additional"
                  rows={3}
                  placeholder="Restrictions, side-letter constraints, preferences…"
                  value={additional}
                  onChange={(e) => setAdditional(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-foreground/10">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/deals"
              className="text-[12px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              Skip for now
            </Link>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={saving}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {saving ? "Saving…" : "Finish setup"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Helper note */}
      <p className="text-center text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        You can edit anything later in Settings · Fund profile
      </p>
    </div>
  )
}
