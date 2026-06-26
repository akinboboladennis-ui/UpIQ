import type { ParseInput, ValidationResult, ValidationError } from '../types/index.js'
import { wordCount } from '../utils/index.js'

const MIN_CHARS = 50
const MAX_CHARS = 50_000
const MIN_WORDS = 10

export function validateParseInput(input: ParseInput): ValidationResult {
  const errors: ValidationError[] = []
  const { rawText } = input

  if (!rawText || rawText.trim().length === 0) {
    errors.push({ code: 'EMPTY_INPUT', message: 'Profile text is required' })
    return { valid: false, errors }
  }

  const trimmed = rawText.trim()

  if (trimmed.length < MIN_CHARS) {
    errors.push({
      code: 'TOO_SHORT',
      message: `Profile text must be at least ${MIN_CHARS} characters (received ${trimmed.length})`,
    })
  }

  if (trimmed.length > MAX_CHARS) {
    errors.push({
      code: 'TOO_LONG',
      message: `Profile text must not exceed ${MAX_CHARS} characters (received ${trimmed.length})`,
    })
  }

  if (wordCount(trimmed) < MIN_WORDS) {
    errors.push({
      code: 'NO_RECOGNIZABLE_CONTENT',
      message: `Profile text must contain at least ${MIN_WORDS} words`,
    })
  }

  // Check for recognizable profile content (at least one of these signals)
  const hasContent = /[a-zA-Z]{3,}/.test(trimmed) && !/^[\s\d\W]+$/.test(trimmed)

  if (!hasContent) {
    errors.push({
      code: 'NO_RECOGNIZABLE_CONTENT',
      message: 'Profile text contains no recognizable text content',
    })
  }

  return { valid: errors.length === 0, errors }
}
