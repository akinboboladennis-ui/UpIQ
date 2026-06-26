import { describe, it, expect } from 'vitest'
import {
  normalizeText,
  normalizeHourlyRate,
  normalizeDate,
  isCurrentDate,
  normalizeSkill,
  normalizeProficiency,
} from '../src/normalizer/index.js'
import { fuzzyMatch } from '../src/utils/index.js'
import { lookupSkill } from '../src/normalizer/skill-dictionary.js'

describe('normalizeText', () => {
  it('normalizes curly quotes', () => {
    expect(normalizeText('‘hello’')).toBe("'hello'")
    expect(normalizeText('“hello”')).toBe('"hello"')
  })

  it('normalizes em-dashes', () => {
    expect(normalizeText('one—two')).toBe('one - two')
  })

  it('collapses whitespace', () => {
    expect(normalizeText('  hello   world  ')).toBe('hello world')
  })
})

describe('normalizeHourlyRate', () => {
  it('parses $85/hr', () => expect(normalizeHourlyRate('$85/hr')).toBe(8500))
  it('parses $100/hour', () => expect(normalizeHourlyRate('$100/hour')).toBe(10000))
  it('parses 75', () => expect(normalizeHourlyRate('75')).toBe(7500))
  it('parses $50.50', () => expect(normalizeHourlyRate('$50.50')).toBe(5050))
  it('rejects $10001/hr', () => expect(normalizeHourlyRate('$10001/hr')).toBeNull())
  it('rejects non-numeric', () => expect(normalizeHourlyRate('not a rate')).toBeNull())
})

describe('normalizeDate', () => {
  it('parses Jan 2022', () => expect(normalizeDate('Jan 2022')).toBe('2022-01'))
  it('parses January 2022', () => expect(normalizeDate('January 2022')).toBe('2022-01'))
  it('parses 2022-01', () => expect(normalizeDate('2022-01')).toBe('2022-01'))
  it('parses 01/2022', () => expect(normalizeDate('01/2022')).toBe('2022-01'))
  it('parses 2022', () => expect(normalizeDate('2022')).toBe('2022'))
  it('returns null for garbage', () => expect(normalizeDate('not a date')).toBeNull())
})

describe('isCurrentDate', () => {
  it('detects present', () => expect(isCurrentDate('present')).toBe(true))
  it('detects current', () => expect(isCurrentDate('current')).toBe(true))
  it('detects now', () => expect(isCurrentDate('now')).toBe(true))
  it('detects ongoing', () => expect(isCurrentDate('ongoing')).toBe(true))
  it('rejects 2022', () => expect(isCurrentDate('2022')).toBe(false))
})

describe('normalizeSkill', () => {
  it('normalizes exact match', () => {
    const s = normalizeSkill('React')
    expect(s.normalized).toBe('React')
    expect(s.confidence).toBeGreaterThanOrEqual(0.95)
  })

  it('normalizes alias', () => {
    const s = normalizeSkill('reactjs')
    expect(s.normalized).toBe('React')
  })

  it('normalizes GoHighLevel alias', () => {
    const s = normalizeSkill('go high level')
    expect(s.normalized).toBe('GoHighLevel')
  })

  it('handles unknown skill', () => {
    const s = normalizeSkill('MyCustomTool2024')
    expect(s.normalized).toBe('MyCustomTool2024')
    expect(s.category).toBeDefined()
  })
})

describe('normalizeProficiency', () => {
  it('detects native', () => expect(normalizeProficiency('native')).toBe('native'))
  it('detects fluent', () => expect(normalizeProficiency('fluent')).toBe('fluent'))
  it('detects C2', () => expect(normalizeProficiency('C2')).toBe('native'))
  it('detects B2', () => expect(normalizeProficiency('B2')).toBe('fluent'))
  it('detects B1', () => expect(normalizeProficiency('B1')).toBe('conversational'))
  it('detects A1', () => expect(normalizeProficiency('A1')).toBe('basic'))
  it('returns unknown for garbage', () => expect(normalizeProficiency('xyz')).toBe('unknown'))
})

describe('lookupSkill', () => {
  it('finds React by exact name', () => expect(lookupSkill('React')?.normalized).toBe('React'))
  it('finds React by alias reactjs', () => expect(lookupSkill('reactjs')?.normalized).toBe('React'))
  it('returns null for unknown', () => expect(lookupSkill('NotARealSkill12345')).toBeNull())
})

describe('fuzzyMatch', () => {
  it('finds identical string', () => expect(fuzzyMatch('react', ['react'], 0.9)).toBe('react'))
  it('finds similar string above threshold', () =>
    expect(fuzzyMatch('reactjs', ['React', 'Vue', 'Angular'], 0.3)).not.toBeNull())
  it('returns null for dissimilar strings', () =>
    expect(fuzzyMatch('python', ['react', 'angular', 'vue'], 0.7)).toBeNull())
})
