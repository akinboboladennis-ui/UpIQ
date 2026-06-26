import type {
  ParsedProfile,
  ParsedSkill,
  SkillCategory,
  NormalizedSkillEntry,
} from '../types/index.js'
import { lookupSkill } from './skill-dictionary.js'
import {
  normalizeWhitespace,
  deduplicateStrings,
  isValidUrl,
  clamp,
  fuzzyMatch,
} from '../utils/index.js'
import { SKILL_DICTIONARY } from './skill-dictionary.js'

// ─── Text Normalization ───────────────────────────────────────────────────────

export function normalizeText(text: string): string {
  return normalizeWhitespace(text)
    .replace(/‘|’/g, "'") // curly single quotes → straight
    .replace(/“|”/g, '"') // curly double quotes → straight
    .replace(/[–—]/g, ' - ') // en/em dash → spaced hyphen
    .replace(/…/g, '...') // ellipsis character → three dots
    .replace(/ /g, ' ') // non-breaking space → space
}

// ─── Rate Normalization ───────────────────────────────────────────────────────

/**
 * Convert a rate string to USD cents.
 * Handles: "$85", "$85/hr", "85 USD", "85.50/hour", etc.
 * Returns null if unparseable.
 */
export function normalizeHourlyRate(raw: string): number | null {
  // Strip currency symbols and common words
  const cleaned = raw
    .replace(/[£€$¥₹]/g, '')
    .replace(/\/hr(our)?/gi, '')
    .replace(/per\s+hour/gi, '')
    .replace(/usd|eur|gbp/gi, '')
    .trim()

  const value = parseFloat(cleaned.replace(/,/g, ''))
  if (isNaN(value) || value < 0 || value > 10000) return null

  return Math.round(value * 100)
}

// ─── Date Normalization ───────────────────────────────────────────────────────

const MONTH_MAP: Record<string, string> = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
}

/**
 * Attempt to parse a date string into ISO format (YYYY-MM or YYYY).
 * Returns null if unparseable.
 */
export function normalizeDate(raw: string): string | null {
  const s = raw.trim().toLowerCase()

  // Already ISO: 2023-04
  if (/^\d{4}-\d{2}$/.test(s)) return raw.trim()
  if (/^\d{4}$/.test(s)) return raw.trim()

  // "Jan 2022" / "January 2022"
  const monthYear = s.match(/^([a-z]+)\s+(\d{4})$/)
  if (monthYear) {
    const month = MONTH_MAP[monthYear[1] ?? '']
    if (month) return `${monthYear[2]}-${month}`
  }

  // "2022 Jan"
  const yearMonth = s.match(/^(\d{4})\s+([a-z]+)$/)
  if (yearMonth) {
    const month = MONTH_MAP[yearMonth[2] ?? '']
    if (month) return `${yearMonth[1]}-${month}`
  }

  // "01/2022" or "2022/01"
  const slashDate = s.match(/^(\d{1,2})\/(\d{4})$/)
  if (slashDate) {
    const m = (slashDate[1] ?? '').padStart(2, '0')
    return `${slashDate[2]}-${m}`
  }

  return null
}

/** Returns true if a date string represents "present" / "current". */
export function isCurrentDate(raw: string): boolean {
  const lower = raw.toLowerCase().trim()
  return ['present', 'current', 'now', 'ongoing', 'till date', 'to date', 'today'].some((t) =>
    lower.includes(t)
  )
}

// ─── URL Normalization ────────────────────────────────────────────────────────

export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  // Add protocol if missing
  let url = trimmed
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  return isValidUrl(url) ? url : null
}

// ─── Skill Normalization ──────────────────────────────────────────────────────

const ALL_NORMALIZED_NAMES = SKILL_DICTIONARY.map((e) => e.normalized)

