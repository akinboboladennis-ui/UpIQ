import { JSONValidationError } from './JSONValidator'

export interface UserFacingError {
  message: string
  code: string
  retryable: boolean
}

export function toUserFacingError(err: unknown): UserFacingError {
  if (err instanceof JSONValidationError) {
    return {
      message: 'The AI returned an unexpected response. Please try again.',
      code: 'AI_PARSE_ERROR',
      retryable: true,
    }
  }

  if (err instanceof Error) {
    const statusMatch = err.message.match(/error (\d{3})/)
    if (statusMatch?.[1]) {
      const status = parseInt(statusMatch[1], 10)
      if (status === 429) {
        return {
          message: 'AI service is busy right now. Please try again in a moment.',
          code: 'RATE_LIMITED',
          retryable: true,
        }
      }
      if (status === 401 || status === 403) {
        return {
          message: 'AI service authentication failed. Please contact support.',
          code: 'AUTH_ERROR',
          retryable: false,
        }
      }
      if (status >= 500) {
        return {
          message: 'AI service is temporarily unavailable. Please try again shortly.',
          code: 'AI_SERVER_ERROR',
          retryable: true,
        }
      }
    }

    if (err.message.includes('ANTHROPIC_API_KEY')) {
      return {
        message: 'AI service is not configured. Please contact support.',
        code: 'CONFIG_ERROR',
        retryable: false,
      }
    }
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    retryable: true,
  }
}

export function logAIError(context: string, err: unknown): void {
  // In production, route this to Sentry or your logging provider.
  console.error(`[AI Error] ${context}:`, err instanceof Error ? err.message : err)
}
