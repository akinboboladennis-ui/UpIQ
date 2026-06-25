# API Specification — UpIQ

## Overview

The UpIQ API is a REST-style JSON API served by the Hono framework on Node.js.

**Base URL:** `https://api.upiq.app/v1`  
**Local:** `http://localhost:3001/v1`

**Version:** `v1` (current)  
**Content-Type:** `application/json`

---

## Authentication

All endpoints (except `/health`) require a valid Supabase JWT in the `Authorization` header.

```
Authorization: Bearer <supabase_access_token>
```

Tokens are obtained by authenticating through the Supabase client in the frontend. Tokens expire after 1 hour; the client is responsible for refreshing them.

---

## Response Envelope

### Success

```json
{
  "data": { ... }
}
```

### Error

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message.",
    "status": 400,
    "details": { }
  }
}
```

### Paginated Response

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 84,
    "hasMore": true
  }
}
```

---

## Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `UNAUTHENTICATED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Authenticated but not authorized for this resource |
| `NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 400 | Request body or params failed Zod validation |
| `RATE_LIMITED` | 429 | Per-user quota exceeded |
| `AI_UNAVAILABLE` | 503 | AI provider returned an error after retries |
| `PROFILE_NOT_FOUND` | 404 | User has no connected profile |
| `ANALYSIS_IN_PROGRESS` | 409 | An analysis is already running for this user |

---

## Endpoints

---

### Health

#### `GET /health`

Returns server health status. No authentication required.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Authentication

Authentication is handled entirely by Supabase Auth on the client side. The API does not issue tokens — it only validates them. The following endpoints exist for server-side session management.

#### `POST /auth/verify`

Validates a JWT and returns the decoded user payload. Used by the frontend to confirm token validity on page load.

**Request:**
```json
{
  "token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Profiles

#### `GET /profiles/me`

Returns the authenticated user's stored profile.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "upworkUrl": "https://www.upwork.com/freelancers/~...",
    "displayName": "Jane Smith",
    "title": "Full-Stack Developer | React & Node.js",
    "category": "web-development",
    "hourlyRate": 85.00,
    "jobSuccessScore": 98.0,
    "reviewCount": 47,
    "portfolioCount": 12,
    "skills": ["React", "TypeScript", "Node.js"],
    "lastSyncedAt": "2024-01-15T09:00:00Z"
  }
}
```

**Error:** `PROFILE_NOT_FOUND` if no profile is connected.

---

#### `POST /profiles/sync`

Connects or refreshes the user's Upwork profile from a public URL.

**Request:**
```json
{
  "upworkUrl": "https://www.upwork.com/freelancers/~01234567890abcdef"
}
```

**Validation:**
- `upworkUrl` must be a valid Upwork freelancer URL

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "displayName": "Jane Smith",
    "title": "Full-Stack Developer | React & Node.js",
    "lastSyncedAt": "2024-01-15T10:30:00Z",
    "synced": true
  }
}
```

---

### Analyses

#### `POST /analyses/profile`

Triggers a profile analysis. Returns a cached result if one exists within the last 24 hours.

**Request:** No body required. Uses the authenticated user's connected profile.

**Optional query params:**
- `force=true` — bypass cache and force a fresh analysis (counts against rate limit)

**Response (202 Accepted — streaming):**

The response is streamed as server-sent events (SSE). The client receives partial results as they are generated.

```
event: progress
data: {"stage": "fetching_profile", "percent": 10}

event: progress
data: {"stage": "benchmarking", "percent": 40}

event: progress  
data: {"stage": "analyzing", "percent": 70}

event: result
data: {"analysisId": "uuid", "overallScore": 72, "dimensions": {...}, "recommendations": [...]}

event: done
data: {}
```

**Sync response fallback** (if streaming not supported by client):
```json
{
  "data": {
    "analysisId": "uuid",
    "cached": false,
    "overallScore": 72,
    "dimensions": {
      "title": { "score": 65, "strengths": ["..."], "gaps": ["..."], "rewrite": "..." },
      "overview": { "score": 80, "strengths": ["..."], "gaps": ["..."], "rewrite": "..." },
      "portfolio": { "score": 55, "strengths": ["..."], "gaps": ["..."] },
      "skills": { "score": 70, "strengths": ["..."], "gaps": ["..."] },
      "rates": { "score": 90, "strengths": ["..."], "gaps": ["..."] }
    },
    "recommendations": [
      {
        "id": "rec_001",
        "dimension": "portfolio",
        "impact": "high",
        "gap": "Your portfolio has 3 items. Top earners in your category have a median of 9.",
        "action": "Add 6 portfolio items prioritizing case studies with measurable client outcomes.",
        "rewrite": null
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Rate limit:** 5 profile analyses per user per day (free tier).

---

#### `GET /analyses`

Lists the authenticated user's past analyses, newest first.

**Query params:**
- `type` — filter by analysis type (`profile`, `positioning`, `market_fit`)
- `page` — page number (default: 1)
- `pageSize` — results per page (default: 20, max: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "profile",
      "overallScore": 72,
      "cached": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 4, "hasMore": false }
}
```

---

#### `GET /analyses/:id`

