/**
 * Environment variable validation.
 *
 * Call validateEnv() once at server startup (e.g., in next.config.ts or a
 * server-only module). Throws with a clear message on missing/invalid vars
 * rather than silently misbehaving at runtime.
 *
 * Client-safe vars (NEXT_PUBLIC_*) are validated separately because they are
 * inlined at build time — missing ones become the string "undefined".
 */

interface EnvVar {
  key: string
  description: string
  required: boolean
  serverOnly?: boolean
}

const ENV_VARS: EnvVar[] = [
  // Supabase (public — safe to expose to browser)
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    required: true,
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous (public) API key',
    required: true,
  },
  // Site
  {
    key: 'NEXT_PUBLIC_SITE_URL',
    description: 'Public site URL used for auth redirects (no trailing slash)',
    required: false,
  },
  // AI — server-only (never exposed to browser)
  {
    key: 'ANTHROPIC_API_KEY',
    description: 'Anthropic API key for Claude AI',
    required: true,
    serverOnly: true,
  },
  // Monitoring — optional but logged as warnings
  {
    key: 'NEXT_PUBLIC_SENTRY_DSN',
    description: 'Sentry DSN for error tracking',
    required: false,
  },
  {
    key: 'NEXT_PUBLIC_POSTHOG_KEY',
    description: 'PostHog project API key for analytics',
    required: false,
  },
  {
    key: 'NEXT_PUBLIC_POSTHOG_HOST',
    description: 'PostHog instance URL (defaults to https://app.posthog.com)',
    required: false,
  },
]

export interface EnvValidationResult {
  valid: boolean
  missing: string[]
  warnings: string[]
}

export function validateEnv(): EnvValidationResult {
  const isServer = typeof window === 'undefined'
  const missing: string[] = []
  const warnings: string[] = []

  for (const envVar of ENV_VARS) {
    if (envVar.serverOnly && !isServer) continue

    const value = process.env[envVar.key]
    const isEmpty = !value || value === 'undefined' || value.trim() === ''

    if (isEmpty) {
      if (envVar.required) {
        missing.push(`${envVar.key} — ${envVar.description}`)
      } else {
        warnings.push(`${envVar.key} not set — ${envVar.description}`)
      }
    }
  }

  return { valid: missing.length === 0, missing, warnings }
}

/**
 * Assert that all required environment variables are present.
 * Throws in development. Logs and continues in production (to avoid
 * crashing the entire app for one missing optional var).
 */
export function assertEnv(): void {
  const { valid, missing, warnings } = validateEnv()

  if (warnings.length > 0) {
    for (const w of warnings) {
      console.warn(`[env] Optional env var missing: ${w}`)
    }
  }

  if (!valid) {
    const message = [
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║            MISSING REQUIRED ENVIRONMENT VARIABLES            ║',
      '╠══════════════════════════════════════════════════════════════╣',
      ...missing.map((v) => `║  ✗ ${v.padEnd(60)}║`),
      '╠══════════════════════════════════════════════════════════════╣',
      '║  Copy .env.example → .env.local and fill in the values.     ║',
      '╚══════════════════════════════════════════════════════════════╝',
      '',
    ].join('\n')

    if (process.env.NODE_ENV === 'production') {
      console.error(message)
    } else {
      throw new Error(message)
    }
  }
}
