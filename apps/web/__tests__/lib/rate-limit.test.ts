import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit, pruneExpiredWindows } from '../../lib/rate-limit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Reset module state between tests by advancing time
    vi.useFakeTimers()
  })

  it('allows requests within the limit', () => {
    const key = `test-allow-${Math.random()}`
    const config = { limit: 3, windowMs: 60_000 }

    const r1 = checkRateLimit(key, config)
    const r2 = checkRateLimit(key, config)
    const r3 = checkRateLimit(key, config)

    expect(r1.success).toBe(true)
    expect(r2.success).toBe(true)
    expect(r3.success).toBe(true)
    expect(r3.remaining).toBe(0)
  })

  it('blocks requests exceeding the limit', () => {
    const key = `test-block-${Math.random()}`
    const config = { limit: 2, windowMs: 60_000 }

    checkRateLimit(key, config)
    checkRateLimit(key, config)
    const r3 = checkRateLimit(key, config)

    expect(r3.success).toBe(false)
    expect(r3.remaining).toBe(0)
  })

  it('resets after the window expires', () => {
    const key = `test-reset-${Math.random()}`
    const config = { limit: 1, windowMs: 1_000 }

    const r1 = checkRateLimit(key, config)
    expect(r1.success).toBe(true)

    const r2 = checkRateLimit(key, config)
    expect(r2.success).toBe(false)

    // Advance time past the window
    vi.advanceTimersByTime(1_001)

    const r3 = checkRateLimit(key, config)
    expect(r3.success).toBe(true)
  })

  it('includes correct headers metadata', () => {
    const key = `test-headers-${Math.random()}`
    const config = { limit: 5, windowMs: 60_000 }

    const result = checkRateLimit(key, config)

    expect(result.remaining).toBe(4)
    expect(result.resetAt).toBeGreaterThan(Date.now())
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('uses separate windows per key', () => {
    const config = { limit: 1, windowMs: 60_000 }
    const keyA = `test-sep-a-${Math.random()}`
    const keyB = `test-sep-b-${Math.random()}`

    checkRateLimit(keyA, config)
    const rA2 = checkRateLimit(keyA, config)
    const rB1 = checkRateLimit(keyB, config)

    expect(rA2.success).toBe(false)
    expect(rB1.success).toBe(true)
  })
})

describe('pruneExpiredWindows', () => {
  it('removes expired entries without throwing', () => {
    vi.useFakeTimers()
    const key = `test-prune-${Math.random()}`
    checkRateLimit(key, { limit: 1, windowMs: 100 })

    vi.advanceTimersByTime(200)
    expect(() => pruneExpiredWindows()).not.toThrow()
    vi.useRealTimers()
  })
})
