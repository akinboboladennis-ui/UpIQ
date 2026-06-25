import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptySectionPlaceholderProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptySectionPlaceholder({
  message,
  actionLabel,
  onAction,
  className,
}: EmptySectionPlaceholderProps) {
  return (
    <div
      className={cn(
        'border-border flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center',
        className
      )}
    >
      <p className="text-muted-foreground text-sm">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-primary hover:text-brand-hover inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
