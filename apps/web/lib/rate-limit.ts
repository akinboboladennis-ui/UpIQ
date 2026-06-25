/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding window algorithm backed by a Map. Suitable for single-instance
 * deployments (e.g., Vercel serverless — note: each function invocation gets a
 * fresh Map, so limits only apply within the same function instance).
 *
 * For multi-instance or cross-request rate limiting, replace the Map with a
 * Redis-backed implementation (e.g., @upstash/ratelimit).
 */

interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window. */
  limit: number
  /** Window duration in milliseconds. */
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  /** Remaining requests in this window. */
  remaining: number
  /** Timestamp (ms) when the window resets. */
  resetAt: number
  /** Suggested Retry-After value in seconds. */
  retryAfterSeconds: number
}

/**
 * Check and increment the rate limit counter for a given key.
 *
 * @param key      Unique identifier (e.g., userId or IP address).
 * @param config   Limit configuration.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()

  let window = store.get(key)

  if (!window || window.resetAt <= now) {
    window = { count: 0, resetAt: now + config.windowMs }
    store.set(key, window)
  }

  window.count++
  const remaining = Math.max(0, config.limit - window.count)
  const retryAfterSeconds = Math.ceil((window.resetAt - now) / 1000)

  return {
    success: window.count <= config.limit,
    remaining,
    resetAt: window.resetAt,
    retryAfterSeconds,
  }
}

/** Clean up expired windows to prevent memory leaks in long-lived processes. */
export function pruneExpiredWindows(): void {
  const now = Date.now()
  for (const [key, window] of store.entries()) {
    if (window.resetAt <= now) {
      store.delete(key)
    }
  }
}

// Prune every 10 minutes (only matters in long-lived Node.js processes)
if (typeof setInterval !== 'undefined') {
  setInterval(pruneExpiredWindows, 10 * 60 * 1000)
}
