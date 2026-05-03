// PDF generator using @react-pdf/renderer 4.5+. Mirrors generate-docx.ts shape
// but emits a print-optimised PDF. Keeps the print and screen layouts visually
// distinct on purpose — print favours dense linear flow, screen favours rich
// interactive panels.

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"
import * as React from "react"
import { verdictLabel } from "./verdict-label"
import type {
  DealAnalysis,
  TeamAnalysis,
  MarketAnalysis,
  ProductAnalysis,
  TractionAnalysis,
  FinanceAnalysis,
  ExitAnalysis,
  FundFitAnalysis,
  MissingInfoAnalysis,
  MetricRow,
  FindingItem,
} from "./types/analysis"

// Helvetica is built-in to @react-pdf/renderer — no registration needed.

const COLORS = {
  brand: "#0F3D2E",
  accent: "#00A86B",
  ink: "#1A2330",
  body: "#3a4654",
  muted: "#6e7785",
  mutedSoft: "#9aa1ad",
  rule: "#dee2e6",
  bgSubtle: "#f5f7f6",
  ok: "#1f7a3a",
  warn: "#a05a00",
  bad: "#a01818",
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.body,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.mutedSoft,
    marginBottom: 18,
  },
  brand: { color: COLORS.brand, fontFamily: "Helvetica-Bold" },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 4,
  },
  subtitle: { fontSize: 9, color: COLORS.muted, marginBottom: 22 },
  verdict: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  verdictMeta: {
    fontSize: 9,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 18,
  },
  h1: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brand,
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rule,
  },
  h2: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginTop: 12,
    marginBottom: 4,
  },
  domainMeta: { fontSize: 9, color: COLORS.muted, marginBottom: 8 },
  body: { marginBottom: 8 },
  bullet: { marginBottom: 3, marginLeft: 8 },
  bulletDot: { color: COLORS.brand },
  empty: { color: COLORS.mutedSoft, fontStyle: "italic" as const },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSubtle,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rule,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.muted,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 5,
    paddingRight: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rule,
    fontSize: 9,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 5,
    paddingRight: 5,
  },
  tableCell: { paddingRight: 6 },
  finding: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 10,
  },
  findingTag: {
    fontFamily: "Helvetica-Bold",
    width: 60,
  },
  footer: {
    fontSize: 8,
    color: COLORS.mutedSoft,
    textAlign: "center",
    marginTop: 24,
  },
})

function verdictColor(verdict: string) {
  if (verdict === "Strong Buy") return "#2E7D32"
  if (verdict === "Explore") return "#F57F17"
  if (verdict === "Conditional Pass") return "#E65100"
  return "#C62828"
}

function severityColor(severity: string) {
  if (severity === "Critical") return COLORS.bad
  if (severity === "Warning") return COLORS.warn
  return COLORS.muted
}

function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.body}>{children}</Text>
}

function Empty({ children = "Not provided." }: { children?: string }) {
  return <Text style={styles.empty}>{children}</Text>
}

function MetricTableRow({ row }: { row: MetricRow }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { width: "30%" }]}>{row.metric}</Text>
      <Text style={[styles.tableCell, { width: "20%" }]}>{row.value || "—"}</Text>
      <Text style={[styles.tableCell, { width: "20%" }]}>{row.benchmark || "—"}</Text>
      <Text style={[styles.tableCell, { width: "30%" }]}>
        {row.statusNote || row.growth || "—"}
      </Text>
    </View>
  )
}

function MetricTable({ rows, headers = ["Metric", "Value", "Benchmark", "Notes"] }: { rows?: MetricRow[]; headers?: string[] }) {
  if (!rows || rows.length === 0) {
    return <Empty>No metric data captured.</Empty>
  }
  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { width: "30%" }]}>{headers[0]}</Text>
        <Text style={[styles.tableCell, { width: "20%" }]}>{headers[1]}</Text>
        <Text style={[styles.tableCell, { width: "20%" }]}>{headers[2]}</Text>
        <Text style={[styles.tableCell, { width: "30%" }]}>{headers[3]}</Text>
      </View>
      {rows.map((r, i) => (
        <MetricTableRow key={`${r.metric}-${i}`} row={r} />
      ))}
    </View>
  )
}

function Findings({ title, items }: { title: string; items: FindingItem[] }) {
  if (!items || items.length === 0) return null
  return (
    <View>
      <Text style={styles.h2}>{title}</Text>
      {items.map((f) => (
        <View key={f.id} style={styles.finding}>
          <Text style={[styles.findingTag, { color: severityColor(f.severity) }]}>
            [{f.severity.toUpperCase()}]
          </Text>
          <Text style={{ flex: 1 }}>{f.text}</Text>
        </View>
      ))}
    </View>
  )
}

