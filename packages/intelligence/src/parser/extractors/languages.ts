import type { ParsedLanguage, LanguageProficiency } from '../../types/index.js'
import { normalizeProficiency } from '../../normalizer/index.js'
import { toLines, stripBullet, normalizeWhitespace } from '../../utils/index.js'

const KNOWN_LANGUAGES = new Set([
  'english',
  'spanish',
  'french',
  'german',
  'portuguese',
  'italian',
  'dutch',
  'russian',
  'chinese',
  'mandarin',
  'cantonese',
  'japanese',
  'korean',
  'arabic',
  'hindi',
  'bengali',
  'urdu',
  'turkish',
  'polish',
  'swedish',
  'norwegian',
  'danish',
  'finnish',
  'greek',
  'hebrew',
  'persian',
  'farsi',
  'thai',
  'vietnamese',
  'indonesian',
  'malay',
  'tagalog',
  'swahili',
  'hausa',
  'yoruba',
  'amharic',
  'romanian',
  'hungarian',
  'czech',
  'slovak',
  'ukrainian',
  'serbian',
  'croatian',
  'bulgarian',
  'catalan',
  'latvian',
  'lithuanian',
])

const PROFICIENCY_INLINE =
  /[-–:]\s*(native|fluent|conversational|professional|business|basic|elementary|beginner|intermediate|advanced|c2|c1|b2|b1|a2|a1)/i

export function extractLanguages(sectionContent: string): ParsedLanguage[] {
  const lines = toLines(sectionContent)
  const results: ParsedLanguage[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    const stripped = stripBullet(line).trim()
    if (!stripped) continue

    const parsed = parseLanguageLine(stripped)
    if (parsed) {
      const key = parsed.language.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        results.push(parsed)
      }
    }
  }

  return results
}

function parseLanguageLine(line: string): ParsedLanguage | null {
  // Match "Language: Proficiency" or "Language - Proficiency" or "Language (Proficiency)"
  const colonSplit = line.match(/^([A-Za-z\s]+?)\s*[:(]\s*(.+?)(?:\s*\))?$/)
  const dashSplit = line.match(PROFICIENCY_INLINE)

  let language: string | null = null
  let proficiency: LanguageProficiency = 'unknown'

  if (colonSplit?.[1] && colonSplit?.[2]) {
    const candidate = normalizeWhitespace(colonSplit[1]).toLowerCase()
    if (KNOWN_LANGUAGES.has(candidate)) {
      language = titleCase(colonSplit[1].trim())
      proficiency = normalizeProficiency(colonSplit[2])
    }
  } else if (dashSplit) {
    const beforeDash = line.slice(0, line.search(PROFICIENCY_INLINE)).trim()
    const candidate = normalizeWhitespace(beforeDash).toLowerCase()
    if (KNOWN_LANGUAGES.has(candidate)) {
      language = titleCase(beforeDash)
      proficiency = normalizeProficiency(dashSplit[1] ?? '')
    }
  } else {
    // Plain language name only
    const candidate = normalizeWhitespace(line)
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .trim()
    if (KNOWN_LANGUAGES.has(candidate)) {
      language = titleCase(line.trim())
      proficiency = 'unknown'
    }
  }

  if (!language) return null
  return { language, proficiency }
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