Returns a specific analysis by ID.

**Response:** Full analysis object (same structure as `POST /analyses/profile` response).

**Error:** `NOT_FOUND` if the analysis does not belong to the authenticated user.

---

### Proposals

#### `POST /proposals/optimize`

Submits a job posting URL and draft proposal for optimization.

**Request:**
```json
{
  "jobUrl": "https://www.upwork.com/jobs/~01234567890abcdef",
  "draft": "Hi, I've been working in web development for 8 years and I think I'd be a great fit..."
}
```

**Validation:**
- `jobUrl` must be a valid Upwork job URL
- `draft` must be 50–5000 characters

**Response (streaming SSE or sync):**
```json
{
  "data": {
    "proposalId": "uuid",
    "overallScore": 68,
    "bidStrength": "medium",
    "scoreBreakdown": {
      "relevance": { "score": 75, "feedback": "Draft mentions React which is required, but does not address the specific API integration challenge." },
      "specificity": { "score": 55, "feedback": "Opening is generic. No specific reference to the client's project context." },
      "socialProof": { "score": 70, "feedback": "Mentions 8 years experience but no quantified outcomes." },
      "tone": { "score": 80, "feedback": "Confident and professional." },
      "callToAction": { "score": 60, "feedback": "Ends with a passive statement rather than a clear next step." }
    },
    "rewrite": "I noticed your project involves a custom Stripe integration with React — I've built exactly this for three SaaS products in the past two years, one of which processes $2M+ in monthly transactions...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Rate limit:** 10 proposal optimizations per user per day (free tier).

---

#### `GET /proposals`

Lists the authenticated user's proposal history.

**Query params:**
- `page`, `pageSize`
- `bidStrength` — filter by `low`, `medium`, `high`
- `outcome` — filter by `submitted`, `shortlisted`, `hired`, `rejected`, `unknown`

---

#### `GET /proposals/:id`

Returns a specific proposal optimization result.

---

#### `PATCH /proposals/:id/outcome`

Records the real-world outcome of a proposal submission. Used to feed the Results learning provider.

**Request:**
```json
{
  "outcome": "shortlisted"
}
```

**Allowed values:** `submitted`, `shortlisted`, `hired`, `rejected`

---

### Market Intelligence

#### `GET /market/snapshot`

Returns the latest market snapshot for a category.

**Query params:**
- `category` — category slug (defaults to the user's connected profile category)

**Response:**
```json
{
  "data": {
    "category": "web-development",
    "snapshotDate": "2024-01-15",
    "medianRate": 85.00,
    "rateP25": 55.00,
    "rateP75": 120.00,
    "jobVolume": 1240,
    "topSkills": [
      { "skill": "React", "frequency": 0.72 },
      { "skill": "TypeScript", "frequency": 0.61 }
    ],
    "emergingSkills": [
      { "skill": "Next.js", "weeklyGrowth": 0.18 }
    ]
  }
}
```

---

#### `GET /market/trends`

Returns trend data for a category over the past N days.

**Query params:**
- `category` — category slug
- `days` — number of days (default: 30, max: 90)

**Response:**
```json
{
  "data": {
    "category": "web-development",
    "period": { "from": "2023-12-15", "to": "2024-01-15" },
    "rateHistory": [
      { "date": "2023-12-15", "medianRate": 80.00 },
      { "date": "2023-12-22", "medianRate": 82.00 }
    ],
    "skillTrends": [
      { "skill": "Next.js", "trendDirection": "up", "changePercent": 18 }
    ]
  }
}
```

---

### Recommendations

#### `GET /recommendations`

Returns the authenticated user's active recommendations.

**Query params:**
- `status` — filter by `active`, `dismissed`, `completed` (default: `active`)
- `impact` — filter by `critical`, `high`, `medium`, `low`

---

#### `PATCH /recommendations/:id/status`

Updates the status of a recommendation.

**Request:**
```json
{
  "status": "dismissed"
}
```

**Allowed values:** `dismissed`, `completed`

---

### Usage

#### `GET /usage/me`

Returns the authenticated user's current rate limit status.

**Response:**
```json
{
  "data": {
    "profileAnalysis": { "used": 3, "limit": 5, "resetsAt": "2024-01-16T00:00:00Z" },
    "proposalOptimizer": { "used": 7, "limit": 10, "resetsAt": "2024-01-16T00:00:00Z" }
  }
}
```

---

## Rate Limiting

Rate limits are enforced per user, per feature, per calendar day (UTC).

| Feature | Free Tier | Paid Tier |
|---|---|---|
| Profile Analysis | 5/day | 50/day |
| Proposal Optimizer | 10/day | 100/day |
| AI Coach messages | — | 50/day |

When a rate limit is exceeded, the API returns `429` with a `Retry-After` header indicating when the quota resets.

---

## Versioning Policy

- The current version is `v1`. All routes are prefixed with `/v1`.
- Breaking changes (removed fields, changed types, changed behavior) require a new version prefix.
- Additive changes (new optional fields, new endpoints) are non-breaking and do not require a version bump.
- Old versions are given a minimum 90-day deprecation notice before removal, communicated via `Deprecation` and `Sunset` response headers.
