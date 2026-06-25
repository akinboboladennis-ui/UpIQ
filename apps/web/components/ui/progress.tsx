import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  'aria-label'?: string
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  'aria-label': ariaLabel,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
      className={cn('bg-muted h-2 w-full overflow-hidden rounded-full', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          barClassName ?? 'bg-primary'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
