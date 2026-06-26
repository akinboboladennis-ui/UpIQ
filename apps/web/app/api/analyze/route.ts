import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import type { ProfileDraft } from '@upiq/shared'
import { AIService } from '@/lib/ai/AIService'
import { ClaudeProvider } from '@/lib/ai/providers/ClaudeProvider'
import { toUserFacingError } from '@/lib/ai/ErrorHandler'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/rate-limit'
import { captureError } from '@/lib/monitoring'

// ─── Request validation ───────────────────────────────────────────────────────

const ListItemSchema = z.record(z.string())

const ProfileDraftSchema = z.object({
  title: z.string().max(200),
  overview: z.string().max(5000),
  skills: z.array(z.string().max(100)).max(50),
  hourlyRate: z.string().max(50),
  availability: z.string().max(100),
  employment: z.array(ListItemSchema).max(20),
  portfolio: z.array(ListItemSchema).max(20),
  projectCatalog: z.array(ListItemSchema).max(20),
  reviews: z.array(ListItemSchema).max(50),
  languages: z.array(ListItemSchema).max(20),
  certifications: z.array(ListItemSchema).max(20),
})

/** 512 KB — generous for a profile, prevents payload abuse */
const MAX_BODY_BYTES = 512 * 1024

/** 5 AI analyses per user per 10 minutes */
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  const startMs = Date.now()

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

  // 2. Rate limiting — protect against API cost abuse.
  const rateLimit = checkRateLimit(`analyze:${user.id}`, RATE_LIMIT)
  if (!rateLimit.success) {
    logger.warn('Rate limit exceeded', { userId: user.id, path: '/api/analyze' })
    return NextResponse.json(
      {
        error: 'Too many analysis requests. Please wait a moment before trying again.',
        code: 'RATE_LIMITED',
        retryable: true,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'X-RateLimit-Limit': String(RATE_LIMIT.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      }
    )
  }

  // 3. Request size guard.
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: 'Request body too large.', code: 'PAYLOAD_TOO_LARGE' },
      { status: 413 }
    )
  }

  // 4. Parse and validate body.
  let body: unknown
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request body too large.', code: 'PAYLOAD_TOO_LARGE' },
        { status: 413 }
      )
    }
    body = JSON.parse(text)
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

  // 5. Initialize AI service (server-side only — key never reaches the client).
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey) {
    logger.error('ANTHROPIC_API_KEY is not set', { path: '/api/analyze' })
    return NextResponse.json(
      { error: 'AI service is not configured.', code: 'CONFIG_ERROR' },
      { status: 503 }
    )
  }

  const aiService = new AIService(new ClaudeProvider(apiKey))

  // 6. Run analysis.
  let result
  try {
    result = await aiService.analyzeProfile(draft)
  } catch (err) {
    const userError = toUserFacingError(err)
    logger.ai('error', {
      provider: 'claude',
      error: userError.message,
      userId: user.id,
      latencyMs: Date.now() - startMs,
    })
    captureError(err, { userId: user.id, tags: { path: '/api/analyze' } })
    return NextResponse.json(
      { error: userError.message, code: userError.code, retryable: userError.retryable },
      { status: userError.retryable ? 503 : 500 }
    )
  }

  // 7. Persist to database.
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
    logger.error('DB insert failed after successful AI analysis', {
      userId: user.id,
      error: dbError.message,
    })
    captureError(dbError, { userId: user.id, tags: { path: '/api/analyze', step: 'db_insert' } })
  }

  const durationMs = Date.now() - startMs
  logger.ai('response', {
    provider: result.provider,
    model: result.model,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    latencyMs: result.latencyMs,
    userId: user.id,
  })
  logger.api({
    method: 'POST',
    path: '/api/analyze',
    status: 200,
    durationMs,
    userId: user.id,
  })

  return NextResponse.json({
    analysisId: stored?.id ?? null,
    createdAt: stored?.created_at ?? new Date().toISOString(),
    result,
  })
}
