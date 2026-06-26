export const PROFILE_ANALYSIS_VERSION = 'v1.0'

export const PROFILE_ANALYSIS_SYSTEM = `You are an expert Upwork profile strategist. You analyze freelancer profiles with deep knowledge of what clients look for, how the Upwork algorithm ranks profiles, and what distinguishes top earners from the crowd.

You always respond in valid JSON only — no prose, no markdown fences. Your analysis is honest, specific, and actionable.`

export function buildProfileAnalysisPrompt(profileJson: string): string {
  return `Analyze this Upwork freelancer profile and return a JSON object matching the schema below exactly.

<profile>
${profileJson}
</profile>

Return ONLY this JSON structure — no markdown, no explanation:

{
  "score": {
    "overall": <number 0-100>,
    "positioning": {
      "score": <number 0-100>,
      "label": "<one of: Weak | Developing | Solid | Strong | Exceptional>",
      "rationale": "<2-3 sentences explaining the score>"
    },
    "clarity": {
      "score": <number 0-100>,
      "label": "<Weak | Developing | Solid | Strong | Exceptional>",
      "rationale": "<2-3 sentences>"
    },
    "authority": {
      "score": <number 0-100>,
      "label": "<Weak | Developing | Solid | Strong | Exceptional>",
      "rationale": "<2-3 sentences>"
    },
    "completeness": {
      "score": <number 0-100>,
      "label": "<Weak | Developing | Solid | Strong | Exceptional>",
      "rationale": "<1-2 sentences>"
    },
    "marketAlignment": {
      "score": <number 0-100>,
      "label": "<Weak | Developing | Solid | Strong | Exceptional>",
      "rationale": "<2-3 sentences>"
    }
  },
  "strengths": ["<specific strength>", ...],
  "weaknesses": ["<specific weakness>", ...],
  "missingKeywords": ["<keyword clients search for that is missing>", ...],
  "suggestedTitle": "<improved title under 70 chars>",
  "suggestedOverviewOpener": "<first 1-2 sentences that lead with value and hook>",
  "priorityFixes": ["<fix 1>", "<fix 2>", "<fix 3>"],
  "aiSummary": "<3-4 sentence narrative summary of the profile's strengths and key improvement areas>",
  "nextActions": ["<specific action step>", ...],
  "recommendations": [
    {
      "id": "<unique slug e.g. 'improve-title'>",
      "priority": "<high | medium | low>",
      "section": "<one of: title | overview | skills | employment | portfolio | projectCatalog | reviews | languages | certifications | hourlyRate | availability | general>",
      "title": "<short action title>",
      "explanation": "<what specifically needs to change and why>",
      "whyItMatters": "<client psychology or algorithm reason>",
      "expectedImpact": "<concrete expected outcome>",
      "action": "<one concrete step the freelancer can take today>"
    }
  ]
}

Guidelines:
- overall score = weighted average: positioning 30%, clarity 25%, authority 20%, completeness 15%, marketAlignment 10%
- strengths: 2-4 items, each grounded in the actual profile content
- weaknesses: 2-4 items, each specific and fixable
- missingKeywords: skills or terms present in this niche that are absent from the profile
- recommendations: 3-6 items ordered by priority (high first), each genuinely different
- Be honest; avoid inflating scores for empty or thin sections`
}