function DomainMeta({ score, verdict, dataCompleteness }: { score: number; verdict: string; dataCompleteness: number }) {
  return (
    <Text style={styles.domainMeta}>
      Score {score}/100  ·  {verdict}  ·  Data {dataCompleteness}%
    </Text>
  )
}

function TeamPage({ team }: { team: TeamAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Team</Text>
      <DomainMeta {...team} />
      {team.founders.length > 0 && (
        <>
          <Text style={styles.h2}>Founders</Text>
          {team.founders.map((f, i) => (
            <View key={`${f.name}-${i}`} style={{ marginBottom: 8 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.ink }}>
                {f.name || "—"}
                {f.role ? `  —  ${f.role}` : ""}
              </Text>
              {f.background ? <Text>{f.background}</Text> : null}
              {f.strength ? (
                <Text>
                  <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.ok }}>Strength: </Text>
                  {f.strength}
                </Text>
              ) : null}
              {f.keyConcern ? (
                <Text>
                  <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.bad }}>Concern: </Text>
                  {f.keyConcern}
                </Text>
              ) : null}
            </View>
          ))}
        </>
      )}
      {team.founderMarketFit ? (
        <>
          <Text style={styles.h2}>Founder–market fit</Text>
          <P>{team.founderMarketFit}</P>
        </>
      ) : null}
      {team.teamDynamics ? (
        <>
          <Text style={styles.h2}>Team dynamics & composition</Text>
          <P>{team.teamDynamics}</P>
        </>
      ) : null}
      <Findings title="Red flags" items={team.redFlags} />
    </View>
  )
}

function MarketPage({ market }: { market: MarketAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Market</Text>
      <DomainMeta {...market} />
      {market.marketSize.length > 0 && (
        <>
          <Text style={styles.h2}>Market size validation</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: "20%" }]}>Metric</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>Founder claim</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>Validated</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>Variance</Text>
          </View>
          {market.marketSize.map((r) => (
            <View key={r.metric} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>{r.metric}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{r.founderClaim || "—"}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{r.validatedEstimate || "—"}</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>{r.variance || "—"}</Text>
            </View>
          ))}
        </>
      )}
      {market.marketDynamics ? (
        <>
          <Text style={styles.h2}>Market dynamics</Text>
          <P>{market.marketDynamics}</P>
        </>
      ) : null}
      {market.whyNow ? (
        <>
          <Text style={styles.h2}>Why now?</Text>
          <P>{market.whyNow}</P>
        </>
      ) : null}
      {market.competitors.length > 0 && (
        <>
          <Text style={styles.h2}>Competitive landscape</Text>
          {market.competitors.map((c, i) => (
            <View key={`${c.name}-${i}`} style={{ marginBottom: 6 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.ink }}>
                {c.name || "—"}
                <Text style={{ fontFamily: "Helvetica", color: COLORS.muted }}>
                  {`  —  Threat: ${c.threatLevel}  ·  Funding: ${c.funding || "—"}`}
                </Text>
              </Text>
              {c.differentiation ? <Text>{c.differentiation}</Text> : null}
            </View>
          ))}
        </>
      )}
      <Findings title="Red flags" items={market.redFlags} />
    </View>
  )
}

function ProductPage({ product }: { product: ProductAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Product</Text>
      <DomainMeta {...product} />
      <Text style={styles.h2}>Problem assessment</Text>
      <P>
        Problem type: {product.problemType || "—"}  ·  Pain score: {product.painScore || "—"}
      </P>
      {product.evidenceOfPain ? (
        <>
          <Text style={styles.h2}>Evidence of pain</Text>
          <P>{product.evidenceOfPain}</P>
        </>
      ) : null}
      {product.currentSolutions ? (
        <>
          <Text style={styles.h2}>Current solutions</Text>
          <P>{product.currentSolutions}</P>
        </>
      ) : null}
      {product.solutionComparison.length > 0 && (
        <>
          <Text style={styles.h2}>Solution & 10x test</Text>
          <MetricTable rows={product.solutionComparison} />
        </>
      )}
      {product.pmfDetails ? (
        <>
          <Text style={styles.h2}>Product–market fit</Text>
          {product.pmfStatus ? <P>Status: {product.pmfStatus}</P> : null}
          <P>{product.pmfDetails}</P>
        </>
      ) : null}
      {product.moat.length > 0 && (
        <>
          <Text style={styles.h2}>Moat assessment</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: "30%" }]}>Type</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Present</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Strength</Text>
            <Text style={[styles.tableCell, { width: "40%" }]}>Evidence</Text>
          </View>
          {product.moat.map((m, i) => {
            const s = Math.max(0, Math.min(10, m.strength))
            return (
              <View key={`${m.type}-${i}`} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "30%" }]}>{m.type}</Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>{m.present ? "Yes" : "No"}</Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>{s}/10</Text>
                <Text style={[styles.tableCell, { width: "40%" }]}>{m.evidence || "—"}</Text>
              </View>
            )
          })}
        </>
      )}
      <Findings title="Red flags" items={product.redFlags} />
    </View>
  )
}

