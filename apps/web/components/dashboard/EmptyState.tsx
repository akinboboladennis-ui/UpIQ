import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: {
    wrapper: 'py-8',
    icon: 'h-8 w-8',
    iconWrap: 'h-12 w-12',
    title: 'text-sm',
    desc: 'text-xs',
  },
  md: {
    wrapper: 'py-12',
    icon: 'h-9 w-9',
    iconWrap: 'h-14 w-14',
    title: 'text-base',
    desc: 'text-sm',
  },
  lg: {
    wrapper: 'py-16',
    icon: 'h-10 w-10',
    iconWrap: 'h-16 w-16',
    title: 'text-lg',
    desc: 'text-sm',
  },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const s = sizeMap[size]
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center', s.wrapper, className)}
    >
      {Icon && (
        <div
          className={cn('bg-muted mb-4 flex items-center justify-center rounded-full', s.iconWrap)}
        >
          <Icon className={cn('text-muted-foreground', s.icon)} />
        </div>
      )}
      <p className={cn('text-foreground font-semibold', s.title)}>{title}</p>
      {description && (
        <p className={cn('text-muted-foreground mt-1.5 max-w-xs', s.desc)}>{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
