"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2, Trash2, UploadCloud } from "lucide-react"
import { registerDocument, deleteDocument } from "@/app/actions/documents"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { DealDocument, DocType } from "@/lib/types/deal"

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024 // 50 MB cap to keep storage costs sane
const ACCEPTED = ".pdf,.docx,.txt,.md"

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
}

const docTypeLabels: Record<DocType, string> = {
  "pitch-deck": "Pitch Deck",
  "transcript": "Transcript",
  "dd-doc": "DD Document",
  "financial-model": "Financial Model",
  "other": "Other",
}

export function DealUpload({
  dealId,
  documents,
  onChange,
}: {
  dealId: string
  documents: DealDocument[]
  onChange: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [docType, setDocType] = useState<DocType>("pitch-deck")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    setError("")

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 50 MB.`)
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const storagePath = `${user.id}/${dealId}/${Date.now()}_${safeName(file.name)}`

      const { error: uploadError } = await supabase.storage
        .from("pitch-decks")
        .upload(storagePath, file, { contentType: file.type, upsert: false })

      if (uploadError) throw new Error(uploadError.message)

      const result = await registerDocument({
        dealId,
        filename: file.name,
        docType,
        storagePath,
        sizeBytes: file.size,
      })

      if (result.error) {
        await supabase.storage.from("pitch-decks").remove([storagePath])
        throw new Error(result.error)
      }

      onChange()
      window.dispatchEvent(new CustomEvent("deal:changed", { detail: { dealId } }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
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

  async function handleDelete(documentId: string) {
    await deleteDocument(documentId, dealId)
    onChange()
    window.dispatchEvent(new CustomEvent("deal:changed", { detail: { dealId } }))
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6 space-y-5">
      {/* Header — title + doc-type chooser. Wraps on small screens. */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h3 className="font-heading text-[15px] font-bold leading-tight">
            Pitch Deck &amp; Supporting Documents
          </h3>
          <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
            Upload the pitch deck first. Transcripts and DD docs are optional but improve analysis quality.
          </p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Document type
          </span>
          <Select value={docType} onValueChange={(v) => setDocType(v as DocType)}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(docTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop zone — scales with container, becomes a real focal point on wide screens */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!uploading) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center text-center cursor-pointer transition-all",
          "rounded-2xl border-2 border-dashed",
          "px-6 py-10 md:py-14 lg:py-16",
          "min-h-[180px] md:min-h-[220px]",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-foreground/15 bg-muted/20 hover:border-foreground/30 hover:bg-muted/40",
          uploading && "pointer-events-none opacity-70"
        )}
      >
        <div className="grid place-items-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary/10 ring-1 ring-primary/30">
          {uploading ? (
            <Loader2 className="h-6 w-6 md:h-7 md:w-7 text-primary animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          )}
        </div>
        <p className="mt-4 font-heading text-[15px] md:text-[17px] font-bold">
          {uploading ? "Uploading…" : "Drop a file here, or click to browse"}
        </p>
        <p className="mt-1.5 text-[12px] md:text-[13px] text-muted-foreground max-w-md">
          Accepted: PDF, DOCX, TXT, MD · Max 50&nbsp;MB
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5 pointer-events-none"
          tabIndex={-1}
          disabled={uploading}
        >
          <Upload className="mr-2 h-3.5 w-3.5" />
          Choose file
        </Button>
      </div>

      {/* Documents list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
            Uploaded ({documents.length})
          </p>
          <ul className="grid gap-2 md:grid-cols-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center gap-3 rounded-xl bg-muted/30 ring-1 ring-foreground/10 p-3 text-sm"
              >
                <div className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-background ring-1 ring-foreground/10">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{doc.filename}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {docTypeLabels[doc.docType]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {(doc.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handleDelete(doc.id)}
                  aria-label={`Delete ${doc.filename}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
