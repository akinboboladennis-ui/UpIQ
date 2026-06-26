import type { ParsedReview, ReviewSentiment } from '../../types/index.js'
import { toLines, stripBullet, normalizeWhitespace } from '../../utils/index.js'

const POSITIVE_WORDS =
  /\b(excellent|outstanding|amazing|great|fantastic|wonderful|superb|perfect|professional|highly\s+recommend|recommend|expert|skilled|talented|knowledgeable|efficient|reliable|responsive|communicat|deliver|quality|impressed|satisfy|pleased|exceptional|top\s+notch|above\s+and\s+beyond)\b/gi

const NEGATIVE_WORDS =
  /\b(disappoint|frustrat|poor|bad|slow|miss(?:ed)?\s+deadline|late|unresponsive|unprofessional|refund|issue|problem|difficult|lack(?:ed)?|fail(?:ed)?|wrong|incorrect|mistake)\b/gi

const TRUST_INDICATORS =
  /\b(hired\s+again|long.term|return(?:ing)?\s+client|multiple\s+projects?|ongoing|work\s+together\s+again|highly\s+recommend|will\s+(?:definitely\s+)?(?:hire|use)\s+again)\b/gi

const STAR_PATTERN = /(\d(?:\.\d+)?)\s*(?:\/\s*5|stars?|out\s+of\s+5)/i
const RATING_WORDS: Record<string, number> = {
  five: 5,
  'five-star': 5,
  '5-star': 5,
  four: 4,
  'four-star': 4,
  '4-star': 4,
  three: 3,
  two: 2,
  one: 1,
}

export function extractReviews(sectionContent: string): ParsedReview[] {
  const blocks = sectionContent
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 20)
  return blocks.map(parseReviewBlock).filter((r) => r.text !== null)
}

function parseReviewBlock(block: string): ParsedReview {
  const lines = toLines(block)
  let reviewer: string | null = null
  let rating: number | null = null
  const textLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const stripped = stripBullet(line)

    // Try to extract rating from any line
    if (rating === null) {
      const starMatch = stripped.match(STAR_PATTERN)
      if (starMatch?.[1]) {
        const parsed = parseFloat(starMatch[1])
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
          rating = parsed
          const rest = stripped.replace(STAR_PATTERN, '').trim()
          if (rest.length > 5) textLines.push(rest)
          continue
        }
      }
      // Check for word-based rating
      const lowerLine = stripped.toLowerCase()
      for (const [word, val] of Object.entries(RATING_WORDS)) {
        if (lowerLine.includes(word)) {
          rating = val
          break
        }
      }
    }

    // First short line that looks like a name (no punctuation, 2-4 words)
    if (
      i === 0 &&
      !reviewer &&
      /^[A-Z][a-zA-Z\s.'-]{2,40}$/.test(stripped) &&
      stripped.split(/\s+/).length <= 4
    ) {
      reviewer = normalizeWhitespace(stripped)
      continue
    }

    // Lines starting with "—" or "-" followed by a name at end = reviewer attribution
    const attributionMatch = stripped.match(/^[—–-]\s*(.+)$/)
    if (attributionMatch?.[1] && !reviewer) {
      const candidate = attributionMatch[1].trim()
      if (candidate.length < 60 && candidate.split(/\s+/).length <= 5) {
        reviewer = candidate
        continue
      }
    }

    if (stripped.length > 0) textLines.push(stripped)
  }

  const text = textLines.join(' ').trim() || null
  const sentiment = classifySentiment(text ?? '')
  const themes = extractThemes(text ?? '')
  const trustIndicators = extractTrustIndicators(text ?? '')
  const positiveStatements = extractMatchingPhrases(text ?? '', POSITIVE_WORDS)
  const negativeStatements = extractMatchingPhrases(text ?? '', NEGATIVE_WORDS)

  return {
    reviewer,
    rating,
    text,
    sentiment,
    themes,
    trustIndicators,
    positiveStatements,
    negativeStatements,
  }
}

function classifySentiment(text: string): ReviewSentiment {
  if (!text) return 'neutral'
  const posMatches = (text.match(POSITIVE_WORDS) ?? []).length
  const negMatches = (text.match(NEGATIVE_WORDS) ?? []).length
  if (negMatches > posMatches) return 'negative'
  if (posMatches >= 2 && negMatches === 0) return 'positive'
  if (posMatches > 0 && negMatches === 0) return 'positive'
  if (negMatches > 0 && posMatches === 0) return 'negative'
  return 'mixed'
}

function extractThemes(text: string): string[] {
  const themes: string[] = []
  const lower = text.toLowerCase()
  if (/communicat/.test(lower)) themes.push('communication')
  if (/deliver|on.time|deadline/.test(lower)) themes.push('delivery')
  if (/quality|excellent\s+work/.test(lower)) themes.push('quality')
  if (/technical|expert|skill|knowledg/.test(lower)) themes.push('technical expertise')
  if (/responsive|quick|fast|prompt/.test(lower)) themes.push('responsiveness')
  if (/professional/.test(lower)) themes.push('professionalism')
  if (/creative|innovat|solution/.test(lower)) themes.push('creativity')
  if (/budget|price|value|afford/.test(lower)) themes.push('value for money')
  return themes
}

function extractTrustIndicators(text: string): string[] {
  const matches = text.match(TRUST_INDICATORS) ?? []
  return [...new Set(matches.map((m) => normalizeWhitespace(m)))]
}

function extractMatchingPhrases(text: string, pattern: RegExp): string[] {
  // Extract sentence fragments containing the matched word
  const sentences = text.match(/[^.!?]+[.!?]?/g) ?? []
  const matched: string[] = []
  const resetPattern = new RegExp(pattern.source, 'gi')
  for (const sentence of sentences) {
    resetPattern.lastIndex = 0
    if (resetPattern.test(sentence)) {
      const trimmed = sentence.trim()
      if (trimmed.length > 5) matched.push(trimmed)
    }
  }
  return matched
}
