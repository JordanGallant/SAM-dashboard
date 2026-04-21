/**
 * Seed demo data for admin@sam.com into Supabase.
 * Run with: npx tsx setup_scripts/seed-demo.ts
 *
 * Creates:
 *  - 1 fund profile (Horizon Ventures)
 *  - 3 deals (Canaaro, VREY, Vint Labs)
 *  - 1 pitch deck PDF uploaded + documents row per deal
 *  - Analyses for Canaaro and VREY
 *
 * Vint Labs has a PDF but no analysis — admin can click
 * "Analyze Pitch Deck" to fire the real n8n webhook.
 */
import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { canaароAnalysis } from "./seed-data/analysis-canaaro"
import { vreyAnalysis } from "./seed-data/analysis-vrey"
import { mockFundProfile } from "./seed-data/fund-profile"

config({ path: ".env.local" })

const ADMIN_EMAIL = "admin@sam.com"
const __dirname_esm = dirname(fileURLToPath(import.meta.url))
const PDF_DIR = join(__dirname_esm, "seed-data", "pdfs")

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find admin user
  const { data: users, error: userErr } = await supabase.auth.admin.listUsers()
  if (userErr) throw userErr
  const adminUser = users.users.find((u) => u.email === ADMIN_EMAIL)
  if (!adminUser) throw new Error(`Admin user ${ADMIN_EMAIL} not found.`)
  const userId = adminUser.id
  console.log(`Found admin: ${userId}`)

  // Clear existing data
  console.log("Clearing existing admin data...")
  const { data: existingDeals } = await supabase.from("deals").select("id").eq("user_id", userId)
  const existingIds = existingDeals?.map((d) => d.id) ?? []

  if (existingIds.length) {
    // Remove orphaned storage files
    const { data: existingDocs } = await supabase
      .from("documents")
      .select("storage_path")
      .in("deal_id", existingIds)
    const paths = existingDocs?.map((d) => d.storage_path).filter(Boolean) ?? []
    if (paths.length) {
      await supabase.storage.from("pitch-decks").remove(paths)
    }
    await supabase.from("analyses").delete().in("deal_id", existingIds)
    await supabase.from("documents").delete().in("deal_id", existingIds)
    await supabase.from("deals").delete().eq("user_id", userId)
  }
  await supabase.from("funds").delete().eq("user_id", userId)

  // Fund profile
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

  const deals = [
    {
      company_name: "Canaaro",
      stage: "Seed",
      status: "Passed",
      source: "Inbound email",
      tags: ["GTM", "SaaS", "Sales Enablement"],
      pdf_file: "canaaro-deck.pdf",
      pdf_label: "Canaaro_Pitch_Deck.pdf",
      analysis: canaароAnalysis,
    },
    {
      company_name: "VREY",
      stage: "Pre-seed",
      status: "First Call",
      source: "Conference (Energy Transition Summit)",
      tags: ["CleanTech", "Energy", "Hardware"],
      pdf_file: "vrey-deck.pdf",
      pdf_label: "VREY_Pitch_Deck.pdf",
      analysis: vreyAnalysis,
    },
    {
      company_name: "Vint Labs",
      stage: "Seed",
      status: "New",
      source: "Partner referral",
      tags: ["Infrastructure", "DevTools"],
      pdf_file: "vint-labs-deck.pdf",
      pdf_label: "Vint_Labs_Pitch_Deck.pdf",
      analysis: null,
    },
  ]

  for (const d of deals) {
    console.log(`Seeding ${d.company_name}...`)

    // Insert deal
    const { data: dealRow, error: dealErr } = await supabase
      .from("deals")
      .insert({
        user_id: userId,
        fund_id: fund.id,
        company_name: d.company_name,
        stage: d.stage,
        status: d.status,
        source: d.source,
        tags: d.tags,
      })
      .select()
      .single()
    if (dealErr) throw dealErr

    // Upload PDF to storage and create document row
    const pdfPath = join(PDF_DIR, d.pdf_file)
    const pdfBuffer = readFileSync(pdfPath)
    const storagePath = `${userId}/${dealRow.id}/${Date.now()}_${d.pdf_label}`

    const { error: uploadErr } = await supabase.storage
      .from("pitch-decks")
      .upload(storagePath, pdfBuffer, { contentType: "application/pdf" })
    if (uploadErr) throw uploadErr

    const { error: docErr } = await supabase.from("documents").insert({
      deal_id: dealRow.id,
      filename: d.pdf_label,
      doc_type: "pitch-deck",
      storage_path: storagePath,
      size_bytes: pdfBuffer.length,
    })
    if (docErr) throw docErr

    // Analysis if present
    if (d.analysis) {
      const { error: analysisErr } = await supabase.from("analyses").insert({
        deal_id: dealRow.id,
        status: "completed",
        result: d.analysis,
        completed_at: new Date().toISOString(),
      })
      if (analysisErr) throw analysisErr
    }

    console.log(`  ✓ ${d.company_name} (deal + pdf + ${d.analysis ? "analysis" : "no analysis"})`)
  }

  console.log("\n✓ Demo data seeded for admin@sam.com")
  console.log("  - 2 deals with completed analyses (Canaaro, VREY)")
  console.log("  - 1 deal with pitch deck uploaded but no analysis (Vint Labs)")
  console.log("  → admin can click \"Analyze Pitch Deck\" on Vint Labs to test n8n end-to-end")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
