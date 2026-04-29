// Maps raw error messages (from n8n, Supabase, our own routes, network failures)
// to short, human-friendly text the user can act on.
//
// Returns { title, hint } so the UI can render a strong line + an optional sub-hint
// without leaking stack traces or implementation names.

export type FriendlyError = {
  title: string
  hint?: string
}

export type ErrorContext = "analysis" | "upload" | "trigger" | "generic"

const PATTERNS: Array<{
  test: RegExp
  contexts?: ErrorContext[]
  build: (raw: string) => FriendlyError
}> = [
  // --- Pipeline / n8n -------------------------------------------------------
  {
    test: /n8n not configured|callback not configured/i,
    build: () => ({
      title: "Analysis engine isn't set up",
      hint: "Please contact support — environment variables are missing.",
    }),
  },
  {
    test: /n8n.*(returned|webhook).*(\d{3})|webhook failed|bad gateway|502|503|504/i,
    build: () => ({
      title: "We couldn't reach the analysis engine",
      hint: "It may be restarting. Wait a minute and click Retry.",
    }),
  },
  {
    test: /timeout|timed out|deadline exceeded/i,
    build: () => ({
      title: "The analysis took too long and was cancelled",
      hint: "This sometimes happens with very large decks. Try splitting the deck or retry.",
    }),
  },
  {
    test: /rate.?limit|too many requests|429/i,
    build: () => ({
      title: "Hit a rate limit on the analysis engine",
      hint: "Wait a minute and click Retry.",
    }),
  },
  {
    test: /anthropic|openai|claude|gpt-|llm/i,
    contexts: ["analysis"],
    build: () => ({
      title: "An AI step in the pipeline failed",
      hint: "The model may be temporarily unavailable. Click Retry.",
    }),
  },

  // --- Document / PDF -------------------------------------------------------
  {
    test: /pdf|parse|extract|could not (read|open|process)/i,
    contexts: ["analysis"],
    build: () => ({
      title: "We couldn't read your pitch deck",
      hint: "Try re-exporting it as a standard PDF (no password, no scanned-only pages).",
    }),
  },
  {
    test: /failed to sign url/i,
    build: () => ({
      title: "We couldn't access the uploaded file",
      hint: "Try removing and re-uploading the deck.",
    }),
  },
  {
    test: /no documents to analyze/i,
    build: () => ({
      title: "No pitch deck uploaded yet",
      hint: "Upload a deck below before running analysis.",
    }),
  },
  {
    test: /file too large/i,
    build: (raw) => ({
      title: raw.replace(/\.$/, ""),
      hint: "Compress the PDF or remove embedded videos and try again.",
    }),
  },

  // --- Auth / permissions ---------------------------------------------------
  {
    test: /unauthori[sz]ed|not authenticated|jwt|auth.*expired|session.*expired/i,
    build: () => ({
      title: "Your session has expired",
      hint: "Log out and log back in to continue.",
    }),
  },
  {
    test: /permission denied|rls|row.level security|forbidden|403/i,
    build: () => ({
      title: "You don't have permission to do this",
      hint: "If you think this is wrong, contact support.",
    }),
  },

  // --- Storage --------------------------------------------------------------
  {
    test: /duplicate|already exists|conflict|409/i,
    contexts: ["upload"],
    build: () => ({
      title: "A file with that name already exists",
      hint: "Rename the file and try again.",
    }),
  },
  {
    test: /payload too large|413|exceeded.*size/i,
    contexts: ["upload"],
    build: () => ({
      title: "File is too large to upload",
      hint: "Max 50 MB. Compress the PDF and retry.",
    }),
  },

  // --- Domain ---------------------------------------------------------------
  {
    test: /deal not found/i,
    build: () => ({
      title: "We couldn't find this deal",
      hint: "It may have been deleted. Go back to the dealroom.",
    }),
  },
  {
    test: /already (pending|processing|in progress|running)/i,
    build: () => ({
      title: "An analysis is already running for this deal",
      hint: "Wait for it to finish — this page will update automatically.",
    }),
  },
  {
    test: /failed to create analysis record/i,
    build: () => ({
      title: "Couldn't start the analysis",
      hint: "Please try again. If it keeps failing, contact support.",
    }),
  },

  // --- Network --------------------------------------------------------------
  {
    test: /failed to fetch|network ?error|networkerror|err_internet_disconnected|err_connection/i,
    build: () => ({
      title: "Couldn't connect to the server",
      hint: "Check your internet connection and try again.",
    }),
  },
]

export function friendlyError(raw: unknown, context: ErrorContext = "generic"): FriendlyError {
  const msg = typeof raw === "string" ? raw : raw instanceof Error ? raw.message : String(raw ?? "")
  if (!msg.trim()) {
    return { title: "Something went wrong" }
  }

  for (const p of PATTERNS) {
    if (p.contexts && !p.contexts.includes(context)) continue
    if (p.test.test(msg)) return p.build(msg)
  }

  // Fallback — keep the raw message but soften the framing.
  // Strip trailing technical noise (HTML, JSON-ish blobs).
  const trimmed = msg
    .replace(/<[^>]+>/g, " ") // strip HTML tags from gateway pages
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240)

  return {
    title: "Something went wrong",
    hint: trimmed || undefined,
  }
}
