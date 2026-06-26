import type { ProfileSectionKey, SectionPresence } from '../types/index.js'

export interface DetectedSection {
  key: ProfileSectionKey
  startOffset: number
  endOffset: number
  content: string
  confidence: number
}

/**
 * Pattern groups for each section.
 * Patterns are tried in order; first match wins.
 * Each pattern matches a section header line.
 */
const SECTION_PATTERNS: Record<ProfileSectionKey, RegExp[]> = {
  title: [
    /^#+\s*(?:title|professional\s+title|headline)/i,
    /^(?:title|professional\s+title|headline)\s*:?\s*$/i,
  ],
  overview: [
    /^#+\s*(?:overview|about|bio|summary|profile\s+summary|professional\s+summary|about\s+me|introduction)/i,
    /^(?:overview|about|bio|summary|profile\s+summary|professional\s+summary|about\s+me|introduction)\s*:?\s*$/i,
  ],
  skills: [
    /^#+\s*(?:skills?|expertise|technologies|tech\s+stack|technical\s+skills?|core\s+competencies|tools?)/i,
    /^(?:skills?|expertise|technologies|tech\s+stack|technical\s+skills?|core\s+competencies|tools?)\s*:?\s*$/i,
  ],
  employment: [
    /^#+\s*(?:work\s+(?:history|experience)|employment(?:\s+history)?|experience|professional\s+experience|career\s+history)/i,
    /^(?:work\s+(?:history|experience)|employment(?:\s+history)?|experience|professional\s+experience|career\s+history)\s*:?\s*$/i,
  ],
  portfolio: [
    /^#+\s*(?:portfolio|projects?|sample\s+work|case\s+studies?|work\s+samples?)/i,
    /^(?:portfolio|projects?|sample\s+work|case\s+studies?|work\s+samples?)\s*:?\s*$/i,
  ],
  reviews: [
    /^#+\s*(?:reviews?|testimonials?|client\s+feedback|feedback|ratings?)/i,
    /^(?:reviews?|testimonials?|client\s+feedback|feedback|ratings?)\s*:?\s*$/i,
  ],
  languages: [
    /^#+\s*(?:languages?(?:\s+spoken)?|spoken\s+languages?)/i,
    /^(?:languages?(?:\s+spoken)?|spoken\s+languages?)\s*:?\s*$/i,
  ],
  certifications: [
    /^#+\s*(?:certifications?|certificates?|credentials?|qualifications?|accreditations?)/i,
    /^(?:certifications?|certificates?|credentials?|qualifications?|accreditations?)\s*:?\s*$/i,
  ],
  hourlyRate: [
    /^#+\s*(?:hourly\s+rate|rate|pricing|my\s+rate)/i,
    /^(?:hourly\s+rate|rate|pricing|my\s+rate)\s*:?\s*$/i,
  ],
  availability: [
    /^#+\s*(?:availability|hours?\s+per\s+week|schedule|working\s+hours?)/i,
    /^(?:availability|hours?\s+per\s+week|schedule|working\s+hours?)\s*:?\s*$/i,
  ],
}

export interface SectionMap {
  sections: Map<ProfileSectionKey, DetectedSection>
  presence: Record<ProfileSectionKey, SectionPresence>
}

/**
 * Detect sections in raw profile text.
 * Works by scanning lines for header patterns, then slicing content between headers.
 */
export function detectSections(rawText: string): SectionMap {
  // Preserve blank lines so block-separators within sections aren't lost.
  // We trim each line for pattern matching but keep empty entries in the array.
  const lines = rawText.split(/\r?\n/).map((l) => l.trim())
  const allKeys = Object.keys(SECTION_PATTERNS) as ProfileSectionKey[]

  // Step 1: find all header line positions
  interface HeaderHit {
    key: ProfileSectionKey
    lineIndex: number
    offset: number
    confidence: number
  }

  const hits: HeaderHit[] = []
  let currentOffset = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    for (const key of allKeys) {
      const patterns = SECTION_PATTERNS[key]
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          hits.push({ key, lineIndex: i, offset: currentOffset, confidence: 0.95 })
          break
        }
      }
    }
    currentOffset += line.length + 1 // +1 for newline
  }

  // Step 2: build section content map by slicing between headers
  const sectionMap = new Map<ProfileSectionKey, DetectedSection>()

  for (let h = 0; h < hits.length; h++) {
    const hit = hits[h]
    if (!hit) continue
    const nextHit = hits[h + 1]

    const startLine = hit.lineIndex + 1 // skip the header line itself
    const endLine = nextHit ? nextHit.lineIndex : lines.length
    const contentLines = lines.slice(startLine, endLine)
    // Trim leading/trailing blank lines; preserve internal blank lines (block separators)
    const firstNonEmpty = contentLines.findIndex((l) => (l ?? '').length > 0)
    if (firstNonEmpty === -1) continue
    const lastNonEmpty =
      contentLines.length - 1 - [...contentLines].reverse().findIndex((l) => (l ?? '').length > 0)
    const content = contentLines.slice(firstNonEmpty, lastNonEmpty + 1).join('\n')

    if (!sectionMap.has(hit.key) && content.trim().length > 0) {
      sectionMap.set(hit.key, {
        key: hit.key,
        startOffset: hit.offset,
        endOffset: hit.offset + content.length,
        content,
        confidence: hit.confidence,
      })
    }
  }

  // Step 3: heuristic fallback for profiles without explicit headers
  // If no sections detected at all, treat the entire text as overview
  if (sectionMap.size === 0) {
    const trimmed = rawText.trim()
    sectionMap.set('overview', {
      key: 'overview',
      startOffset: 0,
      endOffset: trimmed.length,
      content: trimmed,
      confidence: 0.5,
    })
  }

  // Step 4: try to detect inline rate patterns anywhere in text if not found
  if (!sectionMap.has('hourlyRate')) {
    const rateMatch = rawText.match(/\$\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(?:hr|hour))?/i)
    if (rateMatch) {
      const offset = rawText.indexOf(rateMatch[0])
      sectionMap.set('hourlyRate', {
        key: 'hourlyRate',
        startOffset: offset,
        endOffset: offset + rateMatch[0].length,
        content: rateMatch[0],
        confidence: 0.8,
      })
    }
  }

  // Step 5: build presence map
  const presence = {} as Record<ProfileSectionKey, SectionPresence>
  for (const key of allKeys) {
    const section = sectionMap.get(key)
    presence[key] = {
      detected: !!section,
      offset: section?.startOffset ?? null,
      confidence: section?.confidence ?? 0,
    }
  }

  return { sections: sectionMap, presence }
}
