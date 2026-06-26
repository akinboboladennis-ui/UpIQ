'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  Download,
  Heart,
  MoreHorizontal,
  Pencil,
  Printer,
  Share2,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useReportStore } from '@/stores/reportStore'
import { letterGrade, scoreColor } from '@/lib/report/grading'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ReportHeaderProps {
  reportId: string
  title: string | null
  overallScore: number
  isFavorite: boolean
}

export function ReportHeader({ reportId, title, overallScore, isFavorite }: ReportHeaderProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [nameValue, setNameValue] = useState(title ?? '')
  const { renameReport, toggleFavorite, removeReport } = useReportStore()

  const grade = letterGrade(overallScore)
  const color = scoreColor(overallScore)

  async function handleRename() {
    const trimmed = nameValue.trim()
    if (!trimmed) return setEditing(false)
    try {
      await fetch(`/api/analyses/${reportId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      })
      renameReport(reportId, trimmed)
      toast.success('Report renamed.')
    } catch {
      toast.error('Failed to rename report.')
    }
    setEditing(false)
  }

  async function handleToggleFavorite() {
    try {
      await fetch(`/api/analyses/${reportId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ is_favorite: !isFavorite }),
      })
      toggleFavorite(reportId)
    } catch {
      toast.error('Failed to update favorite.')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this report? This cannot be undone.')) return
    try {
      await fetch(`/api/analyses/${reportId}`, { method: 'DELETE' })
      removeReport(reportId)
      toast.success('Report deleted.')
      router.push('/history')
    } catch {
      toast.error('Failed to delete report.')
    }
  }

  function handleExportJSON() {
    toast.info('JSON export is ready when you need it.', {
      description: 'Check the browser console — full analysis data is available via the store.',
    })
  }

  function handlePrint() {
    window.print()
  }

  function handleShare() {
    toast.info('Share link coming in Sprint Nexus v2.')
  }

  return (
    <header className="border-border bg-bg-surface/80 sticky top-0 z-20 border-b backdrop-blur-sm print:static print:border-none print:bg-transparent">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        {/* Back */}
        <Button variant="ghost" size="sm" asChild className="shrink-0 gap-1.5">
          <Link href="/history" aria-label="Back to Analysis History">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">History</span>
          </Link>
        </Button>

        {/* Score badge */}
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1"
          style={{ borderColor: color, color }}
        >
          <span className="text-sm font-bold tabular-nums">{overallScore}</span>
          <span className="text-xs font-semibold">{grade}</span>
        </div>

        {/* Title / rename */}
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleRename()
                  if (e.key === 'Escape') setEditing(false)
                }}
                className="h-7 text-sm"
                autoFocus
                maxLength={120}
                aria-label="Report title"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void handleRename()}
                aria-label="Save"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-foreground group flex items-center gap-1.5 truncate text-sm font-semibold"
              aria-label="Click to rename report"
            >
              <span className="truncate">{title ?? 'Intelligence Report'}</span>
              <Pencil
                className="text-muted-foreground h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleToggleFavorite()}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(isFavorite && 'text-destructive')}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Rename report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <Download className="mr-2 h-4 w-4" /> Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void handleDelete()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
