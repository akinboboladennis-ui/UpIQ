/**
 * Profile data model — the structured, AI-ready representation of an Upwork
 * profile collected by the Profile Analyzer. This is the contract consumed by
 * the Sprint 1D AI analysis pipeline.
 */

export type ProfileSectionId =
  | 'title'
  | 'overview'
  | 'skills'
  | 'employment'
  | 'portfolio'
  | 'projectCatalog'
  | 'reviews'
  | 'languages'
  | 'certifications'
  | 'hourlyRate'
  | 'availability'

/** All list-item fields are string-valued, enabling generic editing. */
export interface ProfileListItem {
  id: string
  [key: string]: string
}

export interface EmploymentItem extends ProfileListItem {
  role: string
  company: string
  period: string
  description: string
}

export interface PortfolioItem extends ProfileListItem {
  title: string
  url: string
  description: string
}

export interface CatalogItem extends ProfileListItem {
  title: string
  price: string
  description: string
}

export interface ReviewItem extends ProfileListItem {
  client: string
  rating: string
  feedback: string
}

export interface LanguageItem extends ProfileListItem {
  language: string
  proficiency: string
}

export interface CertificationItem extends ProfileListItem {
  name: string
  issuer: string
  year: string
}

export interface ProfileDraft {
  title: string
  overview: string
  skills: string[]
  employment: EmploymentItem[]
  portfolio: PortfolioItem[]
  projectCatalog: CatalogItem[]
  reviews: ReviewItem[]
  languages: LanguageItem[]
  certifications: CertificationItem[]
  hourlyRate: string
  availability: string
}

export type SectionStatus = 'empty' | 'incomplete' | 'invalid' | 'complete'

export interface SectionValidation {
  status: SectionStatus
  /** Percentage 0-100 of how complete this section is. */
  completion: number
  /** Human-friendly messages surfaced to the user. */
  messages: string[]
}

export type ProfileValidation = Record<ProfileSectionId, SectionValidation>

/** Snapshot persisted to storage for draft restore. */
export interface ProfileDraftSnapshot {
  draft: ProfileDraft
  savedAt: string
}

export function createEmptyProfileDraft(): ProfileDraft {
  return {
    title: '',
    overview: '',
    skills: [],
    employment: [],
    portfolio: [],
    projectCatalog: [],
    reviews: [],
    languages: [],
    certifications: [],
    hourlyRate: '',
    availability: '',
  }
}
