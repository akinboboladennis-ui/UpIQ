import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'Sample Intelligence Report — UpIQ',
  description:
    'See a real UpIQ profile analysis report. Explore scores, recommendations, keyword gaps, and an AI career summary.',
}

const DEMO_RESULT = {
  freelancer: 'Alex Rivera',
  niche: 'Full-Stack Developer (React / Node.js)',
  analyzedAt: 'June 2025',
  overallScore: 84,
  dimensions: [
    {
      key: 'positioning',
      label: 'Positioning',
      score: 82,
      grade: 'Good',
      rationale:
        'Your niche is clear but the headline undersells your specialization. Leading with a concrete outcome (e.g., "I help SaaS startups ship React apps faster") would increase relevance scores.',
    },
    {
      key: 'overview',
      label: 'Overview Quality',
      score: 78,
      grade: 'Good',
      rationale:
        "The overview reads well but opens with your career story rather than the client's problem. Restructure to lead with client value, then back it with experience.",
    },
    {
      key: 'keywords',
      label: 'Keyword Coverage',
      score: 91,
      grade: 'Excellent',
      rationale:
        'Strong keyword density for React, Node.js, and REST APIs. Missing high-value terms: TypeScript, CI/CD, AWS, PostgreSQL — all searched frequently in your category.',
    },
    {
      key: 'socialProof',
      label: 'Social Proof',
      score: 85,
      grade: 'Very Good',
      rationale:
        'Good JSS and review count. Adding specific client outcomes and metrics (e.g., "reduced load time by 40%") would push this dimension higher.',
    },
    {
      key: 'completeness',
      label: 'Completeness',
      score: 88,
      grade: 'Very Good',
      rationale:
        'Profile is well-filled. Consider adding a portfolio project that showcases end-to-end product work rather than just code samples.',
    },
    {
      key: 'rateAlignment',
      label: 'Rate Alignment',
      score: 79,
      grade: 'Good',
      rationale:
        "Your $85/hr rate is competitive for your level but your profile doesn't justify premium pricing yet. Stronger social proof and case studies would support a higher rate.",
    },
  ],
  recommendations: [
    {
      priority: 'high',
      title: 'Rewrite your headline to lead with client outcomes',
      effort: 'Low',
      impact: 'High',
      category: 'Positioning',
    },
    {
      priority: 'high',
      title: 'Add TypeScript and AWS to your skills section',
      effort: 'Low',
      impact: 'High',
      category: 'Keywords',
    },
    {
      priority: 'high',
      title: 'Restructure overview: problem → solution → proof',
      effort: 'Medium',
      impact: 'High',
      category: 'Overview',
    },
    {
      priority: 'medium',
      title: 'Add 2–3 quantified client outcomes to your overview',
      effort: 'Medium',
      impact: 'Medium',
      category: 'Social Proof',
    },
    {
      priority: 'medium',
      title: 'Upload a case study portfolio item with metrics',
      effort: 'High',
      impact: 'Medium',
      category: 'Completeness',
    },
    {
      priority: 'medium',
      title: 'Add CI/CD and PostgreSQL to skills',
      effort: 'Low',
      impact: 'Medium',
      category: 'Keywords',
    },
    {
      priority: 'low',
      title: 'Request a testimonial from your top client',
      effort: 'Low',
      impact: 'Medium',
      category: 'Social Proof',
    },
    {
      priority: 'low',
      title: 'Create a specialized profile for startup clients',
      effort: 'High',
      impact: 'Medium',
      category: 'Positioning',
    },
  ],
  missingKeywords: ['TypeScript', 'AWS', 'PostgreSQL', 'CI/CD', 'Docker', 'GraphQL', 'Next.js'],
  aiSummary: `Full-stack developer with 6+ years building production React and Node.js applications for growth-stage startups. I specialize in turning complex product requirements into clean, maintainable codebases — from API design and database architecture through to polished React UIs.

Recent clients have shipped new features 40% faster after I introduced TypeScript strict mode, automated testing, and CI/CD pipelines. I work best with founders and product teams who want a senior-level partner, not just a coder.

Technologies: React, Next.js, Node.js, TypeScript, PostgreSQL, AWS, REST APIs, GraphQL.`,
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold ${color}`}>{score}</div>
      <div className="text-muted-foreground text-sm">/100</div>
    </div>
  )
}

function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    Excellent: 'bg-green-500/15 text-green-400 border-green-500/30',
    'Very Good': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Good: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Fair: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Poor: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${colors[grade] ?? ''}`}>
      {grade}
    </span>
  )
}

