"use client"

// Mirrors deal-upload.tsx: client uploads PDF directly to Supabase Storage
// (skips Vercel's serverless body-size limit), then POSTs the storage path
// to /api/fund-doc which extracts the text and persists it onto the funds
// row. The doc text becomes authoritative fund context for Flow 10.

import { useEffect, useRef, useState } from "react"
import { UploadCloud, FileText, AlertCircle, Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { friendlyError, type FriendlyError } from "@/lib/errors"

const ACCEPTED_MIME = "application/pdf"
const ACCEPTED_EXT = ".pdf"
const MAX_BYTES = 10 * 1024 * 1024

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80)
}

type Status =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "have"; filename: string; uploadedAt: string; words?: number }

export function FundDocUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [error, setError] = useState<FriendlyError | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [removing, setRemoving] = useState(false)

  // Hydrate state from the funds row so the component reflects the saved doc.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: fund } = await supabase
          .from("funds")
          .select("one_pager_filename, one_pager_uploaded_at, one_pager_text")
          .eq("user_id", user.id)
          .maybeSingle()
        if (cancelled) return
        if (fund?.one_pager_filename && fund.one_pager_uploaded_at) {
          const wordCount = fund.one_pager_text
            ? fund.one_pager_text.split(/\s+/).filter(Boolean).length
            : undefined
          setStatus({
            kind: "have",
            filename: fund.one_pager_filename,
            uploadedAt: fund.one_pager_uploaded_at,
            words: wordCount,
          })
        }
      } catch {
        // Silent — fall back to idle state.
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function uploadFile(file: File) {
    setError(null)

    const isPdf = file.type === ACCEPTED_MIME || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      setError(friendlyError(`Only PDF files are supported. "${file.name}" is not a PDF.`, "upload"))
      return
    }
    if (file.size > MAX_BYTES) {
      setError(
        friendlyError(
          `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`,
          "upload"
        )
      )
      return
    }

    setStatus({ kind: "uploading" })
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const filename = `${Date.now()}_${safeName(file.name)}`
      const storagePath = `fund-docs/${user.id}/${filename}`

      const { error: upErr } = await supabase.storage
        .from("pitch-decks")
        .upload(storagePath, file, { contentType: file.type, upsert: false })
      if (upErr) throw new Error(upErr.message)

      const res = await fetch("/api/fund-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storagePath,
          filename: file.name,
          size: file.size,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        await supabase.storage.from("pitch-decks").remove([storagePath]).catch(() => {})
        throw new Error(data.error || "Could not process the document")
      }

      setStatus({
        kind: "have",
        filename: file.name,
        uploadedAt: data.uploadedAt || new Date().toISOString(),
        words: data.wordsExtracted,
      })
    } catch (err) {
      setStatus({ kind: "idle" })
      setError(friendlyError(err, "upload"))
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemove() {
    setRemoving(true)
    setError(null)
    try {
      const res = await fetch("/api/fund-doc", { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Could not remove the document")
      }
      setStatus({ kind: "idle" })
    } catch (err) {
      setError(friendlyError(err, "upload"))
    } finally {
      setRemoving(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXT}
        onChange={handleFileSelect}
        className="hidden"
      />

      {status.kind === "have" ? (
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-[14px] font-bold leading-tight truncate">
              {status.filename}
            </p>
            <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Uploaded{" "}
              {new Date(status.uploadedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {status.words ? ` · ${status.words.toLocaleString()} words read` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={removing}
              className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="grid place-items-center h-8 w-8 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
              aria-label="Remove document"
            >
              {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all py-8 px-5 text-center cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-foreground/15 bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"
          } ${status.kind === "uploading" ? "pointer-events-none opacity-70" : ""}`}
        >
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
            {status.kind === "uploading" ? (
              <Loader2 className="h-5 w-5 text-[#0F3D2E] animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5 text-[#0F3D2E]" />
            )}
          </div>
          <p className="mt-3 font-heading text-[14px] font-bold text-[#0A2E22]">
            {status.kind === "uploading"
              ? "Reading your document…"
              : "Drop a fund 1-pager here"}
          </p>
          <p className="mt-1 text-[12.5px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {status.kind === "uploading"
              ? "Extracting text and saving to your fund profile."
              : "Skip the checkboxes. SAM will read your mandate doc and treat it as the authoritative fund context for every Fund Fit run."}
          </p>
          {status.kind !== "uploading" && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
              <span className="h-1 w-1 rounded-full bg-primary" />
              PDF only · Max 10 MB · Optional
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error.title}</p>
            {error.hint && <p className="mt-0.5 text-[12.5px] text-red-700/85">{error.hint}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
