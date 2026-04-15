"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { DocType } from "@/lib/types/deal"

export async function uploadDocument(dealId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const file = formData.get("file") as File | null
  const docType = (formData.get("docType") as DocType) || "other"

  if (!file || file.size === 0) {
    return { error: "No file provided" }
  }

  // Verify deal belongs to user
  const { data: deal } = await supabase
    .from("deals")
    .select("id, user_id")
    .eq("id", dealId)
    .single()

  if (!deal || deal.user_id !== user.id) {
    return { error: "Deal not found" }
  }

  // Upload to storage: {user_id}/{deal_id}/{filename}
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
  const storagePath = `${user.id}/${dealId}/${Date.now()}_${safeFilename}`

  const { error: uploadError } = await supabase.storage
    .from("pitch-decks")
    .upload(storagePath, file, { contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  // Insert documents row
  const { error: dbError } = await supabase.from("documents").insert({
    deal_id: dealId,
    filename: file.name,
    doc_type: docType,
    storage_path: storagePath,
    size_bytes: file.size,
  })

  if (dbError) {
    // Clean up orphaned file
    await supabase.storage.from("pitch-decks").remove([storagePath])
    return { error: dbError.message }
  }

  revalidatePath(`/deals/${dealId}`)
  return { success: true }
}

export async function deleteDocument(documentId: string, dealId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .single()

  if (doc?.storage_path) {
    await supabase.storage.from("pitch-decks").remove([doc.storage_path])
  }

  const { error } = await supabase.from("documents").delete().eq("id", documentId)
  if (error) return { error: error.message }

  revalidatePath(`/deals/${dealId}`)
  return { success: true }
}
