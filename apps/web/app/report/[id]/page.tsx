import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { IntelligenceReport } from '@/components/report/IntelligenceReport'
import type { AIAnalysisResult, DimensionScore, Recommendation } from '@/lib/ai/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('analyses')
    .select('title, overall_score')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Report Not Found | UpIQ' }

  const title = data['title'] ?? 'Intelligence Report'
  return {
    title: `${title} (${data['overall_score']}) | UpIQ`,
    description:
      'Your LinkedIn profile intelligence report with scores, recommendations, and career insights.',
  }
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: row, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !row) notFound()

  const scores = (row['scores'] as Record<string, DimensionScore>) ?? {}
  const blankDim: DimensionScore = { score: 0, label: '', rationale: '' }
  const result: AIAnalysisResult = {
    score: {
      overall: Number(row['overall_score'] ?? 0),
      positioning: scores['positioning'] ?? blankDim,
      clarity: scores['clarity'] ?? blankDim,
      authority: scores['authority'] ?? blankDim,
      completeness: scores['completeness'] ?? blankDim,
      marketAlignment: scores['marketAlignment'] ?? blankDim,
    },
    strengths: (row['strengths'] as string[]) ?? [],
    weaknesses: (row['weaknesses'] as string[]) ?? [],
    missingKeywords: (row['missing_keywords'] as string[]) ?? [],
    suggestedTitle: (row['suggestions'] as Record<string, string>)?.['title'] ?? '',
    suggestedOverviewOpener:
      (row['suggestions'] as Record<string, string>)?.['overviewOpener'] ?? '',
    priorityFixes: (row['priority_fixes'] as string[]) ?? [],
    aiSummary: String(row['ai_summary'] ?? ''),
    nextActions: (row['next_actions'] as string[]) ?? [],
    recommendations: (row['recommendations'] as Recommendation[]) ?? [],
    promptVersion: String(row['prompt_version'] ?? ''),
    provider: String(row['provider'] ?? 'claude') as 'claude' | 'openai',
    model: String(row['model'] ?? ''),
    inputTokens: Number(row['input_tokens'] ?? 0),
    outputTokens: Number(row['output_tokens'] ?? 0),
    latencyMs: Number(row['latency_ms'] ?? 0),
  }

  return (
    <IntelligenceReport
      reportId={id}
      result={result}
      createdAt={String(row['created_at'])}
      title={(row['title'] as string | null) ?? null}
      isFavorite={Boolean(row['is_favorite'])}
      completedRecs={(row['completed_recommendations'] as string[]) ?? []}
    />
  )
}
