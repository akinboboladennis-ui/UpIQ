// ─── Parser Input ─────────────────────────────────────────────────────────────

export interface ParseInput {
  /** Raw profile text pasted by the user. */
  rawText: string
  /** Optional hints provided by the user during onboarding. */
  hints?: ProfileHints
}

export interface ProfileHints {
  niche?: string
  experienceLevel?: 'new' | 'growing' | 'established' | 'veteran'
  hourlyRate?: number
}

// ─── Core Profile Document ────────────────────────────────────────────────────

/**
 * ParsedProfile is the canonical, normalized output of the parser.
 * Every downstream intelligence engine consumes this shape — nothing
 * touches raw text after the parser runs.
 */
export interface ParsedProfile {
  /** Human-readable job title / professional headline. */
  title: string | null
  /** Full profile overview / bio. */
  overview: string | null
  /** Deduplicated, normalized skill list. */
  skills: ParsedSkill[]
  /** Work history / employment entries. */
  employment: ParsedEmployment[]
  /** Portfolio / project entries. */
  portfolio: ParsedPortfolioItem[]
  /** Client reviews. */
  reviews: ParsedReview[]
  /** Spoken languages with proficiency. */
  languages: ParsedLanguage[]
  /** Professional certifications. */
  certifications: ParsedCertification[]
  /** Hourly rate in USD cents (null = not provided). */
  hourlyRateCents: number | null
  /** Availability signal extracted from text. */
  availability: ParsedAvailability | null
  /** Computed metadata about the profile document. */
  metadata: ProfileMetadata
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'ai_ml'
  | 'automation'
  | 'crm'
  | 'marketing'
  | 'design'
  | 'analytics'
  | 'finance'
  | 'writing'
  | 'pm'
  | 'other'

export interface ParsedSkill {
  /** Exactly as it appeared in the profile text. */
  original: string
  /** Canonical name (e.g. "HighLevel" → "GoHighLevel"). */
  normalized: string
  /** Broad category. */
  category: SkillCategory
  /** Confidence that this is a real skill (0–1). */
  confidence: number
}

// ─── Employment ───────────────────────────────────────────────────────────────

export interface ParsedEmployment {
  role: string | null
  company: string | null
  /** ISO date string or human-readable (e.g. "Jan 2021"). */
  startDate: string | null
  endDate: string | null
  /** true if the position is current. */
  isCurrent: boolean
  description: string | null
  /** Technologies mentioned in the description. */
  technologiesMentioned: string[]
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface ParsedPortfolioItem {
  title: string | null
  industry: string | null
  description: string | null
  technologies: string[]
  /** Quantified business outcome if mentioned (e.g. "40% faster load time"). */
  businessOutcome: string | null
  metrics: string[]
  url: string | null
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export type ReviewSentiment = 'positive' | 'neutral' | 'negative' | 'mixed'

export interface ParsedReview {
  reviewer: string | null
  /** 1–5 star rating if present. */
  rating: number | null
  text: string | null
  sentiment: ReviewSentiment
  /** Recurring themes extracted (e.g. "communication", "speed"). */
  themes: string[]
  /** Trust-indicating phrases (e.g. "would hire again"). */
  trustIndicators: string[]
  positiveStatements: string[]
  negativeStatements: string[]
}

// ─── Languages ───────────────────────────────────────────────────────────────

export type LanguageProficiency = 'native' | 'fluent' | 'conversational' | 'basic' | 'unknown'

export interface ParsedLanguage {
  language: string
  proficiency: LanguageProficiency
}

// ─── Certifications ───────────────────────────────────────────────────────────

export interface ParsedCertification {
  name: string | null
  issuer: string | null
  year: number | null
}

// ─── Availability ─────────────────────────────────────────────────────────────

export type AvailabilitySignal = 'full_time' | 'part_time' | 'limited' | 'unavailable' | 'unknown'

export interface ParsedAvailability {
  signal: AvailabilitySignal
  /** Raw text from which the signal was extracted. */
  sourceText: string
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export type ProfileSectionKey =
  | 'title'
  | 'overview'
  | 'skills'
  | 'employment'
  | 'portfolio'
  | 'reviews'
  | 'languages'
  | 'certifications'
  | 'hourlyRate'
  | 'availability'

export interface SectionPresence {
  detected: boolean
  /** Character offset where the section begins (null if not detected). */
  offset: number | null
  /** Parsing confidence 0–1. */
  confidence: number
}

export interface ProfileMetadata {
  /** Parser version for future-proofing. */
  parserVersion: string
  /** Total raw character count. */
  characterCount: number
  /** Total word count in raw text. */
  wordCount: number
  /** Detected sections and their presence. */
  sections: Record<ProfileSectionKey, SectionPresence>
  /** Sections present in output. */
  detectedSections: ProfileSectionKey[]
  /** Sections we expected but did not find. */
  missingSections: ProfileSectionKey[]
  /** Completeness score 0–100. */
  completeness: number
  /** Detected primary language of the text (ISO 639-1 code). */
  detectedLanguage: string
  /** Rough formatting quality: 'structured' | 'unstructured' | 'mixed'. */
  formattingQuality: 'structured' | 'unstructured' | 'mixed'
  /** Non-fatal warnings generated during parsing. */
  warnings: ParserWarning[]
  /** ISO 8601 timestamp of when parsing occurred. */
  parsedAt: string
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidationErrorCode =
  | 'EMPTY_INPUT'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'UNSUPPORTED_FORMAT'
  | 'NO_RECOGNIZABLE_CONTENT'
  | 'DUPLICATE_SECTIONS'
  | 'MALFORMED_URL'

export interface ValidationError {
  code: ValidationErrorCode
  message: string
  field?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

// ─── Parser Warnings ──────────────────────────────────────────────────────────

export type ParserWarningCode =
  | 'LOW_CONFIDENCE_SECTION'
  | 'OVERLAPPING_SECTIONS'
  | 'TRUNCATED_FIELD'
  | 'UNPARSEABLE_DATE'
  | 'SUSPICIOUS_RATE'
  | 'DUPLICATE_SKILL'
  | 'MALFORMED_URL'
  | 'AMBIGUOUS_SECTION'

export interface ParserWarning {
  code: ParserWarningCode
  message: string
  field?: string
}

// ─── Normalization ────────────────────────────────────────────────────────────

export interface NormalizedSkillEntry {
  original: string
  normalized: string
  aliases: string[]
  category: SkillCategory
}

// ─── Service Layer ────────────────────────────────────────────────────────────

export interface ParseResult {
  success: true
  profile: ParsedProfile
  validation: ValidationResult
}

export interface ParseFailure {
  success: false
  validation: ValidationResult
}

export type ParseOutcome = ParseResult | ParseFailure

// ─── Storage ──────────────────────────────────────────────────────────────────

export interface StoredProfileRecord {
  id: string
  userId: string
  rawText: string
  parsedProfile: ParsedProfile
  parserVersion: string
  createdAt: string
}
