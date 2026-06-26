import { normalizeHourlyRate } from '../../normalizer/index.js'
import { toLines } from '../../utils/index.js'

/**
 * Extract hourly rate in USD cents from rate section content.
 * Returns null if no valid rate is found.
 */
export function extractHourlyRate(sectionContent: string): number | null {
  const lines = toLines(sectionContent)

  for (const line of lines) {
    const rate = normalizeHourlyRate(line)
    if (rate !== null) return rate
  }

  // Try the full content as a fallback (rate might be inline with text)
  return normalizeHourlyRate(sectionContent)
}
