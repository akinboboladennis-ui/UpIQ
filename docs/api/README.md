# API Reference

## Base URL

| Environment | URL |
|---|---|
| Local | `http://localhost:3001` |
| Production | `https://api.upiq.app` |

## Authentication

All endpoints require a valid Supabase JWT in the `Authorization` header.

```
Authorization: Bearer <supabase_access_token>
```

Obtain the token by authenticating with Supabase on the client, then pass it with every API request.

## Response Format

All responses return JSON. Successful responses return the data directly. Errors return an `error` envelope.

**Success:**
```json
{ "data": { ... } }
```

**Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message.",
    "status": 400
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthenticated |
| 403 | Forbidden (RLS violation) |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 503 | AI service temporarily unavailable |

## Versioning

Current version: **v1**. All routes are prefixed with `/v1`.

---

## Endpoints

### Profiles

#### `GET /v1/profiles/me`
Returns the authenticated user's stored profile.

#### `POST /v1/profiles/sync`
Triggers a fresh sync of the user's Upwork profile.

**Body:**
```json
{ "upworkUrl": "https://www.upwork.com/freelancers/~..." }
```

### Analyses

#### `POST /v1/analyses/profile`
Runs a full AI profile analysis. Returns the analysis result or a cached result if one exists from the past 24 hours.

**Response:** See [AI Pipeline — Profile Analyzer output schema](../architecture/ai-pipeline.md).

#### `GET /v1/analyses`
Lists the authenticated user's past analyses (paginated).

### Proposals

#### `POST /v1/proposals/optimize`
Scores and rewrites a proposal draft.

**Body:**
```json
{
  "jobUrl": "https://www.upwork.com/jobs/...",
  "draft": "Your proposal text here..."
}
```

**Response:** See [AI Pipeline — Proposal Optimizer output schema](../architecture/ai-pipeline.md).

#### `GET /v1/proposals`
Lists the authenticated user's past proposals (paginated).

### Market

#### `GET /v1/market/snapshot`
Returns the latest market snapshot for the user's category.

**Query params:**
- `category` (optional) — override the user's default category

#### `GET /v1/market/trends`
Returns rate and skill trends over the past 30 days for a category.
