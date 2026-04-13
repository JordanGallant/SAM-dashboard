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
import type { ExecutiveSummary, ScorecardRow, FindingItem } from "./types/analysis"

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
              new TextRun({ text: es.verdict.toUpperCase(), bold: true, size: 48, font: "Calibri", color: verdictColor(es.verdict) }),
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
