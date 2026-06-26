import { describe, it, expect } from 'vitest'
import {
  groupByPriority,
  topRecommendations,
  deduplicateBySsection,
} from '../../lib/ai/RecommendationEngine'
import type { Recommendation } from '../../lib/ai/types'

function rec(
  priority: Recommendation['priority'],
  section: Recommendation['section'],
  id?: string
): Recommendation {
  id ??= priority
  return {
    id,
    priority,
    section,
    title: `Fix ${id}`,
    explanation: '',
    whyItMatters: '',
    expectedImpact: '',
    action: '',
  }
}

describe('groupByPriority', () => {
  it('groups recommendations by priority', () => {
    const recs = [rec('high', 'title'), rec('low', 'skills'), rec('medium', 'overview')]
    const groups = groupByPriority(recs)
    expect(groups.high).toHaveLength(1)
    expect(groups.medium).toHaveLength(1)
    expect(groups.low).toHaveLength(1)
  })

  it('returns empty arrays when no recs', () => {
    const groups = groupByPriority([])
    expect(groups.high).toHaveLength(0)
    expect(groups.medium).toHaveLength(0)
    expect(groups.low).toHaveLength(0)
  })
})

describe('topRecommendations', () => {
  it('returns up to limit items ordered high → medium → low', () => {
    const recs = [
      rec('low', 'skills', 'low-1'),
      rec('medium', 'overview', 'med-1'),
      rec('high', 'title', 'high-1'),
    ]
    const top = topRecommendations(recs, 2)
    expect(top).toHaveLength(2)
    expect(top[0]?.priority).toBe('high')
    expect(top[1]?.priority).toBe('medium')
  })
})

describe('deduplicateBySsection', () => {
  it('keeps only the highest-priority rec per section', () => {
    const recs = [
      rec('medium', 'overview', 'med-overview'),
      rec('high', 'overview', 'high-overview'),
      rec('low', 'skills', 'low-skills'),
    ]
    const deduped = deduplicateBySsection(recs)
    expect(deduped).toHaveLength(2)
    const overviewRec = deduped.find((r) => r.section === 'overview')
    expect(overviewRec?.priority).toBe('high')
  })
})