export default function DemoPage() {
  return (
    <>
      <MarketingNav />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Demo banner */}
        <div className="border-primary/30 bg-primary/5 mb-8 rounded-xl border px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-primary font-semibold">Sample Report</p>
              <p className="text-muted-foreground text-sm">
                This is a demo report for a fictional freelancer. Sign up to analyze your own
                profile.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/signup">Analyze My Profile →</Link>
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <p className="text-muted-foreground mb-1 text-sm">
            Intelligence Report · {DEMO_RESULT.analyzedAt}
          </p>
          <h1 className="mb-1 text-2xl font-bold">{DEMO_RESULT.freelancer}</h1>
          <p className="text-muted-foreground">{DEMO_RESULT.niche}</p>
        </div>

        {/* Score dashboard */}
        <section className="border-border/50 bg-card/60 mb-10 rounded-xl border p-6">
          <h2 className="mb-6 text-lg font-semibold">Profile Score</h2>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <ScoreRing score={DEMO_RESULT.overallScore} />
            <div className="flex-1 space-y-3">
              {DEMO_RESULT.dimensions.map((dim) => (
                <div key={dim.key} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-32 text-sm">{dim.label}</span>
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium">{dim.score}</span>
                  <GradeBadge grade={dim.grade} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="border-border/50 bg-card/60 mb-10 rounded-xl border p-6">
          <h2 className="mb-6 text-lg font-semibold">Recommendations</h2>
          <div className="space-y-3">
            {DEMO_RESULT.recommendations.map((rec, i) => {
              const priorityColor =
                rec.priority === 'high'
                  ? 'border-red-500/30 bg-red-500/5'
                  : rec.priority === 'medium'
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : 'border-border/40 bg-muted/20'
              return (
                <div key={i} className={`rounded-lg border p-4 ${priorityColor}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{rec.title}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {rec.category} · Effort: {rec.effort} · Impact: {rec.impact}
                      </p>
                    </div>
                    <span className="border-border/40 text-muted-foreground flex-shrink-0 rounded-full border px-2 py-0.5 text-xs capitalize">
                      {rec.priority}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Keyword gaps */}
        <section className="border-border/50 bg-card/60 mb-10 rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Missing Keywords</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            These high-value terms are missing from your profile. Adding them can improve your
            visibility in client searches.
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMO_RESULT.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm text-orange-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* AI Summary */}
        <section className="border-border/50 bg-card/60 mb-10 rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">AI Career Summary</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            A suggested overview rewrite based on your profile. Ready to paste into Upwork.
          </p>
          <div className="border-border/40 bg-background/60 rounded-lg border p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed">{DEMO_RESULT.aiSummary}</p>
          </div>
        </section>

        {/* Dimension breakdown */}
        <section className="border-border/50 bg-card/60 mb-10 rounded-xl border p-6">
          <h2 className="mb-6 text-lg font-semibold">Dimension Breakdown</h2>
          <div className="space-y-4">
            {DEMO_RESULT.dimensions.map((dim) => (
              <div key={dim.key} className="border-border/40 border-b pb-4 last:border-0 last:pb-0">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{dim.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{dim.score}</span>
                    <GradeBadge grade={dim.grade} />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{dim.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border-primary/20 bg-primary/5 rounded-xl border p-8 text-center">
          <h2 className="mb-2 text-xl font-bold">Analyze your own profile</h2>
          <p className="text-muted-foreground mb-6">
            Get your personalized intelligence report in under 60 seconds. Free during beta.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
      <MarketingFooter />
    </>
  )
}
