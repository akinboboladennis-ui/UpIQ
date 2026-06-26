// Types
export type {
  ParseInput,
  ProfileHints,
  ParsedProfile,
  ParsedSkill,
  SkillCategory,
  ParsedEmployment,
  ParsedPortfolioItem,
  ParsedReview,
  ReviewSentiment,
  ParsedLanguage,
  LanguageProficiency,
  ParsedCertification,
  ParsedAvailability,
  ProfileSectionKey,
  SectionPresence,
  ProfileMetadata,
  ValidationError,
  ValidationErrorCode,
  ValidationResult,
  ParserWarning,
  ParserWarningCode,
  NormalizedSkillEntry,
  ParseResult,
  ParseFailure,
  ParseOutcome,
  StoredProfileRecord,
} from './types/index.js'

// Parser
export { parseProfile } from './parser/index.js'
export { detectSections } from './parser/section-detector.js'

// Normalizer
export {
  normalizeText,
  normalizeHourlyRate,
  normalizeDate,
  isCurrentDate,
  normalizeUrl,
  normalizeSkill,
  normalizeProficiency,
  normalizeProfile,
} from './normalizer/index.js'

// Validators
export { validateParseInput } from './validators/index.js'

// Services
export { parseAndValidate, buildStoredRecord } from './services/index.js'

// Skill dictionary
export { lookupSkill, allCategories, SKILL_DICTIONARY } from './normalizer/skill-dictionary.js'

// Utils (selected public utilities)
export {
  normalizeWhitespace,
  wordCount,
  fuzzyMatch,
  isValidUrl,
  extractUrls,
} from './utils/index.js'