export function normalizeSkill(raw: string): ParsedSkill {
  const trimmed = raw.trim()

  // Direct dictionary lookup
  const entry = lookupSkill(trimmed)
  if (entry) {
    return {
      original: trimmed,
      normalized: entry.normalized,
      category: entry.category,
      confidence: 1.0,
    }
  }

  // Fuzzy match against all normalized names
  const fuzzy = fuzzyMatch(trimmed, ALL_NORMALIZED_NAMES, 0.7)
  if (fuzzy) {
    const matched = SKILL_DICTIONARY.find((e) => e.normalized === fuzzy)
    if (matched) {
      return {
        original: trimmed,
        normalized: matched.normalized,
        category: matched.category,
        confidence: 0.75,
      }
    }
  }

  // Unknown skill — keep as-is, best-effort category
  return {
    original: trimmed,
    normalized: trimmed,
    category: inferCategory(trimmed),
    confidence: 0.3,
  }
}

function inferCategory(skill: string): SkillCategory {
  const lower = skill.toLowerCase()
  if (/react|vue|angular|html|css|front.?end|ui|web design/i.test(lower)) return 'frontend'
  if (/node|python|php|java|backend|api|server/i.test(lower)) return 'backend'
  if (/ios|android|mobile|flutter|swift|kotlin/i.test(lower)) return 'mobile'
  if (/sql|database|mongo|postgres|mysql/i.test(lower)) return 'database'
  if (/aws|azure|cloud|gcp/i.test(lower)) return 'cloud'
  if (/docker|kubernetes|devops|ci\/cd|terraform/i.test(lower)) return 'devops'
  if (/ai|ml|gpt|llm|machine learning|neural/i.test(lower)) return 'ai_ml'
  if (/zapier|make|automation|n8n/i.test(lower)) return 'automation'
  if (/seo|ads|marketing|email/i.test(lower)) return 'marketing'
  if (/figma|photoshop|design|illustrator/i.test(lower)) return 'design'
  if (/analytics|tableau|power bi|excel/i.test(lower)) return 'analytics'
  return 'other'
}

// ─── Language Proficiency ─────────────────────────────────────────────────────

export function normalizeProficiency(raw: string): import('../types/index.js').LanguageProficiency {
  const lower = raw.toLowerCase()
  if (/native|mother tongue|first language|c2/i.test(lower)) return 'native'
  if (/fluent|proficient|full professional|c1|b2/i.test(lower)) return 'fluent'
  if (/conversational|intermediate|b1/i.test(lower)) return 'conversational'
  if (/basic|elementary|beginner|a1|a2/i.test(lower)) return 'basic'
  return 'unknown'
}

// ─── Profile-Level Normalization ──────────────────────────────────────────────

/**
 * Apply all normalization passes to a parsed profile.
 * Returns a new object — does not mutate input.
 */
export function normalizeProfile(profile: ParsedProfile): ParsedProfile {
  return {
    ...profile,
    title: profile.title ? normalizeText(profile.title) : null,
    overview: profile.overview ? normalizeText(profile.overview) : null,
    skills: deduplicateSkills(profile.skills.map((s) => normalizeSkill(s.original))),
    employment: profile.employment.map((e) => ({
      ...e,
      role: e.role ? normalizeText(e.role) : null,
      company: e.company ? normalizeText(e.company) : null,
      description: e.description ? normalizeText(e.description) : null,
    })),
    portfolio: profile.portfolio.map((p) => ({
      ...p,
      title: p.title ? normalizeText(p.title) : null,
      description: p.description ? normalizeText(p.description) : null,
      url: p.url ? normalizeUrl(p.url) : null,
    })),
    reviews: profile.reviews.map((r) => ({
      ...r,
      text: r.text ? normalizeText(r.text) : null,
    })),
    languages: profile.languages.map((l) => ({
      ...l,
      language: normalizeText(l.language),
    })),
  }
}

function deduplicateSkills(skills: ParsedSkill[]): ParsedSkill[] {
  const seen = new Set<string>()
  return skills.filter((s) => {
    const key = s.normalized.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
