import type { Metadata } from 'next'
import { AnalyzerWorkspace } from '@/components/analyzer/AnalyzerWorkspace'

export const metadata: Metadata = {
  title: 'Profile Analyzer',
}

export default function ProfileAnalyzerPage() {
  return <AnalyzerWorkspace />
}
