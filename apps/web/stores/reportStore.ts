import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIAnalysisResult } from '@/lib/ai/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReportRecord {
  id: string
  title: string | null
  createdAt: string
  overallScore: number
  result: AIAnalysisResult
  isFavorite: boolean
  /** Set of completed recommendation IDs — stored as array for persistence. */
  completedRecs: string[]
}

export type HistorySortKey = 'newest' | 'oldest' | 'highest' | 'lowest'

export interface HistoryFilters {
  search: string
  sort: HistorySortKey
  minScore: number
  maxScore: number
}

interface ReportState {
  /** All locally-cached reports, keyed by analysis ID. */
  reports: Record<string, ReportRecord>
  /** ID of the report currently open in the viewer. */
  activeReportId: string | null
  /** List-page filters. */
  filters: HistoryFilters

  // Report management
  upsertReport: (report: ReportRecord) => void
  removeReport: (id: string) => void
  renameReport: (id: string, title: string) => void
  toggleFavorite: (id: string) => void

  // Recommendation completion
  toggleRecommendation: (reportId: string, recId: string) => void
  isRecCompleted: (reportId: string, recId: string) => boolean

  // Filters
  setSearch: (q: string) => void
  setSort: (sort: HistorySortKey) => void
  setScoreRange: (min: number, max: number) => void
  resetFilters: () => void

  // Navigation
  setActiveReportId: (id: string | null) => void
}

const DEFAULT_FILTERS: HistoryFilters = {
  search: '',
  sort: 'newest',
  minScore: 0,
  maxScore: 100,
}

// ─── Derived helpers (not in store, called by components) ────────────────────

export function filteredReports(
  reports: Record<string, ReportRecord>,
  filters: HistoryFilters
): ReportRecord[] {
  let list = Object.values(reports)

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (r) =>
        (r.title ?? '').toLowerCase().includes(q) || r.result.aiSummary.toLowerCase().includes(q)
    )
  }

  list = list.filter(
    (r) => r.overallScore >= filters.minScore && r.overallScore <= filters.maxScore
  )

  switch (filters.sort) {
    case 'newest':
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    case 'oldest':
      list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      break
    case 'highest':
      list.sort((a, b) => b.overallScore - a.overallScore)
      break
    case 'lowest':
      list.sort((a, b) => a.overallScore - b.overallScore)
      break
  }

  return list
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: {},
      activeReportId: null,
      filters: { ...DEFAULT_FILTERS },

      upsertReport: (report) => set((s) => ({ reports: { ...s.reports, [report.id]: report } })),

      removeReport: (id) =>
        set((s) => {
          const next = { ...s.reports }
          delete next[id]
          return {
            reports: next,
            activeReportId: s.activeReportId === id ? null : s.activeReportId,
          }
        }),

      renameReport: (id, title) =>
        set((s) => {
          const existing = s.reports[id]
          if (!existing) return s
          return { reports: { ...s.reports, [id]: { ...existing, title } } }
        }),

      toggleFavorite: (id) =>
        set((s) => {
          const existing = s.reports[id]
          if (!existing) return s
          return {
            reports: { ...s.reports, [id]: { ...existing, isFavorite: !existing.isFavorite } },
          }
        }),

      toggleRecommendation: (reportId, recId) =>
        set((s) => {
          const existing = s.reports[reportId]
          if (!existing) return s
          const completed = existing.completedRecs.includes(recId)
            ? existing.completedRecs.filter((id) => id !== recId)
            : [...existing.completedRecs, recId]
          return {
            reports: { ...s.reports, [reportId]: { ...existing, completedRecs: completed } },
          }
        }),

      isRecCompleted: (reportId, recId) => {
        return get().reports[reportId]?.completedRecs.includes(recId) ?? false
      },

      setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
      setSort: (sort) => set((s) => ({ filters: { ...s.filters, sort } })),
      setScoreRange: (minScore, maxScore) =>
        set((s) => ({ filters: { ...s.filters, minScore, maxScore } })),
      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      setActiveReportId: (id) => set({ activeReportId: id }),
    }),
    {
      name: 'upiq-reports',
      partialize: (s) => ({
        reports: s.reports,
        activeReportId: s.activeReportId,
        filters: s.filters,
      }),
    }
  )
)
