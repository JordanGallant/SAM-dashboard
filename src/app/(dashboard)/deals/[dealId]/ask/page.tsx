"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Send, Sparkles, MessageSquare, RotateCcw } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useDeal } from "@/hooks/use-deal"
import { SectionLabel } from "@/components/dashboard/section-label"
import { cn } from "@/lib/utils"

type Msg = { who: "user" | "sam"; text: string }
type Scope =
  | "summary"
  | "team"
  | "market"
  | "product"
  | "traction"
  | "finance"
  | "fund-fit"
  | "exit"

const SCOPES: { key: Scope; label: string }[] = [
  { key: "summary", label: "Executive Summary" },
  { key: "team", label: "Team" },
  { key: "market", label: "Market" },
  { key: "product", label: "Product" },
  { key: "traction", label: "Traction" },
  { key: "finance", label: "Finance" },
  { key: "fund-fit", label: "Fund Fit" },
  { key: "exit", label: "Exit Potential" },
]

function suggestionsFor(scope: Scope, company: string): string[] {
  switch (scope) {
    case "team":
      return [
        `What's the biggest gap on ${company}'s team?`,
        `Which founder should I dig into first and why?`,
        `Draft 3 reference-call questions targeting the team's weakest area`,
      ]
    case "market":
      return [
        `Is ${company}'s TAM credible? What would I need to verify?`,
        `Which competitor is the biggest threat and why?`,
        `What's the strongest "why now" argument for this market?`,
      ]
    case "product":
      return [
        `What's the most defensible part of ${company}'s product?`,
        `Where does the moat case fall apart?`,
        `What does the pain score actually tell me?`,
      ]
    case "traction":
      return [
        `Which traction metric is most concerning?`,
        `How do these numbers benchmark against the stage?`,
        `What's the strongest growth signal here?`,
      ]
    case "finance":
      return [
        `Is ${company}'s burn realistic for 18 months?`,
        `What's the riskiest assumption in their projections?`,
        `Where should I push back on the ask?`,
      ]
    case "fund-fit":
      return [
        `Why does ${company} match (or not match) my thesis?`,
        `Which fund-fit dimension is weakest?`,
        `What single change would make this a fit?`,
      ]
    case "exit":
      return [
        `What's the most realistic exit path for ${company}?`,
        `Who would acquire them and why?`,
        `Is the return profile worth a check at this stage?`,
      ]
    case "summary":
    default:
      return [
        `Why did ${company} score the way it did?`,
        `What are the biggest risks for ${company}?`,
        `Draft a founder email for ${company}`,
      ]
  }
}

export default function AskSamPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dealId = params.dealId as string
  const { deal } = useDeal(dealId)

  const scopeParam = (searchParams.get("scope") as Scope | null) ?? "summary"
  const scope: Scope = SCOPES.some((s) => s.key === scopeParam) ? scopeParam : "summary"

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const threadEndRef = useRef<HTMLDivElement>(null)

  // Reset thread when scope changes
  const scopeKey = `${dealId}:${scope}`
  const prevScopeKey = useRef(scopeKey)
  useEffect(() => {
    if (prevScopeKey.current !== scopeKey) {
      setMessages([])
      prevScopeKey.current = scopeKey
    }
  }, [scopeKey])

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, sending])

  const company = deal?.companyName ?? "this deal"
  const suggestions = useMemo(() => suggestionsFor(scope, company), [scope, company])
  const scopeLabel = SCOPES.find((s) => s.key === scope)?.label ?? "Executive Summary"

  function setScope(next: Scope) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set("scope", next)
    router.replace(`/deals/${dealId}/ask?${sp.toString()}`, { scroll: false })
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    const next: Msg[] = [...messages, { who: "user", text: trimmed }]
    setMessages(next)
    setInput("")
    setSending(true)
    try {
      const apiMessages = next.map((m) => ({
        role: m.who === "user" ? "user" : "assistant",
        content: m.text,
      }))
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, dealId, scope }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setMessages((m) => [...m, { who: "sam", text: data.reply || "(empty response)" }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setMessages((m) => [...m, { who: "sam", text: `Error: ${msg}` }])
    } finally {
      setSending(false)
    }
  }

  if (!deal?.analysis) {
    return (
      <p className="text-sm text-muted-foreground">
        SAM is available once analysis completes for this deal.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] ring-1 ring-[#D4FF6B]/20">
            <MessageSquare className="h-5 w-5 text-[#D4FF6B]" />
          </span>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Co-pilot</p>
            <h1 className="text-xl font-heading font-bold leading-tight">Ask SAM</h1>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Grounded follow-ups on {company}. Switch scope to focus on a single domain.
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear thread
          </button>
        )}
      </div>

      {/* Scope chips */}
      <section>
        <SectionLabel className="mb-3">Scope</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {SCOPES.map((s) => {
            const active = scope === s.key
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setScope(s.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12px] font-medium border transition-colors",
                  active
                    ? "bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-[#D4FF6B] border-transparent shadow-sm"
                    : "bg-background border-foreground/10 text-foreground/75 hover:border-primary/30 hover:bg-[#F4FAF6]"
                )}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Thread */}
      <section className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60">
              In context · {company} · {scopeLabel}
            </span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-[12px] text-muted-foreground mb-2">Try a starter:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={sending}
                className="block w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 text-left text-[13.5px] hover:border-primary/30 hover:bg-[#F4FAF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-[1.55] whitespace-pre-wrap",
                  m.who === "sam"
                    ? "self-start bg-[#F4FAF6] text-[#0A2E22] ring-1 ring-[#0F3D2E]/5"
                    : "self-end bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-sm shadow-primary/20"
                )}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="self-start max-w-[75%] rounded-2xl bg-[#F4FAF6] ring-1 ring-[#0F3D2E]/5 px-4 py-2.5">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]/50 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]/50 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]/50 animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>
        )}
      </section>

      {/* Composer */}
      <form
        className="sticky bottom-4 z-10 rounded-2xl bg-white ring-1 ring-foreground/10 shadow-lg shadow-foreground/5 p-3"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder={`Ask about ${scopeLabel.toLowerCase()}…`}
            className="min-h-10 max-h-[140px] resize-none text-sm rounded-xl border-foreground/15 focus-visible:border-primary/40 focus-visible:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-[#D4FF6B] shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
          Shift+Enter for newline
        </p>
      </form>
    </div>
  )
}
