'use client'

import { useEffect } from 'react'
import type { AIAnalysisResult } from '@/lib/ai/types'
import { useReportStore } from '@/stores/reportStore'
import { ExecutiveSummary } from './ExecutiveSummary'
import { ScoreDashboard } from './ScoreDashboard'
import { SectionBreakdown } from './SectionBreakdown'
import { RecommendationCenter } from './RecommendationCenter'
import { KeywordIntelligence } from './KeywordIntelligence'
import { CareerSummary } from './CareerSummary'
import { ImprovementTimeline } from './ImprovementTimeline'
import { ReportHeader } from './ReportHeader'
import { ReportFooter } from './ReportFooter'

interface IntelligenceReportProps {
  reportId: string
  result: AIAnalysisResult
  createdAt: string
  title: string | null
  isFavorite: boolean
  completedRecs: string[]
}

export function IntelligenceReport({
  reportId,
  result,
  createdAt,
  title,
  isFavorite,
  completedRecs,
}: IntelligenceReportProps) {
  const upsertReport = useReportStore((s) => s.upsertReport)

  // Hydrate store with server-fetched data so client actions work immediately.
  useEffect(() => {
    upsertReport({
      id: reportId,
      title,
      createdAt,
      overallScore: result.score.overall,
      result,
      isFavorite,
      completedRecs,
    })
  }, [reportId, title, createdAt, result, isFavorite, completedRecs, upsertReport])

  // Read live state from store for optimistic UI (header needs isFavorite/title reactively)
  const liveRecord = useReportStore((s) => s.reports[reportId])
  const liveTitle = liveRecord?.title ?? title
  const liveIsFavorite = liveRecord?.isFavorite ?? isFavorite

  return (
    <>
      <ReportHeader
        reportId={reportId}
        title={liveTitle}
        overallScore={result.score.overall}
        isFavorite={liveIsFavorite}
      />

      <main
        id="main-content"
        className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"
        tabIndex={-1}
      >
        {/* 1. Executive Summary */}
        <ExecutiveSummary result={result} createdAt={createdAt} reportTitle={liveTitle} />

        {/* 2. Score Dashboard */}
        <ScoreDashboard score={result.score} />

        {/* 3. Section Breakdown */}
        <SectionBreakdown result={result} />

        {/* 4. Recommendation Roadmap */}
        <RecommendationCenter reportId={reportId} recommendations={result.recommendations} />

        {/* 5. Keyword Intelligence */}
        <KeywordIntelligence result={result} />

        {/* 6. AI Career Summary */}
        <CareerSummary result={result} />

        {/* 7. Improvement Timeline */}
        <ImprovementTimeline result={result} />

        {/* 8. Report Footer */}
        <ReportFooter
          overallScore={result.score.overall}
          createdAt={createdAt}
          provider={result.provider}
          model={result.model}
          promptVersion={result.promptVersion}
          latencyMs={result.latencyMs}
        />
      </main>
    </>
  )
}
