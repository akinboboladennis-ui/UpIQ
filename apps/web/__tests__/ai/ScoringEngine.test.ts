import { describe, it, expect } from 'vitest'
import { blendScores, qualityLabel } from '../../lib/ai/ScoringEngine'
import type { ProfileScore } from '../../lib/ai/types'
import { createEmptyProfileDraft } from '@upiq/shared'

const makeScore = (override: Partial<ProfileScore> = {}): ProfileScore => ({
  overall: 70,
  positioning: { score: 75, label: 'Strong', rationale: '' },
  clarity: { score: 70, label: 'Solid', rationale: '' },
  authority: { score: 65, label: 'Solid', rationale: '' },
  completeness: { score: 80, label: 'Strong', rationale: '' },
  marketAlignment: { score: 60, label: 'Solid', rationale: '' },
  ...override,
})

describe('blendScores', () => {
  it('clamps AI completeness to within 20pts of deterministic', () => {
    const draft = createEmptyProfileDraft() // deterministic completeness ≈ 0
    const aiScore = makeScore({ completeness: { score: 90, label: 'Strong', rationale: '' } })
    const result = blendScores(aiScore, draft)
    expect(result.completeness.score).toBeLessThanOrEqual(20)
  })

  it('recomputes overall using correct weights', () => {
    const draft = createEmptyProfileDraft()
    const aiScore = makeScore({
      positioning: { score: 100, label: 'Exceptional', rationale: '' },
      clarity: { score: 100, label: 'Exceptional', rationale: '' },
      authority: { score: 100, label: 'Exceptional', rationale: '' },
      completeness: { score: 100, label: 'Exceptional', rationale: '' },
      marketAlignment: { score: 100, label: 'Exceptional', rationale: '' },
    })
    const result = blendScores(aiScore, draft)
    // When all dimensions near 100, overall should be near 100.
    expect(result.overall).toBeGreaterThan(80)
  })

  it('overall is always between 0 and 100', () => {
    const draft = createEmptyProfileDraft()
    const aiScore = makeScore({ overall: 200 })
    const result = blendScores(aiScore, draft)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(result.overall).toBeGreaterThanOrEqual(0)
  })
})

describe('qualityLabel', () => {
  it.each([
    [90, 'Exceptional'],
    [75, 'Strong'],
    [60, 'Solid'],
    [45, 'Developing'],
    [20, 'Weak'],
  ])('score %i → %s', (score, label) => {
    expect(qualityLabel(score)).toBe(label)
  })
})
