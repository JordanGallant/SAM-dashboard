"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2, Trash2 } from "lucide-react"
import { uploadDocument, deleteDocument } from "@/app/actions/documents"
import type { DealDocument, DocType } from "@/lib/types/deal"

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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("docType", docType)

    const result = await uploadDocument(dealId, formData)

    if (result.error) {
      setError(result.error)
    } else {
      onChange()
      window.dispatchEvent(new CustomEvent("deal:changed", { detail: { dealId } }))
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleDelete(documentId: string) {
    await deleteDocument(documentId, dealId)
    onChange()
    window.dispatchEvent(new CustomEvent("deal:changed", { detail: { dealId } }))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Pitch Deck & Supporting Documents</CardTitle>
        <p className="text-xs text-muted-foreground">
          Upload the pitch deck first. Transcripts and DD docs are optional but improve analysis quality.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {/* Upload zone */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={docType} onValueChange={(v) => setDocType(v as DocType)}>
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(docTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>

        {/* Documents list */}
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-md border p-2 text-sm">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{doc.filename}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {docTypeLabels[doc.docType]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {(doc.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(doc.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No pitch deck uploaded yet</p>
        )}
      </CardContent>
    </Card>
  )
}
