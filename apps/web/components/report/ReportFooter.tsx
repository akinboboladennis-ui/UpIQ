import Link from 'next/link'
import { ArrowRight, GitCompare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReportFooterProps {
  overallScore: number
  createdAt: string
  provider: string
  model: string
  promptVersion: string
  latencyMs: number
}

export function ReportFooter({
  overallScore,
  createdAt,
  provider,
  model,
  promptVersion,
  latencyMs,
}: ReportFooterProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
    new Date(createdAt)
  )

  return (
    <footer className="space-y-6">
      {/* CTAs */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-foreground font-semibold">Ready to improve?</p>
          <p className="text-muted-foreground text-sm">
            Apply these recommendations to push your score above {Math.min(overallScore + 10, 100)}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button asChild size="sm" className="gap-2">
            <Link href="/profile-analyzer">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Improve Profile
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/history">
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              View History
            </Link>
          </Button>
        </div>
      </div>

      {/* Comparison placeholder */}
      <div className="border-border/50 rounded-xl border border-dashed p-6 text-center">
        <GitCompare className="text-muted-foreground mx-auto mb-2 h-6 w-6" aria-hidden />
        <p className="text-foreground text-sm font-semibold">Compare Analyses</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Side-by-side report comparisons are coming in a future sprint.
        </p>
      </div>

      {/* Technical provenance */}
      <div className="text-muted-foreground/50 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
        <span>Analyzed {formattedDate}</span>
        <span>Provider: {provider}</span>
        <span>Model: {model}</span>
        <span>Prompt: {promptVersion}</span>
        <span>Analysis time: {(latencyMs / 1000).toFixed(1)}s</span>
      </div>
    </footer>
  )
}
