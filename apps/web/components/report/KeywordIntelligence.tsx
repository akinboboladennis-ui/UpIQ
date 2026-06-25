'use client'

import { Check, Copy, Tag, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import type { AIAnalysisResult } from '@/lib/ai/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface KeywordIntelligenceProps {
  result: AIAnalysisResult
}

function KeywordChip({
  word,
  variant,
}: {
  word: string
  variant: 'present' | 'missing' | 'trending'
}) {
  const styles = {
    present: 'bg-success/10 text-success border-success/20',
    missing: 'bg-destructive/10 text-destructive border-destructive/20',
    trending: 'bg-info/10 text-info border-info/20',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        styles[variant]
      )}
    >
      {word}
    </span>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
      {copied ? <Check className="text-success h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </Button>
  )
}

export function KeywordIntelligence({ result }: KeywordIntelligenceProps) {
  const missing = result.missingKeywords
  const missingText = missing.join(', ')
  const detected: string[] = []

  return (
    <section
      aria-labelledby="keyword-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="text-primary h-4 w-4" aria-hidden />
          <h2 id="keyword-heading" className="text-foreground font-semibold">
            Keyword Intelligence
          </h2>
        </div>
        {missing.length > 0 && <CopyButton text={missingText} label="Copy missing keywords" />}
      </div>

      <div className="space-y-5">
        {/* Missing keywords — most actionable, shown first */}
        {missing.length > 0 && (
          <div>
            <p className="text-destructive mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
              <span className="bg-destructive/20 rounded-full px-1.5 py-0.5">{missing.length}</span>
              Missing Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {missing.map((kw) => (
                <KeywordChip key={kw} word={kw} variant="missing" />
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              These terms appear in client searches but are absent from your profile. Adding them
              can improve your search ranking.
            </p>
          </div>
        )}

        {/* Detected keywords */}
        {detected.length > 0 && (
          <div>
            <p className="text-success mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
              <span className="bg-success/20 rounded-full px-1.5 py-0.5">{detected.length}</span>
              Detected Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {detected.map((kw) => (
                <KeywordChip key={kw} word={kw} variant="present" />
              ))}
            </div>
          </div>
        )}

        {/* Trending — placeholder */}
        <div className="border-border border-t pt-4">
          <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            Trending Keywords
            <span className="bg-muted rounded-full px-1.5 py-0.5 text-[10px]">Coming Soon</span>
          </p>
          <p className="text-muted-foreground text-xs">
            Live keyword trend data will appear here in Sprint Market.
          </p>
        </div>
      </div>
    </section>
  )
}
