// Data completeness as displayed on the dashboard was previously computed at
// n8n-reshape time from flat LLM keys. Result: the percentage and the
// rendered prose disagreed (page shows 100% but Market dynamics is empty,
// because Flow 8 returned a placeholder string that passed through pct()).
//
// Fix: derive each domain's percentage at read time from the SHAPED fields the
// page actually renders. The number is now a faithful answer to "how full is
// this tab right now?", not "how many flat keys did Flow 8 echo back?".

import type {
  DealAnalysis,
  TeamAnalysis,
  MarketAnalysis,
  ProductAnalysis,
  TractionAnalysis,
  FinanceAnalysis,
  ExitAnalysis,
  FundFitAnalysis,
  MetricRow,
} from "./types/analysis"

const PLACEHOLDER_RE =
  /^(n\/a|none|—|-{1,2}|undisclosed|not disclosed|tbd|tba|unknown|not specified|not provided|not available|not yet|pending|info missing|missing|no data|unspecified|undetermined|to be determined|\?+)$/i

function filledStr(v: string | undefined | null): boolean {
  if (!v) return false
  const s = v.trim()
  if (!s) return false
  return !PLACEHOLDER_RE.test(s)
}

function metricsHaveSignal(rows: MetricRow[] | undefined): boolean {
  if (!Array.isArray(rows) || rows.length === 0) return false
  return rows.some((r) => filledStr(r.value) || filledStr(r.benchmark) || filledStr(r.growth))
}

function pct(checks: boolean[]): number {
  if (checks.length === 0) return 0
  const hit = checks.filter(Boolean).length
  return Math.round((hit / checks.length) * 100)
}

function teamCompleteness(t: TeamAnalysis): number {
  return pct([
    Array.isArray(t.founders) &&
      t.founders.length > 0 &&
      t.founders.some((f) => filledStr(f.name) && filledStr(f.background)),
    filledStr(t.founderMarketFit),
    filledStr(t.teamDynamics),
  ])
}

function marketCompleteness(m: MarketAnalysis): number {
  // Market size rows have founderClaim / validatedEstimate — different shape from
  // MetricRow. Inline check for that.
  const sizeHasSignal =
    Array.isArray(m.marketSize) &&
    m.marketSize.some(
      (r) => filledStr(r.founderClaim) || filledStr(r.validatedEstimate)
    )
  return pct([
    sizeHasSignal,
    filledStr(m.marketDynamics),
    filledStr(m.whyNow),
    Array.isArray(m.competitors) && m.competitors.some((c) => filledStr(c.name)),
  ])
}

function productCompleteness(p: ProductAnalysis): number {
  return pct([
    filledStr(p.problemType) || filledStr(p.painScore),
    filledStr(p.evidenceOfPain) || filledStr(p.currentSolutions),
    filledStr(p.pmfStatus) || filledStr(p.pmfDetails),
    Array.isArray(p.moat) && p.moat.some((m) => m.present || (typeof m.strength === "number" && m.strength > 0)),
    metricsHaveSignal(p.solutionComparison),
  ])
}

function tractionCompleteness(t: TractionAnalysis): number {
  return pct([
    metricsHaveSignal(t.revenueMetrics),
    metricsHaveSignal(t.unitEconomics),
    metricsHaveSignal(t.retention),
  ])
}

function financeCompleteness(f: FinanceAnalysis): number {
  const valuationHasSignal =
    Array.isArray(f.valuation) &&
    f.valuation.some((v) => filledStr(v.impliedValue) || filledStr(v.basis))
  return pct([
    metricsHaveSignal(f.financialHealth),
    filledStr(f.capitalEfficiency),
    valuationHasSignal,
    filledStr(f.dealTerms),
  ])
}

function exitCompleteness(e: ExitAnalysis): number {
  return pct([
    metricsHaveSignal(e.comparableExits),
    filledStr(e.exitRange),
    filledStr(e.exitTimeline),
    filledStr(e.acquirerLandscape),
  ])
}

function fundFitCompleteness(f: FundFitAnalysis): number {
  return pct([
    Array.isArray(f.criteria) && f.criteria.length > 0,
    typeof f.thesisAlignment === "number" && f.thesisAlignment > 0,
    filledStr(f.portfolioConflict),
  ])
}

export function recomputeCompleteness(analysis: DealAnalysis): DealAnalysis {
  const team = teamCompleteness(analysis.team)
  const market = marketCompleteness(analysis.market)
  const product = productCompleteness(analysis.product)
  const traction = tractionCompleteness(analysis.traction)
  const finance = financeCompleteness(analysis.finance)
  const exitP = exitCompleteness(analysis.exitPotential)
  const fundFit = fundFitCompleteness(analysis.fundFit)

  // Overall = average of the 5 main domains (matches existing exec summary pattern).
  const overall = Math.round((team + market + product + traction + finance) / 5)

  // Patch the scorecard rows so the per-domain Data % chip on the exec summary
  // matches each domain page's chip exactly.
  const domainPct: Record<string, number> = {
    Team: team,
    Market: market,
    Product: product,
    Traction: traction,
    Finance: finance,
  }
  const scorecard = analysis.executiveSummary.scorecard.map((row) => ({
    ...row,
    dataCompleteness: domainPct[row.domain] ?? row.dataCompleteness,
  }))

  return {
    ...analysis,
    team: { ...analysis.team, dataCompleteness: team },
    market: { ...analysis.market, dataCompleteness: market },
    product: { ...analysis.product, dataCompleteness: product },
    traction: { ...analysis.traction, dataCompleteness: traction },
    finance: { ...analysis.finance, dataCompleteness: finance },
    exitPotential: { ...analysis.exitPotential, dataCompleteness: exitP },
    fundFit: { ...analysis.fundFit, dataCompleteness: fundFit },
    executiveSummary: {
      ...analysis.executiveSummary,
      dataCompleteness: overall,
      scorecard,
    },
  }
}
