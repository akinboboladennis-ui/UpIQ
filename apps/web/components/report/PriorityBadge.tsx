import { cn } from '@/lib/utils'
import type { RecommendationPriority } from '@/lib/ai/types'

interface PriorityBadgeProps {
  priority: RecommendationPriority
  className?: string
}

const config: Record<RecommendationPriority, { label: string; className: string }> = {
  high: {
    label: 'High Impact',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  medium: { label: 'Medium Impact', className: 'bg-warning/15 text-warning border-warning/30' },
  low: { label: 'Low Impact', className: 'bg-muted text-muted-foreground border-border' },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, className: colorClass } = config[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  )
}
