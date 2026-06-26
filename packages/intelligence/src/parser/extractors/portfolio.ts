import type { ParsedPortfolioItem } from '../../types/index.js'
import { normalizeUrl, normalizeText } from '../../normalizer/index.js'
import { toLines, stripBullet, extractUrls } from '../../utils/index.js'
import { SKILL_DICTIONARY } from '../../normalizer/skill-dictionary.js'

const ALL_TECH_TERMS = SKILL_DICTIONARY.flatMap((e) => [e.normalized, ...e.aliases])
const TECH_PATTERN = new RegExp(
  `\\b(${ALL_TECH_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
)

/** Patterns that indicate quantified business outcomes. */
const METRIC_PATTERN =
  /(?:\d+(?:\.\d+)?%|\d+x|\d+\s*(?:times?|%|users?|clients?|customers?|k|million|billion|hours?|days?|weeks?|months?))/gi

/**
 * Extract portfolio items from the portfolio section.
 * Items are separated by blank lines; each has a title, description, tech, and optional URL.
 */
export function extractPortfolio(sectionContent: string): ParsedPortfolioItem[] {
  const blocks = sectionContent
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 10)
  return blocks.map(parsePortfolioBlock)
}

function parsePortfolioBlock(block: string): ParsedPortfolioItem {
  const lines = toLines(block)
  let title: string | null = null
  let url: string | null = null
  const descriptionLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const stripped = stripBullet(line)

    // First non-empty line → title
    if (i === 0) {
      // Extract URL from title line if present
      const urls = extractUrls(stripped)
      if (urls[0]) {
        url = normalizeUrl(urls[0])
        title = stripped.replace(urls[0], '').trim() || null
      } else {
        title = stripped
      }
      continue
    }

    // Subsequent lines → check for URLs
    const urls = extractUrls(stripped)
    if (urls[0] && !url) {
      url = normalizeUrl(urls[0])
      const rest = stripped.replace(urls[0], '').trim()
      if (rest) descriptionLines.push(rest)
    } else {
      descriptionLines.push(stripped)
    }
  }

  const description = descriptionLines.join(' ').trim() || null
  const fullText = [title ?? '', description ?? ''].join(' ')

  const technologies = extractTechMentions(fullText)
  const metrics = extractMetrics(fullText)
  const businessOutcome = extractBusinessOutcome(fullText)
  const industry = inferIndustry(fullText)

  return {
    title: title ? normalizeText(title) : null,
    industry,
    description: description ? normalizeText(description) : null,
    technologies,
    businessOutcome,
    metrics,
    url,
  }
}

function extractTechMentions(text: string): string[] {
  const matches = text.match(TECH_PATTERN) ?? []
  return [...new Set(matches.map((m) => m.trim()))]
}

function extractMetrics(text: string): string[] {
  const matches = text.match(METRIC_PATTERN) ?? []
  return [...new Set(matches)]
}

function extractBusinessOutcome(text: string): string | null {
  // Look for sentences containing outcome indicators
  const outcomePattern =
    /[^.!?]*(?:increased?|decreased?|reduced?|improved?|grew?|boosted?|saved?|generated?|achieved?|delivered?|resulted?\s+in)[^.!?]*[.!?]/gi
  const match = text.match(outcomePattern)
  return match?.[0]?.trim() ?? null
}

function inferIndustry(text: string): string | null {
  const lower = text.toLowerCase()
  if (/\bsaas\b|software.as.a.service/i.test(lower)) return 'SaaS'
  if (/\bfintech\b|finance|banking|payment/i.test(lower)) return 'Fintech'
  if (/\bhealth\b|medical|healthcare|clinical/i.test(lower)) return 'Healthcare'
  if (/\becommerce\b|e-commerce|shopify|retail|shop/i.test(lower)) return 'E-commerce'
  if (/\bedtech\b|education|learning|lms/i.test(lower)) return 'Edtech'
  if (/\breal\s*estate\b|property|rental/i.test(lower)) return 'Real Estate'
  if (/\bmarketing\b|advertising|agency/i.test(lower)) return 'Marketing'
  if (/\blogistics\b|supply.chain|shipping/i.test(lower)) return 'Logistics'
  return null
}
