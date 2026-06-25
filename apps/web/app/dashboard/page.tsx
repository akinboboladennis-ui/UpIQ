import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import {
  Activity,
  BarChart3,
  Brain,
  DollarSign,
  FileCheck,
  GraduationCap,
  LineChart,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserSearch,
  Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { RecommendationCard } from '@/components/dashboard/RecommendationCard'
import { ComingSoonCard } from '@/components/dashboard/ComingSoonCard'
import { LearningCard } from '@/components/dashboard/LearningCard'

export const metadata: Metadata = {
  title: 'Dashboard',
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatTodayDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
}

const RECOMMENDATIONS = [
  {
    title: 'Complete your first profile analysis',
    description:
      'Run the Profile Analyzer to get a personalized score and actionable improvements tailored to your niche.',
    icon: UserSearch,
    href: '/profile-analyzer',
    priority: 'high' as const,
  },
  {
    title: 'Add your Upwork profile URL',
    description:
      'Connect your Upwork profile so UpIQ can analyze your positioning, skills, and market fit.',
    icon: Target,
    href: '/settings/profile',
    priority: 'high' as const,
  },
  {
    title: 'Explore the Learning Center',
    description:
      'Build your knowledge with curated guides on profile optimization, proposals, and pricing strategy.',
    icon: GraduationCap,
    href: '/learning',
    priority: 'medium' as const,
  },
]

const LEARNING_ARTICLES = [
  {
    title: 'How Upwork Search Works',
    description:
      'Understand the ranking algorithm behind Upwork search and how to position yourself to appear in more relevant searches.',
    category: 'Platform',
    readTime: '5 min read',
  },
  {
    title: 'Writing a Profile That Converts',
    description:
      'The anatomy of a high-converting Upwork profile — from the headline to the overview to portfolio curation.',
    category: 'Profile',
    readTime: '8 min read',
  },
  {
    title: 'Portfolio Best Practices',
    description:
      'How to structure case studies that demonstrate impact, not just output. What top-rated freelancers do differently.',
    category: 'Portfolio',
    readTime: '6 min read',
  },
  {
    title: 'The Psychology of Proposals',
    description:
      'Why most proposals fail and how to write one that speaks to what clients actually care about — before they know it.',
    category: 'Proposals',
    readTime: '10 min read',
  },
]

const COMING_SOON_MODULES = [
  {
    title: 'Proposal Intelligence',
    description:
      'Submit a job posting and draft proposal. Get a score, a rewritten version with annotations, and a bid strength rating.',
    icon: FileCheck,
  },
  {
    title: 'MarketIQ',
    description:
      'Track rate trends, in-demand skills, and emerging niches in your category before they get competitive.',
    icon: LineChart,
  },
  {
    title: 'CareerIQ',
    description:
      'Map your Upwork journey from where you are to where you want to be with milestone-driven career planning.',
    icon: TrendingUp,
  },
  {
    title: 'PricingIQ',
    description:
      'Benchmark your rates against market data and discover the optimal price point for your skill set and niche.',
    icon: DollarSign,
  },
  {
    title: 'PortfolioIQ',
    description:
      'Analyze your portfolio cases for impact clarity and get AI suggestions to make them impossible to ignore.',
    icon: Star,
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const meta = user.user_metadata
  const firstName = (meta?.['first_name'] as string | null) ?? 'there'

  return (
    <div className="space-y-10">
      {/* ── Hero Welcome ── */}
      <section aria-labelledby="welcome-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-muted-foreground mb-1.5 text-sm font-medium">{formatTodayDate()}</p>
            <h1
              id="welcome-heading"
              className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {getGreeting()}, <span className="text-primary capitalize">{firstName}</span>{' '}
              <span aria-hidden>👋</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Let&apos;s make your profile impossible to ignore.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="default"
              size="sm"
              disabled
              className="gap-2"
              aria-label="Analyze Profile — coming soon"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Analyze Profile
            </Button>
            <Button variant="outline" size="sm" disabled aria-label="View History — coming soon">
              View History
            </Button>
          </div>
        </div>
      </section>

      {/* ── Quick Stats ── */}
      <section aria-labelledby="stats-heading">
        <SectionHeader title="Overview" className="mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Profile Health" icon={Activity} description="Run an analysis first" />
          <StatCard label="Overall Score" icon={BarChart3} description="No analyses yet" />
          <StatCard
            label="Analyses Done"
            value={0}
            icon={Brain}
            description="Your first is on us"
          />
          <StatCard
            label="AI Recommendations"
            value={0}
            icon={Zap}
            description="Waiting for first scan"
          />
        </div>
      </section>

      {/* ── Activity + Next Steps ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section aria-labelledby="activity-heading" className="flex flex-col gap-4">
          <SectionHeader title="Recent Activity" />
          <div className="bg-card border-border flex-1 rounded-xl border p-6">
            <EmptyState
              icon={Activity}
              title="No activity yet"
              description="Your analyses, saved reports, and proposal reviews will appear here as you use UpIQ."
              size="sm"
            />
          </div>
        </section>

        <section aria-labelledby="nextsteps-heading" className="flex flex-col gap-4">
          <SectionHeader title="Next Steps" />
          <div className="flex flex-1 flex-col gap-2.5">
            {RECOMMENDATIONS.map((rec) => (
              <RecommendationCard key={rec.title} {...rec} />
            ))}
          </div>
        </section>
      </div>

      {/* ── Learning Center ── */}
      <section aria-labelledby="learning-heading">
        <SectionHeader
          title="Learning Center"
          description="Sharpen your freelance strategy with curated guides from top earners."
          action={
            <Button variant="outline" size="sm" disabled>
              View all
            </Button>
          }
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEARNING_ARTICLES.map((article) => (
            <LearningCard key={article.title} {...article} />
          ))}
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section aria-labelledby="coming-soon-heading">
        <SectionHeader
          title="Coming Soon"
          description="The full UpIQ intelligence suite — built for serious freelancers."
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {COMING_SOON_MODULES.map((mod) => (
            <ComingSoonCard key={mod.title} {...mod} />
          ))}
        </div>
      </section>
    </div>
  )
}
