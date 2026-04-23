"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useDeal } from "@/hooks/use-deal"
import { cn } from "@/lib/utils"

type Msg = { who: "user" | "sam"; text: string }

function dealIdFromPath(pathname: string) {
  const m = pathname.match(/\/deals\/([^/]+)/)
  return m?.[1]
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
        .slice(1) // drop the greeting seed
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
        <Button
          onClick={() => setOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg"
          title="Ask SAM (⌘I)"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      <aside
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-40 flex h-dvh w-[360px] flex-col border-l bg-background shadow-xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between gap-3 border-b px-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-none">Ask SAM</div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Context-aware
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Context chips */}
        <div className="border-b bg-muted/30 px-4 py-3">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            In context
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <Badge key={c} variant="outline" className="font-mono text-[10px]">
                {c}
              </Badge>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-snug",
                m.who === "sam"
                  ? "bg-muted text-foreground rounded-bl-sm"
                  : "ml-auto bg-primary text-primary-foreground rounded-br-sm"
              )}
            >
              {m.text}
            </div>
          ))}
          {messages.length === 1 && (
            <div className="mt-2 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Suggested
              </div>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full rounded-md border bg-card px-2.5 py-1.5 text-left text-[12.5px] hover:bg-muted/60"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Input */}
        <form
          className="p-3"
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
              className="min-h-9 max-h-[120px] resize-none text-sm"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || sending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
            ⌘I to toggle · Shift+Enter for newline
          </p>
        </form>
      </aside>
    </>
  )
}
