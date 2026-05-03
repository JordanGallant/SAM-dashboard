// In-memory sliding-window rate limiter, keyed by arbitrary string (typically
// "<route>:<ip>"). Designed for the SAM single-process PM2 deployment — for a
// distributed/serverless setup we'd swap this for Upstash Redis with the same
// API. Calls outside of Next.js (e.g. unit tests) work too.
//
// Usage:
//   const rl = checkRateLimit(`upload:${ip}`, { limit: 10, windowMs: 60_000 })
//   if (!rl.ok) return 429 with Retry-After: rl.retryAfter
//
// Sliding window: requests in the trailing `windowMs` window count. Each window
// is fresh — once it expires the bucket resets. Good enough for burst / brute
// force protection. (Not a token bucket — that allows steady drip past the
// limit, which we don't want for cost-sensitive endpoints.)

type WindowEntry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, WindowEntry>()

export function checkRateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): { ok: true } | { ok: false; retryAfter: number; limit: number } {
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true }
  }
  if (entry.count >= opts.limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      limit: opts.limit,
    }
  }
  entry.count++
  return { ok: true }
}

// Resolve client IP from common proxy headers. Cloudflare and Vercel set these.
// Falls back to "unknown" (single bucket for unidentifiable callers — slows
// them all down together if upstream proxies aren't trustworthy).
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const real = headers.get("x-real-ip")
  if (real) return real
  const cf = headers.get("cf-connecting-ip")
  if (cf) return cf
  return "unknown"
}

// Periodic cleanup so the Map doesn't leak. Runs once per 5 min in the
// background. Cheap — only iterates expired entries.
if (typeof globalThis !== "undefined" && !(globalThis as { __rateLimitCleanup?: boolean }).__rateLimitCleanup) {
  ;(globalThis as { __rateLimitCleanup?: boolean }).__rateLimitCleanup = true
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k)
    }
  }, 5 * 60 * 1000).unref?.()
}
