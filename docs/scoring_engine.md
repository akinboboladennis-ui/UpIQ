# Scoring Engine — UpIQ

## Design Philosophy

Scores must be **explainable**. A number without reasoning is marketing, not intelligence. Every score UpIQ produces must be traceable back to specific evidence — what was observed, how it compares to the benchmark, and what the impact of changing it would be.

The scoring engine uses a **hybrid model**: deterministic rules handle objective, measurable dimensions; AI evaluation handles subjective, qualitative dimensions. The two are blended with defined weights.

---

## Score Architecture

Every score in UpIQ follows this structure:

```typescript
interface Score {
  value: number;                // 0–100
  label: ScoreLabel;            // 'needs_work' | 'developing' | 'good' | 'excellent'
  components: ScoreComponent[]; // the sub-scores that make up this score
  evidence: Evidence[];         // the data points that drove this score
  benchmark?: BenchmarkContext; // how this compares to the reference group
}

interface ScoreComponent {
  name: string;
  type: 'deterministic' | 'ai_evaluated';
  weight: number;               // 0.0 to 1.0, weights across components sum to 1.0
  rawValue: number;             // 0–100 before weighting
  weightedValue: number;        // rawValue * weight
  explanation: string;          // human-readable reasoning
}

interface BenchmarkContext {
  referenceGroup: string;       // e.g., "Top 20% earners in Web Development"
  percentile: number;           // user's percentile within reference group
  median: number;               // median score in reference group
}

type ScoreLabel = 'needs_work' | 'developing' | 'good' | 'excellent';
// needs_work: 0–39 | developing: 40–59 | good: 60–79 | excellent: 80–100
```

---

## Profile Scoring Model

The profile score is a weighted composite of five dimension scores.

### Dimension Weights

| Dimension | Weight | Rationale |
|---|---|---|
| Overview | 30% | Highest-impact conversion element; clients read this first |
| Portfolio | 25% | Primary trust signal for creative and technical categories |
| Title | 20% | First impression; searchability |
| Skills | 15% | Affects search visibility and relevance matching |
| Rates | 10% | Positioning signal; less variable than other dimensions |

### Dimension 1: Title Score

**Components:**

| Component | Type | Weight | What is measured |
|---|---|---|---|
| Keyword presence | Deterministic | 35% | Do title keywords appear in top job postings for the category? |
| Specificity | Deterministic | 25% | Is the title specific (mentions niche/tool) vs. generic ("Developer") |
| Length | Deterministic | 15% | 50–80 characters is optimal (too short = generic, too long = truncated) |
| Clarity & positioning | AI-evaluated | 25% | Does the title communicate a clear value proposition? Does it differentiate? |

**Deterministic rules — Keyword Presence:**
```
score = (matched_keywords / top_10_keywords_in_category) * 100

Where top_10_keywords are extracted from the latest MarketProvider signal
for the user's category.
```

**Deterministic rules — Specificity:**
```
If title contains niche_term OR specific_tool: score += 40
If title contains technology_category: score += 20
If title is entirely generic category name: score = 10
If title mentions both specialization AND target_client_type: score += 20 bonus
```

**AI-evaluated — Clarity & Positioning:**
- Prompt asks Claude to evaluate the title as a client would on first impression
- Claude returns a structured score with a 1-3 sentence justification
- Output is validated against the `ScoreComponent` Zod schema

---

### Dimension 2: Overview Score

**Components:**

| Component | Type | Weight | What is measured |
|---|---|---|---|
| Length | Deterministic | 10% | 300–800 words is the optimal range for top earners |
| Keyword coverage | Deterministic | 15% | Coverage of category-relevant keywords |
| Structure | Deterministic | 15% | Has identifiable opening hook, body, and CTA |
| Clarity | AI-evaluated | 20% | Is the writing clear, direct, and free of filler language? |
| Positioning strength | AI-evaluated | 25% | Does it communicate a specific value proposition? |
| Trust signals | AI-evaluated | 15% | Does it include specific outcomes, numbers, or credibility markers? |

**Deterministic rules — Structure:**
```
Has opening hook (first sentence not starting with "I am" or "I have"): +30
Has specific example or proof point in body: +30
Has explicit call-to-action at end: +20
Has paragraph breaks (not a wall of text): +20
```

**AI-evaluated — Trust Signals:**

Claude is asked to identify and count:
- Quantified results ("increased revenue by 40%", "delivered in 3 days")
- Named clients or industries (without requiring confidential disclosure)
- Specific technologies with context (not just lists)
- Process descriptions that show expertise depth

