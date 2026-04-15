"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { DealStage, PipelineStatus } from "@/lib/types/deal"

export async function createDeal(input: {
  companyName: string
  stage: DealStage
  source?: string
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Get the user's fund (optional)
  const { data: fund } = await supabase
    .from("funds")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  const { data, error } = await supabase
    .from("deals")
    .insert({
      user_id: user.id,
      fund_id: fund?.id ?? null,
      company_name: input.companyName,
      stage: input.stage,
      status: "New",
      source: input.source ?? null,
      tags: input.tags ?? [],
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/deals")
  return { deal: data }
}

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
