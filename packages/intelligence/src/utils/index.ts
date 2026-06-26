/** Collapse runs of whitespace to a single space and trim. */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/** Strip leading bullet/list characters from a line. */
export function stripBullet(line: string): string {
  return line.replace(/^[\s•–—\-\*\•›▸▶→]+/, '').trim()
}

/** Split text into non-empty, trimmed lines. */
export function toLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
}

/** Count words in a string. */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Capitalize the first letter of each word. */
export function titleCase(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Convert to sentence case (first letter capitalized, rest lower). */
export function sentenceCase(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Return true if a string is a plausible URL. */
export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** Deduplicate an array of strings (case-insensitive). */
export function deduplicateStrings(arr: string[]): string[] {
  const seen = new Set<string>()
  return arr.filter((s) => {
    const key = s.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Extract all URLs from a block of text. */
export function extractUrls(text: string): string[] {
  const pattern = /https?:\/\/[^\s<>"')\]]+/g
  return (text.match(pattern) ?? []).filter(isValidUrl)
}

/** Parse a number from a string that may contain currency symbols/commas. */
export function parseNumeric(str: string): number | null {
  const cleaned = str.replace(/[$£€,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

/**
 * Fuzzy-match a string against a set of candidates.
 * Returns the best match if similarity exceeds threshold.
 */
export function fuzzyMatch(input: string, candidates: string[], threshold = 0.75): string | null {
  const lower = input.toLowerCase()
  let best: string | null = null
  let bestScore = 0

  for (const candidate of candidates) {
    const score = jaccardSimilarity(lower, candidate.toLowerCase())
    if (score > bestScore && score >= threshold) {
      bestScore = score
      best = candidate
    }
  }
  return best
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(bigrams(a))
  const setB = new Set(bigrams(b))
  if (setA.size === 0 && setB.size === 0) return 1
  let intersection = 0
  for (const bi of setA) {
    if (setB.has(bi)) intersection++
  }
  return intersection / (setA.size + setB.size - intersection)
}

function bigrams(s: string): string[] {
  const result: string[] = []
  for (let i = 0; i < s.length - 1; i++) {
    result.push(s.slice(i, i + 2))
  }
  return result
}

/** Truncate a string to maxLength, appending ellipsis if truncated. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1).trimEnd() + '…'
}
