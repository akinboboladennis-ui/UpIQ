import { normalizeWhitespace } from '../../utils/index.js'

/**
 * Extract title from section content or infer from the first line of an
 * unstructured profile (common pattern: first line is the headline).
 */
export function extractTitle(titleSection: string | undefined, rawText: string): string | null {
  if (titleSection?.trim()) {
    const firstLine = titleSection.split('\n').find((l) => l.trim().length > 0)
    if (firstLine) return normalizeWhitespace(firstLine)
  }

  // Fallback: grab the first short line from the raw text (likely a headline)
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const first = lines[0]
  if (first && first.length < 120 && !/^(overview|skills?|about|work|employment)/i.test(first)) {
    return first
  }

  return null
}
