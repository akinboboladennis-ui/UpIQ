import type { ProfileDraft } from '@upiq/shared'
import {
  PROFILE_ANALYSIS_SYSTEM,
  PROFILE_ANALYSIS_VERSION,
  buildProfileAnalysisPrompt,
} from './prompts/profileAnalysis'
import type { AIMessage } from './types'

export interface BuiltPrompt {
  messages: AIMessage[]
  version: string
}

export class PromptManager {
  buildProfileAnalysis(draft: ProfileDraft): BuiltPrompt {
    // Serialize without internal IDs — the AI doesn't need them.
    const clean = this.sanitizeDraft(draft)
    const profileJson = JSON.stringify(clean, null, 2)

    return {
      messages: [
        { role: 'system', content: PROFILE_ANALYSIS_SYSTEM },
        { role: 'user', content: buildProfileAnalysisPrompt(profileJson) },
      ],
      version: PROFILE_ANALYSIS_VERSION,
    }
  }

  private sanitizeDraft(draft: ProfileDraft): Record<string, unknown> {
    return {
      title: draft.title,
      overview: draft.overview,
      skills: draft.skills,
      hourlyRate: draft.hourlyRate,
      availability: draft.availability,
      employment: draft.employment.map(({ id: _id, ...rest }) => rest),
      portfolio: draft.portfolio.map(({ id: _id, ...rest }) => rest),
      projectCatalog: draft.projectCatalog.map(({ id: _id, ...rest }) => rest),
      reviews: draft.reviews.map(({ id: _id, ...rest }) => rest),
      languages: draft.languages.map(({ id: _id, ...rest }) => rest),
      certifications: draft.certifications.map(({ id: _id, ...rest }) => rest),
    }
  }
}
