"use client"

/**
 * Persistent right-rail copilot panel for deal-detail pages.
 * Auto-binds `scope` to the current route segment (summary/team/market/...).
 * On mobile: collapses to a floating button that opens a bottom sheet.
 *
 * Threads persist in Supabase keyed by (user_id, deal_id, scope). The header
 * shows the current thread title with a dropdown switcher; "+" starts a new
 * chat. New mounts default to a fresh chat — users click into history if
 * they want to resume an old conversation.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Send, Sparkles, MessageSquare, Plus, X, ChevronDown, Trash2 } from "lucide-react"
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
type ThreadMeta = { id: string; title: string; updatedAt: string }

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

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return ""
  const diff = Date.now() - t
  const s = Math.round(diff / 1000)
  if (s < 60) return "just now"
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.round(d / 7)
  if (w < 5) return `${w}w ago`
  const mo = Math.round(d / 30)
  return `${mo}mo ago`
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
  input,
  setInput,
  sending,
  send,
  onClose,
  threadId,
  threads,
  threadsLoading,
  loadingThread,
  switcherOpen,
  setSwitcherOpen,
  onSelectThread,
  onNewChat,
  onDeleteThread,
}: {
  dealId: string
  company: string
  scope: Scope
  messages: Msg[]
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  sending: boolean
  send: (text: string) => Promise<void>
  onClose?: () => void
  threadId: string | null
  threads: ThreadMeta[]
  threadsLoading: boolean
  loadingThread: boolean
  switcherOpen: boolean
  setSwitcherOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSelectThread: (id: string) => void
  onNewChat: () => void
  onDeleteThread: (id: string) => void
}) {
  const threadEndRef = useRef<HTMLDivElement>(null)
  const switcherRef = useRef<HTMLDivElement>(null)
  const suggestions = useMemo(() => suggestionsFor(scope, company), [scope, company])
  const scopeLabel = SCOPE_LABEL[scope]
  const currentTitle = threadId ? threads.find((t) => t.id === threadId)?.title ?? "Chat" : "New chat"

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, sending])

  // Click-outside on the switcher dropdown.
  useEffect(() => {
    if (!switcherOpen) return
    function onDoc(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [switcherOpen, setSwitcherOpen])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header — top row + thread switcher */}
      <div className="border-b border-foreground/10">
        <div className="flex items-center gap-2.5 px-4 pt-3 pb-1">
          <span className="grid place-items-center h-8 w-8 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] ring-1 ring-[#B5D33C]/20 shrink-0">
            <MessageSquare className="h-4 w-4 text-[#B5D33C]" />
          </span>
          <p className="text-[9px] font-mono uppercase tracking-widest text-primary leading-none flex-1 truncate">
            Ask Sam · {scopeLabel}
          </p>
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

        {/* Thread switcher trigger — title + caret. Disabled when there are no
            other threads to choose from AND we're already in a fresh chat. */}
        <div ref={switcherRef} className="relative">
          <button
            type="button"
            onClick={() => setSwitcherOpen((o) => !o)}
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-muted/40 transition-colors"
            title={threads.length ? "Switch chat" : "No previous chats yet"}
          >
            <span className="text-[12.5px] font-heading font-semibold leading-tight truncate flex-1 text-left">
              {currentTitle}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0",
                switcherOpen && "rotate-180",
              )}
            />
          </button>

          {switcherOpen && (
            <div className="absolute left-0 right-0 top-full z-20 max-h-[320px] overflow-y-auto border-b border-foreground/10 bg-background shadow-lg">
              <button
                type="button"
                onClick={() => {
                  onNewChat()
                  setSwitcherOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-medium hover:bg-muted/50 transition-colors border-b border-foreground/5"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New chat
              </button>
              {threadsLoading ? (
                <p className="px-4 py-3 text-[11.5px] text-muted-foreground">Loading…</p>
              ) : threads.length === 0 ? (
                <p className="px-4 py-3 text-[11.5px] text-muted-foreground">No previous chats yet.</p>
              ) : (
                threads.map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      "group flex items-stretch hover:bg-muted/50 transition-colors",
                      t.id === threadId && "bg-[#FAFAF7]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectThread(t.id)}
                      className="flex-1 min-w-0 px-4 py-2.5 text-left"
                    >
                      <p className="text-[12.5px] leading-tight truncate">{t.title}</p>
                      <p className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {relativeTime(t.updatedAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteThread(t.id)
                      }}
                      title="Delete chat"
                      className="px-3 grid place-items-center text-muted-foreground/50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="h-3 w-3 text-primary shrink-0" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/55 truncate">
            In context · {company}
          </span>
        </div>

        {loadingThread ? (
          <p className="text-[12px] text-muted-foreground">Loading chat…</p>
        ) : messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-[11.5px] text-muted-foreground mb-1">Try a starter:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={sending || !dealId}
                className="block w-full rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-left text-[12.5px] leading-snug hover:border-primary/30 hover:bg-[#FAFAF7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                    ? "self-start bg-[#FAFAF7] text-[#0F3D2E] ring-1 ring-[#0F3D2E]/5"
                    : "self-end bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-white shadow-sm shadow-primary/20"
                )}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="self-start max-w-[80%] rounded-2xl bg-[#FAFAF7] ring-1 ring-[#0F3D2E]/5 px-3.5 py-2">
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] text-[#B5D33C] shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          Powered by GPT-4o · EU-hosted
        </p>
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

  const [threadId, setThreadId] = useState<string | null>(null)
  const [threads, setThreads] = useState<ThreadMeta[]>([])
  const [threadsLoading, setThreadsLoading] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)

  // Reset to a fresh chat whenever (deal, scope) changes — different scope is
  // its own thread space. Threads list is re-fetched below.
  const scopeKey = `${dealId}:${scope}`
  const prevScopeKey = useRef(scopeKey)
  useEffect(() => {
    if (prevScopeKey.current !== scopeKey) {
      setMessages([])
      setThreadId(null)
      setSwitcherOpen(false)
      prevScopeKey.current = scopeKey
    }
  }, [scopeKey])

  // Fetch the threads list for the switcher whenever (deal, scope) changes.
  useEffect(() => {
    let cancelled = false
    setThreadsLoading(true)
    fetch(`/api/chat/threads?dealId=${encodeURIComponent(dealId)}&scope=${encodeURIComponent(scope)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setThreads(Array.isArray(data?.threads) ? data.threads : [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setThreadsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [dealId, scope])

  const company = deal?.companyName ?? "this deal"

  async function loadThread(id: string) {
    if (loadingThread) return
    setSwitcherOpen(false)
    setLoadingThread(true)
    try {
      const res = await fetch(`/api/chat/threads/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Could not load chat")
      const msgs: Msg[] = (Array.isArray(data.messages) ? data.messages : [])
        .map((m: { role: string; content: string }) => ({
          who: m.role === "user" ? ("user" as const) : ("sam" as const),
          text: m.content,
        }))
      setThreadId(id)
      setMessages(msgs)
    } catch (err) {
      console.error("Load chat failed:", err)
    } finally {
      setLoadingThread(false)
    }
  }

  function newChat() {
    setThreadId(null)
    setMessages([])
    setSwitcherOpen(false)
  }

  async function deleteThread(id: string) {
    try {
      const res = await fetch(`/api/chat/threads/${id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Delete failed")
      }
      setThreads((t) => t.filter((x) => x.id !== id))
      if (id === threadId) {
        setThreadId(null)
        setMessages([])
      }
    } catch (err) {
      console.error("Delete chat failed:", err)
    }
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
        body: JSON.stringify({ messages: apiMessages, dealId, scope, threadId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setMessages((m) => [...m, { who: "sam", text: data.reply || "(empty response)" }])

      const newThreadId: string | undefined = data.threadId
      const newTitle: string | undefined = data.title
      if (newThreadId && !threadId) {
        // Server created a new thread — capture it and prepend to the list.
        setThreadId(newThreadId)
        setThreads((t) => [
          { id: newThreadId, title: newTitle || "New chat", updatedAt: new Date().toISOString() },
          ...t,
        ])
      } else if (threadId) {
        // Existing thread — bump it to the top of the list.
        setThreads((t) => {
          const idx = t.findIndex((x) => x.id === threadId)
          if (idx < 0) return t
          const updated = { ...t[idx], updatedAt: new Date().toISOString() }
          return [updated, ...t.slice(0, idx), ...t.slice(idx + 1)]
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setMessages((m) => [...m, { who: "sam", text: `Error: ${msg}` }])
    } finally {
      setSending(false)
    }
  }

  // Don't render the copilot until analysis exists — same gate as the previous /ask page.
  if (!deal?.analysis) return null

  const bodyProps = {
    dealId,
    company,
    scope,
    messages,
    input,
    setInput,
    sending,
    send,
    threadId,
    threads,
    threadsLoading,
    loadingThread,
    switcherOpen,
    setSwitcherOpen,
    onSelectThread: loadThread,
    onNewChat: newChat,
    onDeleteThread: deleteThread,
  } as const

  return (
    <>
      {/* Desktop: persistent sticky right-rail panel.
        Height accounts for: topbar (3.5rem) + main p-6 (1.5rem) + deal header + gap above the rail
        so the composer stays visible at scroll-top. */}
      <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 sticky top-4 self-start h-[calc(100dvh-15rem)] flex-col rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden shadow-sm">
        <CopilotPanelBody {...bodyProps} />
      </aside>

      {/* Mobile / tablet: floating launcher + bottom sheet */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed right-4 bottom-20 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#00A86B] px-4 py-2.5 text-[#B5D33C] shadow-lg shadow-primary/30 ring-1 ring-[#B5D33C]/20 active:opacity-90 transition-opacity"
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
          <CopilotPanelBody {...bodyProps} onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
