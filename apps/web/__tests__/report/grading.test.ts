import { describe, it, expect } from 'vitest'
import {
  letterGrade,
  profileHealth,
  scoreColor,
  scoreTailwindText,
  competitivenessLabel,
  marketReadinessLabel,
} from '../../lib/report/grading'

describe('letterGrade', () => {
  it.each([
    [100, 'A+'],
    [95, 'A+'],
    [94, 'A'],
    [90, 'A'],
    [89, 'A-'],
    [85, 'A-'],
    [84, 'B+'],
    [80, 'B+'],
    [79, 'B'],
    [75, 'B'],
    [74, 'B-'],
    [70, 'B-'],
    [69, 'C+'],
    [65, 'C+'],
    [64, 'C'],
    [60, 'C'],
    [59, 'C-'],
    [55, 'C-'],
    [54, 'D'],
    [40, 'D'],
    [39, 'F'],
    [0, 'F'],
  ])('score %i → grade %s', (score, expected) => {
    expect(letterGrade(score)).toBe(expected)
  })
})

describe('profileHealth', () => {
  it.each([
    [85, 'Excellent'],
    [100, 'Excellent'],
    [84, 'Good'],
    [70, 'Good'],
    [69, 'Fair'],
    [50, 'Fair'],
    [49, 'Needs Work'],
    [0, 'Needs Work'],
  ])('score %i → %s', (score, expected) => {
    expect(profileHealth(score)).toBe(expected)
  })
})

describe('scoreColor', () => {
  it('returns excellent token for score >= 85', () => {
    expect(scoreColor(85)).toBe('var(--score-excellent)')
    expect(scoreColor(100)).toBe('var(--score-excellent)')
  })

  it('returns good token for score 70-84', () => {
    expect(scoreColor(70)).toBe('var(--score-good)')
    expect(scoreColor(84)).toBe('var(--score-good)')
  })

  it('returns developing token for score 50-69', () => {
    expect(scoreColor(50)).toBe('var(--score-developing)')
    expect(scoreColor(69)).toBe('var(--score-developing)')
  })

  it('returns needs-work token for score < 50', () => {
    expect(scoreColor(0)).toBe('var(--score-needs-work)')
    expect(scoreColor(49)).toBe('var(--score-needs-work)')
  })
})

describe('scoreTailwindText', () => {
  it('returns success class for score >= 85', () => {
    expect(scoreTailwindText(90)).toBe('text-success')
  })

  it('returns lime class for score 70-84', () => {
    expect(scoreTailwindText(75)).toBe('text-lime-400')
  })

  it('returns warning class for score 50-69', () => {
    expect(scoreTailwindText(55)).toBe('text-warning')
  })

  it('returns destructive class for score < 50', () => {
    expect(scoreTailwindText(30)).toBe('text-destructive')
  })
})

describe('competitivenessLabel', () => {
  it.each([
    [85, 'Highly Competitive'],
    [70, 'Competitive'],
    [55, 'Developing'],
    [40, 'Early Stage'],
    [39, 'Not Competitive'],
  ])('score %i → %s', (score, expected) => {
    expect(competitivenessLabel(score)).toBe(expected)
  })
})

describe('marketReadinessLabel', () => {
  it.each([
    [85, 'Market-Ready'],
    [65, 'Mostly Ready'],
    [45, 'Partially Ready'],
    [44, 'Not Market-Ready'],
  ])('score %i → %s', (score, expected) => {
    expect(marketReadinessLabel(score)).toBe(expected)
  })
})
