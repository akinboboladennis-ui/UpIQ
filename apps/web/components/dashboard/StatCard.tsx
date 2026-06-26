import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface StatCardProps {
  label: string
  value?: string | number
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string }
  loading?: boolean
  comingSoon?: boolean
  accent?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  loading,
  comingSoon,
  accent,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card border-border relative flex flex-col gap-3 rounded-xl border p-4 transition-colors',
        accent && 'border-brand/30 bg-brand-subtle/30',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          {comingSoon && (
            <Badge variant="secondary" className="text-[10px]">
              Soon
            </Badge>
          )}
          {Icon && (
            <div className="bg-muted flex h-7 w-7 items-center justify-center rounded-md">
              <Icon className="text-muted-foreground h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className="text-foreground text-2xl font-bold tracking-tight">{value ?? '—'}</p>
        )}
        {description && !loading && (
          <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
        )}
        {loading && <Skeleton className="mt-1 h-3 w-28" />}
      </div>

      {trend && !loading && (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' && 'text-success',
              trend.direction === 'down' && 'text-destructive',
              trend.direction === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend.label}
          </span>
        </div>
      )}
    </div>
  )
}
