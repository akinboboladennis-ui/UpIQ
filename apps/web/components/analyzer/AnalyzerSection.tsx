'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Copy, Plus, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import type { ProfileDraft, SectionValidation } from '@upiq/shared'
import type { SectionConfig } from '@/lib/analyzer/sections'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useProfileAnalyzerStore } from '@/stores/profileAnalyzerStore'
import { CharacterCounter } from './CharacterCounter'
import { ValidationBadge } from './ValidationBadge'
import { TagInput } from './TagInput'
import { ListItemEditor } from './ListItemEditor'
import { EmptySectionPlaceholder } from './EmptySectionPlaceholder'

type ListSectionId =
  | 'employment'
  | 'portfolio'
  | 'projectCatalog'
  | 'reviews'
  | 'languages'
  | 'certifications'

interface AnalyzerSectionProps {
  config: SectionConfig
  validation: SectionValidation
  expanded: boolean
  active: boolean
  onFocus: () => void
}

function serializeSection(config: SectionConfig, draft: ProfileDraft): string {
  const value = draft[config.id]
  if (Array.isArray(value)) {
    if (config.id === 'skills') return (value as string[]).join(', ')
    return (value as Array<Record<string, string>>)
      .map((item) =>
        Object.entries(item)
          .filter(([k]) => k !== 'id')
          .map(([, v]) => v)
          .filter(Boolean)
          .join(' · ')
      )
      .join('\n')
  }
  return String(value ?? '')
}

