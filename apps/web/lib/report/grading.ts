import type { AIAnalysisResult } from '@/lib/ai/types'

// ─── Letter Grade ─────────────────────────────────────────────────────────────

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F'

const GRADE_THRESHOLDS: Array<{ min: number; grade: LetterGrade }> = [
  { min: 95, grade: 'A+' },
  { min: 90, grade: 'A' },
  { min: 85, grade: 'A-' },
  { min: 80, grade: 'B+' },
  { min: 75, grade: 'B' },
  { min: 70, grade: 'B-' },
  { min: 65, grade: 'C+' },
  { min: 60, grade: 'C' },
  { min: 55, grade: 'C-' },
  { min: 40, grade: 'D' },
  { min: 0, grade: 'F' },
]

export function letterGrade(score: number): LetterGrade {
  return GRADE_THRESHOLDS.find((t) => score >= t.min)?.grade ?? 'F'
}

// ─── Profile Health ───────────────────────────────────────────────────────────

export type ProfileHealth = 'Excellent' | 'Good' | 'Fair' | 'Needs Work'

export function profileHealth(score: number): ProfileHealth {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Work'
}

// ─── Score color tokens ───────────────────────────────────────────────────────

export function scoreColor(score: number): string {
  if (score >= 85) return 'var(--score-excellent)'
  if (score >= 70) return 'var(--score-good)'
  if (score >= 50) return 'var(--score-developing)'
  return 'var(--score-needs-work)'
}

export function scoreTailwindText(score: number): string {
  if (score >= 85) return 'text-success'
  if (score >= 70) return 'text-lime-400'
  if (score >= 50) return 'text-warning'
  return 'text-destructive'
}

// ─── Competitiveness / Market Readiness ───────────────────────────────────────

export function competitivenessLabel(score: number): string {
  if (score >= 85) return 'Highly Competitive'
  if (score >= 70) return 'Competitive'
  if (score >= 55) return 'Developing'
  if (score >= 40) return 'Early Stage'
  return 'Not Competitive'
}

export function marketReadinessLabel(marketAlignment: number): string {
  if (marketAlignment >= 85) return 'Market-Ready'
  if (marketAlignment >= 65) return 'Mostly Ready'
  if (marketAlignment >= 45) return 'Partially Ready'
  return 'Not Market-Ready'
}

// ─── Improvement timeline generation ─────────────────────────────────────────

export interface TimelineWeek {
  week: number
  label: string
  items: string[]
  focus: 'high' | 'medium' | 'low'
}

export function buildImprovementTimeline(result: AIAnalysisResult): TimelineWeek[] {
  const highRecs = result.recommendations.filter((r) => r.priority === 'high').slice(0, 2)
  const medRecs = result.recommendations.filter((r) => r.priority === 'medium').slice(0, 2)
  const lowRecs = result.recommendations.filter((r) => r.priority === 'low').slice(0, 2)

  const weeks: TimelineWeek[] = []

  if (highRecs.length > 0) {
    weeks.push({
      week: 1,
      label: 'Quick Wins',
      items: highRecs.map((r) => r.title),
      focus: 'high',
    })
  }

  if (result.suggestedTitle || result.suggestedOverviewOpener) {
    weeks.push({
      week: weeks.length + 1,
      label: 'Rewrite Core Copy',
      items: [
        result.suggestedTitle ? 'Upgrade your headline' : null,
        result.suggestedOverviewOpener ? 'Rewrite your overview opener' : null,
      ].filter(Boolean) as string[],
      focus: 'high',
    })
  }

  if (medRecs.length > 0) {
    weeks.push({
      week: weeks.length + 1,
      label: 'Deepen Your Profile',
      items: medRecs.map((r) => r.title),
      focus: 'medium',
    })
  }

  if (result.missingKeywords.length > 0) {
    weeks.push({
      week: weeks.length + 1,
      label: 'Keyword Optimisation',
      items: [`Add missing keywords: ${result.missingKeywords.slice(0, 3).join(', ')}`],
      focus: 'medium',
    })
  }

  if (lowRecs.length > 0) {
    weeks.push({
      week: weeks.length + 1,
      label: 'Polish & Refine',
      items: lowRecs.map((r) => r.title),
      focus: 'low',
    })
  }

  // Always cap at 6 weeks
  return weeks.slice(0, 6)
}

// ─── Section score derivation (map AI dimension → per-section score) ──────────
// The AI scores 5 dimensions, not individual sections. We map sections to
// the most relevant dimension so the section breakdown has numeric scores.

export function sectionScoreMap(result: AIAnalysisResult): Record<string, number> {
  const { positioning, clarity, authority, completeness, marketAlignment } = result.score
  return {
    title: Math.round(positioning.score * 0.6 + clarity.score * 0.4),
    overview: Math.round(clarity.score * 0.5 + positioning.score * 0.3 + authority.score * 0.2),
    skills: Math.round(marketAlignment.score * 0.7 + completeness.score * 0.3),
    employment: Math.round(authority.score * 0.7 + completeness.score * 0.3),
    portfolio: Math.round(authority.score * 0.6 + positioning.score * 0.4),
    projectCatalog: Math.round(positioning.score * 0.5 + marketAlignment.score * 0.5),
    reviews: Math.round(authority.score * 0.8 + completeness.score * 0.2),
    languages: Math.round(completeness.score),
    certifications: Math.round(authority.score * 0.5 + completeness.score * 0.5),
    hourlyRate: Math.round(marketAlignment.score * 0.6 + positioning.score * 0.4),
    availability: Math.round(completeness.score),
  }
}
