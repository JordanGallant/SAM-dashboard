"use client"

/**
 * Mobile-only bottom sheet combining deal nav + chat.
 * Always-visible bar at the bottom (md:hidden). Tap either pill opens a
 * bottom Sheet with a segmented toggle — users can flip between navigating
 * and asking SAM without dismissing the sheet.
 */

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { List, MessageSquare, Send, Lock } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useDeal } from "@/hooks/use-deal"
import { useTier } from "@/lib/tier-context"
import { cn } from "@/lib/utils"

type Mode = "nav" | "chat"
type Msg = { who: "user" | "sam"; text: string }

const NAV_GROUPS: { label: string; items: { key: string; label: string }[] }[] = [
  { label: "Overview", items: [{ key: "summary", label: "Executive Summary" }] },
  {
    label: "Domains",
    items: [
      { key: "team", label: "Team" },
      { key: "market", label: "Market" },
      { key: "product", label: "Product" },
      { key: "traction", label: "Traction" },
      { key: "finance", label: "Finance" },
      { key: "exit", label: "Exit Potential" },
    ],
  },
  {
    label: "Review",
    items: [
      { key: "fund-fit", label: "Fund Fit" },
      { key: "missing-info", label: "Missing Info" },
    ],
  },
]

export function DealBottomSheet() {
  const params = useParams()
  const pathname = usePathname()
  const dealId = params.dealId as string | undefined
  const { deal } = useDeal(dealId)
  const { config: tierConfig } = useTier()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("nav")

  if (!dealId || !deal?.analysis) return null

  const analysis = deal.analysis
  const tabKeys = new Set(["summary", "team", "market", "product", "traction", "finance", "exit", "fund-fit", "missing-info"])
  const activeTab = pathname.split("/").filter(Boolean).reverse().find((s) => tabKeys.has(s)) || "summary"
  const activeLabel = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.key === activeTab)?.label ?? "Summary"

  function getTabScore(tabKey: string): number | undefined {
    const map: Record<string, number | undefined> = {
      summary: analysis.executiveSummary.overallScore,
      team: analysis.team.score,
      market: analysis.market.score,
      product: analysis.product.score,
      traction: analysis.traction.score,
      finance: analysis.finance.score,
      exit: analysis.exitPotential.score,
      "fund-fit": analysis.fundFit.score,
    }
    return map[tabKey]
  }

  const gatedTabs: Record<string, boolean> = { "fund-fit": !tierConfig.fundFit }

  return (
    <>
      {/* Persistent mobile bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch gap-2 px-3 py-2">
          <button
            onClick={() => {
              setMode("nav")
              setOpen(true)
            }}
            className="flex-1 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-left active:bg-muted/80 transition-colors"
          >
            <List className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground leading-none">
                Current
              </p>
              <p className="text-[12.5px] font-medium truncate mt-0.5 leading-tight">
                {activeLabel}
              </p>
            </div>
          </button>
          <button
            onClick={() => {
              setMode("chat")
              setOpen(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 active:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="text-[12.5px] font-semibold">Ask SAM</span>
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[85dvh] max-h-[85dvh] p-0 flex flex-col"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">
            {mode === "nav" ? "Deal navigation" : "Ask SAM"}
          </SheetTitle>
          {/* Drag handle affordance */}
          <div className="pt-2 pb-0 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Segmented control */}
          <div className="px-4 pt-3 pb-2">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setMode("nav")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md py-2 text-[13px] font-medium transition-colors",
                  mode === "nav"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" />
                Tabs
              </button>
              <button
                onClick={() => setMode("chat")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md py-2 text-[13px] font-medium transition-colors",
                  mode === "chat"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask SAM
              </button>
            </div>
          </div>

          {/* Content switches by mode */}
          {mode === "nav" ? (
            <NavList
              dealId={dealId}
              activeTab={activeTab}
              gatedTabs={gatedTabs}
              getTabScore={getTabScore}
              onPick={() => setOpen(false)}
            />
          ) : (
            <ChatPanel deal={deal} dealId={dealId} />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function NavList({
  dealId,
  activeTab,
  gatedTabs,
  getTabScore,
  onPick,
}: {
  dealId: string
  activeTab: string
  gatedTabs: Record<string, boolean>
  getTabScore: (k: string) => number | undefined
  onPick: () => void
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mt-4 first:mt-2">
          <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/80">
            {group.label}
          </p>
          <ul>
            {group.items.map(({ key, label }) => {
              const score = getTabScore(key)
              const isActive = activeTab === key
              const isGated = gatedTabs[key]
              const dotColor =
                score === undefined
                  ? "bg-muted-foreground/25"
                  : score >= 70
                  ? "bg-emerald-500"
                  : score >= 40
                  ? "bg-primary/100"
                  : "bg-red-500"
              return (
                <li key={key}>
                  <Link
                    href={`/deals/${dealId}/${key}`}
                    onClick={onPick}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2 py-3 text-[14px] transition-colors",
                      isActive
                        ? "bg-muted/70 text-foreground font-medium"
                        : "text-foreground/75 active:bg-muted/40",
                      isGated && "opacity-60"
                    )}
                  >
                    <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
                      {isActive && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-current opacity-30" />
                      )}
                    </span>
                    {isGated && <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />}
                    <span className="truncate">{label}</span>
                    {!isGated && (
                      <span className="ml-auto font-mono text-[12px] tabular-nums text-muted-foreground">
                        {score ?? "—"}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ChatPanel({
  deal,
  dealId,
}: {
  deal: ReturnType<typeof useDeal>["deal"]
  dealId: string
}) {
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { who: "sam", text: "Hi — I have context on this deal. Ask me anything." },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    const next: Msg[] = [...messages, { who: "user", text: trimmed }]
    setMessages(next)
    setInput("")
    setSending(true)
    try {
      const apiMessages = next.slice(1).map((m) => ({
        role: m.who === "user" ? "user" : "assistant",
        content: m.text,
      }))
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
    const es = deal.analysis?.executiveSummary
    if (es?.overallScore !== undefined) chips.push(`Score ${es.overallScore}`)
    if (es?.verdict) chips.push(es.verdict)
  }

  const suggestions = deal
    ? [
        `Biggest risks for ${deal.companyName}?`,
        `Why this score?`,
        `Draft a founder email`,
      ]
    : []

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {chips.length > 0 && (
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <Badge key={c} variant="outline" className="font-mono text-[10px]">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-[13.5px] leading-snug",
              m.who === "sam"
                ? "bg-muted text-foreground rounded-bl-sm"
                : "ml-auto bg-primary text-primary-foreground rounded-br-sm"
            )}
          >
            {m.text}
          </div>
        ))}
        {messages.length === 1 && suggestions.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Suggested
            </div>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full rounded-md border bg-card px-2.5 py-2 text-left text-[13px] active:bg-muted/60"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="border-t p-3"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
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
            placeholder={deal ? `Ask about ${deal.companyName}…` : "Ask about your deal…"}
            className="min-h-9 max-h-[120px] resize-none text-[14px]"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!input.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
