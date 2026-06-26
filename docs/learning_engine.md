# Learning Engine — UpIQ

## Purpose

The Learning Engine is what makes UpIQ's recommendations improve over time. It is a provider-based architecture that ingests data from multiple heterogeneous sources, normalizes it into a common signal format, and feeds those signals into the Recommendation Engine.

The design goal is that **new learning sources can be added without touching the core system**. Adding a new data source means implementing one interface and registering one provider — nothing else changes.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Learning Engine                              │
│                   packages/ai/learning/                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Provider Registry                         │  │
│  │  ProposalProvider | MarketProvider | CommunityProvider       │  │
│  │  ResultsProvider  | ProfileProvider                          │  │
│  └──────────────────────────────┬───────────────────────────────┘  │
│                                  │  LearningSignal[]                │
│  ┌──────────────────────────────▼───────────────────────────────┐  │
│  │                    Signal Normalizer                         │  │
│  │  Validates, deduplicates, weights, and timestamps signals    │  │
│  └──────────────────────────────┬───────────────────────────────┘  │
│                                  │  NormalizedSignal[]              │
│  ┌──────────────────────────────▼───────────────────────────────┐  │
│  │                    Signal Store                              │  │
│  │  Persists to learning_signals table in PostgreSQL            │  │
│  └──────────────────────────────┬───────────────────────────────┘  │
│                                  │                                  │
└──────────────────────────────────┼──────────────────────────────────┘
                                   │
              ┌────────────────────▼───────────────────┐
              │         Recommendation Engine           │
              │  Reads signals, applies user context,   │
              │  generates ranked recommendations       │
              └────────────────────────────────────────┘
```

---

## Core Interfaces

### `LearningProvider`

Every learning source implements this interface.

```typescript
interface LearningProvider {
  readonly name: ProviderName;
  readonly version: string;

  /**
   * Fetch raw data from the source and return normalized signals.
   * Called by the Learning Engine scheduler.
   */
  fetch(context: ProviderContext): Promise<LearningSignal[]>;

  /**
   * Returns true if this provider has new data available since the last run.
   * Used to skip unnecessary fetches.
   */
  hasNewData(lastRunAt: Date): Promise<boolean>;
}
```

### `ProviderContext`

```typescript
interface ProviderContext {
  category?: string;      // Filter signals to a specific category
  userId?: string;        // User-scoped providers receive the user ID
  since?: Date;           // Fetch signals since this timestamp
  limit?: number;         // Max signals to return in one run
}
```

### `LearningSignal`

The raw output of a provider before normalization.

```typescript
interface LearningSignal {
  provider: ProviderName;
  signalType: SignalType;
  category?: string;
  payload: Record<string, unknown>;
  relevance?: number;       // 0.0 to 1.0, provider's confidence in this signal
  sourceUrl?: string;
  capturedAt: Date;
}

type ProviderName =
  | 'proposal'
  | 'market'
  | 'community'
  | 'results'
  | 'profile';

type SignalType =
  | 'proposal_pattern'       // Pattern observed in winning/losing proposals
  | 'market_rate_shift'      // Rate trend change in a category
  | 'skill_demand_change'    // Skill frequency changing
  | 'profile_pattern'        // Pattern in top-performer profiles
  | 'community_insight'      // Validated insight from community discussion
  | 'outcome_correlation'    // User-reported outcome correlated with a recommendation
  | 'niche_emergence';       // New niche appearing in job postings
```

### `NormalizedSignal`

Output after the Signal Normalizer processes raw signals.

```typescript
interface NormalizedSignal {
  id: string;
  provider: ProviderName;
  signalType: SignalType;
  category?: string;
  title: string;            // Human-readable signal summary
  evidence: Evidence[];     // Supporting data points
  weight: number;           // 0.0 to 1.0, composite weight used by Recommendation Engine
  freshness: number;        // 0.0 to 1.0, decays over time
  capturedAt: Date;
  processedAt: Date;
}

