export interface RetryOptions {
  maxAttempts?: number
  initialDelayMs?: number
  maxDelayMs?: number
  /** Status codes that should trigger a retry. Defaults to [429, 500, 502, 503, 504]. */
  retryableStatuses?: number[]
}

const DEFAULT: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 500,
  maxDelayMs: 8000,
  retryableStatuses: [429, 500, 502, 503, 504],
}

function isRetryable(error: unknown, retryableStatuses: number[]): boolean {
  if (error instanceof Error) {
    const match = error.message.match(/error (\d{3})/)
    if (match?.[1]) {
      const status = parseInt(match[1], 10)
      return retryableStatuses.includes(status)
    }
    // Network errors
    if (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT')
    ) {
      return true
    }
  }
  return false
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const options = { ...DEFAULT, ...opts }
  let lastError: unknown

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt === options.maxAttempts || !isRetryable(err, options.retryableStatuses)) {
        throw err
      }
      const backoff = Math.min(
        options.initialDelayMs * Math.pow(2, attempt - 1),
        options.maxDelayMs
      )
      await delay(backoff)
    }
  }

  throw lastError
}
