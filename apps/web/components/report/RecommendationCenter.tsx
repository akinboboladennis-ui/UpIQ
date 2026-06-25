'use client'

import { CheckCircle2, Circle, Clock, Flame, Lightbulb } from 'lucide-react'
import type { Recommendation } from '@/lib/ai/types'
import { groupByPriority } from '@/lib/ai/RecommendationEngine'
import { useReportStore } from '@/stores/reportStore'
import { PriorityBadge } from './PriorityBadge'
import { cn } from '@/lib/utils'

interface RecommendationCenterProps {
  reportId: string
  recommendations: Recommendation[]
}

const DIFFICULTY: Record<string, string> = {
  high: 'High effort',
  medium: 'Moderate effort',
  low: 'Quick win',
}

const TIME_ESTIMATE: Record<string, string> = {
  high: '2–4 hrs',
  medium: '30–60 min',
  low: '10–20 min',
}

function RecCard({
  rec,
  reportId,
  completed,
}: {
  rec: Recommendation
  reportId: string
  completed: boolean
}) {
  const toggleRecommendation = useReportStore((s) => s.toggleRecommendation)

  return (
    <div
      className={cn(
        'border-border bg-card group relative rounded-xl border p-4 transition-opacity',
        completed && 'opacity-50'
      )}
    >
      {/* Priority strip */}
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-1 rounded-l-xl',
          rec.priority === 'high' && 'bg-destructive',
          rec.priority === 'medium' && 'bg-warning',
          rec.priority === 'low' && 'bg-muted-foreground/30'
        )}
        aria-hidden
      />

      <div className="pl-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={rec.priority} />
            <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
              <Clock className="h-3 w-3" aria-hidden />
              {TIME_ESTIMATE[rec.priority]}
            </span>
            <span className="text-muted-foreground text-[10px]">· {DIFFICULTY[rec.priority]}</span>
          </div>

          {/* Completion toggle */}
          <button
            type="button"
            onClick={() => toggleRecommendation(reportId, rec.id)}
            aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
            className={cn(
              'shrink-0 rounded-full transition-colors',
              completed ? 'text-success' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
        </div>

        {/* Title */}
        <h4
          className={cn('text-foreground mt-2 text-sm font-semibold', completed && 'line-through')}
        >
          {rec.title}
        </h4>

        {/* Explanation */}
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{rec.explanation}</p>

        {/* Details */}
        <div className="mt-3 space-y-2">
          <div>
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
              Why it matters
            </span>
            <p className="text-muted-foreground/80 mt-0.5 text-xs">{rec.whyItMatters}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
              Expected impact
            </span>
            <p className="text-muted-foreground/80 mt-0.5 text-xs">{rec.expectedImpact}</p>
          </div>
          <div className="bg-brand-subtle/30 border-brand/20 rounded-md border px-3 py-2">
            <span className="text-primary text-[10px] font-semibold uppercase tracking-wide">
              Action
            </span>
            <p className="text-foreground mt-0.5 text-xs">{rec.action}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GroupSection({
  title,
  icon: Icon,
  recs,
  reportId,
  completedIds,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  recs: Recommendation[]
  reportId: string
  completedIds: string[]
}) {
  if (recs.length === 0) return null
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="text-muted-foreground h-4 w-4" aria-hidden />
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        <span className="text-muted-foreground text-xs">
          ({recs.filter((r) => completedIds.includes(r.id)).length}/{recs.length} done)
        </span>
      </div>
      {recs.map((rec) => (
        <RecCard
          key={rec.id}
          rec={rec}
          reportId={reportId}
          completed={completedIds.includes(rec.id)}
        />
      ))}
    </div>
  )
}

export function RecommendationCenter({ reportId, recommendations }: RecommendationCenterProps) {
  const completedRecs = useReportStore((s) => s.reports[reportId]?.completedRecs ?? [])
  const groups = groupByPriority(recommendations)
  const totalDone = completedRecs.length
  const total = recommendations.length

  return (
    <section aria-labelledby="rec-center-heading" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 id="rec-center-heading" className="text-foreground font-semibold">
          Recommendation Roadmap
        </h2>
        {total > 0 && (
          <span className="text-muted-foreground text-xs">
            {totalDone}/{total} completed
          </span>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center gap-3 rounded-xl border py-12 text-center">
          <Lightbulb className="text-muted-foreground h-8 w-8" aria-hidden />
          <p className="text-muted-foreground text-sm">
            No recommendations generated for this analysis.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <GroupSection
            title="High Impact"
            icon={Flame}
            recs={groups.high}
            reportId={reportId}
            completedIds={completedRecs}
          />
          <GroupSection
            title="Medium Impact"
            icon={Lightbulb}
            recs={groups.medium}
            reportId={reportId}
            completedIds={completedRecs}
          />
          <GroupSection
            title="Lower Impact"
            icon={Circle}
            recs={groups.low}
            reportId={reportId}
            completedIds={completedRecs}
          />
        </div>
      )}
    </section>
  )
}
