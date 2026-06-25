import { CalendarCheck } from 'lucide-react'
import type { AIAnalysisResult } from '@/lib/ai/types'
import { buildImprovementTimeline } from '@/lib/report/grading'
import { cn } from '@/lib/utils'

interface ImprovementTimelineProps {
  result: AIAnalysisResult
}

const focusStyles = {
  high: {
    dot: 'bg-destructive',
    border: 'border-destructive/30',
    bg: 'bg-destructive/5',
    label: 'text-destructive',
  },
  medium: {
    dot: 'bg-warning',
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    label: 'text-warning',
  },
  low: {
    dot: 'bg-muted-foreground/40',
    border: 'border-border',
    bg: 'bg-bg-elevated',
    label: 'text-muted-foreground',
  },
}

export function ImprovementTimeline({ result }: ImprovementTimelineProps) {
  const weeks = buildImprovementTimeline(result)

  if (weeks.length === 0) return null

  return (
    <section
      aria-labelledby="timeline-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <CalendarCheck className="text-primary h-4 w-4" aria-hidden />
        <h2 id="timeline-heading" className="text-foreground font-semibold">
          Improvement Timeline
        </h2>
      </div>

      <p className="text-muted-foreground mb-6 text-xs">
        A suggested week-by-week roadmap based on your highest-impact recommendations. Times are
        estimates — adapt to your schedule.
      </p>

      {/* Timeline */}
      <ol className="relative space-y-0" aria-label="Improvement timeline">
        {weeks.map((week, idx) => {
          const styles = focusStyles[week.focus]
          const isLast = idx === weeks.length - 1
          return (
            <li key={week.week} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className="border-border absolute left-[11px] top-6 h-full border-l-2 border-dashed"
                  aria-hidden
                />
              )}

              {/* Dot */}
              <div
                className={cn(
                  'bg-background relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                  styles.border
                )}
                aria-hidden
              >
                <div className={cn('h-2 w-2 rounded-full', styles.dot)} />
              </div>

              {/* Content */}
              <div className={cn('min-w-0 flex-1 rounded-lg border p-3', styles.border, styles.bg)}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn('text-[10px] font-bold uppercase tracking-wider', styles.label)}
                  >
                    Week {week.week}
                  </span>
                  <span className="text-foreground text-xs font-semibold">{week.label}</span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {week.items.map((item, i) => (
                    <li key={i} className="text-muted-foreground flex gap-1.5 text-xs">
                      <span aria-hidden>–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
