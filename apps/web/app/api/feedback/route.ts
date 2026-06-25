import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, message, rating } = body as Record<string, unknown>

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  const validTypes = ['bug', 'feature', 'general']
  const feedbackType = validTypes.includes(String(type)) ? String(type) : 'general'
  const feedbackRating = typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : null

  const { error } = await supabase.from('feedback').insert({
    user_id: user?.id ?? null,
    type: feedbackType,
    message: message.trim().slice(0, 2000),
    rating: feedbackRating,
  })

  if (error) {
    logger.error('feedback insert failed', { error: error.message })
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
