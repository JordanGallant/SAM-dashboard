import type {
  DealAnalysis,
  DomainVerdict,
  Severity,
  StatusIcon,
  ThreatLevel,
  Verdict,
  Confidence,
  FounderRow,
  FindingItem,
} from "./types/analysis"

type FlatN8N = Record<string, string | undefined>

const num = (s: string | undefined, fallback = 0): number => {
  if (!s) return fallback
  const n = parseInt(String(s).replace(/[^\d-]/g, ""), 10)
  return Number.isFinite(n) ? n : fallback
}

const trim = (s: string | undefined) => (s ?? "").trim()

const mapDomainVerdict = (s: string | undefined): DomainVerdict => {
  const v = (s ?? "").toLowerCase()
  if (v.includes("strong")) return "Strong"
  if (v.includes("moderate")) return "Moderate"
  if (v.includes("weak")) return "Weak"
  return "Insufficient Data"
}

const mapVerdict = (s: string | undefined): Verdict => {
  const v = (s ?? "").toUpperCase()
  if (v.includes("STRONG BUY")) return "Strong Buy"
  if (v.includes("EXPLORE")) return "Explore"
  if (v.includes("CONDITIONAL")) return "Conditional Pass"
  return "Deny"
}

const mapConfidence = (s: string | undefined): Confidence => {
  const v = (s ?? "").toUpperCase()
  if (v.startsWith("H")) return "High"
  if (v.startsWith("L")) return "Low"
  return "Medium"
}

const mapThreat = (s: string | undefined): ThreatLevel => {
  const v = (s ?? "").toUpperCase()
  if (v.includes("VERY HIGH")) return "Very High"
  if (v.startsWith("H")) return "High"
  if (v.startsWith("L")) return "Low"
  return "Medium"
}

const mapStatus = (s: string | undefined): StatusIcon => {
  const v = s ?? ""
  if (v.includes("✓")) return "check"
  if (v.includes("✗") || /critical/i.test(v)) return "critical"
  if (v.includes("⚠") || /warn/i.test(v)) return "warning"
  if (/not disclosed|n\/a|gap/i.test(v)) return "gap"
  return "check"
}

const findings = (texts: (string | undefined)[], severity: Severity): FindingItem[] =>
  texts
    .map(trim)
    .filter((t) => t && !/^n\/a$/i.test(t))
    .map((text, i) => ({ id: i + 1, text, severity }))

// Parse the founders_overview_text block:
//   JOHN DOE - CEO
//   * Background: ...
//   * Key Strength: ...
//   * Key Concern: ...
//
//   JANE SMITH - CTO
//   ...
const parseFounders = (text: string | undefined): FounderRow[] => {
  if (!text) return []
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)

  const out: FounderRow[] = []
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim())
    const header = lines[0] ?? ""
    const [namePart, rolePart] = header.split(/\s*[-|]\s*/, 2)
    if (!namePart) continue

    const grabAfter = (label: RegExp) => {
      const idx = lines.findIndex((l) => label.test(l))
      if (idx === -1) return ""
      return lines[idx].replace(label, "").replace(/^\*?\s*/, "").trim()
    }

    out.push({
      name: namePart.replace(/^\*+/, "").trim(),
      role: (rolePart ?? "").trim(),
      background: grabAfter(/^\*?\s*background\s*:/i),
      strength: grabAfter(/^\*?\s*key\s+strength\s*:/i),
      keyConcern: grabAfter(/^\*?\s*key\s+concern\s*:/i),
    })
  }
  return out
}

