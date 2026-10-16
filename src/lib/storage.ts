// Server-side file storage on Azure Blob. Replaces Supabase Storage (bucket
// "pitch-decks"), which ran out of quota. Object keys are unchanged — the
// `storage_path` values in `documents` and `funds` point at the same names.
//
// No SDK: access is via short-lived service SAS URLs signed with the account
// key, so the browser can PUT straight to Azure (skipping Vercel's body-size
// limit) and n8n can GET a plain URL, exactly like Supabase signed URLs.
//
// Env: AZURE_STORAGE_CONNECTION_STRING (with AccountName + AccountKey),
//      AZURE_STORAGE_CONTAINER (optional, default "sam-pitch-decks").

import { createHmac } from "crypto"

const SAS_VERSION = "2022-11-02"

type Config = { account: string; key: Buffer; endpoint: string; container: string }

let cached: Config | null = null

function config(): Config {
  if (cached) return cached
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set")

  const parts = new Map<string, string>()
  for (const segment of conn.split(";")) {
    const i = segment.indexOf("=")
    if (i > 0) parts.set(segment.slice(0, i).trim(), segment.slice(i + 1).trim())
  }
  const account = parts.get("AccountName")
  const key = parts.get("AccountKey")
  if (!account || !key) throw new Error("AZURE_STORAGE_CONNECTION_STRING needs AccountName and AccountKey")

  const suffix = parts.get("EndpointSuffix") || "core.windows.net"
  cached = {
    account,
    key: Buffer.from(key, "base64"),
    endpoint: parts.get("BlobEndpoint")?.replace(/\/$/, "") || `https://${account}.blob.${suffix}`,
    container: process.env.AZURE_STORAGE_CONTAINER || "sam-pitch-decks",
  }
  return cached
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/")
}

// Service SAS for a single blob (sr=b). Permissions: r=read, c=create,
// w=write, d=delete. Start time is backdated to absorb clock skew.
function signedBlobUrl(path: string, permissions: string, ttlSeconds: number) {
  const { account, key, endpoint, container } = config()
  const iso = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z")
  const start = iso(new Date(Date.now() - 5 * 60 * 1000))
  const expiry = iso(new Date(Date.now() + ttlSeconds * 1000))

  const stringToSign = [
    permissions,
    start,
    expiry,
    `/blob/${account}/${container}/${path}`,
    "", // signedIdentifier
    "", // signedIP
    "https",
    SAS_VERSION,
    "b", // signedResource
    "", // signedSnapshotTime
    "", // signedEncryptionScope
    "", "", "", "", "", // rscc, rscd, rsce, rscl, rsct
  ].join("\n")
  const sig = createHmac("sha256", key).update(stringToSign, "utf8").digest("base64")

  const qs = new URLSearchParams({
    sv: SAS_VERSION,
    sp: permissions,
    st: start,
    se: expiry,
    spr: "https",
    sr: "b",
    sig,
  })
  return `${endpoint}/${container}/${encodePath(path)}?${qs.toString()}`
}

// Read URL handed to the browser (download redirect) or to n8n.
export function createSignedUrl(path: string, ttlSeconds: number) {
  return signedBlobUrl(path, "r", ttlSeconds)
}

// Write-once URL for a direct browser upload. The client sends
// `If-None-Match: *` so an existing object is never overwritten.
export function createUploadUrl(path: string, ttlSeconds = 10 * 60) {
  return signedBlobUrl(path, "cw", ttlSeconds)
}

export async function uploadFile(path: string, body: Blob | Buffer, contentType: string) {
  const res = await fetch(createUploadUrl(path, 5 * 60), {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-blob-content-type": contentType || "application/octet-stream",
      "If-None-Match": "*",
    },
    body: body instanceof Blob ? body : new Uint8Array(body),
  })
  if (!res.ok) throw new Error(`Storage upload failed (${res.status})`)
}

export async function downloadFile(path: string): Promise<Buffer> {
  const res = await fetch(createSignedUrl(path, 60))
  if (!res.ok) throw new Error(res.status === 404 ? "File not found in storage" : `Storage download failed (${res.status})`)
  return Buffer.from(await res.arrayBuffer())
}

// Missing objects count as removed, matching Supabase's remove().
export async function removeFiles(paths: string[]) {
  await Promise.all(
    paths.map(async (path) => {
      const res = await fetch(signedBlobUrl(path, "d", 60), { method: "DELETE" })
      if (!res.ok && res.status !== 404) throw new Error(`Storage delete failed (${res.status})`)
    })
  )
}
