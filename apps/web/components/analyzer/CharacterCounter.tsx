import { cn } from '@/lib/utils'

interface CharacterCounterProps {
  count: number
  max?: number | undefined
  min?: number | undefined
  className?: string
}

export function CharacterCounter({ count, max, min, className }: CharacterCounterProps) {
  const overMax = max !== undefined && count > max
  const underMin = min !== undefined && count > 0 && count < min

  return (
    <span
      className={cn(
        'text-xs tabular-nums',
        overMax ? 'text-destructive font-medium' : underMin ? 'text-warning' : 'text-text-tertiary',
        className
      )}
      aria-live="polite"
    >
      {count.toLocaleString()}
      {max !== undefined && ` / ${max.toLocaleString()}`}
    </span>
  )
}