Score is based on count and quality of trust signals relative to overview length.

---

### Dimension 3: Portfolio Score

**Components:**

| Component | Type | Weight | What is measured |
|---|---|---|---|
| Item count | Deterministic | 30% | Number of portfolio items vs. category benchmark |
| Recency | Deterministic | 20% | How recent are the items? (last 2 years preferred) |
| Diversity | Deterministic | 20% | Does the portfolio show range across use cases? |
| Quality signals | AI-evaluated | 30% | Do items have descriptions that communicate outcome and context? |

**Deterministic rules — Item Count:**
```
Items  0: score = 0
Items  1–3: score = 30
Items  4–6: score = 55
Items  7–9: score = 75
Items 10–12: score = 90
Items 13+: score = 100
```
(Calibrated against median portfolio size of top earners in category)

---

### Dimension 4: Skills Score

**Components:**

| Component | Type | Weight | What is measured |
|---|---|---|---|
| Market demand coverage | Deterministic | 45% | % of top-demanded skills in category that the user lists |
| Emerging skill presence | Deterministic | 25% | Does user list any skills flagged as emerging by MarketProvider? |
| Skill count | Deterministic | 15% | Upwork recommends 10–15; too few = invisible, too many = diluted |
| Coherence | AI-evaluated | 15% | Do the skills form a coherent, specialized profile vs. a random list? |

---

### Dimension 5: Rates Score

**Components:**

| Component | Type | Weight | What is measured |
|---|---|---|---|
| Market positioning | Deterministic | 50% | Where does the user's rate fall in the market distribution? |
| JSS alignment | Deterministic | 30% | Is the rate consistent with the user's JSS level? |
| Consistency | Deterministic | 20% | Is the rate consistent with portfolio quality and experience signals? |

**Deterministic rules — Market Positioning:**

The ideal rate position for most freelancers is the 60th–80th percentile of their category (premium, but not outlier).

```
Rate at < p25 (below market):    score = 30 (underpricing signal)
Rate at p25–p50 (below median):  score = 55
Rate at p50–p75 (above median):  score = 80
Rate at p75–p90 (premium):       score = 95
Rate at > p90 (top earner):      score = 100 (only valid if JSS ≥ 95 and reviews ≥ 20)
```

---

## Proposal Scoring Model

### Dimension Weights

| Dimension | Weight | Rationale |
|---|---|---|
| Relevance | 30% | Is this proposal for this job? |
| Specificity | 25% | Does it show real understanding of the project? |
| Social Proof | 20% | Is there a reason to trust this freelancer? |
| Call-to-Action | 15% | Does it drive the client to respond? |
| Tone | 10% | Is the voice professional and confident? |

All five dimensions are primarily AI-evaluated (Claude Opus). Deterministic rules are used for pre-checks only:

**Pre-check rules (applied before AI evaluation):**
```
Proposal length < 100 words: overall score capped at 40
Proposal is identical to a known generic template: relevance = 0
Proposal does not mention the job title or key requirement: relevance -= 20
```

---

## Overall Score Calculation

```
Profile Overall Score =
  (title.score * 0.20) +
  (overview.score * 0.30) +
  (portfolio.score * 0.25) +
  (skills.score * 0.15) +
  (rates.score * 0.10)
```

Scores are always integers (rounded after weighting). Fractional values are never shown to users.

---

## Explainability Requirements

Every dimension score returned to the user must include:

1. The numeric score and label.
2. A list of 1–3 strengths (what is working).
3. A list of 1–3 gaps (what is costing points).
4. For AI-evaluated components: the specific evidence Claude cited in its evaluation.
5. Where applicable: a specific rewrite or action to address the top gap.

A score without this information must not be returned. If Claude fails to produce a structured explanation, the analysis fails and is retried.

---

## Score Stability

Scores must be stable: re-running the same analysis on the same unchanged profile must return the same score (±2 points for AI-evaluated components). This is enforced by:

- Caching analyses for 24 hours.
- Using low-temperature Claude calls for scoring (temperature = 0.1).
- Seeding the benchmark with a fixed reference group snapshot rather than a live query.

---

## Versioning

Every analysis stores the `prompt_version` used. When scoring weights or prompt templates change, the version increments. Old scores are not retroactively updated — users see a "Re-analyze to get updated score" prompt when a new scoring version is available.
