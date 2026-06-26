export const metadata = {
  title: 'Release Notes — UpIQ',
  description: "What's new in UpIQ.",
}

const RELEASES = [
  {
    version: '0.3.0',
    date: 'June 2025',
    tag: 'Beta',
    changes: [
      'New: Full marketing landing page with feature highlights and social proof',
      'New: Sample intelligence report at /demo — no sign-up required',
      'New: About, Pricing, FAQ, Contact, Privacy, and Terms pages',
      'New: Beta badge in app navigation',
      'Improved: Onboarding flow for new users',
      'Improved: Mobile responsiveness across all pages',
    ],
  },
  {
    version: '0.2.0',
    date: 'May 2025',
    tag: 'Beta',
    changes: [
      'New: Analysis history page with search and favorites',
      'New: Full intelligence report page at /report/[id]',
      'New: Redirect to report page after analysis completes',
      'New: PATCH and DELETE endpoints for saved analyses',
      'Improved: Score dashboard with per-dimension progress bars',
      'Improved: Recommendation center with priority filtering',
    ],
  },
  {
    version: '0.1.0',
    date: 'April 2025',
    tag: 'Beta',
    changes: [
      'New: Core profile analyzer with AI scoring',
      'New: Six-dimension scoring model (positioning, overview, keywords, social proof, completeness, rate)',
      'New: Keyword gap analysis',
      'New: AI career summary generation',
      'New: User authentication with Supabase',
      'New: Dashboard with analysis history sidebar',
      'New: Rate limiting on analysis endpoint',
      'New: Security headers and CSP policy',
    ],
  },
]

export default function ReleasesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-4xl font-bold">Release Notes</h1>
      <p className="text-muted-foreground mb-10 text-lg">
        A record of what&apos;s shipped in UpIQ.
      </p>

      <div className="space-y-10">
        {RELEASES.map((release) => (
          <div key={release.version}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold">v{release.version}</h2>
              <span className="border-primary/30 bg-primary/10 text-primary rounded-full border px-2 py-0.5 text-xs font-medium">
                {release.tag}
              </span>
              <span className="text-muted-foreground text-sm">{release.date}</span>
            </div>
            <ul className="space-y-2">
              {release.changes.map((change, i) => (
                <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
