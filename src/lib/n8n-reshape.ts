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

// Score helper: clamps any incoming value to 0–100. Catches LLM oddities like
// "110/10" or out-of-range outputs that produced invalid scorecards before.
const score = (s: string | undefined): number => {
  const n = num(s)
  if (n < 0) return 0
  if (n > 100) return 100
  return n
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

// Treat empty / N/A / dash / 0-score / common placeholder phrases as "not provided".
// Used by pct() below — the previous version under-counted gaps because the LLM
// often returns "TBD" / "Unknown" / "Not specified" instead of leaving fields blank,
// which inflated dataCompleteness toward 100% even when the deck had nothing useful.
const PLACEHOLDER_RE = /^(n\/a|none|—|-{1,2}|undisclosed|not disclosed|tbd|tba|unknown|not specified|not provided|not available|not yet|pending|info missing|missing|no data|unspecified|undetermined|to be determined|\?+)$/i

const isFilled = (v: unknown): boolean => {
  if (v == null) return false
  if (typeof v === "string") {
    const s = v.trim()
    if (!s) return false
    return !PLACEHOLDER_RE.test(s)
  }
  if (typeof v === "number") return Number.isFinite(v) && v > 0
  if (typeof v === "boolean") return v
  if (Array.isArray(v)) return v.length > 0
  return true
}

// Domain data completeness: integer 0–100 = percent of expected signal fields
// that came back populated. Drives the "Data X%" chip on each domain page.
const pct = (vals: unknown[]): number => {
  if (vals.length === 0) return 0
  const filled = vals.filter(isFilled).length
  return Math.round((filled / vals.length) * 100)
}

// Parse the founders_overview_text block. Flow 8 emits one founder block
// like the example below, with a single blank line BETWEEN sections of one
// founder and TWO blank lines between separate founders:
//
//   JOHN DOE | CEO & Founder
//   --------------------------------------------------
//   BACKGROUND:
//   2-3 sentence summary
//
//   KEY STRENGTH:
//   1-2 sentences
//
//   KEY CONCERN:
//   1-2 sentences
//
//
//   JANE SMITH | CTO
//   ...
//
// We split on 2+ consecutive blank lines for founder boundaries, then within
// each block locate the BACKGROUND / KEY STRENGTH / KEY CONCERN sections by
// label and capture every line up to the next labeled section.
const parseFounders = (text: string | undefined): FounderRow[] => {
  if (!text) return []

  // Founder boundary = blank-line that's followed by another blank-line.
  const founderBlocks = text
    .split(/\n[ \t]*\n[ \t]*\n+/) // 2+ blank lines
    .map((b) => b.trim())
    .filter(Boolean)

  // Fallback parser kept for the older list-bullet format ("* Background: ...").
  const grabBulletAfter = (lines: string[], label: RegExp) => {
    const idx = lines.findIndex((l) => label.test(l))
    if (idx === -1) return ""
    return lines[idx].replace(label, "").replace(/^\*?\s*/, "").trim()
  }

  // Section parser for the divider-line format. Returns the joined lines from
  // just-after the label up to (but not including) the next label or end.
  const grabSection = (lines: string[], label: RegExp) => {
    const start = lines.findIndex((l) => label.test(l))
    if (start === -1) return ""
    const stops = [/^BACKGROUND\s*:?$/i, /^KEY\s+STRENGTH\s*:?$/i, /^KEY\s+CONCERN\s*:?$/i]
    const buf: string[] = []
    for (let i = start + 1; i < lines.length; i++) {
      const l = lines[i].trim()
      if (!l) continue
      if (l.startsWith("---") || l.startsWith("___")) continue
      if (stops.some((s) => s.test(l))) break
      buf.push(l)
    }
    return buf.join(" ").trim()
  }

  const out: FounderRow[] = []
  for (const block of founderBlocks) {
    const rawLines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => !l.startsWith("---") && !l.startsWith("___"))

    if (rawLines.length === 0) continue

    // First non-empty line is the header: "NAME | role"  or  "NAME - role"
    const header = rawLines.find(Boolean) ?? ""
    const [namePartRaw, rolePartRaw] = header.split(/\s*[-|]\s*/, 2)
    const name = (namePartRaw ?? "").replace(/^\*+/, "").trim()
    const role = (rolePartRaw ?? "").trim()
    if (!name || /^(KEY\s+(STRENGTH|CONCERN)|BACKGROUND)\s*:?$/i.test(name)) continue

    // Try the divider format first (Flow 8's current shape), then the bullet fallback.
    const background =
      grabSection(rawLines, /^BACKGROUND\s*:?$/i) ||
      grabBulletAfter(rawLines, /^\*?\s*background\s*:/i)
    const strength =
      grabSection(rawLines, /^KEY\s+STRENGTH\s*:?$/i) ||
      grabBulletAfter(rawLines, /^\*?\s*key\s+strength\s*:/i)
    const keyConcern =
      grabSection(rawLines, /^KEY\s+CONCERN\s*:?$/i) ||
      grabBulletAfter(rawLines, /^\*?\s*key\s+concern\s*:/i)

    out.push({ name, role, background, strength, keyConcern })
  }
  return out
}

