"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { UploadCloud, AlertCircle } from "lucide-react"
import { useUpload } from "@/components/upload-context"

type Variant = "hero" | "compact"

const ACCEPTED_MIME = "application/pdf"
const ACCEPTED_EXT = ".pdf"
const MAX_BYTES = 50 * 1024 * 1024

export function DeckUploader({
  variant = "hero",
  onCreated,
}: {
  variant?: Variant
  onCreated?: (dealId: string) => void
}) {
  void onCreated // accepted for API compat; the uploading page handles navigation
  const router = useRouter()
  const { setPendingFile } = useUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function pickFile(file: File) {
    setError(null)

    const isPdf = file.type === ACCEPTED_MIME || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      setError("Only PDF files are supported.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 50 MB.`)
      return
    }

    setPendingFile(file)
    router.push("/deals/uploading")
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) pickFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) pickFile(file)
  }

  if (variant === "compact") {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          <UploadCloud className="h-4 w-4" />
          Upload pitch deck
        </button>
        {error && (
          <span className="ml-2 inline-flex items-center gap-1 text-[12px] text-red-700">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </span>
        )}
      </>
    )
  }

  return (
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
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all py-16 px-6 text-center cursor-pointer ${
        dragOver
          ? "border-primary bg-primary/5"
          : "border-[#0F3D2E]/15 bg-white hover:border-[#0F3D2E]/30 hover:bg-[#F4FAF6]/40"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXT}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mb-5 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E]/5 to-[#00A86B]/10 ring-1 ring-[#0F3D2E]/10">
        <UploadCloud className="h-6 w-6 text-[#0F3D2E]" />
      </div>

      <h3 className="text-xl font-heading font-bold text-[#0A2E22]">
        Drop a pitch deck to get started
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
        Drag a PDF here or click to browse. We&apos;ll extract the company info and start the analysis automatically.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#0F3D2E]/15 bg-white px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#0F3D2E] shadow-sm">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        PDF only · Max 50 MB
      </div>

      {error && (
        <div className="mt-5 mx-auto max-w-md rounded-xl bg-red-50 ring-1 ring-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="text-left">{error}</span>
        </div>
      )}
    </div>
  )
}
