import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { parseAndValidate } from '@upiq/intelligence'

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()

    if (
      !body ||
      typeof body !== 'object' ||
      !('rawText' in body) ||
      typeof (body as Record<string, unknown>).rawText !== 'string'
    ) {
      return NextResponse.json({ error: 'rawText is required' }, { status: 400 })
    }

    const rawText = (body as { rawText: string }).rawText

    // Parse and validate
    const outcome = parseAndValidate({ rawText })

    if (!outcome.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: outcome.errors },
        { status: 422 }
      )
    }

    // Optionally persist if user is authenticated
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    let savedId: string | null = null

    if (user) {
      const { data, error } = await supabase
        .from('parsed_profiles')
        .insert({
          user_id: user.id,
          raw_text: rawText,
          parsed_data: outcome.parsed,
          parser_version: outcome.parsed.metadata.parserVersion,
        })
        .select('id')
        .single()

      if (!error && data) {
        savedId = (data as { id: string }).id
      }
    }

    return NextResponse.json({
      success: true,
      id: savedId,
      parsed: outcome.parsed,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
