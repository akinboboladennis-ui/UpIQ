'use client'

import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'
import type { ProfileDraft, ProfileValidation } from '@upiq/shared'
import { SECTION_MAP } from '@/lib/analyzer/sections'
import { buildRecommendations, type ProfileSummary } from '@/lib/analyzer/validation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ReviewSummaryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: ProfileDraft
  validation: ProfileValidation
  summary: ProfileSummary
  onConfirm: () => void
}

const qualityLabel: Record<ProfileSummary['quality'], string> = {
  low: 'Limited',
  fair: 'Fair',
  good: 'Good',
  excellent: 'Excellent',
}

export function ReviewSummary({
  open,
  onOpenChange,
  draft,
  validation,
  summary,
  onConfirm,
}: ReviewSummaryProps) {
  const recommendations = buildRecommendations(draft, validation, summary)
  const completedSections = summary.completedCount
  const missing = [...summary.requiredMissing, ...summary.invalidSections]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            Review before analysis
          </DialogTitle>
          <DialogDescription>
            Here&apos;s a snapshot of your profile. You can analyze now or keep refining.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Quick metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-bg-surface border-border rounded-lg border p-3 text-center">
              <p className="text-foreground text-lg font-bold">
                {completedSections}/{summary.totalCount}
              </p>
              <p className="text-muted-foreground text-xs">Sections done</p>
            </div>
            <div className="bg-bg-surface border-border rounded-lg border p-3 text-center">
              <p className="text-foreground text-lg font-bold">{summary.readiness}</p>
              <p className="text-muted-foreground text-xs">AI readiness</p>
            </div>
            <div className="bg-bg-surface border-border rounded-lg border p-3 text-center">
              <p className="text-foreground text-lg font-bold">{qualityLabel[summary.quality]}</p>
              <p className="text-muted-foreground text-xs">Est. quality</p>
            </div>
          </div>

          {/* Missing information */}
          {missing.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <AlertTriangle className="text-warning h-3.5 w-3.5" />
                Missing or needs attention
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((id) => (
                  <Badge key={id} variant="warning" className="text-xs">
                    {SECTION_MAP[id].label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Lightbulb className="text-primary h-3.5 w-3.5" />
                Recommendations
              </p>
              <ul className="space-y-1">
                {recommendations.map((rec) => (
                  <li key={rec} className="text-muted-foreground flex gap-2 text-xs">
                    <span className="text-primary mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {missing.length === 0 && recommendations.length === 0 && (
            <div className="border-success/30 bg-success-subtle flex items-center gap-2 rounded-lg border p-3">
              <CheckCircle2 className="text-success h-4 w-4 shrink-0" />
              <p className="text-success text-xs">
                Your profile looks complete and ready for analysis.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep editing
          </Button>
          <Button onClick={onConfirm} className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Analyze profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
