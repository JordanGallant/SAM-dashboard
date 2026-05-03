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
  ChevronDown,
  ChevronUp,
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

// Two steps. Required-only-where-essential. The 1-pager upload at the top of
// step 2 is the fast path — most users with a real fund mandate doc never
// touch the checkboxes below.

const STEPS = ["About you", "About your fund"] as const

export default function SetupPage() {
  const router = useRouter()
  const { fund, loading: fundLoading } = useFundProfile()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [prefilled, setPrefilled] = useState(false)
  const [showFundDetails, setShowFundDetails] = useState(false)

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

  async function handleComplete() {
    if (!name.trim()) {
      setError("Fund name is required")
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

    void enrichLead({ firstName, lastName, phone, role }).catch(() => {})
    router.push("/deals")
  }

  return (
    <div className="space-y-7">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3">
        {STEPS.map((label, i) => {
          const active = i === step
          const done = i < step
          return (
            <div key={label} className="flex items-center gap-3">
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
                  active ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
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

            {/* Required minimum */}
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
              <p className="text-[11px] text-muted-foreground">
                The only required field. Everything else can be added later in Settings.
              </p>
            </div>

            {/* Collapsible "more details" */}
            <div className="rounded-xl ring-1 ring-foreground/10 bg-muted/30">
              <button
                type="button"
                onClick={() => setShowFundDetails((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left"
              >
                <div>
                  <p className="font-heading text-[13.5px] font-bold text-[#0A2E22]">
                    Add more details
                  </p>
                  <p className="text-[11.5px] text-muted-foreground">
                    Stage, sector, geography, ticket size, restrictions
                  </p>
                </div>
                {showFundDetails ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {showFundDetails && (
                <div className="border-t border-foreground/10 p-5 space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourfund.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="thesis">Investment thesis</Label>
                    <Textarea
                      id="thesis"
                      placeholder="What do you look for in investments?"
                      rows={3}
                      value={thesis}
                      onChange={(e) => setThesis(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stage focus</Label>
                    <div className="flex flex-wrap gap-3">
                      {DEAL_STAGES.map((s) => (
                        <label
                          key={s}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
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
                    <Label>Sector focus</Label>
                    <div className="flex flex-wrap gap-3">
                      {SECTORS.map((s) => (
                        <label
                          key={s}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
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
                    <Label>Geography</Label>
                    <div className="flex flex-wrap gap-3">
                      {GEOS.map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
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
                    <Label>Ticket size (EUR)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="ticket-min"
                          className="text-xs font-normal text-muted-foreground"
                        >
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
                        <Label
                          htmlFor="ticket-max"
                          className="text-xs font-normal text-muted-foreground"
                        >
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
                    <Label htmlFor="additional">Anything else?</Label>
                    <Textarea
                      id="additional"
                      rows={3}
                      placeholder="Restrictions, side-letter constraints, preferences…"
                      value={additional}
                      onChange={(e) => setAdditional(e.target.value)}
                    />
                  </div>
                </div>
              )}
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
