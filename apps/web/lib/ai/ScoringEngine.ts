import type { ProfileDraft } from '@upiq/shared'
import { validateProfile, summarizeProfile } from '@/lib/analyzer/validation'
import type { ProfileScore } from './types'

/**
 * Deterministic completeness score derived from the profile draft.
 * This is blended with the AI-generated scores to produce a hybrid result.
 */
export function computeDeterministicCompleteness(draft: ProfileDraft): number {
  const validation = validateProfile(draft)
  const summary = summarizeProfile(draft, validation)
  return summary.completion
}

/**
 * Blend deterministic and AI scores.
 * Completeness is always deterministic; other dimensions come from AI.
 * If the AI completeness score deviates >20pts from deterministic, we clamp it.
 */
export function blendScores(aiScore: ProfileScore, draft: ProfileDraft): ProfileScore {
  const deterministicCompleteness = computeDeterministicCompleteness(draft)

  // Clamp AI completeness to within 20 points of the deterministic value.
  const aiCompleteness = aiScore.completeness.score
  const maxDelta = 20
  const clampedCompleteness = Math.max(
    deterministicCompleteness - maxDelta,
    Math.min(deterministicCompleteness + maxDelta, aiCompleteness)
  )

  const completeness = {
    ...aiScore.completeness,
    score: Math.round(clampedCompleteness),
  }

  // Recompute overall using weighted dimensions.
  const overall = Math.round(
    aiScore.positioning.score * 0.3 +
      aiScore.clarity.score * 0.25 +
      aiScore.authority.score * 0.2 +
      completeness.score * 0.15 +
      aiScore.marketAlignment.score * 0.1
  )

  return {
    ...aiScore,
    completeness,
    overall: Math.max(0, Math.min(100, overall)),
  }
}

export function qualityLabel(overall: number): string {
  if (overall >= 85) return 'Exceptional'
  if (overall >= 70) return 'Strong'
  if (overall >= 55) return 'Solid'
  if (overall >= 40) return 'Developing'
  return 'Weak'
}
