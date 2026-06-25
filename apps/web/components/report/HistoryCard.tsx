'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Heart, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { ReportRecord } from '@/stores/reportStore'
import { useReportStore } from '@/stores/reportStore'
import { letterGrade, profileHealth, scoreColor, scoreTailwindText } from '@/lib/report/grading'
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

interface HistoryCardProps {
  record: ReportRecord
}

export function HistoryCard({ record }: HistoryCardProps) {
  const { renameReport, toggleFavorite, removeReport } = useReportStore()
  const [editing, setEditing] = useState(false)
  const [nameValue, setNameValue] = useState(record.title ?? '')

  const grade = letterGrade(record.overallScore)
  const health = profileHealth(record.overallScore)
  const color = scoreColor(record.overallScore)
  const textColor = scoreTailwindText(record.overallScore)
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
    new Date(record.createdAt)
  )
  const latencySec = (record.result.latencyMs / 1000).toFixed(1)

  async function handleRename() {
    const trimmed = nameValue.trim()
    if (!trimmed) return setEditing(false)
    try {
      await fetch(`/api/analyses/${record.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      })
      renameReport(record.id, trimmed)
      toast.success('Renamed.')
    } catch {
      toast.error('Failed to rename.')
    }
    setEditing(false)
  }

  async function handleFavorite() {
    try {
      await fetch(`/api/analyses/${record.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ is_favorite: !record.isFavorite }),
      })
      toggleFavorite(record.id)
    } catch {
      toast.error('Failed to update.')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this report?')) return
    try {
      await fetch(`/api/analyses/${record.id}`, { method: 'DELETE' })
      removeReport(record.id)
      toast.success('Report deleted.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <div className="border-border bg-card group rounded-xl border p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-4">
        {/* Score badge */}
        <div
          className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border-2 text-center"
          style={{ borderColor: color, color }}
          aria-label={`Score: ${record.overallScore}, Grade: ${grade}`}
        >
          <span className="text-sm font-bold tabular-nums leading-none">{record.overallScore}</span>
          <span className="text-[8px] font-bold uppercase leading-none opacity-80">{grade}</span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="mb-1 flex items-center gap-2">
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
              />
              <Button size="sm" variant="ghost" onClick={() => void handleRename()}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <p className="text-foreground truncate text-sm font-semibold">
              {record.title ?? 'Intelligence Report'}
            </p>
          )}

          <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
            <span>{date}</span>
            <span className={textColor}>{health}</span>
            <span>Analysis: {latencySec}s</span>
            <span>{record.result.provider}</span>
          </div>

          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
            {record.result.aiSummary}
          </p>

          {/* Completion progress */}
          {record.result.recommendations.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-muted h-1 w-20 overflow-hidden rounded-full">
                <div
                  className="bg-success h-full rounded-full transition-all"
                  style={{
                    width: `${(record.completedRecs.length / record.result.recommendations.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-muted-foreground text-[10px]">
                {record.completedRecs.length}/{record.result.recommendations.length} done
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleFavorite()}
            aria-label={record.isFavorite ? 'Remove favorite' : 'Favorite'}
            className={cn(record.isFavorite && 'text-destructive')}
          >
            <Heart className={cn('h-4 w-4', record.isFavorite && 'fill-current')} />
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link href={`/report/${record.id}`}>Open</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void handleDelete()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
