/**
 * Seed demo data for admin@sam.com into Supabase.
 * Run with: npx tsx setup_scripts/seed-demo.ts
 *
 * Creates:
 *  - 1 fund profile (Horizon Ventures)
 *  - 3 deals (Canaaro, VREY, Vint Labs)
 *  - Analyses for Canaaro and VREY
 */
import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { canaароAnalysis } from "./seed-data/analysis-canaaro"
import { vreyAnalysis } from "./seed-data/analysis-vrey"
import { mockFundProfile } from "./seed-data/fund-profile"

config({ path: ".env.local" })

const ADMIN_EMAIL = "admin@sam.com"

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find admin user
  const { data: users, error: userErr } = await supabase.auth.admin.listUsers()
  if (userErr) throw userErr
  const adminUser = users.users.find((u) => u.email === ADMIN_EMAIL)
  if (!adminUser) throw new Error(`Admin user ${ADMIN_EMAIL} not found. Create it first.`)
  const userId = adminUser.id
  console.log(`Found admin: ${userId}`)

  // Clear existing demo data
  console.log("Clearing existing admin data...")
  await supabase.from("analyses").delete().in("deal_id",
    (await supabase.from("deals").select("id").eq("user_id", userId)).data?.map(d => d.id) ?? []
  )
  await supabase.from("documents").delete().in("deal_id",
    (await supabase.from("deals").select("id").eq("user_id", userId)).data?.map(d => d.id) ?? []
  )
  await supabase.from("deals").delete().eq("user_id", userId)
  await supabase.from("funds").delete().eq("user_id", userId)

  // Seed fund profile
  console.log("Seeding fund profile...")
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
  console.log(`Fund seeded: ${fund.id}`)

  // Seed deals
  const deals = [
    {
      user_id: userId,
      fund_id: fund.id,
      company_name: "Canaaro",
      stage: "Seed",
      status: "Passed",
      source: "Inbound email",
      tags: ["GTM", "SaaS", "Sales Enablement"],
      analysis: canaароAnalysis,
    },
    {
      user_id: userId,
      fund_id: fund.id,
      company_name: "VREY",
      stage: "Pre-seed",
      status: "First Call",
      source: "Conference (Energy Transition Summit)",
      tags: ["CleanTech", "Energy", "Hardware"],
      analysis: vreyAnalysis,
    },
    {
      user_id: userId,
      fund_id: fund.id,
      company_name: "Vint Labs",
      stage: "Seed",
      status: "New",
      source: "Partner referral",
      tags: ["Infrastructure", "DevTools"],
      analysis: null,
    },
  ]

  for (const d of deals) {
    console.log(`Seeding ${d.company_name}...`)
    const { data: dealRow, error: dealErr } = await supabase
      .from("deals")
      .insert({
        user_id: d.user_id,
        fund_id: d.fund_id,
        company_name: d.company_name,
        stage: d.stage,
        status: d.status,
        source: d.source,
        tags: d.tags,
      })
      .select()
      .single()
    if (dealErr) throw dealErr

    if (d.analysis) {
      const { error: analysisErr } = await supabase.from("analyses").insert({
        deal_id: dealRow.id,
        status: "completed",
        result: d.analysis,
        completed_at: new Date().toISOString(),
      })
      if (analysisErr) throw analysisErr
    }

    console.log(`  ✓ Deal ${dealRow.id}${d.analysis ? " + analysis" : ""}`)
  }

  console.log("\n✓ Demo data seeded for admin@sam.com")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
