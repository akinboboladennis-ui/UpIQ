import type { ParsedSkill } from '../../types/index.js'
import { normalizeSkill } from '../../normalizer/index.js'
import { toLines, stripBullet, deduplicateStrings } from '../../utils/index.js'

/** Delimiters that separate skills on a single line. */
const INLINE_DELIMITERS = /[,|•·\/\\]+/

/**
 * Extract skills from:
 * 1. A dedicated skills section (comma/bullet-delimited)
 * 2. Technology mentions throughout the overview and other sections
 */
export function extractSkills(
  skillsSection: string | undefined,
  supplementaryText = ''
): ParsedSkill[] {
  const rawSkills: string[] = []

  if (skillsSection) {
    const lines = toLines(skillsSection)
    for (const line of lines) {
      const stripped = stripBullet(line)
      // Check if line contains multiple skills delimited by common separators
      if (INLINE_DELIMITERS.test(stripped)) {
        const parts = stripped
          .split(INLINE_DELIMITERS)
          .map((p) => p.trim())
          .filter(Boolean)
        rawSkills.push(...parts)
      } else if (stripped.length > 0 && stripped.length < 60) {
        // Single skill per line
        rawSkills.push(stripped)
      }
    }
  }

  // Deduplicate raw strings before normalizing
  const deduped = deduplicateStrings(rawSkills)

  // Normalize each skill
  const normalized = deduped
    .filter((s) => s.length >= 2 && s.length <= 60)
    .map((s) => normalizeSkill(s))

  // Deduplicate by normalized name
  const seen = new Set<string>()
  return normalized.filter((s) => {
    const key = s.normalized.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
