import type { AIAnalysisResult, DimensionScore, Recommendation } from './types'

export class JSONValidationError extends Error {
  constructor(
    message: string,
    public readonly raw: string
  ) {
    super(message)
    this.name = 'JSONValidationError'
  }
}

function extractJSON(raw: string): string {
  // Strip markdown code fences if the model wrapped the JSON.
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch?.[1]) return fenceMatch[1].trim()

  // Find the outermost { … } block.
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end > start) return raw.slice(start, end + 1)

  return raw.trim()
}

function assertNumber(val: unknown, path: string): number {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    throw new JSONValidationError(`Expected number at ${path}, got ${typeof val}`, String(val))
  }
  return Math.max(0, Math.min(100, val))
}

function assertString(val: unknown, path: string): string {
  if (typeof val !== 'string') {
    throw new JSONValidationError(`Expected string at ${path}, got ${typeof val}`, String(val))
  }
  return val
}

function assertStringArray(val: unknown, path: string): string[] {
  if (!Array.isArray(val)) {
    throw new JSONValidationError(`Expected array at ${path}`, String(val))
  }
  return val.map((item, i) => assertString(item, `${path}[${i}]`))
}

function parseDimension(val: unknown, path: string): DimensionScore {
  if (typeof val !== 'object' || val === null) {
    throw new JSONValidationError(`Expected object at ${path}`, String(val))
  }
  const d = val as Record<string, unknown>
  return {
    score: assertNumber(d['score'], `${path}.score`),
    label: assertString(d['label'], `${path}.label`),
    rationale: assertString(d['rationale'], `${path}.rationale`),
  }
}

const VALID_PRIORITIES = new Set(['high', 'medium', 'low'])
const VALID_SECTIONS = new Set([
  'title',
  'overview',
  'skills',
  'employment',
  'portfolio',
  'projectCatalog',
  'reviews',
  'languages',
  'certifications',
  'hourlyRate',
  'availability',
  'general',
])

function parseRecommendation(val: unknown, i: number): Recommendation {
  if (typeof val !== 'object' || val === null) {
    throw new JSONValidationError(`recommendations[${i}] must be an object`, String(val))
  }
  const r = val as Record<string, unknown>
  const priority = assertString(r['priority'], `recommendations[${i}].priority`)
  if (!VALID_PRIORITIES.has(priority)) {
    throw new JSONValidationError(
      `Invalid priority "${priority}" at recommendations[${i}]`,
      priority
    )
  }
  const section = assertString(r['section'], `recommendations[${i}].section`)
  if (!VALID_SECTIONS.has(section)) {
    // Fall back to 'general' for unknown sections rather than failing hard.
    r['section'] = 'general'
  }
  return {
    id: assertString(r['id'] ?? `rec-${i}`, `recommendations[${i}].id`),
    priority: priority as Recommendation['priority'],
    section: (VALID_SECTIONS.has(section) ? section : 'general') as Recommendation['section'],
    title: assertString(r['title'], `recommendations[${i}].title`),
    explanation: assertString(r['explanation'], `recommendations[${i}].explanation`),
    whyItMatters: assertString(r['whyItMatters'], `recommendations[${i}].whyItMatters`),
    expectedImpact: assertString(r['expectedImpact'], `recommendations[${i}].expectedImpact`),
    action: assertString(r['action'], `recommendations[${i}].action`),
  }
}

/** Parse and validate a raw AI response string into a typed AIAnalysisResult shape. */
export function parseAIResponse(
  raw: string,
  meta: {
    promptVersion: string
    provider: AIAnalysisResult['provider']
    model: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
  }
): AIAnalysisResult {
  const jsonStr = extractJSON(raw)

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonStr) as Record<string, unknown>
  } catch (e) {
    throw new JSONValidationError(`Failed to parse JSON: ${(e as Error).message}`, raw)
  }

  const scoreObj = parsed['score'] as Record<string, unknown>
  if (typeof scoreObj !== 'object' || scoreObj === null) {
    throw new JSONValidationError('Missing score object', raw)
  }

  const recommendations = Array.isArray(parsed['recommendations'])
    ? (parsed['recommendations'] as unknown[]).map((r, i) => parseRecommendation(r, i))
    : []

  return {
    score: {
      overall: assertNumber(scoreObj['overall'], 'score.overall'),
      positioning: parseDimension(scoreObj['positioning'], 'score.positioning'),
      clarity: parseDimension(scoreObj['clarity'], 'score.clarity'),
      authority: parseDimension(scoreObj['authority'], 'score.authority'),
      completeness: parseDimension(scoreObj['completeness'], 'score.completeness'),
      marketAlignment: parseDimension(scoreObj['marketAlignment'], 'score.marketAlignment'),
    },
    strengths: assertStringArray(parsed['strengths'] ?? [], 'strengths'),
    weaknesses: assertStringArray(parsed['weaknesses'] ?? [], 'weaknesses'),
    missingKeywords: assertStringArray(parsed['missingKeywords'] ?? [], 'missingKeywords'),
    suggestedTitle: assertString(parsed['suggestedTitle'] ?? '', 'suggestedTitle'),
    suggestedOverviewOpener: assertString(
      parsed['suggestedOverviewOpener'] ?? '',
      'suggestedOverviewOpener'
    ),
    priorityFixes: assertStringArray(parsed['priorityFixes'] ?? [], 'priorityFixes'),
    aiSummary: assertString(parsed['aiSummary'] ?? '', 'aiSummary'),
    nextActions: assertStringArray(parsed['nextActions'] ?? [], 'nextActions'),
    recommendations,
    ...meta,
  }
}
