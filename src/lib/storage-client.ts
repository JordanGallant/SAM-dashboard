// Browser helpers for direct uploads to Azure Blob via /api/storage.
// See src/lib/storage.ts for the server side.

export async function uploadToStorage(storagePath: string, file: File, contentType?: string) {
  const signRes = await fetch("/api/storage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storagePath }),
  })
  const signed = await signRes.json().catch(() => ({}))
  if (!signRes.ok || !signed.url) throw new Error(signed.error || "Could not start upload")

  const putRes = await fetch(signed.url, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-blob-content-type": contentType || file.type || "application/octet-stream",
      "If-None-Match": "*",
    },
    body: file,
  })
  if (!putRes.ok) throw new Error(`Upload failed (${putRes.status})`)
}

export async function removeFromStorage(storagePath: string) {
  await fetch("/api/storage", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storagePath }),
  }).catch(() => {})
}
