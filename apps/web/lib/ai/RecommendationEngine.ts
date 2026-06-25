import type { Recommendation, RecommendationPriority } from './types'

export interface GroupedRecommendations {
  high: Recommendation[]
  medium: Recommendation[]
  low: Recommendation[]
}

export function groupByPriority(recommendations: Recommendation[]): GroupedRecommendations {
  const groups: GroupedRecommendations = { high: [], medium: [], low: [] }
  for (const rec of recommendations) {
    groups[rec.priority].push(rec)
  }
  return groups
}

export function topRecommendations(recommendations: Recommendation[], limit = 3): Recommendation[] {
  const order: Record<RecommendationPriority, number> = { high: 0, medium: 1, low: 2 }
  return [...recommendations].sort((a, b) => order[a.priority] - order[b.priority]).slice(0, limit)
}

/** Deduplicate by section — keep only the highest-priority rec per section. */
export function deduplicateBySsection(recommendations: Recommendation[]): Recommendation[] {
  const order: Record<RecommendationPriority, number> = { high: 0, medium: 1, low: 2 }
  const bySection = new Map<string, Recommendation>()

  for (const rec of recommendations) {
    const existing = bySection.get(rec.section)
    if (!existing || order[rec.priority] < order[existing.priority]) {
      bySection.set(rec.section, rec)
    }
  }

  return Array.from(bySection.values()).sort((a, b) => order[a.priority] - order[b.priority])
}
