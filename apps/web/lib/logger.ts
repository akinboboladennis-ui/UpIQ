/**
 * Centralized structured logger.
 *
 * In development: human-readable console output.
 * In production: JSON lines (compatible with Vercel/Datadog/Logtail ingestion).
 *
 * Sentry integration: set NEXT_PUBLIC_SENTRY_DSN and call initSentry() once
 * at startup (see lib/monitoring.ts). The logger will forward errors there.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

const IS_PROD = process.env.NODE_ENV === 'production'
const IS_SERVER = typeof window === 'undefined'

function timestamp(): string {
  return new Date().toISOString()
}

function serialize(level: LogLevel, message: string, ctx?: LogContext): string {
  return JSON.stringify({
    ts: timestamp(),
    level,
    msg: message,
    ...ctx,
  })
}

function write(level: LogLevel, message: string, ctx?: LogContext): void {
  if (IS_PROD) {
    const line = serialize(level, message, ctx)
    if (level === 'error' || level === 'warn') {
      console.error(line)
    } else {
      console.log(line)
    }
    return
  }

  // Development: colour-coded, human-readable
  const prefix = IS_SERVER ? '[server]' : '[client]'
  const tag = `[${level.toUpperCase()}]`
  const contextStr = ctx && Object.keys(ctx).length > 0 ? JSON.stringify(ctx, null, 2) : ''
  if (level === 'error') {
    console.error(`${timestamp()} ${prefix} ${tag} ${message}`, contextStr)
  } else if (level === 'warn') {
    console.warn(`${timestamp()} ${prefix} ${tag} ${message}`, contextStr)
  } else {
    console.log(`${timestamp()} ${prefix} ${tag} ${message}`, contextStr)
  }
}

export const logger = {
  debug(message: string, ctx?: LogContext) {
    if (!IS_PROD) write('debug', message, ctx)
  },
  info(message: string, ctx?: LogContext) {
    write('info', message, ctx)
  },
  warn(message: string, ctx?: LogContext) {
    write('warn', message, ctx)
  },
  error(message: string, ctx?: LogContext) {
    write('error', message, ctx)
  },

  /** Log an AI request/response cycle with structured fields. */
  ai(
    event: 'request' | 'response' | 'error',
    ctx: {
      provider?: string
      model?: string
      latencyMs?: number
      inputTokens?: number
      outputTokens?: number
      error?: string
      userId?: string
    }
  ) {
    write(event === 'error' ? 'error' : 'info', `ai.${event}`, { scope: 'ai', ...ctx })
  },

  /** Log an API request with method, path, status, duration. */
  api(ctx: {
    method: string
    path: string
    status: number
    durationMs: number
    userId?: string
    error?: string
  }) {
    const level: LogLevel = ctx.status >= 500 ? 'error' : ctx.status >= 400 ? 'warn' : 'info'
    write(level, `api.${ctx.method} ${ctx.path} → ${ctx.status}`, { scope: 'api', ...ctx })
  },
}
