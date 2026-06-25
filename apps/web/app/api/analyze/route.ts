import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import type { ProfileDraft } from '@upiq/shared'
import { AIService } from '@/lib/ai/AIService'
import { ClaudeProvider } from '@/lib/ai/providers/ClaudeProvider'
import { toUserFacingError, logAIError } from '@/lib/ai/ErrorHandler'

// ─── Request validation ───────────────────────────────────────────────────────

const ListItemSchema = z.record(z.string())

const ProfileDraftSchema = z.object({
  title: z.string(),
  overview: z.string(),
  skills: z.array(z.string()),
  hourlyRate: z.string(),
  availability: z.string(),
  employment: z.array(ListItemSchema),
  portfolio: z.array(ListItemSchema),
  projectCatalog: z.array(ListItemSchema),
  reviews: z.array(ListItemSchema),
  languages: z.array(ListItemSchema),
  certifications: z.array(ListItemSchema),
})

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Auth — never trust the client for userId.
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // Route handlers can't set cookies; session is read-only here.
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  // 2. Parse and validate body.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body', code: 'BAD_REQUEST' }, { status: 400 })
  }

  const parsed = ProfileDraftSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid profile data', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  // Cast is safe: Zod validated the shape; the list item types are structurally compatible.
  const draft = parsed.data as unknown as ProfileDraft

  // 3. Initialize AI service (server-side only — key never reaches the client).
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey) {
    logAIError('POST /api/analyze', new Error('ANTHROPIC_API_KEY is not set'))
    return NextResponse.json(
      { error: 'AI service is not configured.', code: 'CONFIG_ERROR' },
      { status: 503 }
    )
  }

  const aiService = new AIService(new ClaudeProvider(apiKey))

  // 4. Run analysis.
  let result
  try {
    result = await aiService.analyzeProfile(draft)
  } catch (err) {
    logAIError('POST /api/analyze', err)
    const userError = toUserFacingError(err)
    return NextResponse.json(
      { error: userError.message, code: userError.code, retryable: userError.retryable },
      { status: userError.retryable ? 503 : 500 }
    )
  }

  // 5. Persist to database.
  const { data: stored, error: dbError } = await supabase
    .from('analyses')
    .insert({
      user_id: user.id,
      draft,
      overall_score: result.score.overall,
      scores: result.score,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      missing_keywords: result.missingKeywords,
      suggestions: {
        title: result.suggestedTitle,
        overviewOpener: result.suggestedOverviewOpener,
      },
      priority_fixes: result.priorityFixes,
      ai_summary: result.aiSummary,
      next_actions: result.nextActions,
      recommendations: result.recommendations,
      prompt_version: result.promptVersion,
      provider: result.provider,
      model: result.model,
      input_tokens: result.inputTokens,
      output_tokens: result.outputTokens,
      latency_ms: result.latencyMs,
    })
    .select('id, created_at')
    .single()

  if (dbError) {
    // Don't fail the whole request if storage fails — return the result but log.
    logAIError('POST /api/analyze: db insert', dbError)
  }

  return NextResponse.json({
    analysisId: stored?.id ?? null,
    createdAt: stored?.created_at ?? new Date().toISOString(),
    result,
  })
}
