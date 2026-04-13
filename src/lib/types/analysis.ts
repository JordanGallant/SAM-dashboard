export type Verdict = "Strong Buy" | "Explore" | "Conditional Pass" | "Deny"
export type Confidence = "High" | "Medium" | "Low"
export type DomainVerdict = "Strong" | "Moderate" | "Weak" | "Insufficient Data"
export type Severity = "Critical" | "Warning" | "Info"
export type ThreatLevel = "Very High" | "High" | "Medium" | "Low"
export type StatusIcon = "check" | "warning" | "critical" | "gap"
export type DomainName = "Team" | "Market" | "Product" | "Traction" | "Finance"

export interface ScorecardRow {
  domain: DomainName
  score: number
  verdict: DomainVerdict
  keyFinding: string
  dataCompleteness: number
}

export interface FindingItem {
  id: number
  text: string
  severity: Severity
  source?: string
}

export interface ExecutiveSummary {
  companyName: string
  stage: string
  sector: string
  raising: string
  geography: string
  mrr: string
  verdict: Verdict
  confidence: Confidence
  overallScore: number
  scorecard: ScorecardRow[]
  thesis: string
  strengths: FindingItem[]
  risks: FindingItem[]
  recommendedNextSteps: string[]
  dataCompleteness: number
}

export interface FounderRow {
  name: string
  role: string
  background: string
  strength: string
  keyConcern: string
  linkedinUrl?: string
}

export interface TeamAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  founders: FounderRow[]
  founderMarketFit: string
  teamDynamics: string
  redFlags: FindingItem[]
}

export interface MarketSizeRow {
  metric: "TAM" | "SAM" | "SOM"
  founderClaim: string
  validatedEstimate: string
  variance: string
  assessment: string
}

export interface CompetitorRow {
  name: string
  threatLevel: ThreatLevel
  differentiation: string
  funding?: string
}

export interface MarketAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  marketSize: MarketSizeRow[]
  marketDynamics: string
  whyNow: string
  whyNowScore: DomainVerdict
  competitors: CompetitorRow[]
  redFlags: FindingItem[]
}

export interface MetricRow {
  metric: string
  value: string
  benchmark?: string
  growth?: string
  status: StatusIcon
  statusNote?: string
}

export interface MoatRow {
  type: string
  present: boolean
  strength: number
  evidence: string
}

export interface ProductAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  problemType: string
  painScore: string
  currentSolutions: string
  evidenceOfPain: string
  solutionComparison: MetricRow[]
  pmfStatus: string
  pmfDetails: string
  moat: MoatRow[]
  redFlags: FindingItem[]
}

export interface TractionAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  revenueMetrics: MetricRow[]
  unitEconomics: MetricRow[]
  retention: MetricRow[]
  redFlags: FindingItem[]
}

export interface ValuationRow {
  method: "Conservative" | "Moderate" | "Aggressive"
  impliedValue: string
  basis: string
}

export interface FinanceAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  financialHealth: MetricRow[]
  capitalEfficiency: string
  investorSignals: string
  valuation: ValuationRow[]
  dealTerms: string
  redFlags: FindingItem[]
}

export interface ExitAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  comparableExits: MetricRow[]
  exitRange: string
  exitTimeline: string
  acquirerLandscape: string
  redFlags: FindingItem[]
}

export interface FundFitCriterion {
  criterion: string
  fundProfile: string
  deal: string
  match: boolean
}

export interface FundFitAnalysis {
  score: number
  verdict: DomainVerdict
  dataCompleteness: number
  criteria: FundFitCriterion[]
  thesisAlignment: number
  portfolioConflict: string
}

export interface MissingInfoSection {
  section: DomainName | "Exit" | "Fund Fit"
  items: string[]
  impact: string
  followUpQuestions: string[]
}

export interface MissingInfoAnalysis {
  sections: MissingInfoSection[]
  overallCompleteness: number
}

export type AnalysisStatus = "pending" | "processing" | "completed" | "failed"

export interface DealAnalysis {
  id: string
  dealId: string
  status: AnalysisStatus
  createdAt: string
  executiveSummary: ExecutiveSummary
  team: TeamAnalysis
  market: MarketAnalysis
  product: ProductAnalysis
  traction: TractionAnalysis
  finance: FinanceAnalysis
  exitPotential: ExitAnalysis
  fundFit: FundFitAnalysis
  missingInfo: MissingInfoAnalysis
}
