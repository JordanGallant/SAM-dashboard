"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UploadState = {
  pendingFile: File | null
  setPendingFile: (f: File | null) => void
}

const UploadContext = createContext<UploadState | null>(null)

export function UploadProvider({ children }: { children: ReactNode }) {
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  return (
    <UploadContext.Provider value={{ pendingFile, setPendingFile }}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  const ctx = useContext(UploadContext)
  if (!ctx) throw new Error("useUpload must be used inside <UploadProvider>")
  return ctx
}
