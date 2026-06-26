import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  size?: 'sm' | 'md'
  id?: string
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  size = 'md',
  id,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h2
          id={id}
          className={cn(
            'font-semibold tracking-tight',
            size === 'md'
              ? 'text-foreground text-base'
              : 'text-muted-foreground text-xs uppercase tracking-wider'
          )}
        >
          {title}
        </h2>
        {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
