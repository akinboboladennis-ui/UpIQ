import { describe, it, expect } from 'vitest'
import { parseProfile } from '../src/parser/index.js'
import { parseAndValidate } from '../src/services/index.js'
import { validateParseInput } from '../src/validators/index.js'

const FULL_PROFILE = `
# Full-Stack Developer | React & Node.js Expert

## Overview
I'm a senior full-stack developer with 8+ years of experience building scalable web applications for SaaS companies. I specialize in React, TypeScript, and Node.js.

## Skills
React, TypeScript, Node.js, PostgreSQL, AWS, Docker, GraphQL, REST APIs, Git

## Work Experience

Senior Software Engineer at Acme Corp
Jan 2020 – Present
Built microservices architecture serving 50,000+ users. Led team of 5 engineers. Improved API response time by 40%.

Full Stack Developer | StartupXYZ
March 2018 – December 2019
Developed React dashboard, Node.js backend, PostgreSQL database. Increased user retention by 25%.

## Portfolio

E-commerce Platform
https://example.com/project1
Built a full e-commerce platform using React and Node.js. Reduced checkout time by 30%. Generated $2M in revenue.

SaaS Analytics Dashboard
Developed real-time analytics dashboard for SaaS startup. Boosted user engagement by 50%.

## Reviews

Jane Smith
5/5 stars
Excellent work! Delivered the project on time and exceeded expectations. Highly recommend for complex React projects. Will hire again.

Bob Johnson
4.5/5 stars
Great developer, very responsive and professional. Delivered high quality code.

## Languages
English: Native
Spanish: Conversational

## Certifications
AWS Certified Solutions Architect by Amazon 2022
Google Cloud Professional Developer 2021

## Hourly Rate
$85/hr

## Availability
Available full-time, 40 hours per week
`

describe('parseProfile', () => {
  it('parses a well-structured profile', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    expect(result.success).toBe(true)
    if (!result.success) return

    const { parsed } = result
    expect(parsed.title).toBeTruthy()
    expect(parsed.overview).toBeTruthy()
    expect(parsed.skills.length).toBeGreaterThan(0)
    expect(parsed.employment.length).toBe(2)
    expect(parsed.portfolio.length).toBe(2)
    expect(parsed.reviews.length).toBe(2)
    expect(parsed.languages.length).toBe(2)
    expect(parsed.certifications.length).toBe(2)
    expect(parsed.hourlyRateCents).toBe(8500)
    expect(parsed.availability?.signal).toBe('full_time')
  })

  it('extracts skills correctly', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    const skillNames = result.parsed.skills.map((s) => s.normalized.toLowerCase())
    expect(skillNames.some((s) => s.includes('react'))).toBe(true)
    expect(skillNames.some((s) => s.includes('typescript'))).toBe(true)
  })

  it('extracts employment with dates', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    const current = result.parsed.employment.find((e) => e.isCurrent)
    expect(current?.role).toBeTruthy()
    expect(current?.isCurrent).toBe(true)
    expect(current?.startDate).toMatch(/2020/)
  })

  it('extracts portfolio metrics', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    const ecommerce = result.parsed.portfolio[0]
    expect(ecommerce?.metrics?.length).toBeGreaterThan(0)
  })

  it('extracts review sentiment', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    const firstReview = result.parsed.reviews[0]
    expect(firstReview?.sentiment).toBe('positive')
  })

  it('infers hourly rate in cents', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    expect(result.parsed.hourlyRateCents).toBe(8500)
  })

  it('computes completeness score', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    expect(result.parsed.metadata.completenessScore).toBeGreaterThan(60)
  })
})

describe('parseProfile — edge cases', () => {
  it('handles unstructured profile without headers', () => {
    const raw = `I am a freelance graphic designer with 5 years of experience. I work with Figma, Adobe Photoshop, and Illustrator. I have worked with clients in the healthcare and marketing sectors.`
    const result = parseProfile({ rawText: raw })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.parsed.overview).toBeTruthy()
  })

  it('handles profile with only skills section', () => {
    const raw = `Skills\nReact, Vue.js, Angular, TypeScript, JavaScript, HTML, CSS, Tailwind CSS`
    const result = parseProfile({ rawText: raw })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.parsed.skills.length).toBeGreaterThan(0)
  })

  it('handles duplicate skills', () => {
    const raw = `## Skills\nReact, React, JavaScript, javascript, JS`
    const result = parseProfile({ rawText: raw })
    if (!result.success) return
    const reactSkills = result.parsed.skills.filter((s) =>
      s.normalized.toLowerCase().includes('react')
    )
    expect(reactSkills.length).toBe(1)
  })

  it('handles mixed formatting (markdown + plain text)', () => {
    const raw = `
John Doe
Senior Backend Engineer

Skills
Node.js | Python | PostgreSQL | Redis | Docker

Experience
Backend Lead at TechCo (2021 - Present)
Built distributed systems handling 1M+ requests per day.

Software Engineer at OldCo (2018 - 2021)
Developed REST APIs using Python and Flask.
`
    const result = parseProfile({ rawText: raw })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.parsed.skills.length).toBeGreaterThan(0)
  })

  it('handles profile with inline rate and no rate section', () => {
    const raw = `I charge $75/hr for my freelance work. I specialize in Python and data analysis.`
    const result = parseProfile({ rawText: raw })
    if (!result.success) return
    expect(result.parsed.hourlyRateCents).toBe(7500)
  })

  it('formats quality is excellent for structured profiles', () => {
    const result = parseProfile({ rawText: FULL_PROFILE })
    if (!result.success) return
    expect(['good', 'excellent']).toContain(result.parsed.metadata.formattingQuality)
  })
})

describe('validateParseInput', () => {
  it('rejects empty input', () => {
    const result = validateParseInput({ rawText: '' })
    expect(result.valid).toBe(false)
    expect(result.errors[0]?.code).toBe('EMPTY_INPUT')
  })

  it('rejects too-short input', () => {
    const result = validateParseInput({ rawText: 'Hello world' })
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.code === 'TOO_SHORT')).toBe(true)
  })

  it('rejects too-long input', () => {
    const result = validateParseInput({ rawText: 'a'.repeat(50_001) })
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.code === 'TOO_LONG')).toBe(true)
  })

  it('accepts valid input', () => {
    const result = validateParseInput({
      rawText:
        'I am a full-stack developer with 5 years of experience building web applications using React and Node.js.',
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

describe('parseAndValidate', () => {
  it('returns failure for invalid input', () => {
    const result = parseAndValidate({ rawText: 'too short' })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('returns success for valid input', () => {
    const result = parseAndValidate({ rawText: FULL_PROFILE })
    expect(result.success).toBe(true)
  })
})
