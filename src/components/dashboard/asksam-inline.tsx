"use client"

/**
 * Persistent right-rail copilot panel for deal-detail pages.
 * Auto-binds `scope` to the current route segment (summary/team/market/...).
 * On mobile: collapses to a floating button that opens a bottom sheet.
 *
 * Reuses the /api/chat endpoint (accepts dealId + scope).
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Send, Sparkles, MessageSquare, RotateCcw, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useDeal } from "@/hooks/use-deal"
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

const SCOPE_KEYS: Scope[] = [
  "summary",
  "team",
  "market",
  "product",
  "traction",
  "finance",
  "fund-fit",
  "exit",
]

const SCOPE_LABEL: Record<Scope, string> = {
  summary: "Executive Summary",
  team: "Team",
  market: "Market",
  product: "Product",
  traction: "Traction",
  finance: "Finance",
  "fund-fit": "Fund Fit",
  exit: "Exit Potential",
}

function deriveScope(pathname: string): Scope {
  const seg = pathname.split("/").filter(Boolean).reverse().find((s) => SCOPE_KEYS.includes(s as Scope))
  return (seg as Scope) ?? "summary"
}

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

/**
 * Panel body — extracted so we can render it in both the sticky desktop rail
 * and inside a mobile bottom sheet without duplicating chat state.
 */
function CopilotPanelBody({
  dealId,
  company,
  scope,
  messages,
  setMessages,
  input,
  setInput,
  sending,
  send,
  onClose,
}: {
  dealId: string
  company: string
  scope: Scope
  messages: Msg[]
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  sending: boolean
  send: (text: string) => Promise<void>
  onClose?: () => void
}) {
  const threadEndRef = useRef<HTMLDivElement>(null)
  const suggestions = useMemo(() => suggestionsFor(scope, company), [scope, company])
  const scopeLabel = SCOPE_LABEL[scope]

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, sending])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-foreground/10 px-4 py-3">
        <span className="grid place-items-center h-8 w-8 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] ring-1 ring-[#D4FF6B]/20 shrink-0">
          <MessageSquare className="h-4 w-4 text-[#D4FF6B]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-mono uppercase tracking-widest text-primary leading-none">
            Co-pilot
          </p>
          <p className="mt-1 text-[12.5px] font-heading font-semibold leading-tight truncate">
            Ask SAM · {scopeLabel}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            title="Clear thread"
            className="grid place-items-center h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="grid place-items-center h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Thread */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="h-3 w-3 text-primary shrink-0" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/55 truncate">
            In context · {company}
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-[11.5px] text-muted-foreground mb-1">Try a starter:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={sending || !dealId}
                className="block w-full rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-left text-[12.5px] leading-snug hover:border-primary/30 hover:bg-[#F4FAF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-[1.5] whitespace-pre-wrap",
                  m.who === "sam"
                    ? "self-start bg-[#F4FAF6] text-[#0A2E22] ring-1 ring-[#0F3D2E]/5"
                    : "self-end bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-sm shadow-primary/20"
                )}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="self-start max-w-[80%] rounded-2xl bg-[#F4FAF6] ring-1 ring-[#0F3D2E]/5 px-3.5 py-2">
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
      </div>

      {/* Composer */}
      <form
        className="border-t border-foreground/10 bg-background p-3"
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
            className="min-h-9 max-h-[120px] resize-none text-[12.5px] rounded-xl border-foreground/15 focus-visible:border-primary/40 focus-visible:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-[#D4FF6B] shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export function AskSamInline({ dealId }: { dealId: string }) {
  const pathname = usePathname()
  const scope = deriveScope(pathname)
  const { deal } = useDeal(dealId)

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Reset thread when scope changes — keeps follow-ups grounded in the current tab.
  const scopeKey = `${dealId}:${scope}`
  const prevScopeKey = useRef(scopeKey)
  useEffect(() => {
    if (prevScopeKey.current !== scopeKey) {
      setMessages([])
      prevScopeKey.current = scopeKey
    }
  }, [scopeKey])

  const company = deal?.companyName ?? "this deal"

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

  // Don't render the copilot until analysis exists — same gate as the previous /ask page.
  if (!deal?.analysis) return null

  return (
    <>
      {/* Desktop: persistent sticky right-rail panel.
        Height accounts for: topbar (3.5rem) + main p-6 (1.5rem) + deal header + gap above the rail
        so the composer stays visible at scroll-top. */}
      <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 sticky top-4 self-start h-[calc(100dvh-15rem)] flex-col rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden shadow-sm">
        <CopilotPanelBody
          dealId={dealId}
          company={company}
          scope={scope}
          messages={messages}
          setMessages={setMessages}
          input={input}
          setInput={setInput}
          sending={sending}
          send={send}
        />
      </aside>

      {/* Mobile / tablet: floating launcher + bottom sheet */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed right-4 bottom-20 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] px-4 py-2.5 text-[#D4FF6B] shadow-lg shadow-primary/30 ring-1 ring-[#D4FF6B]/20 active:opacity-90 transition-opacity"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Open Ask SAM copilot"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-[12.5px] font-semibold">Ask SAM</span>
      </button>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="bottom"
          className="h-[85dvh] max-h-[85dvh] p-0 flex flex-col"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Ask SAM</SheetTitle>
          <CopilotPanelBody
            dealId={dealId}
            company={company}
            scope={scope}
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            sending={sending}
            send={send}
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
