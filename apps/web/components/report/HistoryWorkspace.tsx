'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Heart, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useReportStore, filteredReports, type HistorySortKey } from '@/stores/reportStore'
import type { ReportRecord } from '@/stores/reportStore'
import type { DimensionScore, Recommendation } from '@/lib/ai/types'
import { HistoryCard } from './HistoryCard'
import { HistorySkeleton } from './ReportSkeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function HistoryWorkspace() {
  const { reports, filters, upsertReport, setSearch, setSort, resetFilters } = useReportStore()
  const [loading, setLoading] = useState(true)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Fetch history from server and hydrate store
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analyses')
        if (!res.ok) return
        const data = (await res.json()) as { analyses: Array<Record<string, unknown>> }
        for (const row of data.analyses) {
          const analysisResult = buildResultFromRow(row)
          const record: ReportRecord = {
            id: String(row['id']),
            title: (row['title'] as string | null) ?? null,
            createdAt: String(row['created_at']),
            overallScore: Number(row['overall_score']),
            result: analysisResult,
            isFavorite: Boolean(row['is_favorite']),
            completedRecs: (row['completed_recommendations'] as string[]) ?? [],
          }
          upsertReport(record)
        }
      } catch {
        // Silently fall back to cached store data
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [upsertReport])

  const all = filteredReports(reports, filters)
  const displayed = showFavoritesOnly ? all.filter((r) => r.isFavorite) : all
  const hasFilters = filters.search !== '' || filters.sort !== 'newest'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
            <ClipboardList className="text-primary h-5 w-5" aria-hidden />
            Analysis History
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            All your profile analyses, sorted and searchable.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0 gap-2">
          <Link href="/profile-analyzer">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Filters toolbar */}
      <div className="border-border flex flex-wrap items-center gap-2 border-y py-2.5">
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="text-muted-foreground absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            aria-hidden
          />
          <Input
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="h-8 pl-8 text-sm"
            aria-label="Search reports"
          />
          {filters.search && (
            <button
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button
          variant={showFavoritesOnly ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setShowFavoritesOnly((v) => !v)}
          className="gap-1.5"
          aria-pressed={showFavoritesOnly}
        >
          <Heart className={cn('h-3.5 w-3.5', showFavoritesOnly && 'fill-current')} aria-hidden />
          Favorites
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.sort}
              onValueChange={(v) => setSort(v as HistorySortKey)}
            >
              <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest">Highest score</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lowest">Lowest score</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-xs">
            <X className="h-3 w-3" aria-hidden /> Reset
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <HistorySkeleton />
      ) : displayed.length === 0 ? (
        <EmptyState hasFilters={hasFilters || showFavoritesOnly} />
      ) : (
        <div className="space-y-3">
          {displayed.map((record) => (
            <HistoryCard key={record.id} record={record} />
          ))}
          <p className="text-muted-foreground pt-2 text-center text-xs">
            {displayed.length} report{displayed.length !== 1 ? 's' : ''}
            {showFavoritesOnly && ' (favorited)'}
          </p>
        </div>
      )}

      {/* Comparison placeholder */}
      <div className="border-border/50 mt-8 rounded-xl border border-dashed p-6 text-center">
        <p className="text-foreground text-sm font-semibold">Compare Analyses</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Side-by-side report comparisons are coming in a future sprint.
        </p>
      </div>
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-4 rounded-xl border py-16 text-center">
      <ClipboardList className="text-muted-foreground h-10 w-10" aria-hidden />
      <div>
        <p className="text-foreground font-semibold">
          {hasFilters ? 'No reports match your filters' : 'No analyses yet'}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {hasFilters
            ? 'Try adjusting your search or sort options.'
            : 'Analyze your profile to see your first Intelligence Report.'}
        </p>
      </div>
      {!hasFilters && (
        <Button asChild size="sm" className="gap-2">
          <Link href="/profile-analyzer">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Analyze Profile
          </Link>
        </Button>
      )}
    </div>
  )
}

// Build AIAnalysisResult from raw Supabase row
function buildResultFromRow(row: Record<string, unknown>) {
  const scores = (row['scores'] as Record<string, DimensionScore>) ?? {}
  const blankDim: DimensionScore = { score: 0, label: '', rationale: '' }
  return {
    score: {
      overall: Number(row['overall_score'] ?? 0),
      positioning: scores['positioning'] ?? blankDim,
      clarity: scores['clarity'] ?? blankDim,
      authority: scores['authority'] ?? blankDim,
      completeness: scores['completeness'] ?? blankDim,
      marketAlignment: scores['marketAlignment'] ?? blankDim,
    },
    strengths: (row['strengths'] as string[]) ?? [],
    weaknesses: (row['weaknesses'] as string[]) ?? [],
    missingKeywords: (row['missing_keywords'] as string[]) ?? [],
    suggestedTitle: (row['suggestions'] as Record<string, string>)?.['title'] ?? '',
    suggestedOverviewOpener:
      (row['suggestions'] as Record<string, string>)?.['overviewOpener'] ?? '',
    priorityFixes: (row['priority_fixes'] as string[]) ?? [],
    aiSummary: String(row['ai_summary'] ?? ''),
    nextActions: (row['next_actions'] as string[]) ?? [],
    recommendations: (row['recommendations'] as Recommendation[]) ?? [],
    promptVersion: String(row['prompt_version'] ?? ''),
    provider: String(row['provider'] ?? 'claude') as 'claude' | 'openai',
    model: String(row['model'] ?? ''),
    inputTokens: Number(row['input_tokens'] ?? 0),
    outputTokens: Number(row['output_tokens'] ?? 0),
    latencyMs: Number(row['latency_ms'] ?? 0),
  }
}