interface Evidence {
  type: 'data_point' | 'pattern' | 'quote' | 'statistic';
  value: string;
  source?: string;
}
```

---

## Provider Implementations

### 1. ProposalProvider

**Purpose:** Learn patterns from winning and losing proposals to improve proposal optimization quality.

**Data source:** User-submitted proposals with recorded outcomes (`proposals.outcome` column).

**What it learns:**
- Phrase patterns correlated with shortlisting (e.g., "opening with a specific observation about the job post" is correlated with +23% shortlist rate)
- Structural patterns in high-scoring proposals (e.g., lead with social proof, not with bio)
- Topic-specific patterns (e.g., "for data engineering jobs, mention data volume handled")
- Red flags correlated with rejection (e.g., generic openers, excessive self-focus)

**Signal types generated:** `proposal_pattern`, `outcome_correlation`

**Run frequency:** Daily (on outcome data), real-time (on new submissions)

**Implementation notes:**
- Requires minimum 50 proposals with recorded outcomes before patterns are statistically significant.
- Uses Claude Haiku for batch pattern extraction from proposal text.
- Patterns are weighted by the volume of data supporting them (more outcomes = higher confidence).

```typescript
class ProposalProvider implements LearningProvider {
  readonly name = 'proposal' as const;
  readonly version = '1.0.0';

  async fetch(context: ProviderContext): Promise<LearningSignal[]> {
    // 1. Query proposals with outcomes from the DB
    // 2. Group by outcome type
    // 3. Send batch to Claude Haiku for pattern extraction
    // 4. Return signals with relevance scored by sample size
  }

  async hasNewData(lastRunAt: Date): Promise<boolean> {
    // Check if any new outcomes were recorded since lastRunAt
  }
}
```

---

### 2. MarketProvider

**Purpose:** Learn from the public freelance job market to surface rate trends, skill demand shifts, and emerging niches.

**Data source:** Public Upwork job postings (fetched via Upwork MCP or public search API).

**What it learns:**
- Median rates and rate distribution by category, updated daily
- Which skills appear in job postings and how their frequency is changing week-over-week
- Emerging niches (new categories or sub-specialties appearing with increasing frequency)
- Demand-supply gap indicators (lots of postings, few strong applicants)
- Budget trends (are clients paying more or less for a given category?)

**Signal types generated:** `market_rate_shift`, `skill_demand_change`, `niche_emergence`

**Run frequency:** Daily (market data does not need to be real-time)

**Implementation notes:**
- Fetches a sample of 200–500 recent postings per category per run.
- Uses Claude Haiku for structured extraction of rate, skills, and niche signals.
- Stores raw results in `market_snapshots` before extracting signals.

```typescript
class MarketProvider implements LearningProvider {
  readonly name = 'market' as const;
  readonly version = '1.0.0';

