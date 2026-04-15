import type { Deal, DealDocument, DealStage, PipelineStatus, DocType } from "./types/deal"
import type { FundProfile } from "./types/fund"
import type { DealAnalysis } from "./types/analysis"

// Supabase row shapes (snake_case)
export interface DbDeal {
  id: string
  user_id: string
  fund_id: string | null
  company_name: string
  stage: DealStage | null
  status: PipelineStatus
  source: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface DbDocument {
  id: string
  deal_id: string
  filename: string
  doc_type: DocType
  storage_path: string
  size_bytes: number | null
  uploaded_at: string
}

export interface DbFund {
  id: string
  user_id: string
  name: string
  website: string | null
  logo_url: string | null
  thesis: string | null
  stage_focus: string[] | null
  sector_focus: string[] | null
  geo_focus: string[] | null
  ticket_size_min: number | null
  ticket_size_max: number | null
  fund_size: number | null
  portfolio_companies: string[] | null
}

export interface DbAnalysis {
  id: string
  deal_id: string
  status: "pending" | "processing" | "completed" | "failed"
  result: DealAnalysis | null
  error: string | null
  created_at: string
  completed_at: string | null
}

// Mappers
export function dbToDocument(row: DbDocument): DealDocument {
  return {
    id: row.id,
    filename: row.filename,
    docType: row.doc_type,
    uploadedAt: row.uploaded_at,
    size: row.size_bytes ?? 0,
    url: row.storage_path,
  }
}

export function dbToDeal(row: DbDeal, documents: DbDocument[] = [], analysis?: DealAnalysis | null): Deal {
  return {
    id: row.id,
    companyName: row.company_name,
    stage: (row.stage ?? "Seed") as DealStage,
    status: row.status,
    source: row.source ?? "",
    tags: row.tags ?? [],
    documents: documents.map(dbToDocument),
    analysis: analysis ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function dbToFund(row: DbFund): FundProfile {
  return {
    id: row.id,
    name: row.name,
    website: row.website ?? "",
    logoUrl: row.logo_url ?? undefined,
    thesis: row.thesis ?? "",
    stageFocus: row.stage_focus ?? [],
    sectorFocus: row.sector_focus ?? [],
    geoFocus: row.geo_focus ?? [],
    ticketSizeMin: row.ticket_size_min ?? 0,
    ticketSizeMax: row.ticket_size_max ?? 0,
    fundSize: row.fund_size ?? 0,
    portfolioCompanies: row.portfolio_companies ?? [],
  }
}
