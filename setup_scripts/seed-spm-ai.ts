/**
 * One-off seeder: drop "SPM AI" into sam@admin.com so the dashboard
 * has an SPM AI deal to screenshot. Replaces any prior SPM AI deal
 * on this account.
 *
 * Run with: cd /root/SAM/app && npx tsx setup_scripts/seed-spm-ai.ts
 */
import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { sampleAnalysis } from "../src/lib/sample-analysis"
import { mockFundProfile } from "./seed-data/fund-profile"

config({ path: ".env.local" })

const ADMIN_EMAIL = "sam@admin.com"

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: users, error: userErr } = await supabase.auth.admin.listUsers()
  if (userErr) throw userErr
  const adminUser = users.users.find((u) => u.email === ADMIN_EMAIL)
  if (!adminUser) throw new Error(`User ${ADMIN_EMAIL} not found.`)
  const userId = adminUser.id
  console.log(`User: ${userId}`)

  // Make sure the profile can reach the dashboard — middleware blocks
  // inactive non-trial accounts. Bump to trial well into the future.
  const trialEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  const { error: profErr } = await supabase
    .from("profiles")
    .update({
      subscription_status: "trial",
      trial_ends_at: trialEnd,
      tier: "professional",
    })
    .eq("id", userId)
  if (profErr) throw profErr
  console.log("Profile bumped to professional/trial")

  // Wipe any prior SPM AI deal on this account so re-runs are idempotent.
  const { data: priorDeals } = await supabase
    .from("deals")
    .select("id")
    .eq("user_id", userId)
    .eq("company_name", "SPM AI")
  const priorIds = priorDeals?.map((d) => d.id) ?? []
  if (priorIds.length) {
    await supabase.from("analyses").delete().in("deal_id", priorIds)
    await supabase.from("documents").delete().in("deal_id", priorIds)
    await supabase.from("deals").delete().in("id", priorIds)
  }

  // Make sure a fund exists for this user.
  const { data: existingFunds } = await supabase
    .from("funds")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
  let fundId = existingFunds?.[0]?.id
  if (!fundId) {
    const { data: fund, error: fundErr } = await supabase
      .from("funds")
      .insert({
        user_id: userId,
        name: mockFundProfile.name,
        website: mockFundProfile.website,
        thesis: mockFundProfile.thesis,
        stage_focus: mockFundProfile.stageFocus,
        sector_focus: mockFundProfile.sectorFocus,
        geo_focus: mockFundProfile.geoFocus,
        ticket_size_min: mockFundProfile.ticketSizeMin,
        ticket_size_max: mockFundProfile.ticketSizeMax,
        fund_size: mockFundProfile.fundSize,
        portfolio_companies: mockFundProfile.portfolioCompanies,
      })
      .select()
      .single()
    if (fundErr) throw fundErr
    fundId = fund.id
    console.log(`Fund created: ${fundId}`)
  } else {
    console.log(`Fund exists: ${fundId}`)
  }

  // Insert the SPM AI deal.
  const { data: dealRow, error: dealErr } = await supabase
    .from("deals")
    .insert({
      user_id: userId,
      fund_id: fundId,
      company_name: "SPM AI",
      stage: sampleAnalysis.executiveSummary.stage,
      status: "Reviewing",
      source: "Inbound demo",
      tags: ["B2B SaaS", "Procurement"],
    })
    .select()
    .single()
  if (dealErr) throw dealErr
  console.log(`Deal: ${dealRow.id}`)

  // Attach the sample analysis JSON to it.
  const { error: analysisErr } = await supabase.from("analyses").insert({
    deal_id: dealRow.id,
    status: "completed",
    result: sampleAnalysis,
    completed_at: new Date().toISOString(),
  })
  if (analysisErr) throw analysisErr

  console.log("\n✓ SPM AI deal seeded for sam@admin.com")
  console.log(`  Open: /deals/${dealRow.id}/summary`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
