'use client'

import { Clock, Gauge, Lightbulb, ShieldCheck, Sparkles } from 'lucide-react'
import type { ProfileSectionId, ProfileValidation } from '@upiq/shared'
import type { ProfileSummary } from '@/lib/analyzer/validation'
import { SECTION_CONFIGS, SECTION_MAP } from '@/lib/analyzer/sections'
import { cn } from '@/lib/utils'
import { ProgressRing } from '@/components/dashboard/ProgressRing'
import { ValidationBadge } from './ValidationBadge'

interface AIAssistantPanelProps {
  summary: ProfileSummary
  validation: ProfileValidation
  activeSection: ProfileSectionId | null
  onJump: (id: ProfileSectionId) => void
}

const qualityMeta: Record<ProfileSummary['quality'], { label: string; color: string }> = {
  low: { label: 'Needs work', color: 'var(--score-needs-work)' },
  fair: { label: 'Developing', color: 'var(--score-developing)' },
  good: { label: 'Good', color: 'var(--score-good)' },
  excellent: { label: 'Excellent', color: 'var(--score-excellent)' },
}

function readinessColor(readiness: number): string {
  if (readiness >= 85) return 'var(--score-excellent)'
  if (readiness >= 65) return 'var(--score-good)'
  if (readiness >= 40) return 'var(--score-developing)'
  return 'var(--score-needs-work)'
}

export function AIAssistantPanel({
  summary,
  validation,
  activeSection,
  onJump,
}: AIAssistantPanelProps) {
  const quality = qualityMeta[summary.quality]
  const tip = activeSection
    ? SECTION_MAP[activeSection].tip
    : 'Adding measurable achievements improves profile quality.'

  return (
    <div className="flex flex-col gap-4">
      {/* Readiness hero */}
      <div className="bg-card border-border rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <h2 className="text-foreground text-sm font-semibold">AI Assistant</h2>
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          Live readiness preview. Analysis runs once you submit.
        </p>

        <div className="mt-4 flex items-center gap-4">
          <ProgressRing
            value={summary.readiness}
            size={88}
            strokeWidth={7}
            color={readinessColor(summary.readiness)}
            label={`${summary.readiness}`}
            sublabel="Ready"
          />
          <div className="flex-1 space-y-2">
            <Metric icon={Gauge} label="Profile completion" value={`${summary.completion}%`} />
            <Metric
              icon={ShieldCheck}
              label="Data quality"
              value={quality.label}
              valueColor={quality.color}
            />
            <Metric
              icon={Clock}
              label="Est. analysis time"
              value={`~${summary.estimatedSeconds}s`}
            />
          </div>
        </div>

        {/* Completion bar */}
        <div className="mt-4">
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.completion}%` }}
            />
          </div>
          <p className="text-text-tertiary mt-1.5 text-xs">
            {summary.completedCount} of {summary.totalCount} sections complete
          </p>
        </div>
      </div>

      {/* Contextual tip */}
      <div className="border-brand/30 bg-brand-subtle/30 rounded-xl border p-4">
        <div className="flex gap-2.5">
          <Lightbulb className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-foreground text-xs font-semibold">Tip</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>

      {/* Section checklist / progress sidebar */}
      <div className="bg-card border-border rounded-xl border p-4">
        <h3 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
          Sections
        </h3>
        <ul className="space-y-0.5">
          {SECTION_CONFIGS.map((cfg) => {
            const v = validation[cfg.id]
            const isActive = activeSection === cfg.id
            return (
              <li key={cfg.id}>
                <button
                  type="button"
                  onClick={() => onJump(cfg.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                    isActive
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                  )}
                >
                  <ValidationBadge status={v.status} />
                  <span className="flex-1 truncate">{cfg.label}</span>
                  {cfg.required && v.status !== 'complete' && (
                    <span className="text-text-tertiary text-[10px]">Required</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
      <span className="text-muted-foreground flex-1 text-xs">{label}</span>
      <span
        className="text-foreground text-xs font-semibold"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  )
}
