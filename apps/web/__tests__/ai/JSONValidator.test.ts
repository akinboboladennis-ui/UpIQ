import { describe, it, expect } from 'vitest'
import { parseAIResponse, JSONValidationError } from '../../lib/ai/JSONValidator'

const META = {
  promptVersion: 'v1.0',
  provider: 'claude' as const,
  model: 'claude-haiku',
  inputTokens: 100,
  outputTokens: 200,
  latencyMs: 800,
}

const VALID_JSON = JSON.stringify({
  score: {
    overall: 72,
    positioning: { score: 75, label: 'Strong', rationale: 'Clear niche.' },
    clarity: { score: 70, label: 'Solid', rationale: 'Well structured.' },
    authority: { score: 68, label: 'Solid', rationale: 'Good portfolio.' },
    completeness: { score: 80, label: 'Strong', rationale: 'Most sections filled.' },
    marketAlignment: { score: 65, label: 'Solid', rationale: 'Skills match demand.' },
  },
  strengths: ['Clear title', 'Good portfolio'],
  weaknesses: ['Thin overview'],
  missingKeywords: ['TypeScript', 'CI/CD'],
  suggestedTitle: 'Senior React Engineer | 5+ Years | Performance Specialist',
  suggestedOverviewOpener: 'I help SaaS teams ship faster React apps.',
  priorityFixes: ['Expand overview', 'Add certifications'],
  aiSummary: 'Solid profile with room to grow.',
  nextActions: ['Add 3 more skills', 'Expand overview to 400+ chars'],
  recommendations: [
    {
      id: 'expand-overview',
      priority: 'high',
      section: 'overview',
      title: 'Expand your overview',
      explanation: 'Current overview is too brief.',
      whyItMatters: 'Clients read overviews carefully.',
      expectedImpact: 'Higher search ranking.',
      action: 'Add 200 more characters with measurable achievements.',
    },
  ],
})

describe('parseAIResponse', () => {
  it('parses a valid JSON response', () => {
    const result = parseAIResponse(VALID_JSON, META)
    expect(result.score.overall).toBe(72)
    expect(result.strengths).toHaveLength(2)
    expect(result.recommendations[0]?.priority).toBe('high')
    expect(result.promptVersion).toBe('v1.0')
  })

  it('strips markdown code fences', () => {
    const wrapped = '```json\n' + VALID_JSON + '\n```'
    const result = parseAIResponse(wrapped, META)
    expect(result.score.overall).toBe(72)
  })

  it('clamps scores to 0-100', () => {
    const json = JSON.parse(VALID_JSON)
    json.score.overall = 150
    json.score.positioning.score = -10
    const result = parseAIResponse(JSON.stringify(json), META)
    expect(result.score.overall).toBe(100)
    expect(result.score.positioning.score).toBe(0)
  })

  it('throws JSONValidationError for invalid JSON', () => {
    expect(() => parseAIResponse('not json at all', META)).toThrow(JSONValidationError)
  })

  it('throws JSONValidationError when score is missing', () => {
    expect(() => parseAIResponse('{"strengths":[]}', META)).toThrow(JSONValidationError)
  })

  it('falls back to general section for unknown section values', () => {
    const json = JSON.parse(VALID_JSON)
    json.recommendations[0].section = 'unknownSection'
    const result = parseAIResponse(JSON.stringify(json), META)
    expect(result.recommendations[0]?.section).toBe('general')
  })

  it('handles empty recommendations array', () => {
    const json = JSON.parse(VALID_JSON)
    json.recommendations = []
    const result = parseAIResponse(JSON.stringify(json), META)
    expect(result.recommendations).toHaveLength(0)
  })
})
