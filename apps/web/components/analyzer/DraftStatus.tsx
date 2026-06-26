import { Check, CloudOff, Loader2, RefreshCw } from 'lucide-react'
import type { SaveStatus } from '@/hooks/useAutoSave'
import { cn } from '@/lib/utils'

interface DraftStatusProps {
  status: SaveStatus
  savedAt: string | null
  className?: string
}

function formatRelative(iso: string | null): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 minute ago'
  if (mins < 60) return `${mins} minutes ago`
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function DraftStatus({ status, savedAt, className }: DraftStatusProps) {
  let icon = <Check className="h-3.5 w-3.5" />
  let text = savedAt ? `Saved ${formatRelative(savedAt)}` : 'Not saved yet'
  let color = 'text-text-tertiary'

  if (status === 'saving') {
    icon = <Loader2 className="h-3.5 w-3.5 animate-spin" />
    text = 'Saving…'
    color = 'text-muted-foreground'
  } else if (status === 'saved') {
    icon = <Check className="h-3.5 w-3.5" />
    text = 'All changes saved'
    color = 'text-success'
  } else if (status === 'unsaved') {
    icon = <RefreshCw className="h-3.5 w-3.5" />
    text = 'Unsaved changes'
    color = 'text-warning'
  } else if (!savedAt) {
    icon = <CloudOff className="h-3.5 w-3.5" />
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', color, className)}
      aria-live="polite"
    >
      {icon}
      {text}
    </span>
  )
}
