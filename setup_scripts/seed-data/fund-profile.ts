import type { FundProfile } from "../../src/lib/types/fund"

export const mockFundProfile: FundProfile = {
  id: "fund-1",
  name: "Horizon Ventures",
  website: "https://horizonvc.eu",
  thesis: "We invest in early-stage European startups building foundational technology in SaaS, CleanTech, and Fintech. We look for teams with deep domain expertise and a clear path to EUR 100M+ revenue.",
  stageFocus: ["Pre-seed", "Seed", "Series A"],
  sectorFocus: ["SaaS", "Fintech", "CleanTech"],
  geoFocus: ["Netherlands", "DACH", "Nordics"],
  ticketSizeMin: 250000,
  ticketSizeMax: 2000000,
  fundSize: 50000000,
  portfolioCompanies: ["StreamLedger", "GridPulse", "Nexova"],
}