export function reshapeFlatToDealAnalysis(
  flat: FlatN8N,
  context: { dealId: string; analysisId: string; createdAt?: string }
): DealAnalysis {
  const now = context.createdAt ?? new Date().toISOString()

  const teamScore = score(flat.team_score)
  const marketScore = score(flat.market_score)
  const productScore = score(flat.product_score)
  const tractionScore = score(flat.traction_score)
  const financeScore = score(flat.finance_score)

  // --- Per-domain data completeness ----------------------------------------
  // Each list = the fields we expect Flow 8 to populate for that domain.
  // "Filled" = non-empty + not N/A. The percentage is the share that came back.
  const founders = parseFounders(flat.founders_overview_text)
  const teamCompleteness = pct([
    founders.length > 0,
    flat.team_finding,
    flat.fmf_text,
    flat.team_dynamics_text,
    flat.team_verdict,
  ])
  const marketCompleteness = pct([
    flat.tam_val, flat.sam_val, flat.som_val,
    flat.tam_claim, flat.sam_claim, flat.som_claim,
    flat.market_dynamics_text,
    flat.timing_text,
    flat.comp_type_1, flat.comp_type_2,
    flat.market_finding,
  ])
  const productCompleteness = pct([
    flat.problem_type, flat.pain_score, flat.current_solutions, flat.pain_evidence,
    flat.pmf_status, flat.pmf_text,
    flat.moat_network_pres, flat.moat_data_pres, flat.moat_switch_pres, flat.moat_tech_pres,
    flat.product_finding,
  ])
  const tractionCompleteness = pct([
    flat.arr_val, flat.hist_rev_val, flat.traj_val,
    flat.ue_ltv_val, flat.ue_cac_val, flat.ue_margin_val, flat.ue_payback_val, flat.ue_nrr_val,
    flat.ret_nrr_val, flat.ret_logo_val, flat.ret_cohort_val,
    flat.traction_finding,
  ])
  const financeCompleteness = pct([
    flat.fin_cash_val, flat.fin_burn_val, flat.fin_runway_val, flat.fin_multiple_val,
    flat.capital_efficiency_text,
    flat.inv_1_name,
    flat.val_cons_val, flat.val_mod_val, flat.val_aggr_val,
    flat.deal_terms_text,
    flat.finance_finding,
  ])

  // Executive-summary completeness = average across the 5 covered domains.
  // (exitPotential / fundFit / missingInfo aren't emitted by Flow 8 today.)
  const overallCompleteness = Math.round(
    (teamCompleteness + marketCompleteness + productCompleteness + tractionCompleteness + financeCompleteness) / 5
  )

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
      overallScore: score(flat.overall_score),
      scorecard: [
        { domain: "Team", score: teamScore, verdict: mapDomainVerdict(flat.team_verdict), keyFinding: trim(flat.team_finding), dataCompleteness: teamCompleteness },
        { domain: "Market", score: marketScore, verdict: mapDomainVerdict(flat.market_verdict), keyFinding: trim(flat.market_finding), dataCompleteness: marketCompleteness },
        { domain: "Product", score: productScore, verdict: mapDomainVerdict(flat.product_verdict), keyFinding: trim(flat.product_finding), dataCompleteness: productCompleteness },
        { domain: "Traction", score: tractionScore, verdict: mapDomainVerdict(flat.traction_verdict), keyFinding: trim(flat.traction_finding), dataCompleteness: tractionCompleteness },
        { domain: "Finance", score: financeScore, verdict: mapDomainVerdict(flat.finance_verdict), keyFinding: trim(flat.finance_finding), dataCompleteness: financeCompleteness },
      ],
      thesis: trim(flat.investment_thesis),
      strengths: findings([flat.strength_1, flat.strength_2, flat.strength_3], "Info"),
      risks: findings([flat.risk_1, flat.risk_2, flat.risk_3], "Warning"),
      recommendedNextSteps: [flat.next_step_1, flat.next_step_2, flat.next_step_3, flat.next_step_4]
        .map(trim)
        .filter(Boolean),
      dataCompleteness: overallCompleteness,
    },

    team: {
      score: teamScore,
      verdict: mapDomainVerdict(flat.team_verdict),
      dataCompleteness: teamCompleteness,
      founders,
      founderMarketFit: trim(flat.fmf_text),
      teamDynamics: trim(flat.team_dynamics_text),
      redFlags: findings([flat.team_redflag_1, flat.team_redflag_2, flat.team_redflag_3], "Critical"),
    },

    market: {
      score: marketScore,
      verdict: mapDomainVerdict(flat.market_verdict),
      dataCompleteness: marketCompleteness,
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
      dataCompleteness: productCompleteness,
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
      dataCompleteness: tractionCompleteness,
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
      dataCompleteness: financeCompleteness,
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
