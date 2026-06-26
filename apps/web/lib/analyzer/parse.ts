import type { ProfileDraft } from '@upiq/shared'

/**
 * Best-effort parser for a full pasted Upwork profile. This is intentionally
 * heuristic — it splits on common section headings and maps them onto the
 * draft. Users can always correct the result section-by-section afterwards.
 */

const HEADING_ALIASES: Record<string, keyof ProfileDraft> = {
  title: 'title',
  headline: 'title',
  overview: 'overview',
  summary: 'overview',
  about: 'overview',
  bio: 'overview',
  skills: 'skills',
  'hourly rate': 'hourlyRate',
  rate: 'hourlyRate',
  availability: 'availability',
}

interface ParseResult {
  partial: Partial<ProfileDraft>
  matchedSections: string[]
}

export function parseFullProfile(raw: string): ParseResult {
  const text = raw.replace(/\r\n/g, '\n').trim()
  const partial: Partial<ProfileDraft> = {}
  const matched = new Set<string>()

  const lines = text.split('\n')
  let currentKey: keyof ProfileDraft | null = null
  let buffer: string[] = []

  const flush = () => {
    if (!currentKey || buffer.length === 0) return
    const value = buffer.join('\n').trim()
    if (!value) return

    if (currentKey === 'skills') {
      const skills = value
        .split(/[\n,•|]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      if (skills.length) {
        partial.skills = skills
        matched.add('skills')
      }
    } else if (currentKey === 'hourlyRate') {
      const num = value.match(/\d+(\.\d+)?/)
      if (num) {
        partial.hourlyRate = num[0]
        matched.add('hourlyRate')
      }
    } else if (
      currentKey === 'title' ||
      currentKey === 'overview' ||
      currentKey === 'availability'
    ) {
      partial[currentKey] = value
      matched.add(currentKey)
    }
    buffer = []
  }

  for (const line of lines) {
    const heading = line
      .trim()
      .replace(/[:#*]+$/g, '')
      .toLowerCase()
    const mapped = HEADING_ALIASES[heading]
    if (mapped && line.trim().length < 40) {
      flush()
      currentKey = mapped
      continue
    }
    if (currentKey) buffer.push(line)
    else if (!partial.title && line.trim()) {
      // First non-empty line before any heading is treated as the title.
      partial.title = line.trim()
      matched.add('title')
    }
  }
  flush()

  return { partial, matchedSections: Array.from(matched) }
}
