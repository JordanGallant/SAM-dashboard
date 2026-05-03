import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"
import { dbToDeal, type DbDeal, type DbDocument, type DbAnalysis } from "@/lib/db-mappers"
import type { Deal } from "@/lib/types/deal"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const maxDuration = 60

type Msg = { role: "user" | "assistant"; content: string }
type Scope = "team" | "market" | "product" | "traction" | "finance" | "fund-fit" | "exit" | "summary"

const SYSTEM_BASE = `You are SAM, an AI investment associate for a European VC fund.
You answer questions about the user's deal pipeline with concrete, citation-backed reasoning.
Be concise (usually under 150 words). Use short bullets when they aid scanning.
When the user asks about a specific deal, ground every claim in the memo data we give you below.
If data is missing, say "not in the memo" rather than speculating.
Never invent numbers, founders, customers, or competitors.`

function buildDealContext(deal: Deal): string {
  const es = deal.analysis?.executiveSummary
  if (!es) {
    return `DEAL IN CONTEXT: ${deal.companyName} (${deal.stage})\nNo analysis available yet — the pitch deck has not been processed.`
  }
  const scorecard = es.scorecard
    .map((r) => `  - ${r.domain}: ${r.score}/100 (${r.verdict}) — ${r.keyFinding}`)
    .join("\n")
  const strengths = es.strengths.map((s) => `  - [${s.severity}] ${s.text}`).join("\n")
  const risks = es.risks.map((r) => `  - [${r.severity}] ${r.text}`).join("\n")
  const nextSteps = es.recommendedNextSteps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")

  return `DEAL IN CONTEXT: ${deal.companyName}
Stage: ${es.stage} · Sector: ${es.sector} · Geography: ${es.geography}
Raising: ${es.raising || "not disclosed"} · MRR: ${es.mrr || "not disclosed"}
Overall score: ${es.overallScore}/100 · Verdict: ${es.verdict} · Confidence: ${es.confidence}
Data completeness: ${es.dataCompleteness}%

SCORECARD:
${scorecard}

THESIS:
${es.thesis}

STRENGTHS:
${strengths || "  (none recorded)"}

RISKS:
${risks || "  (none recorded)"}

RECOMMENDED NEXT STEPS:
${nextSteps || "  (none recorded)"}`
}

function buildTeamContext(deal: Deal): string {
  const t = deal.analysis?.team
  if (!t) {
    return `DEAL IN CONTEXT: ${deal.companyName} (${deal.stage})\nNo team analysis available yet.`
  }
  const founders = t.founders
    .filter((f) => f.name && f.name !== "Unknown")
    .map((f) => {
      const lines = [`  - ${f.name} (${f.role || "—"})`]
      if (f.background) lines.push(`    background: ${f.background}`)
      if (f.strength) lines.push(`    strength: ${f.strength}`)
      if (f.keyConcern) lines.push(`    concern: ${f.keyConcern}`)
      if (f.linkedinUrl) lines.push(`    linkedin: ${f.linkedinUrl}`)
      return lines.join("\n")
    })
    .join("\n")
  const redFlags = t.redFlags.map((r) => `  - [${r.severity}] ${r.text}`).join("\n")

  return `DEAL IN CONTEXT: ${deal.companyName} — TEAM TAB
Team score: ${t.score}/100 · Verdict: ${t.verdict} · Data completeness: ${t.dataCompleteness}%

FOUNDERS:
${founders || "  (none)"}

FOUNDER-MARKET FIT:
${t.founderMarketFit || "  (not recorded)"}

TEAM DYNAMICS & COMPOSITION:
${t.teamDynamics || "  (not recorded)"}

RED FLAGS:
${redFlags || "  (none)"}`
}

async function getScopedDealContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  dealId: string,
  scope: Scope | undefined
): Promise<string> {
  const [{ data: dealRow }, { data: docRows }, { data: latestAnalysis }] = await Promise.all([
    supabase.from("deals").select("*").eq("id", dealId).single(),
    supabase.from("documents").select("*").eq("deal_id", dealId),
    supabase
      .from("analyses")
      .select("*")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])
  if (!dealRow) return "(deal not found)"
  const analysisRow = latestAnalysis as DbAnalysis | null
  const result = analysisRow?.status === "completed" ? analysisRow?.result ?? undefined : undefined
  const deal = dbToDeal(dealRow as DbDeal, (docRows ?? []) as DbDocument[], result)
  switch (scope) {
    case "team":
      return buildTeamContext(deal)
    default:
      return buildDealContext(deal)
  }
}

async function getPipelineContext(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string> {
  const { data: deals } = await supabase
    .from("deals")
    .select("id, company_name, stage, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)
  if (!deals || deals.length === 0) return "PIPELINE: no deals yet."
  return `PIPELINE (${deals.length} deals):\n${deals
    .map((d) => `  - ${d.company_name} (${d.stage}) · ${d.status}`)
    .join("\n")}`
}

export async function POST(req: Request) {
  // Burst protection — chat hits Azure on every message; trivial abuse vector.
  // 30/min/IP gives a real user plenty of headroom while clipping bots.
  const ip = getClientIp(req.headers)
  const rl = checkRateLimit(`chat:${ip}`, { limit: 30, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many requests. Retry in ${rl.retryAfter}s.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfter),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Window": "60",
        },
      }
    )
  }

  const key = process.env.AZURE_AI_KEY
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const model = process.env.AZURE_AI_MODEL || "gpt-4o"
  if (!key || !endpoint) {
    return NextResponse.json(
      { error: "Azure AI not configured — set AZURE_AI_KEY and AZURE_AI_ENDPOINT" },
      { status: 500 }
    )
  }

  let body: { messages?: Msg[]; dealId?: string; scope?: Scope }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const messages = Array.isArray(body.messages) ? body.messages : []
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const context = body.dealId
    ? await getScopedDealContext(supabase, body.dealId, body.scope)
    : await getPipelineContext(supabase, user.id)

  const client = new OpenAI({ baseURL: endpoint, apiKey: key })

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 600,
      messages: [
        { role: "system", content: `${SYSTEM_BASE}\n\n${context}` },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    })
    const reply = completion.choices[0]?.message?.content ?? ""
    return NextResponse.json({ reply })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Inference failed"
    console.error("[chat] Azure AI error:", message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
