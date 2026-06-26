import type { ParsedAvailability } from '../../types/index.js'
import { normalizeWhitespace } from '../../utils/index.js'

const FULL_TIME_PATTERN =
  /\b(full.?time|40\s*(?:\+\s*)?hours?(?:\s*\/\s*week)?|available\s+immediately|immediately\s+available|open\s+to\s+full.?time)\b/i

const PART_TIME_PATTERN =
  /\b(part.?time|(?:\d+)\s*(?:to\s*(?:\d+))?\s*hours?\s*(?:per|\/)\s*week|limited\s+availability|a\s+few\s+hours|some\s+hours)\b/i

const CONTRACT_PATTERN =
  /\b(contract|freelance|project.?based|per\s+project|short.?term|on\s+demand)\b/i

const UNAVAILABLE_PATTERN =
  /\b(not\s+available|unavailable|fully\s+booked|at\s+capacity|no\s+new\s+clients)\b/i

export function extractAvailability(sectionContent: string): ParsedAvailability | null {
  if (!sectionContent.trim()) return null

  const text = normalizeWhitespace(sectionContent)

  let signal: ParsedAvailability['signal']

  if (UNAVAILABLE_PATTERN.test(text)) {
    signal = 'unavailable'
  } else if (FULL_TIME_PATTERN.test(text)) {
    signal = 'full_time'
  } else if (PART_TIME_PATTERN.test(text)) {
    signal = 'part_time'
  } else if (CONTRACT_PATTERN.test(text)) {
    signal = 'contract'
  } else {
    signal = 'unknown'
  }

  return {
    signal,
    sourceText: text.slice(0, 200),
  }
}
