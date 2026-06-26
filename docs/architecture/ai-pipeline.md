# AI Pipeline

## Overview

The AI pipeline is the intelligence core of UpIQ. It is implemented in `packages/ai` and consumed by the API service layer. All AI calls go through Anthropic's Claude API.

## Model Strategy

| Task | Model | Reasoning |
|---|---|---|
| Profile analysis, proposal rewriting | `claude-opus-4-8` | High-stakes, nuanced output |
| Proposal scoring, market trend extraction | `claude-haiku-4-5` | High throughput, cost-efficient |
| Embedding generation | Supabase built-in (pgvector) | Low latency, no external call |

## Pipeline Modules

### 1. Profile Analyzer

**Input:** Raw Upwork profile JSON + benchmark dataset (top earners in the same category).

**Process:**
1. Builds a structured prompt comparing the user's profile across five dimensions: title, overview, portfolio, skills, and rates.
2. Sends to `claude-opus-4-8` with a JSON output schema enforced by Zod.
3. Returns a scored analysis with specific, line-level rewrite suggestions.

**Output schema:**
```typescript
{
  overallScore: number,           // 0-100
  dimensions: {
    title: DimensionScore,
    overview: DimensionScore,
    portfolio: DimensionScore,
    skills: DimensionScore,
    rates: DimensionScore,
  },
  topSuggestions: Suggestion[],   // max 5, ordered by impact
}

type DimensionScore = {
  score: number,
  strengths: string[],
  gaps: string[],
  rewrite?: string,               // direct replacement copy
}
```

### 2. Proposal Optimizer

**Input:** Job posting metadata + user's draft proposal.

**Process:**
1. Extracts key signals from the job post (budget, required skills, client history).
2. Scores the draft proposal on: relevance, specificity, social proof, call-to-action, and tone.
3. Generates a rewritten proposal with inline `<!--reason: ...-->` annotations.

**Output schema:**
```typescript
{
  score: number,                  // 0-100
  dimensions: ProposalDimensions,
  rewrite: string,                // markdown with annotations
  estimatedBidStrength: "low" | "medium" | "high",
}
```

### 3. Market Intelligence Extractor

**Input:** Batch of recent job postings (JSON array, up to 200 items).

**Process:**
1. Passes the batch to `claude-haiku-4-5` with a structured extraction prompt.
2. Extracts: median rates, required skills frequency, emerging skills, red-flag patterns.
3. Aggregated output is stored in `market_snapshots`.

### 4. Positioning Engine

**Input:** User profile + top 10 competitor profiles in the same niche.

**Process:**
1. Claude identifies differentiation vectors not yet claimed by competitors.
2. Suggests a positioning statement and 3 profile angles.

## Prompt Management

All prompts live in `packages/ai/prompts/`. Each prompt file exports:
- A builder function that accepts typed inputs and returns a `MessageParam[]`
- A Zod schema for the expected output
- A model recommendation constant

This keeps prompts testable and diffable in version control.

## Cost Controls

- All AI calls are gated behind a per-user rate limiter (Redis token bucket).
- Opus calls cache results in the DB for 24 hours. Identical inputs return cached output.
- Haiku is used for any task where output quality is "good enough."
- Usage is tracked per user in the `ai_usage` table for billing.

## Error Handling

- All Claude API calls are wrapped in a retry helper with exponential backoff (3 attempts max).
- If Claude returns a malformed JSON response, the pipeline retries once with a stricter prompt.
- On persistent failure, a `503` is returned to the user with a retry-after header.
