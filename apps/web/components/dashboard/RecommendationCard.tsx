import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecommendationCardProps {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  priority?: 'high' | 'medium' | 'low'
  completed?: boolean
  className?: string
}

const priorityStyles = {
  high: 'border-brand/30 bg-brand-subtle/20',
  medium: 'border-border bg-card',
  low: 'border-border bg-card',
}

const priorityDot = {
  high: 'bg-brand',
  medium: 'bg-warning',
  low: 'bg-muted-foreground/40',
}

export function RecommendationCard({
  title,
  description,
  icon: Icon,
  href,
  priority = 'medium',
  completed,
  className,
}: RecommendationCardProps) {
  const content = (
    <div
      className={cn(
        'group relative flex gap-4 rounded-xl border p-4 transition-all',
        priorityStyles[priority],
        href && !completed && 'hover:border-brand/50 cursor-pointer',
        completed && 'opacity-60',
        className
      )}
    >
      {Icon && (
        <div className="bg-muted mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Icon className="text-muted-foreground h-4 w-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-foreground text-sm font-semibold leading-snug',
              completed && 'line-through'
            )}
          >
            {title}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', priorityDot[priority])} />
            {href && !completed && (
              <ArrowRight className="text-muted-foreground h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  )

  if (href && !completed) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
