import { cn } from '@/lib/utils'

export interface ActivityItem {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: React.ComponentType<{ className?: string }>
  type?: 'analysis' | 'report' | 'proposal' | 'update' | 'default'
}

interface ActivityTimelineProps {
  items: ActivityItem[]
  className?: string
}

const typeColors: Record<NonNullable<ActivityItem['type']>, string> = {
  analysis: 'bg-brand',
  report: 'bg-success',
  proposal: 'bg-warning',
  update: 'bg-info',
  default: 'bg-muted-foreground',
}

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  if (items.length === 0) return null

  return (
    <ol className={cn('space-y-0', className)}>
      {items.map((item, index) => {
        const dotColor = typeColors[item.type ?? 'default']
        const isLast = index === items.length - 1

        return (
          <li key={item.id} className="relative flex gap-4">
            {/* Timeline track */}
            <div className="flex flex-col items-center">
              <div className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', dotColor)} />
              {!isLast && <div className="bg-border mt-1 w-px flex-1" />}
            </div>

            {/* Content */}
            <div className={cn('pb-5', isLast && 'pb-0')}>
              <p className="text-foreground text-sm font-medium leading-snug">{item.title}</p>
              {item.description && (
                <p className="text-muted-foreground mt-0.5 text-xs">{item.description}</p>
              )}
              <time className="text-text-tertiary mt-1 block text-xs">{item.timestamp}</time>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
