import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { validateEnv } from '../../lib/env'

describe('validateEnv', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Clear all monitored env vars before each test
    delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    delete process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
    delete process.env['ANTHROPIC_API_KEY']
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key]
    }
  })

  it('reports missing required vars', () => {
    const result = validateEnv()
    expect(result.valid).toBe(false)
    expect(result.missing.length).toBeGreaterThan(0)
    expect(result.missing.some((m) => m.includes('NEXT_PUBLIC_SUPABASE_URL'))).toBe(true)
  })

  it('reports valid when all required vars are present', () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://test.supabase.co'
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'test-anon-key'
    process.env['ANTHROPIC_API_KEY'] = 'sk-ant-test'

    const result = validateEnv()
    expect(result.valid).toBe(true)
    expect(result.missing).toHaveLength(0)
  })

  it('treats "undefined" string as missing', () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'undefined'
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'test-anon-key'
    process.env['ANTHROPIC_API_KEY'] = 'sk-ant-test'

    const result = validateEnv()
    expect(result.missing.some((m) => m.includes('NEXT_PUBLIC_SUPABASE_URL'))).toBe(true)
  })

  it('treats empty string as missing', () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = ''
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'test-anon-key'
    process.env['ANTHROPIC_API_KEY'] = 'sk-ant-test'

    const result = validateEnv()
    expect(result.missing.some((m) => m.includes('NEXT_PUBLIC_SUPABASE_URL'))).toBe(true)
  })

  it('includes optional vars in warnings (not missing)', () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://test.supabase.co'
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'test-anon-key'
    process.env['ANTHROPIC_API_KEY'] = 'sk-ant-test'

    const result = validateEnv()
    expect(result.valid).toBe(true)
    // Optional vars like Sentry DSN not set → warnings
    expect(result.warnings.some((w) => w.includes('NEXT_PUBLIC_SENTRY_DSN'))).toBe(true)
  })
})
