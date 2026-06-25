import { describe, it, expect } from 'vitest'
import { filteredReports } from '../../stores/reportStore'
import type { ReportRecord, HistoryFilters } from '../../stores/reportStore'

const blankResult = {
  score: {
    overall: 0,
    positioning: { score: 0, label: '', rationale: '' },
    clarity: { score: 0, label: '', rationale: '' },
    authority: { score: 0, label: '', rationale: '' },
    completeness: { score: 0, label: '', rationale: '' },
    marketAlignment: { score: 0, label: '', rationale: '' },
  },
  strengths: [],
  weaknesses: [],
  missingKeywords: [],
  suggestedTitle: '',
  suggestedOverviewOpener: '',
  priorityFixes: [],
  aiSummary: 'Test AI summary',
  nextActions: [],
  recommendations: [],
  promptVersion: '1.0',
  provider: 'claude' as const,
  model: 'claude-haiku',
  inputTokens: 0,
  outputTokens: 0,
  latencyMs: 0,
}

function makeRecord(overrides: Partial<ReportRecord>): ReportRecord {
  return {
    id: Math.random().toString(36).slice(2),
    title: 'Report',
    createdAt: '2024-01-01T00:00:00Z',
    overallScore: 70,
    result: blankResult,
    isFavorite: false,
    completedRecs: [],
    ...overrides,
  }
}

const defaultFilters: HistoryFilters = {
  search: '',
  sort: 'newest',
  minScore: 0,
  maxScore: 100,
}

describe('filteredReports', () => {
  it('returns all reports with default filters', () => {
    const r1 = makeRecord({ id: 'a', createdAt: '2024-01-01T00:00:00Z' })
    const r2 = makeRecord({ id: 'b', createdAt: '2024-01-02T00:00:00Z' })
    const reports = { a: r1, b: r2 }

    const result = filteredReports(reports, defaultFilters)
    expect(result).toHaveLength(2)
  })

  it('returns empty array for empty store', () => {
    expect(filteredReports({}, defaultFilters)).toHaveLength(0)
  })

  it('filters by title search', () => {
    const r1 = makeRecord({ title: 'Backend Expert Report' })
    const r2 = makeRecord({ title: 'Frontend Developer' })
    const reports = { a: r1, b: r2 }

    const result = filteredReports(reports, { ...defaultFilters, search: 'backend' })
    expect(result).toHaveLength(1)
    expect(result[0]?.title).toBe('Backend Expert Report')
  })

  it('filters by aiSummary search', () => {
    const r1 = makeRecord({
      result: { ...blankResult, aiSummary: 'Strong Python developer profile' },
    })
    const r2 = makeRecord({ result: { ...blankResult, aiSummary: 'Frontend React specialist' } })
    const reports = { a: r1, b: r2 }

    const result = filteredReports(reports, { ...defaultFilters, search: 'python' })
    expect(result).toHaveLength(1)
  })

  it('search is case-insensitive', () => {
    const r1 = makeRecord({ title: 'PYTHON EXPERT' })
    const reports = { a: r1 }
    expect(filteredReports(reports, { ...defaultFilters, search: 'python' })).toHaveLength(1)
  })

  it('filters by score range', () => {
    const r1 = makeRecord({ overallScore: 90 })
    const r2 = makeRecord({ overallScore: 60 })
    const r3 = makeRecord({ overallScore: 40 })
    const reports = { a: r1, b: r2, c: r3 }

    const result = filteredReports(reports, { ...defaultFilters, minScore: 60, maxScore: 95 })
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.overallScore).sort()).toEqual([60, 90])
  })

  it('sorts newest first by default', () => {
    const r1 = makeRecord({ id: 'a', createdAt: '2024-01-01T00:00:00Z' })
    const r2 = makeRecord({ id: 'b', createdAt: '2024-01-03T00:00:00Z' })
    const r3 = makeRecord({ id: 'c', createdAt: '2024-01-02T00:00:00Z' })
    const reports = { a: r1, b: r2, c: r3 }

    const result = filteredReports(reports, defaultFilters)
    expect(result.map((r) => r.id)).toEqual(['b', 'c', 'a'])
  })

  it('sorts oldest first', () => {
    const r1 = makeRecord({ id: 'a', createdAt: '2024-01-01T00:00:00Z' })
    const r2 = makeRecord({ id: 'b', createdAt: '2024-01-03T00:00:00Z' })
    const reports = { a: r1, b: r2 }

    const result = filteredReports(reports, { ...defaultFilters, sort: 'oldest' })
    expect(result[0]?.id).toBe('a')
  })

  it('sorts highest score first', () => {
    const r1 = makeRecord({ overallScore: 60 })
    const r2 = makeRecord({ overallScore: 90 })
    const r3 = makeRecord({ overallScore: 75 })
    const reports = { a: r1, b: r2, c: r3 }

    const result = filteredReports(reports, { ...defaultFilters, sort: 'highest' })
    expect(result[0]?.overallScore).toBe(90)
    expect(result[2]?.overallScore).toBe(60)
  })

  it('sorts lowest score first', () => {
    const r1 = makeRecord({ overallScore: 60 })
    const r2 = makeRecord({ overallScore: 90 })
    const reports = { a: r1, b: r2 }

    const result = filteredReports(reports, { ...defaultFilters, sort: 'lowest' })
    expect(result[0]?.overallScore).toBe(60)
  })
})
