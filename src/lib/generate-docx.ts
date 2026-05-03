import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Packer,
} from "docx"
import { verdictLabel } from "./verdict-label"
import type {
  ExecutiveSummary,
  ScorecardRow,
  FindingItem,
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
} from "./types/analysis"

function verdictColor(verdict: string) {
  if (verdict === "Strong Buy") return "2E7D32"
  if (verdict === "Explore") return "F57F17"
  if (verdict === "Conditional Pass") return "E65100"
  return "C62828" // Deny
}

function severityLabel(severity: string) {
  if (severity === "Critical") return "[CRITICAL]"
  if (severity === "Warning") return "[WARNING]"
  return "[INFO]"
}

function cellBorders() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
  return { top: border, bottom: border, left: border, right: border }
}

function headerCell(text: string) {
  return new TableCell({
    borders: cellBorders(),
    shading: { fill: "F5F5F5" },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, font: "Calibri" })] })],
  })
}

function bodyCell(text: string) {
  return new TableCell({
    borders: cellBorders(),
    children: [new Paragraph({ children: [new TextRun({ text, size: 18, font: "Calibri" })] })],
  })
}

function findingsList(title: string, items: FindingItem[]): Paragraph[] {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: title, bold: true, size: 22, font: "Calibri" })],
      spacing: { before: 300, after: 100 },
    }),
    ...items.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun({ text: `${item.id}. ${severityLabel(item.severity)} `, bold: true, size: 18, font: "Calibri" }),
            new TextRun({ text: item.text, size: 18, font: "Calibri" }),
          ],
          spacing: { after: 80 },
        })
    ),
  ]
}

export async function generateExecutiveSummaryDocx(es: ExecutiveSummary): Promise<Buffer> {
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20 } },
      },
    },
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({ text: "SAM", bold: true, size: 28, font: "Calibri", color: "333333" }),
              new TextRun({ text: " — AI Investment Associate", size: 22, font: "Calibri", color: "888888" }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Investment Memo: ${es.companyName}`, bold: true, size: 32, font: "Calibri" })],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Stage: ${es.stage}  |  Sector: ${es.sector}  |  Geography: ${es.geography}  |  Raising: ${es.raising}`, size: 18, font: "Calibri", color: "666666" }),
            ],
            spacing: { after: 200 },
          }),

          // Verdict
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: verdictLabel(es.verdict).toUpperCase(), bold: true, size: 48, font: "Calibri", color: verdictColor(es.verdict) }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Confidence: ${es.confidence}  |  Overall Score: ${es.overallScore}/100  |  Data Completeness: ${es.dataCompleteness}%`, size: 20, font: "Calibri", color: "555555" }),
            ],
            spacing: { after: 300 },
          }),

          // Investment Scorecard
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Investment Scorecard", bold: true, size: 24, font: "Calibri" })],
            spacing: { after: 100 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  headerCell("Domain"),
                  headerCell("Score"),
                  headerCell("Verdict"),
                  headerCell("Key Finding"),
                ],
              }),
              ...es.scorecard.map(
                (row: ScorecardRow) =>
                  new TableRow({
                    children: [
                      bodyCell(row.domain),
                      bodyCell(`${row.score}/100`),
                      bodyCell(row.verdict),
                      bodyCell(row.keyFinding),
                    ],
                  })
              ),
            ],
          }),

          // Thesis
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Investment Thesis", bold: true, size: 24, font: "Calibri" })],
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: es.thesis, size: 20, font: "Calibri" })],
            spacing: { after: 200 },
          }),

          // Strengths
          ...findingsList("Key Strengths", es.strengths),

          // Risks
          ...findingsList("Key Risks", es.risks),

          // Recommended Next Steps
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: "Recommended Next Steps", bold: true, size: 22, font: "Calibri" })],
            spacing: { before: 300, after: 100 },
          }),
          ...es.recommendedNextSteps.map(
            (step, i) =>
              new Paragraph({
                children: [new TextRun({ text: `${i + 1}. ${step}`, size: 18, font: "Calibri" })],
                spacing: { after: 60 },
              })
          ),

          // Footer
          new Paragraph({
            children: [
              new TextRun({ text: `Generated by SAM — AI Investment Associate  |  ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, size: 16, font: "Calibri", color: "AAAAAA", italics: true }),
            ],
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}

// ----------------------------------------------------------------------------
// Full report — every section the dashboard renders, in one DOCX. Used by
// /api/export/word with the "Full report" option.
// ----------------------------------------------------------------------------

function h1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 28, font: "Calibri", color: "0F3D2E" })],
    spacing: { before: 400, after: 160 },
  })
}

function h2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 22, font: "Calibri" })],
    spacing: { before: 240, after: 100 },
  })
}

