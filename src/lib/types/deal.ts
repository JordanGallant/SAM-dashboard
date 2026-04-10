import type { DealAnalysis } from "./analysis"

export type PipelineStatus = "New" | "Reviewing" | "First Call" | "DD" | "Passed" | "Invested"
export type DealStage = "Pre-seed" | "Seed" | "Series A" | "Series B+"
export type DocType = "pitch-deck" | "transcript" | "dd-doc" | "financial-model" | "other"

export interface DealDocument {
  id: string
  filename: string
  docType: DocType
  uploadedAt: string
  size: number
  url: string
}

export interface Deal {
  id: string
  companyName: string
  stage: DealStage
  status: PipelineStatus
  source: string
  tags: string[]
  documents: DealDocument[]
  analysis?: DealAnalysis
  createdAt: string
  updatedAt: string
}
