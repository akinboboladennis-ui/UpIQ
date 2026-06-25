import type {
  ProfileDraft,
  ProfileSectionId,
  ProfileValidation,
  SectionValidation,
} from '@upiq/shared'
import { SECTION_CONFIGS, SECTION_MAP } from './sections'

const URL_PATTERN = /^https?:\/\/[^\s.]+\.\S{2,}$/i

export function isValidUrl(value: string): boolean {
  return URL_PATTERN.test(value.trim())
}

function textValue(draft: ProfileDraft, id: ProfileSectionId): string {
  const v = draft[id]
  return typeof v === 'string' ? v : ''
}

/** Validate and score a single section. */
export function validateSection(draft: ProfileDraft, id: ProfileSectionId): SectionValidation {
  const cfg = SECTION_MAP[id]
  const messages: string[] = []

  switch (cfg.kind) {
    case 'text':
    case 'textarea':
    case 'rate': {
      const value = textValue(draft, id).trim()
      if (!value) {
        return { status: 'empty', completion: 0, messages }
      }
      if (cfg.kind === 'rate') {
        const num = Number(value)
        if (Number.isNaN(num) || num <= 0) {
          messages.push('Enter a valid hourly rate.')
          return { status: 'invalid', completion: 50, messages }
        }
        return { status: 'complete', completion: 100, messages }
      }
      if (cfg.maxLength && value.length > cfg.maxLength) {
        messages.push(`Exceeds the ${cfg.maxLength}-character limit.`)
        return { status: 'invalid', completion: 100, messages }
      }
      if (cfg.minLength && value.length < cfg.minLength) {
        messages.push(`Add at least ${cfg.minLength} characters for a strong section.`)
        return {
          status: 'incomplete',
          completion: Math.round((value.length / cfg.minLength) * 100),
          messages,
        }
      }
      return { status: 'complete', completion: 100, messages }
    }

    case 'select': {
      const value = textValue(draft, id).trim()
      if (!value) return { status: 'empty', completion: 0, messages }
      return { status: 'complete', completion: 100, messages }
    }

    case 'tags': {
      const skills = draft.skills
      if (skills.length === 0) return { status: 'empty', completion: 0, messages }

      const lower = skills.map((s) => s.trim().toLowerCase())
      const hasDuplicates = new Set(lower).size !== lower.length
      if (hasDuplicates) {
        messages.push('Remove duplicate skills.')
        return { status: 'invalid', completion: 100, messages }
      }
      // Target ~10 skills for full completion.
      const target = 10
      const completion = Math.min(100, Math.round((skills.length / target) * 100))
      if (skills.length < 3) {
        messages.push('Add a few more skills — aim for 10–15.')
        return { status: 'incomplete', completion, messages }
      }
      return { status: 'complete', completion, messages }
    }

    case 'list': {
      const items = (draft[id] as Array<Record<string, string>>) ?? []
      if (items.length === 0) return { status: 'empty', completion: 0, messages }

      const fields = cfg.itemFields ?? []
      const requiredKeys = fields.filter((f) => f.required).map((f) => f.key)
      const urlKeys = fields.filter((f) => f.type === 'url').map((f) => f.key)

      let invalid = false
      for (const item of items) {
        for (const key of requiredKeys) {
          if (!String(item[key] ?? '').trim()) {
            invalid = true
          }
        }
        for (const key of urlKeys) {
          const raw = String(item[key] ?? '').trim()
          if (raw && !isValidUrl(raw)) {
            invalid = true
            messages.push('One or more URLs look invalid.')
          }
        }
      }

      if (invalid) {
        if (!messages.length)
          messages.push(`Fill in the required fields for each ${cfg.itemNoun ?? 'item'}.`)
        return { status: 'invalid', completion: 100, messages }
      }
      return { status: 'complete', completion: 100, messages }
    }

    default:
      return { status: 'empty', completion: 0, messages }
  }
}

export function validateProfile(draft: ProfileDraft): ProfileValidation {
  const result = {} as ProfileValidation
  for (const cfg of SECTION_CONFIGS) {
    result[cfg.id] = validateSection(draft, cfg.id)
  }
  return result
}

export interface ProfileSummary {
  /** Overall completion 0-100, weighted toward required sections. */
  completion: number
  /** AI readiness 0-100 — completion gated by validity. */
  readiness: number
  completedCount: number
  totalCount: number
  requiredMissing: ProfileSectionId[]
  invalidSections: ProfileSectionId[]
  emptyOptional: ProfileSectionId[]
  /** Coarse quality label derived from readiness. */
  quality: 'low' | 'fair' | 'good' | 'excellent'
  /** Rough estimate in seconds for the (future) AI pass. */
  estimatedSeconds: number
}

export function summarizeProfile(
  draft: ProfileDraft,
  validation: ProfileValidation
): ProfileSummary {
  const requiredMissing: ProfileSectionId[] = []
  const invalidSections: ProfileSectionId[] = []
  const emptyOptional: ProfileSectionId[] = []
  let completedCount = 0

  let weightedScore = 0
  let weightTotal = 0

  for (const cfg of SECTION_CONFIGS) {
    const v = validation[cfg.id]
    const weight = cfg.required ? 2 : 1
    weightTotal += weight
    weightedScore += (v.completion / 100) * weight

    if (v.status === 'complete') completedCount += 1
    if (cfg.required && (v.status === 'empty' || v.status === 'incomplete')) {
      requiredMissing.push(cfg.id)
    }
    if (v.status === 'invalid') invalidSections.push(cfg.id)
    if (!cfg.required && v.status === 'empty') emptyOptional.push(cfg.id)
  }

  const completion = Math.round((weightedScore / weightTotal) * 100)

  // Readiness penalizes invalid sections and missing required data.
  const penalty = invalidSections.length * 10 + requiredMissing.length * 8
  const readiness = Math.max(0, Math.min(100, completion - penalty))

  const quality: ProfileSummary['quality'] =
    readiness >= 85 ? 'excellent' : readiness >= 65 ? 'good' : readiness >= 40 ? 'fair' : 'low'

  // More content → longer estimated pass. Bounded 8–45s.
  const estimatedSeconds = Math.min(45, 8 + Math.round((completion / 100) * 30))

  return {
    completion,
    readiness,
    completedCount,
    totalCount: SECTION_CONFIGS.length,
    requiredMissing,
    invalidSections,
    emptyOptional,
    quality,
    estimatedSeconds,
  }
}

/** Pre-analysis recommendations shown on the review screen. */
export function buildRecommendations(
  draft: ProfileDraft,
  validation: ProfileValidation,
  summary: ProfileSummary
): string[] {
  const recs: string[] = []

  for (const id of summary.requiredMissing) {
    recs.push(
      `Complete the ${SECTION_MAP[id].label} section — it’s required for a meaningful analysis.`
    )
  }
  if (draft.portfolio.length === 0) {
    recs.push('Adding one portfolio example could improve the quality of your analysis.')
  }
  if (draft.skills.length > 0 && draft.skills.length < 8) {
    recs.push('Add a few more skills to better match how clients search.')
  }
  if (draft.overview && draft.overview.trim().length < 400) {
    recs.push('Expanding your overview with measurable achievements strengthens the analysis.')
  }
  if (draft.employment.length === 0) {
    recs.push('Adding employment history gives the AI more context on your experience.')
  }

  return recs.slice(0, 5)
}
