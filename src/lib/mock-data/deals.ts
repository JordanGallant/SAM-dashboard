import type { Deal } from "../types/deal"
import { canaароAnalysis } from "./analysis-canaaro"
import { vreyAnalysis } from "./analysis-vrey"

export const mockDeals: Deal[] = [
  {
    id: "deal-1",
    companyName: "Canaaro",
    stage: "Seed",
    status: "Passed",
    source: "Inbound email",
    tags: ["GTM", "SaaS", "Sales Enablement"],
    documents: [
      { id: "doc-1", filename: "Canaaro_Pitch_Deck.pdf", docType: "pitch-deck", uploadedAt: "2025-06-14T09:00:00Z", size: 245000, url: "/uploads/canaaro-deck.pdf" },
    ],
    analysis: canaароAnalysis,
    createdAt: "2025-06-14T08:30:00Z",
    updatedAt: "2025-06-15T10:30:00Z",
  },
  {
    id: "deal-2",
    companyName: "VREY",
    stage: "Pre-seed",
    status: "First Call",
    source: "Conference (Energy Transition Summit)",
    tags: ["CleanTech", "Energy", "Hardware"],
    documents: [
      { id: "doc-2", filename: "VREY_Handout_Deck_preseed.pdf", docType: "pitch-deck", uploadedAt: "2025-06-28T14:00:00Z", size: 2372290, url: "/uploads/vrey-deck.pdf" },
      { id: "doc-3", filename: "VREY_Pilot_Report.pdf", docType: "dd-doc", uploadedAt: "2025-06-29T10:00:00Z", size: 890000, url: "/uploads/vrey-pilot.pdf" },
      { id: "doc-4", filename: "Marcus_Call_Notes.md", docType: "transcript", uploadedAt: "2025-06-30T16:00:00Z", size: 15000, url: "/uploads/vrey-notes.md" },
    ],
    analysis: vreyAnalysis,
    createdAt: "2025-06-28T13:00:00Z",
    updatedAt: "2025-07-01T14:30:00Z",
  },
  {
    id: "deal-3",
    companyName: "Vint Labs",
    stage: "Seed",
    status: "New",
    source: "Partner referral",
    tags: ["Infrastructure", "DevTools"],
    documents: [
      { id: "doc-5", filename: "Vint_Labs_Pitch_Deck.pdf", docType: "pitch-deck", uploadedAt: "2025-07-05T11:00:00Z", size: 3045663, url: "/uploads/vint-deck.pdf" },
    ],
    createdAt: "2025-07-05T10:30:00Z",
    updatedAt: "2025-07-05T11:00:00Z",
  },
]
