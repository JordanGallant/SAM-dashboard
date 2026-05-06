"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { PipelineStatus } from "@/lib/types/deal"

export async function updateDealStatus(dealId: string, status: PipelineStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("deals")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", dealId)

  if (error) return { error: error.message }
  revalidatePath("/deals")
  revalidatePath(`/deals/${dealId}`)
  return { success: true }
}

export async function deleteDeal(dealId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("deals").delete().eq("id", dealId)
  if (error) return { error: error.message }
  revalidatePath("/deals")
  return { success: true }
}

// Pilot #10: deck-name extraction sometimes fails (e.g. filenames with parens
// or numbers). Let the user fix it from the deal page.
export async function renameDeal(dealId: string, companyName: string) {
  const trimmed = companyName.trim()
  if (!trimmed) return { error: "Company name cannot be empty" }
  if (trimmed.length > 120) return { error: "Company name is too long" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("deals")
    .update({ company_name: trimmed, updated_at: new Date().toISOString() })
    .eq("id", dealId)

  if (error) return { error: error.message }
  revalidatePath("/deals")
  revalidatePath(`/deals/${dealId}`)
  return { success: true }
}
