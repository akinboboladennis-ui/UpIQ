import { BookOpen } from 'lucide-react'
import type { AIAnalysisResult } from '@/lib/ai/types'

interface CareerSummaryProps {
  result: AIAnalysisResult
}

function SummaryBlock({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-widest">
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-foreground/80 flex gap-2 text-sm leading-relaxed">
            <span className="text-primary mt-1 shrink-0 text-xs">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CareerSummary({ result }: CareerSummaryProps) {
  return (
    <section
      aria-labelledby="career-summary-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <BookOpen className="text-primary h-4 w-4" aria-hidden />
        <h2 id="career-summary-heading" className="text-foreground font-semibold">
          AI Career Summary
        </h2>
      </div>

      <div className="space-y-6">
        {/* Full AI narrative */}
        {result.aiSummary && (
          <div className="border-brand/20 bg-brand-subtle/20 rounded-lg border p-4">
            <p className="text-foreground/90 text-sm leading-relaxed">{result.aiSummary}</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <SummaryBlock label="Profile Strengths" items={result.strengths} />
          <SummaryBlock label="Greatest Opportunities" items={result.weaknesses} />
          <SummaryBlock label="Suggested Next Actions" items={result.nextActions.slice(0, 4)} />
          <SummaryBlock label="Priority Fixes" items={result.priorityFixes.slice(0, 3)} />
        </div>
      </div>
    </section>
  )
}
