// One-off copy of every object in the Supabase "pitch-decks" bucket to Azure
// Blob, under the same object key (so `documents.storage_path` and
// `funds.one_pager_filename` keep working unchanged). Idempotent: objects that
// already exist in Azure are skipped, so it is safe to re-run after cutover to
// pick up anything uploaded in between. Read-only on the Supabase side.
//
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   AZURE_STORAGE_CONNECTION_STRING=... \
//   npx tsx scripts/migrate-storage-to-azure.ts [--dry-run]

import { createClient } from "@supabase/supabase-js"
import { createSignedUrl, uploadFile } from "../src/lib/storage"

const BUCKET = "pitch-decks"
const dryRun = process.argv.includes("--dry-run")

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

// Supabase list() is one level deep; folders come back with id === null.
async function listAll(prefix = ""): Promise<{ path: string; size: number; mimetype: string }[]> {
  const out: { path: string; size: number; mimetype: string }[] = []
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000, offset })
    if (error) throw new Error(`list ${prefix || "/"}: ${error.message}`)
    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.id === null) out.push(...(await listAll(path)))
      else out.push({ path, size: entry.metadata?.size ?? 0, mimetype: entry.metadata?.mimetype ?? "application/pdf" })
    }
    if (data.length < 1000) return out
  }
}

async function existsInAzure(path: string) {
  const res = await fetch(createSignedUrl(path, 60), { method: "HEAD" })
  return res.ok
}

const objects = await listAll()
const totalMb = objects.reduce((n, o) => n + o.size, 0) / 1024 / 1024
console.log(`${objects.length} objects, ${totalMb.toFixed(1)} MB in Supabase bucket "${BUCKET}"`)

let copied = 0, skipped = 0, failed = 0
for (const obj of objects) {
  if (await existsInAzure(obj.path)) {
    skipped++
    continue
  }
  if (dryRun) {
    console.log(`would copy ${obj.path}`)
    continue
  }
  try {
    const { data, error } = await supabase.storage.from(BUCKET).download(obj.path)
    if (error || !data) throw new Error(error?.message || "empty download")
    const buffer = Buffer.from(await data.arrayBuffer())
    if (obj.size && buffer.length !== obj.size) throw new Error(`size mismatch ${buffer.length} != ${obj.size}`)
    await uploadFile(obj.path, buffer, obj.mimetype)
    copied++
    console.log(`copied ${obj.path} (${(buffer.length / 1024).toFixed(0)} KB)`)
  } catch (err) {
    failed++
    console.error(`FAILED ${obj.path}: ${err instanceof Error ? err.message : err}`)
  }
}

console.log(`done: ${copied} copied, ${skipped} already in Azure, ${failed} failed`)
if (failed) process.exit(1)
