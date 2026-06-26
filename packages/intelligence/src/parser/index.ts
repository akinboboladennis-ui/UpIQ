import type { ParseInput, ParsedProfile, ParseOutcome, ProfileMetadata } from '../types/index.js'
import { normalizeProfile } from '../normalizer/index.js'
import { wordCount } from '../utils/index.js'
import { detectSections } from './section-detector.js'
import { extractTitle } from './extractors/title.js'
import { extractSkills } from './extractors/skills.js'
import { extractEmployment } from './extractors/employment.js'
import { extractPortfolio } from './extractors/portfolio.js'
import { extractReviews } from './extractors/reviews.js'
import { extractLanguages } from './extractors/languages.js'
import { extractCertifications } from './extractors/certifications.js'
import { extractHourlyRate } from './extractors/rate.js'
import { extractAvailability } from './extractors/availability.js'

const PARSER_VERSION = '1.0.0'

export function parseProfile(input: ParseInput): ParseOutcome {
  const { rawText } = input

  // Detect sections
  const { sections, presence } = detectSections(rawText)

  const warnings: ParsedProfile['metadata']['warnings'] = []

  // Extract each field
  const title = extractTitle(sections.get('title')?.content, rawText)
  const overview = sections.get('overview')?.content?.trim() ?? null

  const skillsContent = sections.get('skills')?.content
  const skills = extractSkills(skillsContent, overview ?? '')

  const employmentContent = sections.get('employment')?.content
  const employment = employmentContent ? extractEmployment(employmentContent) : []

  const portfolioContent = sections.get('portfolio')?.content
  const portfolio = portfolioContent ? extractPortfolio(portfolioContent) : []

  const reviewsContent = sections.get('reviews')?.content
  const reviews = reviewsContent ? extractReviews(reviewsContent) : []

  const languagesContent = sections.get('languages')?.content
  const languages = languagesContent ? extractLanguages(languagesContent) : []

  const certificationsContent = sections.get('certifications')?.content
  const certifications = certificationsContent ? extractCertifications(certificationsContent) : []

  const rateContent = sections.get('hourlyRate')?.content
  const hourlyRateCents = rateContent ? extractHourlyRate(rateContent) : null

  const availabilityContent = sections.get('availability')?.content
  const availability = availabilityContent ? extractAvailability(availabilityContent) : null

  // Completeness scoring
  const completenessScore = computeCompleteness({
    title,
    overview,
    skills,
    employment,
    portfolio,
    reviews,
    languages,
    certifications,
    hourlyRateCents,
    availability,
  })

  // Formatting quality heuristics
  const formattingQuality = assessFormattingQuality(rawText, sections.size)

  // Warn if key sections are missing
  if (!title) warnings.push({ code: 'MISSING_TITLE', message: 'No title or headline detected' })
  if (!overview)
    warnings.push({ code: 'MISSING_OVERVIEW', message: 'No overview or bio section detected' })
  if (skills.length === 0) warnings.push({ code: 'NO_SKILLS', message: 'No skills extracted' })
  if (wordCount(rawText) < 100)
    warnings.push({ code: 'PROFILE_TOO_SHORT', message: 'Profile text is very short' })

  const metadata: ProfileMetadata = {
    parserVersion: PARSER_VERSION,
    parsedAt: new Date().toISOString(),
    wordCount: wordCount(rawText),
    sectionPresence: presence,
    completenessScore,
    formattingQuality,
    warnings,
  }

  const rawParsed: ParsedProfile = {
    title,
    overview,
    skills,
    employment,
    portfolio,
    reviews,
    languages,
    certifications,
    hourlyRateCents,
    availability,
    metadata,
  }

  // Normalize the parsed profile
  const parsed = normalizeProfile(rawParsed)

  return { success: true, parsed }
}

function computeCompleteness(fields: {
  title: string | null
  overview: string | null
  skills: unknown[]
  employment: unknown[]
  portfolio: unknown[]
  reviews: unknown[]
  languages: unknown[]
  certifications: unknown[]
  hourlyRateCents: number | null
  availability: unknown | null
}): number {
  let score = 0
  if (fields.title) score += 10
  if (fields.overview) score += 20
  if (fields.skills.length > 0) score += 15
  if (fields.employment.length > 0) score += 20
  if (fields.portfolio.length > 0) score += 15
  if (fields.reviews.length > 0) score += 10
  if (fields.languages.length > 0) score += 5
  if (fields.certifications.length > 0) score += 3
  if (fields.hourlyRateCents !== null) score += 1
  if (fields.availability !== null) score += 1
  return Math.min(score, 100)
}

function assessFormattingQuality(
  rawText: string,
  sectionsFound: number
): 'poor' | 'fair' | 'good' | 'excellent' {
  let score = 0
  if (sectionsFound >= 4) score += 2
  else if (sectionsFound >= 2) score += 1
  if (/^#+\s/m.test(rawText)) score += 1 // markdown headers
  if (/^[-*•]\s/m.test(rawText)) score += 1 // bullet points
  if (wordCount(rawText) >= 200) score += 1
  if (wordCount(rawText) >= 500) score += 1

  if (score >= 5) return 'excellent'
  if (score >= 3) return 'good'
  if (score >= 1) return 'fair'
  return 'poor'
}
