"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, FileText, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { useUpload } from "@/components/upload-context"

const STEPS = [
  "Reading pitch deck",
  "Extracting company info",
  "Creating deal",
  "Starting analysis",
] as const

export default function UploadingPage() {
  const router = useRouter()
  const { pendingFile, setPendingFile } = useUpload()
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!pendingFile) {
      router.replace("/deals")
      return
    }
    if (startedRef.current) return
    startedRef.current = true

    const file = pendingFile

    const cycle = setInterval(() => {
      setStepIndex((s) => Math.min(s + 1, STEPS.length - 1))
    }, 4000)

    ;(async () => {
      try {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/upload-deck", { method: "POST", body: form })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) throw new Error(data.error || "Upload failed")
        if (!data.dealId) throw new Error("Server did not return a deal id")

        setCompanyName(data.companyName ?? null)
        setStepIndex(STEPS.length - 1)
        clearInterval(cycle)
        setPendingFile(null)
        router.replace(`/deals/${data.dealId}/summary`)
      } catch (err) {
        clearInterval(cycle)
        setError(err instanceof Error ? err.message : "Upload failed")
      }
    })()

    return () => clearInterval(cycle)
  }, [pendingFile, router, setPendingFile])

  function handleCancel() {
    setPendingFile(null)
    router.replace("/deals")
  }

  if (!pendingFile && !error) {
    return null
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          Cancel
        </button>

        <div className="rounded-3xl border border-[#0F3D2E]/10 bg-white p-8 shadow-sm">
          {/* File chip */}
          {pendingFile && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#F4FAF6]/50 ring-1 ring-[#0F3D2E]/10 p-3">
              <div className="grid place-items-center h-10 w-10 shrink-0 rounded-xl bg-white ring-1 ring-[#0F3D2E]/10">
                <FileText className="h-4 w-4 text-[#0F3D2E]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#0A2E22]">{pendingFile.name}</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  {(pendingFile.size / 1024 / 1024).toFixed(1)} MB · PDF
                </p>
              </div>
            </div>
          )}

          {error ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-red-50 ring-1 ring-red-200 p-4">
                <AlertCircle className="h-5 w-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading text-sm font-bold text-red-900">Upload failed</p>
                  <p className="mt-1 text-[13px] text-red-900/80">{error}</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="w-full rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white py-2.5 text-sm font-semibold hover:-translate-y-0.5 transition-all"
              >
                Back to Dealroom
              </button>
            </div>
          ) : (
            <>
              <div className="mb-2 text-center">
                <h2 className="font-heading text-lg font-bold text-[#0A2E22]">
                  {companyName ? `Preparing ${companyName}` : "Preparing your deal"}
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  This usually takes 10–20 seconds.
                </p>
              </div>

              <ol className="mt-6 space-y-3">
                {STEPS.map((label, i) => {
                  const done = i < stepIndex
                  const active = i === stepIndex
                  return (
                    <li key={label} className="flex items-center gap-3">
                      <div
                        className={`grid place-items-center h-7 w-7 shrink-0 rounded-full transition-colors ${
                          done
                            ? "bg-emerald-100 text-emerald-700"
                            : active
                            ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                            : "bg-muted text-muted-foreground/50"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : active ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span className="text-[11px] font-mono font-bold tabular-nums">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[14px] ${
                          done
                            ? "text-foreground/60"
                            : active
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {label}
                        {active && <span className="text-muted-foreground">…</span>}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
