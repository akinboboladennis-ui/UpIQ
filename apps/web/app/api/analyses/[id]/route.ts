import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

async function buildClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx): Promise<NextResponse> {
  const { id } = await ctx.params
  const supabase = await buildClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // ownership enforced at query level too
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ analysis: data })
}

const PatchSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  is_favorite: z.boolean().optional(),
  completed_recommendations: z.array(z.string()).optional(),
})

export async function PATCH(req: Request, ctx: Ctx): Promise<NextResponse> {
  const { id } = await ctx.params
  const supabase = await buildClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid fields', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('analyses')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, title, is_favorite, completed_recommendations')
    .single()

  if (error || !data)
    return NextResponse.json({ error: 'Not found or update failed' }, { status: 404 })

  return NextResponse.json({ analysis: data })
}

export async function DELETE(_req: Request, ctx: Ctx): Promise<NextResponse> {
  const { id } = await ctx.params
  const supabase = await buildClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('analyses').delete().eq('id', id).eq('user_id', user.id)

  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
