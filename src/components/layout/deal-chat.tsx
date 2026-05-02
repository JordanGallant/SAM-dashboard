"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageSquare, X, Send, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useDeal } from "@/hooks/use-deal"
import { cn } from "@/lib/utils"

type Msg = { who: "user" | "sam"; text: string }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function dealIdFromPath(pathname: string) {
  const m = pathname.match(/\/deals\/([^/]+)/)
  return m && UUID_RE.test(m[1]) ? m[1] : undefined
}

export function DealChat() {
  const pathname = usePathname()
  const dealId = dealIdFromPath(pathname)
  const { deal } = useDeal(dealId)

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { who: "sam", text: "Hi — I have context on your deals. Ask me anything." },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape" && open) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    const nextHistory: Msg[] = [...messages, { who: "user", text: trimmed }]
    setMessages(nextHistory)
    setInput("")
    setSending(true)
    try {
      const apiMessages = nextHistory
        .slice(1)
        .map((m) => ({ role: m.who === "user" ? "user" : "assistant", content: m.text }))
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, dealId }),
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

  const chips: string[] = []
  if (deal) {
    chips.push(deal.companyName)
    if (deal.stage) chips.push(deal.stage)
    const summary = deal.analysis?.executiveSummary
    if (summary?.overallScore !== undefined) chips.push(`Score ${summary.overallScore}`)
    if (summary?.verdict) chips.push(summary.verdict)
  } else {
    chips.push("All deals")
  }

  const suggestions = deal
    ? [
        `Why did ${deal.companyName} score the way it did?`,
        `What are the biggest risks for ${deal.companyName}?`,
        `Draft a founder email for ${deal.companyName}`,
      ]
    : [
        "Which deals look strongest this week?",
        "Summarise deals I haven't reviewed yet",
        "Which deals match my fund thesis?",
      ]

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group fixed bottom-6 right-6 z-40 hidden md:inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-[#D4FF6B] shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all ring-1 ring-[#D4FF6B]/20"
          title="Ask SAM (⌘I)"
          aria-label="Ask SAM"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}

      <aside
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-40 flex h-dvh w-[380px] flex-col bg-white border-l border-[#0F3D2E]/10 shadow-2xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between gap-3 border-b border-[#0F3D2E]/10 bg-gradient-to-br from-[#F4FAF6] to-white px-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] ring-1 ring-[#D4FF6B]/20">
              <MessageSquare className="h-4 w-4 text-[#D4FF6B]" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-heading font-bold leading-none text-[#0A2E22]">Ask SAM</div>
              <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                Context-aware
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F3D2E]/70 hover:bg-[#0F3D2E]/5 hover:text-[#0F3D2E] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Context chips */}
        <div className="border-b border-[#0F3D2E]/5 bg-[#F4FAF6]/50 px-4 py-3">
          <div className="mb-2 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
            In context
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-[#0F3D2E]/10 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0A2E22]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug",
                m.who === "sam"
                  ? "bg-[#F4FAF6] text-[#0A2E22] rounded-bl-sm ring-1 ring-[#0F3D2E]/5"
                  : "ml-auto bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white rounded-br-sm shadow-sm shadow-primary/20"
              )}
            >
              {m.text}
            </div>
          ))}
          {sending && (
            <div
              className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#F4FAF6] ring-1 ring-[#0F3D2E]/5 px-3 py-2.5"
              aria-label="SAM is typing"
            >
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]/50 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]/50 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]/50 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          )}
          {messages.length === 1 && !sending && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Suggested
              </div>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full rounded-xl border border-[#0F3D2E]/10 bg-white px-3 py-2 text-left text-[12.5px] hover:border-primary/30 hover:bg-[#F4FAF6] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          className="border-t border-[#0F3D2E]/10 bg-white p-3"
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
              placeholder={deal ? `Ask about ${deal.companyName}…` : "Ask about your deals…"}
              className="min-h-10 max-h-[120px] resize-none text-sm rounded-xl border-[#0F3D2E]/15 focus-visible:border-primary/40 focus-visible:ring-primary/20"
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
            ⌘I to toggle · Shift+Enter for newline
          </p>
        </form>
      </aside>
    </>
  )
}