function TractionPage({ traction }: { traction: TractionAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Traction</Text>
      <DomainMeta {...traction} />
      {traction.revenueMetrics.length > 0 && (
        <>
          <Text style={styles.h2}>Revenue & growth</Text>
          <MetricTable rows={traction.revenueMetrics} />
        </>
      )}
      {traction.unitEconomics.length > 0 && (
        <>
          <Text style={styles.h2}>Unit economics</Text>
          <MetricTable rows={traction.unitEconomics} />
        </>
      )}
      {traction.retention.length > 0 && (
        <>
          <Text style={styles.h2}>Retention & engagement</Text>
          <MetricTable rows={traction.retention} />
        </>
      )}
      <Findings title="Red flags" items={traction.redFlags} />
    </View>
  )
}

function FinancePage({ finance }: { finance: FinanceAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Finance</Text>
      <DomainMeta {...finance} />
      {finance.financialHealth.length > 0 && (
        <>
          <Text style={styles.h2}>Financial health</Text>
          <MetricTable rows={finance.financialHealth} />
        </>
      )}
      {finance.capitalEfficiency ? (
        <>
          <Text style={styles.h2}>Capital efficiency</Text>
          <P>{finance.capitalEfficiency}</P>
        </>
      ) : null}
      {finance.investorSignals ? (
        <>
          <Text style={styles.h2}>Investor signals</Text>
          <P>{finance.investorSignals}</P>
        </>
      ) : null}
      {finance.valuation.length > 0 && (
        <>
          <Text style={styles.h2}>Valuation assessment</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: "25%" }]}>Method</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>Implied value</Text>
            <Text style={[styles.tableCell, { width: "50%" }]}>Basis</Text>
          </View>
          {finance.valuation.map((v, i) => (
            <View key={`${v.method}-${i}`} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "25%" }]}>{v.method}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>{v.impliedValue || "—"}</Text>
              <Text style={[styles.tableCell, { width: "50%" }]}>{v.basis || "—"}</Text>
            </View>
          ))}
        </>
      )}
      {finance.dealTerms ? (
        <>
          <Text style={styles.h2}>Deal terms & cap table</Text>
          <P>{finance.dealTerms}</P>
        </>
      ) : null}
      <Findings title="Red flags" items={finance.redFlags} />
    </View>
  )
}

function ExitPage({ exit }: { exit: ExitAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Exit Potential</Text>
      <DomainMeta {...exit} />
      {exit.comparableExits.length > 0 && (
        <>
          <Text style={styles.h2}>Comparable exits</Text>
          <MetricTable rows={exit.comparableExits} />
        </>
      )}
      {exit.exitRange ? (
        <>
          <Text style={styles.h2}>Realistic exit range</Text>
          <P>{exit.exitRange}</P>
        </>
      ) : null}
      {exit.exitTimeline ? (
        <>
          <Text style={styles.h2}>Exit timeline</Text>
          <P>{exit.exitTimeline}</P>
        </>
      ) : null}
      {exit.acquirerLandscape ? (
        <>
          <Text style={styles.h2}>Acquirer landscape</Text>
          <P>{exit.acquirerLandscape}</P>
        </>
      ) : null}
      <Findings title="Red flags" items={exit.redFlags} />
    </View>
  )
}

function FundFitPage({ fit }: { fit: FundFitAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Fund Fit</Text>
      <DomainMeta {...fit} />
      {fit.criteria.length > 0 && (
        <>
          <Text style={styles.h2}>Criteria match</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: "25%" }]}>Criterion</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>Fund profile</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>Deal</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Match</Text>
          </View>
          {fit.criteria.map((c, i) => (
            <View key={`${c.criterion}-${i}`} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "25%" }]}>{c.criterion}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{c.fundProfile || "—"}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{c.deal || "—"}</Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: "15%", color: c.match ? COLORS.ok : COLORS.bad, fontFamily: "Helvetica-Bold" },
                ]}
              >
                {c.match ? "✓" : "✗"}
              </Text>
            </View>
          ))}
        </>
      )}
      <Text style={styles.h2}>Thesis alignment</Text>
      <P>{fit.thesisAlignment}/100</P>
      {fit.portfolioConflict ? (
        <>
          <Text style={styles.h2}>Portfolio conflict</Text>
          <P>{fit.portfolioConflict}</P>
        </>
      ) : null}
    </View>
  )
}

