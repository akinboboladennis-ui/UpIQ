# Frontend Architecture

## Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 15 | App framework (App Router) |
| React | 19 | UI runtime |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | latest | Accessible component primitives |
| Zustand | 5 | Client-side state |
| TanStack Query | 5 | Server-state, caching, background sync |
| Zod | 3 | Schema validation on the client |

## Directory Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (login, signup, callback)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Authenticated area
│   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   ├── page.tsx              # Dashboard home (overview)
│   │   ├── profile/              # Profile intelligence
│   │   ├── proposals/            # Proposal optimizer
│   │   ├── market/               # Market radar
│   │   └── growth/               # Growth compass
│   ├── api/                      # Route handlers (thin proxies to apps/api)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Marketing landing page
├── components/
│   ├── ui/                       # Re-exports from packages/ui
│   ├── dashboard/                # Dashboard-specific components
│   ├── profile/                  # Profile analysis components
│   ├── proposals/                # Proposal components
│   └── shared/                   # Generic shared components
├── lib/
│   ├── api.ts                    # Typed API client
│   ├── auth.ts                   # Supabase auth helpers
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── public/
├── .env.example
└── next.config.ts
```

## Routing Conventions

- Route groups `(auth)` and `(dashboard)` separate public and protected areas without affecting URLs.
- Dynamic segments use `[id]` notation. Catch-all routes use `[...slug]`.
- Loading states use `loading.tsx` collocated with the page.
- Error boundaries use `error.tsx` collocated with the page.

## Server vs. Client Components

- Default to **Server Components** for all data-fetching and static content.
- Use `"use client"` only when the component needs browser APIs, event handlers, or React state.
- AI-generated content is streamed to the client using React's `<Suspense>` and Next.js streaming.

## State Management

| State type | Tool |
|---|---|
| Server/async state | TanStack Query |
| Authenticated user | Zustand (`useAuthStore`) |
| UI state (modals, toasts) | Zustand (`useUIStore`) |
| Form state | React Hook Form + Zod |
| URL state | Next.js `useSearchParams` |

## Environment Variables

```
NEXT_PUBLIC_API_URL=          # Backend API base URL
NEXT_PUBLIC_SUPABASE_URL=     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
```