export function AnalyzerSection({
  config,
  validation,
  expanded,
  active,
  onFocus,
}: AnalyzerSectionProps) {
  const draft = useProfileAnalyzerStore((s) => s.draft)
  const toggleSection = useProfileAnalyzerStore((s) => s.toggleSection)
  const setText = useProfileAnalyzerStore((s) => s.setText)
  const addSkill = useProfileAnalyzerStore((s) => s.addSkill)
  const removeSkill = useProfileAnalyzerStore((s) => s.removeSkill)
  const setSkills = useProfileAnalyzerStore((s) => s.setSkills)
  const addItem = useProfileAnalyzerStore((s) => s.addItem)
  const updateItem = useProfileAnalyzerStore((s) => s.updateItem)
  const removeItem = useProfileAnalyzerStore((s) => s.removeItem)
  const resetSection = useProfileAnalyzerStore((s) => s.resetSection)

  const [dragOver, setDragOver] = useState(false)

  const Icon = config.icon

  function handleCopy() {
    const text = serializeSection(config, draft)
    if (!text) {
      toast.error('Nothing to copy yet.')
      return
    }
    void navigator.clipboard.writeText(text)
    toast.success(`${config.label} copied.`)
  }

  function handleReset() {
    resetSection(config.id)
    toast.success(`${config.label} cleared.`)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const text = e.dataTransfer.getData('text')
    if (!text) return
    if (config.kind === 'text' || config.kind === 'textarea') {
      setText(config.id as 'title' | 'overview', text.trim())
      toast.success(`Pasted into ${config.label}.`)
    } else if (config.kind === 'tags') {
      text
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach(addSkill)
    }
  }

  const acceptsDrop = ['text', 'textarea', 'tags'].includes(config.kind)

  // Duplicate skill detection for the tag input.
  const duplicateIndices: number[] = []
  if (config.kind === 'tags') {
    const seen = new Map<string, number>()
    draft.skills.forEach((s, i) => {
      const key = s.trim().toLowerCase()
      if (seen.has(key)) duplicateIndices.push(i)
      else seen.set(key, i)
    })
  }

  return (
    <section
      id={`section-${config.id}`}
      aria-labelledby={`heading-${config.id}`}
      className={cn(
        'bg-card border-border scroll-mt-4 rounded-xl border transition-colors',
        active && 'border-brand/40 ring-brand/10 ring-1',
        dragOver && 'border-brand bg-brand-subtle/20'
      )}
      onFocusCapture={onFocus}
      onDragOver={(e) => {
        if (acceptsDrop) {
          e.preventDefault()
          setDragOver(true)
        }
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={acceptsDrop ? handleDrop : undefined}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => toggleSection(config.id)}
          aria-expanded={expanded}
          aria-controls={`body-${config.id}`}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <Icon className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                id={`heading-${config.id}`}
                className="text-foreground truncate text-sm font-semibold"
              >
                {config.label}
              </h3>
              {config.required && (
                <span className="text-text-tertiary text-[10px] uppercase tracking-wide">
                  Required
                </span>
              )}
            </div>
            <p className="text-muted-foreground truncate text-xs">{config.description}</p>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <ValidationBadge status={validation.status} />
          <span className="text-text-tertiary hidden text-xs tabular-nums sm:inline">
            {validation.completion}%
          </span>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                  aria-label={`Copy ${config.label}`}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy section</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                  aria-label={`Reset ${config.label}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Reset section</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            type="button"
            onClick={() => toggleSection(config.id)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`body-${config.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-border space-y-3 border-t p-4">
              {/* Text / Textarea */}
              {(config.kind === 'text' || config.kind === 'textarea') && (
                <div className="space-y-1.5">
                  {config.kind === 'textarea' ? (
                    <Textarea
                      value={draft[config.id] as string}
                      onChange={(e) => setText(config.id as 'overview', e.target.value)}
                      placeholder={config.placeholder}
                      rows={6}
                    />
                  ) : (
                    <Input
                      value={draft[config.id] as string}
                      onChange={(e) => setText(config.id as 'title', e.target.value)}
                      placeholder={config.placeholder}
                    />
                  )}
                  <div className="flex items-center justify-between">
                    {validation.messages[0] ? (
                      <p className="text-warning text-xs">{validation.messages[0]}</p>
                    ) : (
                      <span />
                    )}
                    <CharacterCounter
                      count={(draft[config.id] as string).length}
                      max={config.maxLength}
                      min={config.minLength}
                    />
                  </div>
                </div>
              )}

              {/* Rate */}
              {config.kind === 'rate' && (
                <div className="space-y-1.5">
                  <div className="relative max-w-[160px]">
                    <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                      $
                    </span>
                    <Input
                      value={draft.hourlyRate}
                      onChange={(e) => setText('hourlyRate', e.target.value)}
                      placeholder={config.placeholder}
                      inputMode="decimal"
                      className="pl-7 pr-12"
                    />
                    <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                      /hr
                    </span>
                  </div>
                  {validation.messages[0] && (
                    <p className="text-destructive text-xs">{validation.messages[0]}</p>
                  )}
                </div>
              )}

              {/* Select */}
              {config.kind === 'select' && (
                <select
                  value={draft.availability}
                  onChange={(e) => setText('availability', e.target.value)}
                  className="border-input bg-background focus-visible:ring-ring h-9 w-full max-w-sm rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
                >
                  <option value="">Select availability…</option>
                  {config.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {/* Tags */}
              {config.kind === 'tags' && (
                <div className="space-y-1.5">
                  <TagInput
                    tags={draft.skills}
                    onAdd={addSkill}
                    onRemove={removeSkill}
                    duplicateIndices={duplicateIndices}
                  />
                  <div className="flex items-center justify-between">
                    {validation.messages[0] ? (
                      <p
                        className={cn(
                          'text-xs',
                          validation.status === 'invalid' ? 'text-destructive' : 'text-warning'
                        )}
                      >
                        {validation.messages[0]}
                      </p>
                    ) : (
                      <span className="text-text-tertiary text-xs">
                        {draft.skills.length} skill{draft.skills.length === 1 ? '' : 's'}
                      </span>
                    )}
                    {draft.skills.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSkills([])}
                        className="text-muted-foreground hover:text-destructive text-xs"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* List */}
              {config.kind === 'list' && (
                <div className="space-y-3">
                  {(draft[config.id] as Array<Record<string, string> & { id: string }>).length ===
                  0 ? (
                    <EmptySectionPlaceholder
                      message={`No ${config.itemNoun}s added yet.`}
                      actionLabel={`Add ${config.itemNoun}`}
                      onAction={() => addItem(config.id as ListSectionId)}
                    />
                  ) : (
                    <>
                      {(draft[config.id] as Array<Record<string, string> & { id: string }>).map(
                        (item, i) => (
                          <ListItemEditor
                            key={item.id}
                            index={i}
                            fields={config.itemFields ?? []}
                            item={item}
                            itemNoun={config.itemNoun ?? 'item'}
                            onChange={(key, value) =>
                              updateItem(config.id as ListSectionId, item.id, key, value)
                            }
                            onRemove={() => removeItem(config.id as ListSectionId, item.id)}
                          />
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => addItem(config.id as ListSectionId)}
                        className="text-primary hover:text-brand-hover inline-flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add another {config.itemNoun}
                      </button>
                      {validation.messages[0] && (
                        <p className="text-destructive text-xs">{validation.messages[0]}</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