export function reshapeFlatToDealAnalysis(
  flat: FlatN8N,
  context: { dealId: string; analysisId: string; createdAt?: string }
): DealAnalysis {
  const now = context.createdAt ?? new Date().toISOString()

  const teamScore = num(flat.team_score)
  const marketScore = num(flat.market_score)
  const productScore = num(flat.product_score)
  const tractionScore = num(flat.traction_score)
  const financeScore = num(flat.finance_score)

  return {
    id: context.analysisId,
    dealId: context.dealId,
    status: "completed",
    createdAt: now,

    executiveSummary: {
      companyName: trim(flat.company_name),
      stage: trim(flat.stage),
      sector: trim(flat.sector),
      raising: trim(flat.raising),
      geography: trim(flat.geography),
      mrr: trim(flat.MRR ?? flat.arr_val),
      verdict: mapVerdict(flat.verdict),
      confidence: mapConfidence(flat.confidence),
      overallScore: num(flat.overall_score),
      scorecard: [
        { domain: "Team", score: teamScore, verdict: mapDomainVerdict(flat.team_verdict), keyFinding: trim(flat.team_finding), dataCompleteness: 0 },
        { domain: "Market", score: marketScore, verdict: mapDomainVerdict(flat.market_verdict), keyFinding: trim(flat.market_finding), dataCompleteness: 0 },
        { domain: "Product", score: productScore, verdict: mapDomainVerdict(flat.product_verdict), keyFinding: trim(flat.product_finding), dataCompleteness: 0 },
        { domain: "Traction", score: tractionScore, verdict: mapDomainVerdict(flat.traction_verdict), keyFinding: trim(flat.traction_finding), dataCompleteness: 0 },
        { domain: "Finance", score: financeScore, verdict: mapDomainVerdict(flat.finance_verdict), keyFinding: trim(flat.finance_finding), dataCompleteness: 0 },
      ],
      thesis: trim(flat.investment_thesis),
      strengths: findings([flat.strength_1, flat.strength_2, flat.strength_3], "Info"),
      risks: findings([flat.risk_1, flat.risk_2, flat.risk_3], "Warning"),
      recommendedNextSteps: [flat.next_step_1, flat.next_step_2, flat.next_step_3, flat.next_step_4]
        .map(trim)
        .filter(Boolean),
      dataCompleteness: 0,
    },

    team: {
      score: teamScore,
      verdict: mapDomainVerdict(flat.team_verdict),
      dataCompleteness: 0,
      founders: parseFounders(flat.founders_overview_text),
      founderMarketFit: trim(flat.fmf_text),
      teamDynamics: trim(flat.team_dynamics_text),
      redFlags: findings([flat.team_redflag_1, flat.team_redflag_2, flat.team_redflag_3], "Critical"),
    },

    market: {
      score: marketScore,
      verdict: mapDomainVerdict(flat.market_verdict),
      dataCompleteness: 0,
      marketSize: [
        { metric: "TAM", founderClaim: trim(flat.tam_claim), validatedEstimate: trim(flat.tam_val), variance: trim(flat.tam_var), assessment: trim(flat.tam_assess) },
        { metric: "SAM", founderClaim: trim(flat.sam_claim), validatedEstimate: trim(flat.sam_val), variance: trim(flat.sam_var), assessment: trim(flat.sam_assess) },
        { metric: "SOM", founderClaim: trim(flat.som_claim), validatedEstimate: trim(flat.som_val), variance: trim(flat.som_var), assessment: trim(flat.som_assess) },
      ],
      marketDynamics: trim(flat.market_dynamics_text),
      whyNow: trim(flat.timing_text),
      whyNowScore: mapDomainVerdict(flat.timing_score),
      competitors: [
        { name: trim(flat.comp_type_1), threatLevel: mapThreat(flat.comp_threat_1), differentiation: trim(flat.comp_diff_1) },
        { name: trim(flat.comp_type_2), threatLevel: mapThreat(flat.comp_threat_2), differentiation: trim(flat.comp_diff_2) },
        { name: trim(flat.comp_type_3), threatLevel: mapThreat(flat.comp_threat_3), differentiation: trim(flat.comp_diff_3) },
        { name: trim(flat.comp_type_4), threatLevel: mapThreat(flat.comp_threat_4), differentiation: trim(flat.comp_diff_4) },
      ].filter((c) => c.name),
      redFlags: findings([flat.market_redflag_1, flat.market_redflag_2], "Critical"),
    },

    product: {
      score: productScore,
      verdict: mapDomainVerdict(flat.product_verdict),
      dataCompleteness: 0,
      problemType: trim(flat.problem_type),
      painScore: trim(flat.pain_score),
      currentSolutions: trim(flat.current_solutions),
      evidenceOfPain: trim(flat.pain_evidence),
      solutionComparison: [
        { metric: "Speed", value: trim(flat.sol_speed_new), benchmark: trim(flat.sol_speed_alt), growth: trim(flat.sol_speed_imp), status: "check" },
        { metric: "Labor", value: trim(flat.sol_labor_new), benchmark: trim(flat.sol_labor_alt), growth: trim(flat.sol_labor_imp), status: "check" },
        { metric: "Coverage", value: trim(flat.sol_cov_new), benchmark: trim(flat.sol_cov_alt), growth: trim(flat.sol_cov_imp), status: "check" },
        { metric: "Flexibility", value: trim(flat.sol_flex_new), benchmark: trim(flat.sol_flex_alt), growth: trim(flat.sol_flex_imp), status: "check" },
      ],
      pmfStatus: trim(flat.pmf_status),
      pmfDetails: trim(flat.pmf_text),
      moat: [
        { type: "Network Effects", present: /yes|building/i.test(flat.moat_network_pres ?? ""), strength: num(flat.moat_network_str), evidence: trim(flat.moat_network_evid) },
        { type: "Proprietary Data", present: /yes|building/i.test(flat.moat_data_pres ?? ""), strength: num(flat.moat_data_str), evidence: trim(flat.moat_data_evid) },
        { type: "Switching Costs", present: /yes|building/i.test(flat.moat_switch_pres ?? ""), strength: num(flat.moat_switch_str), evidence: trim(flat.moat_switch_evid) },
        { type: "Technology/IP", present: /yes|building/i.test(flat.moat_tech_pres ?? ""), strength: num(flat.moat_tech_str), evidence: trim(flat.moat_tech_evid) },
      ],
      redFlags: findings([flat.product_redflag_1, flat.product_redflag_2], "Critical"),
    },

    traction: {
      score: tractionScore,
      verdict: mapDomainVerdict(flat.traction_verdict),
      dataCompleteness: 0,
      revenueMetrics: [
        { metric: "ARR", value: trim(flat.arr_val), benchmark: trim(flat.arr_bench), growth: trim(flat.arr_growth), status: mapStatus(flat.arr_status) },
        { metric: "Historical Revenue", value: trim(flat.hist_rev_val), benchmark: trim(flat.hist_rev_bench), growth: trim(flat.hist_rev_growth), status: mapStatus(flat.hist_rev_status) },
        { metric: "Trajectory", value: trim(flat.traj_val), benchmark: trim(flat.traj_bench), growth: trim(flat.traj_growth), status: mapStatus(flat.traj_status) },
      ],
      unitEconomics: [
        { metric: "LTV", value: trim(flat.ue_ltv_val), status: mapStatus(flat.ue_ltv_status) },
        { metric: "CAC", value: trim(flat.ue_cac_val), status: mapStatus(flat.ue_cac_status) },
        { metric: "Gross Margin", value: trim(flat.ue_margin_val), status: mapStatus(flat.ue_margin_status) },
        { metric: "Payback", value: trim(flat.ue_payback_val), status: mapStatus(flat.ue_payback_status) },
        { metric: "NRR", value: trim(flat.ue_nrr_val), status: mapStatus(flat.ue_nrr_status) },
      ],
      retention: [
        { metric: "NRR", value: trim(flat.ret_nrr_val), status: mapStatus(flat.ret_nrr_status) },
        { metric: "Logo Churn", value: trim(flat.ret_logo_val), status: mapStatus(flat.ret_logo_status) },
        { metric: "Cohort Retention", value: trim(flat.ret_cohort_val), status: mapStatus(flat.ret_cohort_status) },
        { metric: "DAU/MAU", value: trim(flat.ret_dau_val), status: mapStatus(flat.ret_dau_status) },
        { metric: "Revenue Churn", value: trim(flat.ret_rev_val), status: mapStatus(flat.ret_rev_status) },
      ],
      redFlags: findings([flat.traction_redflag_1, flat.traction_redflag_2, flat.traction_redflag_3], "Critical"),
    },

    finance: {
      score: financeScore,
      verdict: mapDomainVerdict(flat.finance_verdict),
      dataCompleteness: 0,
      financialHealth: [
        { metric: "Cash Position", value: trim(flat.fin_cash_val), status: mapStatus(flat.fin_cash_status) },
        { metric: "Monthly Burn", value: trim(flat.fin_burn_val), status: mapStatus(flat.fin_burn_status) },
        { metric: "Runway", value: trim(flat.fin_runway_val), status: mapStatus(flat.fin_runway_status) },
        { metric: "Burn Multiple", value: trim(flat.fin_multiple_val), status: mapStatus(flat.fin_multiple_status) },
      ],
      capitalEfficiency: trim(flat.capital_efficiency_text),
      investorSignals: [flat.inv_1_name, flat.inv_2_name, flat.inv_3_name, flat.inv_4_name]
        .map((n, i) => {
          const name = trim(n)
          if (!name || /^n\/a$/i.test(name)) return null
          const type = trim(flat[`inv_${i + 1}_type`])
          const sig = trim(flat[`inv_${i + 1}_signal`])
          return `${name} (${type}) — ${sig}`
        })
        .filter(Boolean)
        .join("\n") || "No prior investors disclosed",
      valuation: [
        { method: "Conservative", impliedValue: trim(flat.val_cons_val), basis: trim(flat.val_cons_basis) },
        { method: "Moderate", impliedValue: trim(flat.val_mod_val), basis: trim(flat.val_mod_basis) },
        { method: "Aggressive", impliedValue: trim(flat.val_aggr_val), basis: trim(flat.val_aggr_basis) },
      ],
      dealTerms: trim(flat.deal_terms_text),
      redFlags: findings([flat.finance_redflag_1, flat.finance_redflag_2, flat.finance_redflag_3], "Critical"),
    },

    // Out-of-scope tabs — Flow 8 doesn't yet emit these. Empty placeholders so the UI degrades gracefully.
    exitPotential: {
      score: 0,
      verdict: "Insufficient Data",
      dataCompleteness: 0,
      comparableExits: [],
      exitRange: "",
      exitTimeline: "",
      acquirerLandscape: "",
      redFlags: [],
    },
    fundFit: {
      score: 0,
      verdict: "Insufficient Data",
      dataCompleteness: 0,
      criteria: [],
      thesisAlignment: 0,
      portfolioConflict: "",
    },
    missingInfo: {
      sections: [],
      overallCompleteness: 0,
    },
  }
}
