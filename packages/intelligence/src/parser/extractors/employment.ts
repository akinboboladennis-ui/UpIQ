import type { ParsedEmployment } from '../../types/index.js'
import { normalizeDate, isCurrentDate } from '../../normalizer/index.js'
import { toLines, stripBullet, normalizeWhitespace } from '../../utils/index.js'
import { SKILL_DICTIONARY } from '../../normalizer/skill-dictionary.js'

const ALL_TECH_TERMS = SKILL_DICTIONARY.flatMap((e) => [e.normalized, ...e.aliases])
const TECH_PATTERN = new RegExp(
  `\\b(${ALL_TECH_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
)

/** Date range pattern: "Jan 2020 – Present", "2019-2022", "March 2021 to current" */
const DATE_RANGE_PATTERN =
  /(\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}|\d{4})\s*(?:–|-|to|–|—)\s*(present|current|now|ongoing|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}|\d{4})/gi

/**
 * Split employment section into individual job entries.
 * Entries are typically separated by blank lines or repeated role/company patterns.
 */
export function extractEmployment(sectionContent: string): ParsedEmployment[] {
  const blocks = splitIntoBlocks(sectionContent)
  return blocks.map(parseEmploymentBlock).filter((e) => e.role !== null || e.company !== null)
}

function splitIntoBlocks(text: string): string[] {
  // Split on double newlines (blank line separator)
  const rawBlocks = text.split(/\n{2,}/)
  return rawBlocks.map((b) => b.trim()).filter((b) => b.length > 20)
}

function parseEmploymentBlock(block: string): ParsedEmployment {
  const lines = toLines(block)
  let role: string | null = null
  let company: string | null = null
  let startDate: string | null = null
  let endDate: string | null = null
  let isCurrent = false
  const descriptionLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const stripped = stripBullet(line)

    // Look for date range anywhere in the line
    const dateMatch = stripped.match(DATE_RANGE_PATTERN)
    if (dateMatch?.[0]) {
      const parts = dateMatch[0].split(/\s*(?:–|-|to|—)\s*/i)
      startDate = normalizeDate(parts[0] ?? '') ?? parts[0] ?? null
      const rawEnd = parts[1]?.trim() ?? ''
      if (isCurrentDate(rawEnd)) {
        isCurrent = true
        endDate = null
      } else {
        endDate = (normalizeDate(rawEnd) ?? rawEnd) || null
      }
      // The rest of the line (if any) contributes to description
      const afterDate = stripped.replace(DATE_RANGE_PATTERN, '').trim()
      if (afterDate) descriptionLines.push(afterDate)
      continue
    }

    // Heuristic: first non-date, non-bullet line → role, second → company
    if (i === 0 && !role) {
      // May contain "Role at Company" or "Role | Company"
      const atSplit = stripped.match(/^(.+?)\s+(?:at|@|,)\s+(.+)$/)
      const pipeSplit = stripped.match(/^(.+?)\s*[|\/]\s*(.+)$/)
      if (atSplit) {
        role = normalizeWhitespace(atSplit[1] ?? '')
        company = normalizeWhitespace(atSplit[2] ?? '')
      } else if (pipeSplit) {
        role = normalizeWhitespace(pipeSplit[1] ?? '')
        company = normalizeWhitespace(pipeSplit[2] ?? '')
      } else {
        role = stripped
      }
      continue
    }

    if (i === 1 && !company && role && stripped.length < 80) {
      company = stripped
      continue
    }

    descriptionLines.push(stripped)
  }

  const description = descriptionLines.join(' ').trim() || null

  // Extract technology mentions from description
  const technologiesMentioned = extractTechMentions(description ?? '')

  return {
    role,
    company,
    startDate,
    endDate,
    isCurrent,
    description,
    technologiesMentioned,
  }
}

function extractTechMentions(text: string): string[] {
  const matches = text.match(TECH_PATTERN) ?? []
  return [...new Set(matches.map((m) => m.trim()))]
}
