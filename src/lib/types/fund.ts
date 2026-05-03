export interface FundProfile {
  id: string
  name: string
  website: string
  logoUrl?: string
  thesis: string
  stageFocus: string[]
  sectorFocus: string[]
  geoFocus: string[]
  ticketSizeMin: number
  ticketSizeMax: number
  fundSize: number
  portfolioCompanies: string[]
  additional?: string
  onePagerFilename?: string
  onePagerUploadedAt?: string
}
