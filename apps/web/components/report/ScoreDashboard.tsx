'use client'

import type { ProfileScore, DimensionScore } from '@/lib/ai/types'
import { scoreColor, scoreTailwindText } from '@/lib/report/grading'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ScoreDashboardProps {
  score: ProfileScore
}

interface DimensionCardProps {
  label: string
  dimension: DimensionScore
  description: string
}

function DimensionCard({ label, dimension, description }: DimensionCardProps) {
  const color = scoreColor(dimension.score)
  const textColor = scoreTailwindText(dimension.score)

  return (
    <div className="bg-bg-elevated border-border flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-foreground text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
        <span className={cn('text-lg font-bold tabular-nums', textColor)}>{dimension.score}</span>
      </div>

      <Progress
        value={dimension.score}
        aria-label={`${label}: ${dimension.score} out of 100`}
        barClassName=""
        className="h-1.5"
      />
      {/* Custom colored bar */}
      <div className="-mt-4">
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${dimension.score}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <div>
        <span
          className="inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold"
          style={{ color, borderColor: color, opacity: 0.85 }}
        >
          {dimension.label}
        </span>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{description}</p>
      </div>

      {dimension.rationale && (
        <p className="text-muted-foreground/70 border-border border-t pt-2 text-xs italic leading-relaxed">
          {dimension.rationale}
        </p>
      )}
    </div>
  )
}

const DIMENSION_DESCRIPTIONS: Record<keyof Omit<ProfileScore, 'overall'>, string> = {
  positioning: 'How clearly you differentiate yourself and target a specific niche.',
  clarity: 'How readable and persuasive your profile copy is to clients.',
  authority: 'How well your portfolio, reviews, and history establish credibility.',
  completeness: 'How thoroughly all sections of your profile are filled out.',
  marketAlignment: 'How well your skills and positioning match current market demand.',
}

export function ScoreDashboard({ score }: ScoreDashboardProps) {
  return (
    <section
      aria-labelledby="score-dashboard-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <h2 id="score-dashboard-heading" className="text-foreground mb-5 font-semibold">
        Score Breakdown
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {(
          [
            ['Positioning', 'positioning'],
            ['Clarity', 'clarity'],
            ['Authority', 'authority'],
            ['Completeness', 'completeness'],
            ['Market Alignment', 'marketAlignment'],
          ] as const
        ).map(([label, key]) => (
          <DimensionCard
            key={key}
            label={label}
            dimension={score[key]}
            description={DIMENSION_DESCRIPTIONS[key]}
          />
        ))}
      </div>
    </section>
  )
}
