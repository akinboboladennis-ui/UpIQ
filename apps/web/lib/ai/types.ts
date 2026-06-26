import type { ProfileDraft, ProfileSectionId } from '@upiq/shared'

// ─── Provider Interface ──────────────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIRequestOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface AIResponse {
  content: string
  inputTokens: number
  outputTokens: number
  model: string
  provider: AIProviderName
  latencyMs: number
}

export type AIProviderName = 'claude' | 'openai'

export interface AIProvider {
  name: AIProviderName
  complete(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface DimensionScore {
  score: number // 0-100
  label: string
  rationale: string
}

export interface ProfileScore {
  overall: number
  positioning: DimensionScore
  clarity: DimensionScore
  authority: DimensionScore
  completeness: DimensionScore
  marketAlignment: DimensionScore
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export type RecommendationPriority = 'high' | 'medium' | 'low'

export interface Recommendation {
  id: string
  priority: RecommendationPriority
  section: ProfileSectionId | 'general'
  title: string
  explanation: string
  whyItMatters: string
  expectedImpact: string
  action: string
}

// ─── AI Analysis Output ───────────────────────────────────────────────────────

export interface AIAnalysisResult {
  score: ProfileScore
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  suggestedTitle: string
  suggestedOverviewOpener: string
  priorityFixes: string[]
  aiSummary: string
  nextActions: string[]
  recommendations: Recommendation[]
  promptVersion: string
  provider: AIProviderName
  model: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

export interface AnalysisRequest {
  userId: string
  draft: ProfileDraft
}

export interface StoredAnalysis {
  id: string
  userId: string
  draft: ProfileDraft
  result: AIAnalysisResult
  createdAt: string
}