function p(text: string | undefined, opts: { italic?: boolean; color?: string } = {}): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text || "—",
        size: 20,
        font: "Calibri",
        italics: opts.italic,
        color: opts.color,
      }),
    ],
    spacing: { after: 120 },
  })
}

function domainHeader(label: string, score: number, verdict: string, completeness: number): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `Score ${score}/100  ·  ${verdict}  ·  Data ${completeness}%`,
        size: 18,
        font: "Calibri",
        color: "666666",
      }),
    ],
    spacing: { after: 200 },
  })
}

function metricTable(rows: MetricRow[]): Table | Paragraph {
  if (!rows || rows.length === 0) {
    return p("No metric data captured.", { italic: true, color: "888888" })
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          headerCell("Metric"),
          headerCell("Value"),
          headerCell("Benchmark"),
          headerCell("Notes"),
        ],
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: [
              bodyCell(r.metric),
              bodyCell(r.value || "—"),
              bodyCell(r.benchmark || "—"),
              bodyCell(r.statusNote || r.growth || "—"),
            ],
          })
      ),
    ],
  })
}

function teamSection(team: TeamAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Team"),
    domainHeader("Team", team.score, team.verdict, team.dataCompleteness),
  ]
  if (team.founders && team.founders.length > 0) {
    out.push(h2("Founders"))
    for (const f of team.founders) {
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: f.name || "—", bold: true, size: 22, font: "Calibri" }),
            new TextRun({ text: f.role ? `  —  ${f.role}` : "", size: 20, font: "Calibri", color: "666666" }),
          ],
          spacing: { before: 160, after: 80 },
        })
      )
      if (f.background) out.push(p(f.background))
      if (f.strength)
        out.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Strength: ", bold: true, size: 18, font: "Calibri", color: "2E7D32" }),
              new TextRun({ text: f.strength, size: 18, font: "Calibri" }),
            ],
            spacing: { after: 60 },
          })
        )
      if (f.keyConcern)
        out.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Concern: ", bold: true, size: 18, font: "Calibri", color: "C62828" }),
              new TextRun({ text: f.keyConcern, size: 18, font: "Calibri" }),
            ],
            spacing: { after: 60 },
          })
        )
    }
  }
  if (team.founderMarketFit) {
    out.push(h2("Founder–market fit"))
    out.push(p(team.founderMarketFit))
  }
  if (team.teamDynamics) {
    out.push(h2("Team dynamics & composition"))
    out.push(p(team.teamDynamics))
  }
  if (team.redFlags && team.redFlags.length > 0) {
    out.push(...findingsList("Red flags", team.redFlags))
  }
  return out
}

function marketSection(market: MarketAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Market"),
    domainHeader("Market", market.score, market.verdict, market.dataCompleteness),
  ]
  if (market.marketSize && market.marketSize.length > 0) {
    out.push(h2("Market size validation"))
    out.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [headerCell("Metric"), headerCell("Founder claim"), headerCell("Validated"), headerCell("Variance")],
          }),
          ...market.marketSize.map(
            (r) =>
              new TableRow({
                children: [
                  bodyCell(r.metric),
                  bodyCell(r.founderClaim || "—"),
                  bodyCell(r.validatedEstimate || "—"),
                  bodyCell(r.variance || "—"),
                ],
              })
          ),
        ],
      })
    )
  }
  if (market.marketDynamics) {
    out.push(h2("Market dynamics"))
    out.push(p(market.marketDynamics))
  }
  if (market.whyNow) {
    out.push(h2("Why now?"))
    out.push(p(market.whyNow))
  }
  if (market.competitors && market.competitors.length > 0) {
    out.push(h2("Competitive landscape"))
    for (const c of market.competitors) {
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: c.name || "—", bold: true, size: 20, font: "Calibri" }),
            new TextRun({
              text: `  —  Threat: ${c.threatLevel}  ·  Funding: ${c.funding || "—"}`,
              size: 18,
              font: "Calibri",
              color: "666666",
            }),
          ],
          spacing: { before: 120, after: 60 },
        })
      )
      if (c.differentiation) out.push(p(c.differentiation))
    }
  }
  if (market.redFlags && market.redFlags.length > 0) {
    out.push(...findingsList("Red flags", market.redFlags))
  }
  return out
}

