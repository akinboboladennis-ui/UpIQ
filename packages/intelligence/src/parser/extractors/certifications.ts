import type { ParsedCertification } from '../../types/index.js'
import { toLines, stripBullet, normalizeWhitespace } from '../../utils/index.js'

const YEAR_PATTERN = /\b(19|20)\d{2}\b/

const ISSUER_PREFIXES = /\b(?:by|from|issued\s+by|via|through)\s+(.+?)(?:\s*[,.]|$)/i

const KNOWN_ISSUERS = [
  'google',
  'aws',
  'amazon',
  'microsoft',
  'meta',
  'facebook',
  'apple',
  'ibm',
  'coursera',
  'udemy',
  'linkedin',
  'hubspot',
  'salesforce',
  'cisco',
  'comptia',
  'pmi',
  'scrum',
  'scrumalliance',
  'isc2',
  'isaca',
  'oracle',
  'adobe',
]

export function extractCertifications(sectionContent: string): ParsedCertification[] {
  const lines = toLines(sectionContent)
  const results: ParsedCertification[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    const stripped = stripBullet(line).trim()
    if (stripped.length < 5) continue

    const cert = parseCertLine(stripped)
    if (cert) {
      const key = cert.name.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        results.push(cert)
      }
    }
  }

  return results
}

function parseCertLine(line: string): ParsedCertification | null {
  // Extract year
  const yearMatch = line.match(YEAR_PATTERN)
  const year = yearMatch ? parseInt(yearMatch[0], 10) : null

  // Remove year from line for further processing
  const withoutYear = line.replace(YEAR_PATTERN, '').trim()

  // Try to extract issuer via preposition
  let issuer: string | null = null
  const issuerPrefixMatch = withoutYear.match(ISSUER_PREFIXES)
  if (issuerPrefixMatch?.[1]) {
    issuer = normalizeWhitespace(issuerPrefixMatch[1].replace(/[,.]$/, '').trim())
  }

  // Check for known issuers inline
  if (!issuer) {
    const lower = withoutYear.toLowerCase()
    for (const known of KNOWN_ISSUERS) {
      if (lower.includes(known)) {
        issuer = known.charAt(0).toUpperCase() + known.slice(1)
        break
      }
    }
  }

  // The name is what remains after stripping issuer info and year
  let name = withoutYear
  if (issuerPrefixMatch?.[0]) {
    name = name.replace(issuerPrefixMatch[0], '').trim()
  }
  name = name.replace(/[,.-]+$/, '').trim()

  if (name.length < 4) return null

  return {
    name: normalizeWhitespace(name),
    issuer,
    year,
  }
}
