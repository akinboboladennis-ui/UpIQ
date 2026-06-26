'use client'

import {
  Award,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  FolderGit2,
  Languages,
  MessageSquareQuote,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react'
import type { AIAnalysisResult } from '@/lib/ai/types'
import { sectionScoreMap, scoreColor, scoreTailwindText } from '@/lib/report/grading'
import { AccordionItem } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

interface SectionBreakdownProps {
  result: AIAnalysisResult
}

interface SectionDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const SECTIONS: SectionDef[] = [
  { key: 'title', label: 'Profile Title', icon: Sparkles },
  { key: 'overview', label: 'Professional Overview', icon: FileText },
  { key: 'skills', label: 'Skills', icon: Tag },
  { key: 'employment', label: 'Employment History', icon: Briefcase },
  { key: 'portfolio', label: 'Portfolio Projects', icon: FolderGit2 },
  { key: 'projectCatalog', label: 'Project Catalog', icon: Star },
  { key: 'reviews', label: 'Client Reviews', icon: MessageSquareQuote },
  { key: 'languages', label: 'Languages', icon: Languages },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'hourlyRate', label: 'Hourly Rate', icon: DollarSign },
  { key: 'availability', label: 'Availability', icon: Clock },
]

function SectionScoreBar({ score }: { score: number }) {
  const color = scoreColor(score)
  return (
    <div className="bg-muted h-1 w-24 overflow-hidden rounded-full">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  )
}

function SectionHeader({ def, score }: { def: SectionDef; score: number }) {
  const Icon = def.icon
  const textColor = scoreTailwindText(score)
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <Icon className="text-muted-foreground h-4 w-4" aria-hidden />
      </div>
      <span className="text-foreground text-sm font-medium">{def.label}</span>
      <div className="ml-auto flex items-center gap-3">
        <SectionScoreBar score={score} />
        <span className={cn('w-7 text-right text-sm font-bold tabular-nums', textColor)}>
          {score}
        </span>
      </div>
    </div>
  )
}

function ItemList({
  label,
  items,
  className,
}: {
  label: string
  items: string[]
  className?: string
}) {
  if (items.length === 0) return null
  return (
    <div>
      <p className={cn('mb-1.5 text-xs font-semibold uppercase tracking-wide', className)}>
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-muted-foreground flex gap-2 text-xs">
            <span className="mt-0.5 shrink-0">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SectionBreakdown({ result }: SectionBreakdownProps) {
  const scores = sectionScoreMap(result)
  const { strengths, weaknesses, priorityFixes, suggestedTitle, suggestedOverviewOpener } = result

  return (
    <section aria-labelledby="section-breakdown-heading" className="space-y-3">
      <h2 id="section-breakdown-heading" className="text-foreground font-semibold">
        Section Breakdown
      </h2>

      {SECTIONS.map((def) => {
        const score = scores[def.key] ?? 0
        return (
          <AccordionItem
            key={def.key}
            className="bg-card"
            headerClassName="hover:bg-accent/30"
            title={<SectionHeader def={def} score={score} />}
          >
            <div className="space-y-4">
              {/* Context-aware content per major sections */}
              {def.key === 'title' && (
                <>
                  <ItemList
                    label="Strengths"
                    items={strengths.slice(0, 2)}
                    className="text-success"
                  />
                  <ItemList
                    label="Weaknesses"
                    items={weaknesses.slice(0, 2)}
                    className="text-destructive"
                  />
                  {suggestedTitle && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wide">
                        Suggested Title
                      </p>
                      <p className="bg-brand-subtle/40 border-brand/20 text-foreground rounded-md border px-3 py-2 text-sm font-medium">
                        {suggestedTitle}
                      </p>
                    </div>
                  )}
                </>
              )}

              {def.key === 'overview' && (
                <>
                  <ItemList
                    label="Strengths"
                    items={strengths.slice(0, 2)}
                    className="text-success"
                  />
                  <ItemList
                    label="Weaknesses"
                    items={weaknesses.slice(0, 2)}
                    className="text-destructive"
                  />
                  {suggestedOverviewOpener && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wide">
                        Suggested Opening
                      </p>
                      <p className="bg-brand-subtle/40 border-brand/20 text-foreground rounded-md border px-3 py-2 text-sm italic leading-relaxed">
                        &ldquo;{suggestedOverviewOpener}&rdquo;
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Default content for all sections */}
              {def.key !== 'title' && def.key !== 'overview' && (
                <>
                  <ItemList
                    label="Strengths"
                    items={strengths.slice(0, 2)}
                    className="text-success"
                  />
                  <ItemList
                    label="Areas to improve"
                    items={weaknesses.slice(0, 2)}
                    className="text-destructive"
                  />
                </>
              )}

              {/* Priority fixes relevant to this section */}
              {priorityFixes.length > 0 && (
                <ItemList
                  label="Quick Wins"
                  items={priorityFixes.slice(0, 2)}
                  className="text-warning"
                />
              )}

              {/* Estimated impact */}
              <p className="text-muted-foreground/60 text-xs">
                Estimated impact on overall score:{' '}
                <span className="font-medium">
                  {score < 60 ? '+8 – +15 pts' : score < 80 ? '+4 – +10 pts' : '+1 – +5 pts'}
                </span>
              </p>
            </div>
          </AccordionItem>
        )
      })}
    </section>
  )
}
