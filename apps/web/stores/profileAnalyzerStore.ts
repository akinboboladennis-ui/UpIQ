import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEmptyProfileDraft, type ProfileDraft, type ProfileSectionId } from '@upiq/shared'
import { SECTION_ORDER } from '@/lib/analyzer/sections'

type ListSectionId =
  | 'employment'
  | 'portfolio'
  | 'projectCatalog'
  | 'reviews'
  | 'languages'
  | 'certifications'

type ListItem = Record<string, string> & { id: string }

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

interface ProfileAnalyzerState {
  draft: ProfileDraft
  expanded: Record<ProfileSectionId, boolean>
  savedAt: string | null
  /** A snapshot of the last saved draft, used to detect unsaved changes & restore. */
  restorable: boolean

  // Field setters
  setText: (id: 'title' | 'overview' | 'hourlyRate' | 'availability', value: string) => void

  // Tags (skills)
  addSkill: (skill: string) => void
  removeSkill: (index: number) => void
  setSkills: (skills: string[]) => void

  // List sections
  addItem: (id: ListSectionId) => void
  updateItem: (id: ListSectionId, itemId: string, key: string, value: string) => void
  removeItem: (id: ListSectionId, itemId: string) => void

  // Section ops
  toggleSection: (id: ProfileSectionId) => void
  setExpanded: (id: ProfileSectionId, open: boolean) => void
  expandAll: () => void
  collapseAll: () => void
  resetSection: (id: ProfileSectionId) => void
  clearAll: () => void

  // Draft lifecycle
  markSaved: () => void
  restoreDraft: () => void
  importDraft: (partial: Partial<ProfileDraft>) => void
}

function emptyExpanded(open = true): Record<ProfileSectionId, boolean> {
  return SECTION_ORDER.reduce(
    (acc, id) => {
      acc[id] = open
      return acc
    },
    {} as Record<ProfileSectionId, boolean>
  )
}

const NEW_ITEM_FIELDS: Record<ListSectionId, string[]> = {
  employment: ['role', 'company', 'period', 'description'],
  portfolio: ['title', 'url', 'description'],
  projectCatalog: ['title', 'price', 'description'],
  reviews: ['client', 'rating', 'feedback'],
  languages: ['language', 'proficiency'],
  certifications: ['name', 'issuer', 'year'],
}

function blankItem(id: ListSectionId): ListItem {
  const item: ListItem = { id: uid() }
  for (const key of NEW_ITEM_FIELDS[id]) item[key] = ''
  return item
}

export const useProfileAnalyzerStore = create<ProfileAnalyzerState>()(
  persist(
    (set) => ({
      draft: createEmptyProfileDraft(),
      expanded: emptyExpanded(true),
      savedAt: null,
      restorable: false,

      setText: (id, value) => set((s) => ({ draft: { ...s.draft, [id]: value } })),

      addSkill: (skill) =>
        set((s) => {
          const trimmed = skill.trim()
          if (!trimmed) return s
          return { draft: { ...s.draft, skills: [...s.draft.skills, trimmed] } }
        }),
      removeSkill: (index) =>
        set((s) => ({
          draft: { ...s.draft, skills: s.draft.skills.filter((_, i) => i !== index) },
        })),
      setSkills: (skills) => set((s) => ({ draft: { ...s.draft, skills } })),

      addItem: (id) =>
        set((s) => ({
          draft: {
            ...s.draft,
            [id]: [...(s.draft[id] as ListItem[]), blankItem(id)],
          },
        })),
      updateItem: (id, itemId, key, value) =>
        set((s) => ({
          draft: {
            ...s.draft,
            [id]: (s.draft[id] as ListItem[]).map((item) =>
              item.id === itemId ? { ...item, [key]: value } : item
            ),
          },
        })),
      removeItem: (id, itemId) =>
        set((s) => ({
          draft: {
            ...s.draft,
            [id]: (s.draft[id] as ListItem[]).filter((item) => item.id !== itemId),
          },
        })),

      toggleSection: (id) => set((s) => ({ expanded: { ...s.expanded, [id]: !s.expanded[id] } })),
      setExpanded: (id, open) => set((s) => ({ expanded: { ...s.expanded, [id]: open } })),
      expandAll: () => set({ expanded: emptyExpanded(true) }),
      collapseAll: () => set({ expanded: emptyExpanded(false) }),

      resetSection: (id) =>
        set((s) => {
          const empty = createEmptyProfileDraft()
          return { draft: { ...s.draft, [id]: empty[id] } }
        }),
      clearAll: () => set({ draft: createEmptyProfileDraft(), savedAt: null, restorable: false }),

      markSaved: () => set({ savedAt: new Date().toISOString(), restorable: true }),
      restoreDraft: () => set({ restorable: false }),
      importDraft: (partial) => set((s) => ({ draft: { ...s.draft, ...partial } })),
    }),
    {
      name: 'upiq-profile-draft',
      partialize: (s) => ({ draft: s.draft, savedAt: s.savedAt, expanded: s.expanded }),
    }
  )
)
