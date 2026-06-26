# Backend Architecture

## Stack

| Technology | Version | Role |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Hono | 4 | Web framework |
| Zod | 3 | Request/response validation |
| Supabase JS | 2 | Database client + auth |
| @anthropic-ai/sdk | latest | Claude API client |

## Directory Structure

```
apps/api/
├── src/
│   ├── index.ts              # App entry point, route mounting
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification via Supabase
│   │   ├── cors.ts           # CORS configuration
│   │   └── logger.ts         # Request logging
│   ├── routes/
│   │   ├── profiles.ts       # /v1/profiles
│   │   ├── proposals.ts      # /v1/proposals
│   │   ├── market.ts         # /v1/market
│   │   └── analyses.ts       # /v1/analyses
│   ├── services/
│   │   ├── profile.service.ts
│   │   ├── proposal.service.ts
│   │   ├── market.service.ts
│   │   └── analysis.service.ts
│   ├── lib/
│   │   ├── db.ts             # Supabase client singleton
│   │   └── upwork.ts         # Upwork MCP client wrapper
│   └── types/
│       └── index.ts          # Re-export from packages/shared
├── .env.example
└── tsconfig.json
```

## Request Lifecycle

```
Request
  → CORS middleware
  → Auth middleware (validates Supabase JWT, attaches user to context)
  → Route handler (validates input with Zod)
  → Service layer (business logic, DB access, AI calls)
  → Response (JSON, validated with Zod output schema)
```

## API Versioning

All routes are prefixed with `/v1`. Breaking changes require a new version prefix (`/v2`). Old versions are deprecated with a sunset header before removal.

## Error Handling

All errors are returned in a consistent envelope:

```json
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "No profile found for this user.",
    "status": 404
  }
}
```

Error codes are defined as constants in `packages/shared`.

## Authentication

- All API routes require a valid Supabase JWT in the `Authorization: Bearer <token>` header.
- The auth middleware extracts `user.id` from the JWT and attaches it to the Hono context.
- Service layer functions always receive `userId` as a first argument — they never infer it.

## Environment Variables

```
DATABASE_URL=               # Supabase Postgres connection string
SUPABASE_URL=               # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=  # Service role key (never expose to client)
ANTHROPIC_API_KEY=          # Anthropic Claude API key
UPWORK_API_KEY=             # Upwork API credentials
PORT=3001
```