function productSection(product: ProductAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Product"),
    domainHeader("Product", product.score, product.verdict, product.dataCompleteness),
    h2("Problem assessment"),
    p(`Problem type: ${product.problemType || "—"}  ·  Pain score: ${product.painScore || "—"}`),
  ]
  if (product.evidenceOfPain) {
    out.push(h2("Evidence of pain"))
    out.push(p(product.evidenceOfPain))
  }
  if (product.currentSolutions) {
    out.push(h2("Current solutions"))
    out.push(p(product.currentSolutions))
  }
  if (product.solutionComparison && product.solutionComparison.length > 0) {
    out.push(h2("Solution & 10x test"))
    out.push(metricTable(product.solutionComparison))
  }
  if (product.pmfDetails) {
    out.push(h2("Product–market fit"))
    if (product.pmfStatus) out.push(p(`Status: ${product.pmfStatus}`))
    out.push(p(product.pmfDetails))
  }
  if (product.moat && product.moat.length > 0) {
    out.push(h2("Moat assessment"))
    out.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [headerCell("Type"), headerCell("Present"), headerCell("Strength"), headerCell("Evidence")],
          }),
          ...product.moat.map((m) => {
            const strengthClamped = Math.max(0, Math.min(10, m.strength))
            return new TableRow({
              children: [
                bodyCell(m.type),
                bodyCell(m.present ? "Yes" : "No"),
                bodyCell(`${strengthClamped}/10`),
                bodyCell(m.evidence || "—"),
              ],
            })
          }),
        ],
      })
    )
  }
  if (product.redFlags && product.redFlags.length > 0) {
    out.push(...findingsList("Red flags", product.redFlags))
  }
  return out
}

function tractionSection(traction: TractionAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Traction"),
    domainHeader("Traction", traction.score, traction.verdict, traction.dataCompleteness),
  ]
  if (traction.revenueMetrics && traction.revenueMetrics.length > 0) {
    out.push(h2("Revenue & growth"))
    out.push(metricTable(traction.revenueMetrics))
  }
  if (traction.unitEconomics && traction.unitEconomics.length > 0) {
    out.push(h2("Unit economics"))
    out.push(metricTable(traction.unitEconomics))
  }
  if (traction.retention && traction.retention.length > 0) {
    out.push(h2("Retention & engagement"))
    out.push(metricTable(traction.retention))
  }
  if (traction.redFlags && traction.redFlags.length > 0) {
    out.push(...findingsList("Red flags", traction.redFlags))
  }
  return out
}

function financeSection(finance: FinanceAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Finance"),
    domainHeader("Finance", finance.score, finance.verdict, finance.dataCompleteness),
  ]
  if (finance.financialHealth && finance.financialHealth.length > 0) {
    out.push(h2("Financial health"))
    out.push(metricTable(finance.financialHealth))
  }
  if (finance.capitalEfficiency) {
    out.push(h2("Capital efficiency"))
    out.push(p(finance.capitalEfficiency))
  }
  if (finance.investorSignals) {
    out.push(h2("Investor signals"))
    out.push(p(finance.investorSignals))
  }
  if (finance.valuation && finance.valuation.length > 0) {
    out.push(h2("Valuation assessment"))
    out.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [headerCell("Method"), headerCell("Implied value"), headerCell("Basis")],
          }),
          ...finance.valuation.map(
            (v) =>
              new TableRow({
                children: [bodyCell(v.method), bodyCell(v.impliedValue || "—"), bodyCell(v.basis || "—")],
              })
          ),
        ],
      })
    )
  }
  if (finance.dealTerms) {
    out.push(h2("Deal terms & cap table"))
    out.push(p(finance.dealTerms))
  }
  if (finance.redFlags && finance.redFlags.length > 0) {
    out.push(...findingsList("Red flags", finance.redFlags))
  }
  return out
}

function exitSection(exit: ExitAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Exit Potential"),
    domainHeader("Exit", exit.score, exit.verdict, exit.dataCompleteness),
  ]
  if (exit.comparableExits && exit.comparableExits.length > 0) {
    out.push(h2("Comparable exits"))
    out.push(metricTable(exit.comparableExits))
  }
  if (exit.exitRange) {
    out.push(h2("Realistic exit range"))
    out.push(p(exit.exitRange))
  }
  if (exit.exitTimeline) {
    out.push(h2("Exit timeline"))
    out.push(p(exit.exitTimeline))
  }
  if (exit.acquirerLandscape) {
    out.push(h2("Acquirer landscape"))
    out.push(p(exit.acquirerLandscape))
  }
  if (exit.redFlags && exit.redFlags.length > 0) {
    out.push(...findingsList("Red flags", exit.redFlags))
  }
  return out
}

