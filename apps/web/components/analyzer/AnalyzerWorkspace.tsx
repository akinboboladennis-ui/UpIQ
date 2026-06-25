'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronsDownUp, ChevronsUpDown, ClipboardPaste, Eraser, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import type { ProfileSectionId } from '@upiq/shared'
import { SECTION_CONFIGS } from '@/lib/analyzer/sections'
import { summarizeProfile, validateProfile } from '@/lib/analyzer/validation'
import { useProfileAnalyzerStore } from '@/stores/profileAnalyzerStore'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Button } from '@/components/ui/button'
import { AnalyzerSection } from './AnalyzerSection'
import { AIAssistantPanel } from './AIAssistantPanel'
import { DraftStatus } from './DraftStatus'
import { ReviewSummary } from './ReviewSummary'
import { PasteImportDialog } from './PasteImportDialog'

export function AnalyzerWorkspace() {
  const draft = useProfileAnalyzerStore((s) => s.draft)
  const expanded = useProfileAnalyzerStore((s) => s.expanded)
  const savedAt = useProfileAnalyzerStore((s) => s.savedAt)
  const markSaved = useProfileAnalyzerStore((s) => s.markSaved)
  const expandAll = useProfileAnalyzerStore((s) => s.expandAll)
  const collapseAll = useProfileAnalyzerStore((s) => s.collapseAll)
  const clearAll = useProfileAnalyzerStore((s) => s.clearAll)
  const setExpanded = useProfileAnalyzerStore((s) => s.setExpanded)
  const importDraft = useProfileAnalyzerStore((s) => s.importDraft)
  const setAnalysisLoading = useProfileAnalyzerStore((s) => s.setAnalysisLoading)
  const setAnalysisSuccess = useProfileAnalyzerStore((s) => s.setAnalysisSuccess)
  const setAnalysisError = useProfileAnalyzerStore((s) => s.setAnalysisError)
  const analysisStatus = useProfileAnalyzerStore((s) => s.analysisStatus)

  const [activeSection, setActiveSection] = useState<ProfileSectionId | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [pasteOpen, setPasteOpen] = useState(false)
  const restoreNotified = useRef(false)

  const validation = useMemo(() => validateProfile(draft), [draft])
  const summary = useMemo(() => summarizeProfile(draft, validation), [draft, validation])

  const { status: saveStatus } = useAutoSave({
    value: draft,
    onSave: markSaved,
  })

  // Notify once if a previously-saved draft was restored from storage.
  useEffect(() => {
    if (restoreNotified.current) return
    restoreNotified.current = true
    if (savedAt) {
      toast.info('Draft restored from your last session.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function jumpToSection(id: ProfileSectionId) {
    setExpanded(id, true)
    setActiveSection(id)
    requestAnimationFrame(() => {
      document
        .getElementById(`section-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleAnalyze = useCallback(async () => {
    setReviewOpen(false)
    setAnalysisLoading()
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const data = (await res.json()) as {
        analysisId: string | null
        createdAt: string
        result?: import('@/lib/ai/types').AIAnalysisResult
        error?: string
        retryable?: boolean
      }
      if (!res.ok || !data.result) {
        setAnalysisError(data.error ?? 'Analysis failed. Please try again.', data.retryable ?? true)
        toast.error(data.error ?? 'Analysis failed.', { description: 'Please try again.' })
        return
      }
      setAnalysisSuccess(data.result, data.analysisId, data.createdAt)
      toast.success('Analysis complete!', {
        description: `Your profile scored ${data.result.score.overall}/100.`,
      })
    } catch {
      const message = 'Network error. Please check your connection and try again.'
      setAnalysisError(message, true)
      toast.error('Could not reach the AI service.', { description: message })
    }
  }, [draft, setAnalysisLoading, setAnalysisSuccess, setAnalysisError])

  function handleClearAll() {
    if (window.confirm('Clear all sections? This cannot be undone.')) {
      clearAll()
      toast.success('All sections cleared.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Sparkles className="text-primary h-5 w-5" />
            Profile Analyzer
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Build your profile section by section. We&apos;ll prepare it for AI analysis.
          </p>
        </div>
        <DraftStatus status={saveStatus} savedAt={savedAt} className="shrink-0 sm:mt-1" />
      </div>

      {/* Toolbar */}
      <div className="border-border flex flex-wrap items-center gap-2 border-y py-2.5">
        <Button variant="outline" size="sm" onClick={() => setPasteOpen(true)} className="gap-1.5">
          <ClipboardPaste className="h-3.5 w-3.5" />
          Paste full profile
        </Button>
        <Button variant="ghost" size="sm" onClick={expandAll} className="gap-1.5">
          <ChevronsUpDown className="h-3.5 w-3.5" />
          Expand all
        </Button>
        <Button variant="ghost" size="sm" onClick={collapseAll} className="gap-1.5">
          <ChevronsDownUp className="h-3.5 w-3.5" />
          Collapse all
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-muted-foreground hover:text-destructive ml-auto gap-1.5"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear all
        </Button>
      </div>

      {/* Two-panel workspace */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: input workspace */}
        <div className="space-y-3">
          {SECTION_CONFIGS.map((cfg) => (
            <AnalyzerSection
              key={cfg.id}
              config={cfg}
              validation={validation[cfg.id]}
              expanded={expanded[cfg.id]}
              active={activeSection === cfg.id}
              onFocus={() => setActiveSection(cfg.id)}
            />
          ))}

          {/* Submit */}
          <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-foreground text-sm font-semibold">Ready to analyze?</p>
              <p className="text-muted-foreground text-xs">
                Review your profile before sending it for AI analysis.
              </p>
            </div>
            <Button onClick={() => setReviewOpen(true)} className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Review &amp; analyze
            </Button>
          </div>
        </div>

        {/* Right: AI assistant preview (sticky on desktop) */}
        <aside className="lg:sticky lg:top-4 lg:h-fit">
          <AIAssistantPanel
            summary={summary}
            validation={validation}
            activeSection={activeSection}
            onJump={jumpToSection}
          />
        </aside>
      </div>

      <ReviewSummary
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        draft={draft}
        validation={validation}
        summary={summary}
        onConfirm={handleAnalyze}
        analyzing={analysisStatus === 'loading'}
      />

      <PasteImportDialog open={pasteOpen} onOpenChange={setPasteOpen} onImport={importDraft} />
    </div>
  )
}
