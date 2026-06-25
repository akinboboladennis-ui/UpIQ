'use client'

import Link from 'next/link'
import { CalendarDays, Sparkles, TrendingUp, Zap } from 'lucide-react'
import type { AIAnalysisResult } from '@/lib/ai/types'
import {
  letterGrade,
  profileHealth,
  competitivenessLabel,
  marketReadinessLabel,
  scoreTailwindText,
} from '@/lib/report/grading'
import { ScoreRing } from './ScoreRing'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ExecutiveSummaryProps {
  result: AIAnalysisResult
  createdAt: string
  reportTitle: string | null
}

function MetricChip({
  label,
  value,
  icon: Icon,
  valueClass,
}: {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  valueClass?: string
}) {
  return (
    <div className="bg-bg-elevated border-border flex flex-col gap-0.5 rounded-lg border p-3">
      <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide">
        {Icon && <Icon className="h-3 w-3" aria-hidden />}
        {label}
      </div>
      <span className={cn('text-sm font-semibold', valueClass ?? 'text-foreground')}>{value}</span>
    </div>
  )
}

export function ExecutiveSummary({ result, createdAt, reportTitle }: ExecutiveSummaryProps) {
  const score = result.score.overall
  const grade = letterGrade(score)
  const health = profileHealth(score)
  const competitiveness = competitivenessLabel(score)
  const marketReadiness = marketReadinessLabel(result.score.marketAlignment.score)
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(createdAt)
  )
  const healthColor = scoreTailwindText(score)

  return (
    <section
      aria-labelledby="exec-summary-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="text-primary h-4 w-4" aria-hidden />
        <h2 id="exec-summary-heading" className="text-foreground font-semibold">
          Executive Summary
        </h2>
      </div>

      {reportTitle && <p className="text-muted-foreground mb-4 text-sm">{reportTitle}</p>}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Score ring */}
        <div className="flex justify-center sm:justify-start">
          <ScoreRing score={score} grade={grade} size={160} label="Overall" />
        </div>

        {/* Metrics & summary */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MetricChip label="Profile Health" value={health} icon={Zap} valueClass={healthColor} />
            <MetricChip label="Competitiveness" value={competitiveness} icon={TrendingUp} />
            <MetricChip label="Market Readiness" value={marketReadiness} />
            <MetricChip
              label="Analysis Date"
              value={date}
              icon={CalendarDays}
              valueClass="text-muted-foreground text-xs"
            />
          </div>

          {/* AI executive summary */}
          {result.aiSummary && (
            <p className="text-muted-foreground text-sm leading-relaxed">{result.aiSummary}</p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild size="sm" className="gap-2">
              <Link href="/profile-analyzer">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Improve My Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
