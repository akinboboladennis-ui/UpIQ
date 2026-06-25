/**
 * Monitoring & analytics integration.
 *
 * This module provides a clean abstraction over Sentry (error tracking) and
 * PostHog (product analytics). Adapters are no-ops until the corresponding
 * env vars are set — no live accounts required to run locally.
 *
 * To enable Sentry:
 *   1. npm install @sentry/nextjs
 *   2. Set NEXT_PUBLIC_SENTRY_DSN in your environment.
 *   3. Uncomment the Sentry import and init below.
 *   4. Create sentry.client.config.ts / sentry.server.config.ts per Sentry docs.
 *
 * To enable PostHog:
 *   1. npm install posthog-js
 *   2. Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST.
 *   3. Uncomment the PostHog import and init below.
 */

// ─── Sentry (Error Tracking) ─────────────────────────────────────────────────

// import * as Sentry from '@sentry/nextjs'

export interface ErrorContext {
  userId?: string
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}

/**
 * Capture an error for Sentry. No-op if Sentry is not configured.
 */
export function captureError(err: unknown, ctx?: ErrorContext): void {
  const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN']

  if (!dsn) {
    // Not configured — log to console in production, silent in dev (logger handles it)
    if (process.env.NODE_ENV === 'production') {
      console.error('[monitoring] Sentry not configured. Error:', err)
    }
    return
  }

  // Sentry integration — uncomment after installing @sentry/nextjs:
  // Sentry.withScope((scope) => {
  //   if (ctx?.userId) scope.setUser({ id: ctx.userId })
  //   if (ctx?.tags) scope.setTags(ctx.tags)
  //   if (ctx?.extra) scope.setExtras(ctx.extra)
  //   Sentry.captureException(err)
  // })
}

/**
 * Set the current user context in Sentry.
 * Call after successful authentication.
 */
export function identifyUser(userId: string, email?: string): void {
  const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN']
  if (!dsn) return

  // Sentry.setUser({ id: userId, email })
  void userId
  void email
}

/**
 * Clear the current user context (e.g., on sign out).
 */
export function clearUser(): void {
  const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN']
  if (!dsn) return

  // Sentry.setUser(null)
}

// ─── PostHog (Product Analytics) ─────────────────────────────────────────────

// import posthog from 'posthog-js'

export type AnalyticsEvent =
  | 'analysis_started'
  | 'analysis_completed'
  | 'analysis_failed'
  | 'report_viewed'
  | 'report_favorited'
  | 'report_deleted'
  | 'recommendation_completed'
  | 'keyword_copied'
  | 'profile_exported'
  | 'signup_completed'
  | 'login_completed'

/**
 * Track a product analytics event. No-op if PostHog is not configured.
 */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  const key = process.env['NEXT_PUBLIC_POSTHOG_KEY']
  if (!key) return

  // posthog.capture(event, properties)
  void event
  void properties
}

/**
 * Track a page view (for SPAs where automatic capture is disabled).
 */
export function trackPage(path: string): void {
  const key = process.env['NEXT_PUBLIC_POSTHOG_KEY']
  if (!key) return

  // posthog.capture('$pageview', { $current_url: path })
  void path
}
