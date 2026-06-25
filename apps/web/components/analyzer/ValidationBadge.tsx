import { AlertTriangle, CheckCircle2, Circle, MinusCircle } from 'lucide-react'
import type { SectionStatus } from '@upiq/shared'
import { cn } from '@/lib/utils'

interface ValidationBadgeProps {
  status: SectionStatus
  className?: string
  showLabel?: boolean
}

const config: Record<SectionStatus, { icon: typeof Circle; label: string; className: string }> = {
  complete: { icon: CheckCircle2, label: 'Complete', className: 'text-success' },
  incomplete: { icon: MinusCircle, label: 'In progress', className: 'text-warning' },
  invalid: { icon: AlertTriangle, label: 'Needs attention', className: 'text-destructive' },
  empty: { icon: Circle, label: 'Empty', className: 'text-text-tertiary' },
}

export function ValidationBadge({ status, className, showLabel }: ValidationBadgeProps) {
  const { icon: Icon, label, className: color } = config[status]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5', color, className)}
      role="status"
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </span>
  )
}
