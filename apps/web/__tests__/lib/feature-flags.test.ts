import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { isEnabled, getAllFlags } from '../../lib/feature-flags'

describe('isEnabled', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    // Restore env after each test
    Object.assign(process.env, originalEnv)
    // Remove any keys that weren't in original
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete process.env[key]
      }
    }
  })

  it('returns false by default for all flags', () => {
    expect(isEnabled('marketInsights')).toBe(false)
    expect(isEnabled('proposalIntel')).toBe(false)
    expect(isEnabled('compareAnalyses')).toBe(false)
  })

  it('returns true when env var is "true"', () => {
    process.env['NEXT_PUBLIC_FF_MARKET_INSIGHTS'] = 'true'
    expect(isEnabled('marketInsights')).toBe(true)
  })

  it('returns true when env var is "1"', () => {
    process.env['NEXT_PUBLIC_FF_COMPARE_ANALYSES'] = '1'
    expect(isEnabled('compareAnalyses')).toBe(true)
  })

  it('returns false when env var is "false"', () => {
    process.env['NEXT_PUBLIC_FF_SHARE_REPORT'] = 'false'
    expect(isEnabled('shareReport')).toBe(false)
  })

  it('returns false when env var is "0"', () => {
    process.env['NEXT_PUBLIC_FF_EXPORT_PDF'] = '0'
    expect(isEnabled('exportPDF')).toBe(false)
  })

  it('is case-insensitive for "TRUE"', () => {
    process.env['NEXT_PUBLIC_FF_AI_STREAMING'] = 'TRUE'
    expect(isEnabled('aiStreaming')).toBe(true)
  })
})

describe('getAllFlags', () => {
  it('returns an object with all expected flag keys', () => {
    const flags = getAllFlags()
    expect(flags).toHaveProperty('marketInsights')
    expect(flags).toHaveProperty('proposalIntel')
    expect(flags).toHaveProperty('jobMatch')
    expect(flags).toHaveProperty('learningCenter')
    expect(flags).toHaveProperty('compareAnalyses')
    expect(flags).toHaveProperty('shareReport')
    expect(flags).toHaveProperty('exportPDF')
    expect(flags).toHaveProperty('aiStreaming')
  })

  it('returns boolean values for all flags', () => {
    const flags = getAllFlags()
    for (const val of Object.values(flags)) {
      expect(typeof val).toBe('boolean')
    }
  })
})