function MissingInfoPage({ missing }: { missing: MissingInfoAnalysis }) {
  return (
    <View>
      <Text style={styles.h1}>Missing Information</Text>
      <Text style={styles.domainMeta}>Overall completeness: {missing.overallCompleteness}%</Text>
      {missing.sections.length === 0 ? (
        <Empty>No data gaps identified.</Empty>
      ) : (
        missing.sections.map((s) => (
          <View key={s.section} style={{ marginBottom: 10 }}>
            <Text style={styles.h2}>{s.section}</Text>
            {s.impact ? <Text style={[styles.empty, { marginBottom: 4 }]}>{s.impact}</Text> : null}
            <Text style={{ fontFamily: "Helvetica-Bold", marginTop: 2 }}>Data gaps</Text>
            {s.items.map((item, i) => (
              <Text key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text> {item}
              </Text>
            ))}
            {s.followUpQuestions.length > 0 ? (
              <>
                <Text style={{ fontFamily: "Helvetica-Bold", marginTop: 6 }}>Follow-up questions</Text>
                {s.followUpQuestions.map((q, i) => (
                  <Text key={i} style={styles.bullet}>
                    {String(i + 1).padStart(2, "0")}. {q}
                  </Text>
                ))}
              </>
            ) : null}
          </View>
        ))
      )}
    </View>
  )
}

function ReportDocument({ companyName, analysis }: { companyName: string; analysis: DealAnalysis }) {
  const es = analysis.executiveSummary
  return (
    <Document title={`SAM Investment Memo — ${companyName}`} author="SAM">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>SAM · INVESTMENT MEMO</Text>
          <Text>{companyName.toUpperCase()}</Text>
        </View>

        <Text style={styles.title}>Investment Memo: {companyName}</Text>
        <Text style={styles.subtitle}>
          {[es.stage, es.sector, es.geography, es.raising ? `Raising ${es.raising}` : null]
            .filter(Boolean)
            .join("  ·  ")}
        </Text>

        <Text style={[styles.verdict, { color: verdictColor(es.verdict) }]}>
          {verdictLabel(es.verdict).toUpperCase()}
        </Text>
        <Text style={styles.verdictMeta}>
          Confidence: {es.confidence}  ·  Overall: {es.overallScore}/100  ·  Data: {es.dataCompleteness}%
        </Text>

        <Text style={styles.h1}>Executive Summary</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { width: "20%" }]}>Domain</Text>
          <Text style={[styles.tableCell, { width: "12%" }]}>Score</Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Verdict</Text>
          <Text style={[styles.tableCell, { width: "48%" }]}>Key finding</Text>
        </View>
        {es.scorecard.map((row) => (
          <View key={row.domain} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "20%" }]}>{row.domain}</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{row.score}/100</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>{row.verdict}</Text>
            <Text style={[styles.tableCell, { width: "48%" }]}>{row.keyFinding}</Text>
          </View>
        ))}

        <Text style={styles.h2}>Investment thesis</Text>
        <P>{es.thesis}</P>

        <Findings title="Key strengths" items={es.strengths} />
        <Findings title="Key risks" items={es.risks} />

        {es.recommendedNextSteps.length > 0 && (
          <>
            <Text style={styles.h2}>Recommended next steps</Text>
            {es.recommendedNextSteps.map((step, i) => (
              <Text key={i} style={styles.bullet}>
                {i + 1}. {step}
              </Text>
            ))}
          </>
        )}

        <TeamPage team={analysis.team} />
        <MarketPage market={analysis.market} />
        <ProductPage product={analysis.product} />
        <TractionPage traction={analysis.traction} />
        <FinancePage finance={analysis.finance} />
        <ExitPage exit={analysis.exitPotential} />
        <FundFitPage fit={analysis.fundFit} />
        <MissingInfoPage missing={analysis.missingInfo} />

        <Text style={styles.footer}>
          {`SAM — AI Investment Associate  ·  ${new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`}
        </Text>
      </Page>
    </Document>
  )
}

export async function generateFullReportPdf(
  companyName: string,
  analysis: DealAnalysis
): Promise<Buffer> {
  return await renderToBuffer(<ReportDocument companyName={companyName} analysis={analysis} />)
}