function fundFitSection(fit: FundFitAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    h1("Fund Fit"),
    domainHeader("Fund Fit", fit.score, fit.verdict, fit.dataCompleteness),
  ]
  if (fit.criteria && fit.criteria.length > 0) {
    out.push(h2("Criteria match"))
    out.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [headerCell("Criterion"), headerCell("Fund profile"), headerCell("Deal"), headerCell("Match")],
          }),
          ...fit.criteria.map(
            (c) =>
              new TableRow({
                children: [
                  bodyCell(c.criterion),
                  bodyCell(c.fundProfile || "—"),
                  bodyCell(c.deal || "—"),
                  bodyCell(c.match ? "✓" : "✗"),
                ],
              })
          ),
        ],
      })
    )
  }
  out.push(h2("Thesis alignment"))
  out.push(p(`${fit.thesisAlignment}/100`))
  if (fit.portfolioConflict) {
    out.push(h2("Portfolio conflict"))
    out.push(p(fit.portfolioConflict))
  }
  return out
}

function missingInfoSection(missing: MissingInfoAnalysis): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [h1("Missing Information")]
  out.push(p(`Overall completeness: ${missing.overallCompleteness}%`, { color: "666666" }))
  if (!missing.sections || missing.sections.length === 0) {
    out.push(p("No data gaps identified.", { italic: true, color: "888888" }))
    return out
  }
  for (const s of missing.sections) {
    out.push(h2(s.section))
    if (s.impact) out.push(p(s.impact, { italic: true }))
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Data gaps", bold: true, size: 18, font: "Calibri" })],
        spacing: { before: 100, after: 60 },
      })
    )
    for (const item of s.items) {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${item}`, size: 18, font: "Calibri" })],
          spacing: { after: 40 },
        })
      )
    }
    if (s.followUpQuestions && s.followUpQuestions.length > 0) {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: "Suggested follow-up questions", bold: true, size: 18, font: "Calibri" })],
          spacing: { before: 100, after: 60 },
        })
      )
      s.followUpQuestions.forEach((q, i) =>
        out.push(
          new Paragraph({
            children: [new TextRun({ text: `${String(i + 1).padStart(2, "0")}. ${q}`, size: 18, font: "Calibri" })],
            spacing: { after: 40 },
          })
        )
      )
    }
  }
  return out
}

export async function generateFullReportDocx(
  companyName: string,
  analysis: DealAnalysis
): Promise<Buffer> {
  const es = analysis.executiveSummary

  const cover: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({ text: "SAM", bold: true, size: 28, font: "Calibri", color: "333333" }),
        new TextRun({ text: " — AI Investment Associate", size: 22, font: "Calibri", color: "888888" }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Investment Memo: ${companyName}`, bold: true, size: 32, font: "Calibri" })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Stage: ${es.stage}  |  Sector: ${es.sector}  |  Geography: ${es.geography}  |  Raising: ${es.raising}`,
          size: 18,
          font: "Calibri",
          color: "666666",
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: verdictLabel(es.verdict).toUpperCase(), bold: true, size: 48, font: "Calibri", color: verdictColor(es.verdict) }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Confidence: ${es.confidence}  |  Overall Score: ${es.overallScore}/100  |  Data Completeness: ${es.dataCompleteness}%`,
          size: 20,
          font: "Calibri",
          color: "555555",
        }),
      ],
      spacing: { after: 300 },
    }),
    h1("Executive Summary"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [headerCell("Domain"), headerCell("Score"), headerCell("Verdict"), headerCell("Key Finding")],
        }),
        ...es.scorecard.map(
          (row: ScorecardRow) =>
            new TableRow({
              children: [
                bodyCell(row.domain),
                bodyCell(`${row.score}/100`),
                bodyCell(row.verdict),
                bodyCell(row.keyFinding),
              ],
            })
        ),
      ],
    }),
    h2("Investment thesis"),
    p(es.thesis),
    ...findingsList("Key strengths", es.strengths),
    ...findingsList("Key risks", es.risks),
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: "Recommended Next Steps", bold: true, size: 22, font: "Calibri" })],
      spacing: { before: 300, after: 100 },
    }),
    ...es.recommendedNextSteps.map(
      (step, i) =>
        new Paragraph({
          children: [new TextRun({ text: `${i + 1}. ${step}`, size: 18, font: "Calibri" })],
          spacing: { after: 60 },
        })
    ),
  ]

  const allChildren: (Paragraph | Table)[] = [
    ...cover,
    ...teamSection(analysis.team),
    ...marketSection(analysis.market),
    ...productSection(analysis.product),
    ...tractionSection(analysis.traction),
    ...financeSection(analysis.finance),
    ...exitSection(analysis.exitPotential),
    ...fundFitSection(analysis.fundFit),
    ...missingInfoSection(analysis.missingInfo),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated by SAM — AI Investment Associate  |  ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
          size: 16,
          font: "Calibri",
          color: "AAAAAA",
          italics: true,
        }),
      ],
      spacing: { before: 400 },
    }),
  ]

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
    sections: [{ children: allChildren }],
  })
  return Buffer.from(await Packer.toBuffer(doc))
}
