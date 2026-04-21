import type { DealAnalysis } from "./types/analysis"

/**
 * Fully fictional sample memo used on the public /sample page.
 * Do NOT replace with real client data — this page is unauthenticated.
 * "Meridian Flow" is an invented company for demonstration.
 */
export const sampleAnalysis: DealAnalysis = {
  id: "sample-analysis",
  dealId: "sample-deal",
  status: "completed",
  createdAt: "2026-04-01T10:00:00Z",
  executiveSummary: {
    companyName: "Meridian Flow",
    stage: "Seed",
    sector: "B2B SaaS / Procurement Automation",
    raising: "EUR 1.5M",
    geography: "Netherlands / Germany",
    mrr: "EUR 12k (pilot revenue)",
    verdict: "Explore",
    confidence: "Medium",
    overallScore: 64,
    scorecard: [
      {
        domain: "Team",
        score: 72,
        verdict: "Moderate",
        keyFinding:
          "Experienced founding team with combined 18 years in procurement and enterprise software. Commercial lead has direct domain experience; gap is on the engineering side — no full-time CTO.",
        dataCompleteness: 85,
      },
      {
        domain: "Market",
        score: 68,
        verdict: "Moderate",
        keyFinding:
          "Mid-market European procurement automation is a growing segment (EUR 4.2B SAM, 14% CAGR), but the competitive landscape is crowded with well-funded players (Coupa, Jaggaer). Differentiation thesis is plausible but not yet proven.",
        dataCompleteness: 78,
      },
      {
        domain: "Product",
        score: 75,
        verdict: "Moderate",
        keyFinding:
          "MVP deployed with three pilot customers. The AI-driven supplier matching feature is a real improvement over legacy tools, though not yet 10x. Moat depends on data accumulation over time.",
        dataCompleteness: 82,
      },
      {
        domain: "Traction",
        score: 45,
        verdict: "Weak",
        keyFinding:
          "Three paying pilots at EUR 4k/month each. No expansion revenue yet. Retention too early to judge — all contracts under 6 months. LTV:CAC unclear, no stated CAC or payback period.",
        dataCompleteness: 58,
      },
      {
        domain: "Financials",
        score: 62,
        verdict: "Moderate",
        keyFinding:
          "Raising EUR 1.5M at EUR 8M pre-money. 18 months runway at current burn rate. Valuation is within range for Seed stage in this sector, but light on traction to justify the top end.",
        dataCompleteness: 70,
      },
    ],
    thesis:
      "Meridian Flow is building procurement automation for European mid-market buyers — a legitimate gap in a market currently served by expensive enterprise tools (Coupa) or generic horizontal software. The founding team has genuine domain expertise and has shipped a working product with early pilot revenue. However, the core question is whether the team can break out of the pilot phase into repeatable enterprise sales before the runway ends. The traction data does not yet support the valuation being asked, and the competitive landscape includes well-capitalised incumbents who could extend downmarket. Worth continuing conversations — particularly to understand the CTO gap and the path from pilot to expansion — but not yet a clear conviction investment at these terms.",
    strengths: [
      {
        id: 1,
        severity: "Info",
        text: "Founders have 18 combined years of domain expertise in procurement and enterprise software. Commercial lead previously ran procurement at a mid-market retailer, which maps directly to the ICP.",
      },
      {
        id: 2,
        severity: "Info",
        text: "Three paying pilots validate that enterprise buyers are willing to sign for the core product. The data-driven supplier matching feature is a genuine improvement over what legacy tools offer.",
      },
      {
        id: 3,
        severity: "Info",
        text: "Capital efficiency is reasonable for the stage. EUR 1.5M raise at EUR 8M pre-money is in the typical range for EU Seed SaaS with pilot revenue.",
      },
    ],
    risks: [
      {
        id: 1,
        severity: "Warning",
        text: "No full-time CTO. Engineering is currently led by a contract team, which is a common scaling bottleneck and a risk flag for technical due diligence. Confirm the plan to hire before Series A.",
      },
      {
        id: 2,
        severity: "Warning",
        text: "Traction is pilot-stage, not growth-stage. No expansion revenue, no stated CAC or payback period, and retention curves cannot yet be evaluated. At this price point, IC will want more evidence of repeatable sales motion.",
      },
      {
        id: 3,
        severity: "Info",
        text: "Competitive moat is thin today. Coupa and Jaggaer could extend downmarket at any time. Defensibility depends on data accumulation — which only works if Meridian wins enough pilots in the next 12 months to matter.",
      },
    ],
    recommendedNextSteps: [
      "Reference calls with all three pilot customers — focus on expansion intent, contract renewal likelihood, and perceived differentiation vs alternatives.",
      "Request detailed financial model: CAC breakdown, expected payback period, and path to EUR 500k ARR by end of year.",
      "Meet the engineering lead. Understand the CTO hiring timeline and whether the current contract team is a permanent arrangement or a bridge.",
      "Map the competitive landscape in more depth — particularly whether any incumbent has announced a mid-market product.",
      "If pilot customers give strong references and the team has a credible Series A plan, revisit terms. At current valuation with current traction, this is a conditional pass pending the follow-up.",
    ],
    dataCompleteness: 75,
  },
  // The rest of DealAnalysis is stubbed — /sample only renders executiveSummary.
  team: {
    score: 72,
    verdict: "Moderate",
    dataCompleteness: 85,
    founders: [],
    founderMarketFit: "",
    teamDynamics: "",
    redFlags: [],
  },
  market: {
    score: 68,
    verdict: "Moderate",
    dataCompleteness: 78,
    marketSize: [],
    marketDynamics: "",
    whyNow: "",
    whyNowScore: "Moderate",
    competitors: [],
    redFlags: [],
  },
  product: {
    score: 75,
    verdict: "Moderate",
    dataCompleteness: 82,
    problemType: "",
    painScore: "",
    currentSolutions: "",
    evidenceOfPain: "",
    solutionComparison: [],
    pmfStatus: "",
    pmfDetails: "",
    moat: [],
    redFlags: [],
  },
  traction: {
    score: 45,
    verdict: "Weak",
    dataCompleteness: 58,
    revenueMetrics: [],
    unitEconomics: [],
    retention: [],
    redFlags: [],
  },
  finance: {
    score: 62,
    verdict: "Moderate",
    dataCompleteness: 70,
    financialHealth: [],
    capitalEfficiency: "",
    investorSignals: "",
    valuation: [],
    dealTerms: "",
    redFlags: [],
  },
  exitPotential: {
    score: 60,
    verdict: "Moderate",
    dataCompleteness: 65,
    comparableExits: [],
    exitRange: "",
    exitTimeline: "",
    acquirerLandscape: "",
    redFlags: [],
  },
  fundFit: {
    score: 70,
    verdict: "Moderate",
    dataCompleteness: 80,
    criteria: [],
    thesisAlignment: 70,
    portfolioConflict: "",
  },
  missingInfo: {
    sections: [],
    overallCompleteness: 75,
  },
}
