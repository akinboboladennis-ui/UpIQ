import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ComingSoonCardProps {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  iconBg?: string
  className?: string
}

export function ComingSoonCard({
  title,
  description,
  icon: Icon,
  iconBg,
  className,
}: ComingSoonCardProps) {
  return (
    <div
      className={cn(
        'bg-card border-border flex flex-col gap-3 rounded-xl border p-5 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              iconBg ?? 'bg-brand-subtle'
            )}
          >
            <Icon className="text-primary h-5 w-5" />
          </div>
        )}
        <Badge variant="secondary" className="text-xs">
          Coming Soon
        </Badge>
      </div>

      <div>
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p>
      </div>

      {/* Placeholder illustration strip */}
      <div className="border-border mt-auto flex h-12 items-center justify-center rounded-lg border border-dashed">
        <div className="flex gap-1.5">
          <div className="bg-muted h-1.5 w-8 rounded-full" />
          <div className="bg-muted h-1.5 w-5 rounded-full opacity-60" />
          <div className="bg-muted h-1.5 w-6 rounded-full opacity-30" />
        </div>
      </div>
    </div>
  )
}