  async fetch(context: ProviderContext): Promise<LearningSignal[]> {
    // 1. Fetch recent job postings for context.category
    // 2. Extract structured signals via Claude Haiku
    // 3. Compare to previous snapshot for trend detection
    // 4. Return signals for significant changes (>10% shift)
  }
}
```

---

### 3. CommunityProvider

**Purpose:** Extract validated insights from freelance community discussions that represent real practitioner experience.

**Data source:** Public freelance community forums and discussions (Reddit r/freelance, Upwork Community forums). Phase 5 feature.

**What it learns:**
- Recurring complaints about client behavior patterns (used to improve proposal red-flag detection)
- Success stories with attributable tactics (e.g., "I increased my rate by 40% by doing X")
- Platform policy changes that affect freelancer strategy
- Category-specific tips that are widely validated by the community

**Signal types generated:** `community_insight`, `proposal_pattern`

**Run frequency:** Weekly (community data changes slowly and noise filtering takes processing time)

**Implementation notes:**
- High signal-to-noise ratio is the critical challenge. Only insights validated by community upvotes/engagement are included.
- Uses Claude Opus for nuanced interpretation of community discussions (not Haiku — this requires judgment about validity).
- Signals from this provider have lower default weight than outcome-based signals (anecdotal vs. empirical).
- Deduplication is essential — the same insight often appears many times across posts.

---

### 4. ResultsProvider

**Purpose:** Learn from the real-world outcomes that users report after taking UpIQ's recommendations.

**Data source:** User-reported outcomes (proposal results, rate increases, shortlist rates).

**What it learns:**
- Which recommendations actually lead to better outcomes
- Which recommendations users act on vs. dismiss (action rate as a proxy for perceived relevance)
- Whether profile changes made after UpIQ recommendations correlate with score improvements
- Category-specific outcome patterns

**Signal types generated:** `outcome_correlation`

**Run frequency:** Continuous (triggered by new outcome reports)

**Implementation notes:**
- This is the highest-value provider — empirical, user-verified, directly correlated with product effectiveness.
- Creates a reinforcement loop: better recommendations → better outcomes → stronger signal → even better recommendations.
- Attribution is challenging (the user may have made other changes). Statistical methods are used to isolate UpIQ's contribution.
- Minimum sample size gates: signals require at least 20 correlated outcomes before being surfaced with high confidence.

---

### 5. ProfileProvider

**Purpose:** Learn from patterns in top-performing freelancer profiles to improve benchmark quality and profile recommendations.

**Data source:** Public Upwork freelancer profiles filtered by high JSS, high earnings, and high review counts.

**What it learns:**
- Title structure patterns that top earners use by category
- Overview length, structure, and narrative patterns of high-performing profiles
- Portfolio item count, type, and presentation patterns
- Skill tag selection strategies
- How top earners position their rates vs. the market median

**Signal types generated:** `profile_pattern`

**Run frequency:** Weekly (profiles change slowly)

**Implementation notes:**
- Top-earner benchmark data is anonymized and aggregated — individual profiles are never surfaced to other users.
- Uses Claude Opus for nuanced profile pattern analysis.
- Generates and stores embeddings of top-earner profiles for similarity search.

---

## Signal Normalizer

The normalizer runs after each provider fetch. Its responsibilities:

1. **Schema validation:** Every signal matches the `LearningSignal` interface.
2. **Deduplication:** Signals within a 24-hour window with the same `provider + signalType + category + payload hash` are deduplicated.
3. **Weight assignment:** Each signal is assigned a weight based on:
   - Provider trust score (empirical providers score higher than anecdotal)
   - Sample size (more data = higher weight)
   - Freshness (signals decay in weight over time — a 90-day-old signal is worth 50% of a fresh one)
   - Relevance score from the provider
4. **Persistence:** Validated signals are written to `learning_signals` with `processed = false`.

---

## Recommendation Engine Integration

The Recommendation Engine reads from `learning_signals` where `processed = false`, applies user context (category, current scores, past recommendations), and produces a ranked `RecommendationSet`.

```typescript
interface RecommendationSet {
  userId: string;
  generatedAt: Date;
  recommendations: Recommendation[];
  signalCount: number;
}

interface Recommendation {
  id: string;
  source: ProviderName;
  signalType: SignalType;
  dimension?: string;
  title: string;
  description: string;
  action?: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  evidence: Evidence[];
  confidence: number;   // 0.0 to 1.0
}
```

---

## Adding a New Provider

1. Create `packages/ai/learning/providers/myProvider.ts` implementing `LearningProvider`.
2. Add the new provider name to the `ProviderName` union type.
3. Add any new signal types to the `SignalType` union type.
4. Register the provider in `packages/ai/learning/registry.ts`.
5. Add a run schedule in the background job configuration.
6. Write a unit test for the provider's `fetch()` method with a mocked data source.

**No other files need to change.** The normalizer, signal store, and recommendation engine are all provider-agnostic.
