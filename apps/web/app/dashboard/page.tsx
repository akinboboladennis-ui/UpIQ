import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { BarChart3, BookOpen, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const UPCOMING_FEATURES = [
  {
    icon: BarChart3,
    title: 'Profile Intelligence',
    description:
      'Get a scored analysis of your Upwork profile with specific, actionable recommendations benchmarked against top earners in your niche.',
    phase: 'Phase 1',
  },
  {
    icon: BookOpen,
    title: 'Proposal Optimizer',
    description:
      'Submit a job posting and your draft proposal. Receive a score, a rewritten version with annotations, and a bid strength rating.',
    phase: 'Phase 2',
  },
  {
    icon: TrendingUp,
    title: 'Market Radar',
    description:
      'Track rate trends, in-demand skills, and emerging niches in your category before they become competitive.',
    phase: 'Phase 3',
  },
] as const

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const firstName = (user.user_metadata?.['first_name'] as string | null) ?? 'there'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your AI career intelligence platform is getting ready. Here&apos;s what&apos;s coming.
        </p>
      </div>

      {/* Coming soon cards */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Upcoming Features
          </h2>
          <Badge variant="outline" className="text-muted-foreground text-xs">
            Beta
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {UPCOMING_FEATURES.map(({ icon: Icon, title, description, phase }) => (
            <Card key={title} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="bg-brand-subtle mb-3 flex h-9 w-9 items-center justify-center rounded-md">
                  <Icon className="text-primary h-4 w-4" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {phase}
                  </Badge>
                </div>
                <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Button variant="outline" size="sm" disabled className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Account confirmed banner */}
      <Card className="border-success/30 bg-success-subtle">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="bg-success h-2 w-2 shrink-0 rounded-full" />
          <p className="text-success text-sm">
            Your account is active. You&apos;ll be notified when Profile Intelligence launches.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
