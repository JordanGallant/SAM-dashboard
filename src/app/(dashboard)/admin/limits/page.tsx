"use client"

import { useEffect, useState, useTransition } from "react"
import { Shield, Loader2, Check, AlertCircle, Building2 } from "lucide-react"
import {
  listAllFundsForAdmin,
  updateFundLimits,
  type AdminFundRow,
} from "@/app/actions/admin-limits"

// Admin-only editor for per-fund seat + memo overrides. Gated server-side
// (the action returns "Not authorized" for non-admins). We render the
// access-denied banner in that case so non-admins who guess the URL get a
// clean response instead of broken UI.
export default function AdminLimitsPage() {
  const [rows, setRows] = useState<AdminFundRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    setLoading(true)
    const res = await listAllFundsForAdmin()
    if ("error" in res) {
      setError(res.error)
      setRows(null)
    } else {
      setError(null)
      setRows(res.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading funds…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-red-200 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-red-700">Not authorized</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              This area is restricted. If you should have access, ask the
              platform admin to add your email to <code>ADMIN_EMAILS</code>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-2 inline-flex items-center gap-2 text-3xl md:text-4xl font-bold font-heading tracking-[-0.025em] text-[#0A0A0A]">
          <Shield className="h-7 w-7 text-[#0F3D2E]" />
          Per-fund limit overrides
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground max-w-2xl">
          Bend the seat cap or monthly memo cap for individual customers
          without changing tier pricing. Leave a field blank to fall back to
          the tier default. Values apply immediately — the customer&apos;s
          billing page and member roster reflect them on next load.
        </p>
      </div>

      {(rows ?? []).length === 0 && (
        <p className="text-muted-foreground text-sm">No funds yet.</p>
      )}

      <div className="space-y-4">
        {(rows ?? []).map((row) => (
          <FundCard key={row.fundId} row={row} onSaved={refresh} />
        ))}
      </div>
    </div>
  )
}

function FundCard({ row, onSaved }: { row: AdminFundRow; onSaved: () => void }) {
  const [seats, setSeats] = useState<string>(
    row.seatsOverride != null ? String(row.seatsOverride) : "",
  )
  const [memos, setMemos] = useState<string>(
    row.memosOverride != null ? String(row.memosOverride) : "",
  )
  const [pending, startTransition] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [justSaved, setJustSaved] = useState(false)

  function fmtCap(n: number) {
    return n === -1 ? "Unlimited" : String(n)
  }

  const effectiveSeats = seats.trim() ? Number(seats) : row.tierSeats
  const effectiveMemos = memos.trim() ? Number(memos) : row.tierMemos

  function handleSave() {
    setSaveError(null)
    setJustSaved(false)
    const seatsNum = seats.trim() ? Number(seats) : null
    const memosNum = memos.trim() ? Number(memos) : null
    if (seatsNum !== null && (!Number.isFinite(seatsNum) || seatsNum <= 0)) {
      setSaveError("Seats must be a positive number, or empty for tier default.")
      return
    }
    if (memosNum !== null && (!Number.isFinite(memosNum) || memosNum <= 0)) {
      setSaveError("Memos must be a positive number, or empty for tier default.")
      return
    }
    startTransition(async () => {
      const res = await updateFundLimits({
        fundId: row.fundId,
        seatsOverride: seatsNum,
        memosOverride: memosNum,
      })
      if ("error" in res) {
        setSaveError(res.error)
      } else {
        setJustSaved(true)
        onSaved()
        setTimeout(() => setJustSaved(false), 2500)
      }
    })
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#0F3D2E]/70" />
            <p className="font-heading font-bold text-[15.5px] text-[#0A0A0A]">
              {row.fundName}
            </p>
            <span className="inline-flex items-center rounded-full bg-foreground/[0.05] ring-1 ring-foreground/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest">
              {row.ownerTier}
            </span>
            <span
              className={
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest " +
                (row.ownerStatus === "active" || row.ownerStatus === "trial"
                  ? "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700"
                  : "bg-red-50 ring-1 ring-red-200 text-red-700")
              }
            >
              {row.ownerStatus}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{row.ownerEmail}</p>
          <p className="mt-2 text-[11.5px] text-muted-foreground font-mono tabular-nums">
            {row.memberCount} member{row.memberCount === 1 ? "" : "s"} ·{" "}
            {row.pendingInvites} pending invite{row.pendingInvites === 1 ? "" : "s"} ·{" "}
            {row.memosThisMonth} memo{row.memosThisMonth === 1 ? "" : "s"} this month
          </p>
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <OverrideField
          label="Seats"
          tierDefault={row.tierSeats}
          value={seats}
          onChange={setSeats}
          effective={effectiveSeats}
          fmtCap={fmtCap}
          disabled={pending}
        />
        <OverrideField
          label="Memos / month"
          tierDefault={row.tierMemos}
          value={memos}
          onChange={setMemos}
          effective={effectiveMemos}
          fmtCap={fmtCap}
          disabled={pending}
        />
      </div>

      {saveError && (
        <div className="mt-3 rounded-xl bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[13px] text-red-700">
          {saveError}
        </div>
      )}

      <div className="mt-5 flex items-center justify-end gap-3">
        {justSaved && (
          <span className="inline-flex items-center gap-1 text-[12.5px] text-emerald-700 font-medium">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F3D2E] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#0F3D2E]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save overrides
        </button>
      </div>
    </div>
  )
}

function OverrideField({
  label,
  tierDefault,
  value,
  onChange,
  effective,
  fmtCap,
  disabled,
}: {
  label: string
  tierDefault: number
  value: string
  onChange: (v: string) => void
  effective: number
  fmtCap: (n: number) => string
  disabled?: boolean
}) {
  return (
    <div className="rounded-xl bg-foreground/[0.03] ring-1 ring-foreground/10 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          {label}
        </p>
        <p className="text-[11px] font-mono tabular-nums text-muted-foreground">
          Tier default: {fmtCap(tierDefault)}
        </p>
      </div>
      <input
        type="number"
        min={1}
        step={1}
        placeholder={`Leave blank for ${fmtCap(tierDefault)}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-2 w-full rounded-lg bg-card ring-1 ring-foreground/10 px-3 py-2 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 disabled:opacity-60"
      />
      <p className="mt-2 text-[11px] text-muted-foreground">
        Effective:{" "}
        <span className="font-mono tabular-nums font-semibold text-[#0F3D2E]">
          {fmtCap(effective)}
        </span>
        {value.trim() && (
          <span className="ml-1.5 inline-flex items-center rounded-full bg-[#B5D33C]/30 ring-1 ring-[#B5D33C]/50 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest text-[#0F3D2E]">
            Custom
          </span>
        )}
      </p>
    </div>
  )
}
