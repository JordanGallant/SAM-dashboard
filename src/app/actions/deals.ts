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
