import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'UpIQ — AI Career Intelligence for Upwork Freelancers',
  description:
    'Analyze your Upwork profile, get AI-powered recommendations, and grow your freelance career faster. Free during beta.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <>
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-24 pt-20 sm:pt-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-primary/10 absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[120px]" />
          </div>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="border-primary/30 bg-primary/10 text-primary mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium">
              Free during beta &mdash; no credit card required
            </div>
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              AI Career Intelligence for{' '}
              <span className="from-primary bg-gradient-to-r to-violet-400 bg-clip-text text-transparent">
                Upwork Freelancers
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
              Get an instant AI-powered profile audit with a scored report, personalized
              recommendations, and a clear action plan to win more clients on Upwork.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="w-full text-base sm:w-auto">
                <Link href="/signup">Start Free — No Card Needed</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full text-base sm:w-auto">
                <Link href="/demo">View Sample Report</Link>
              </Button>
            </div>
            {/* Score card preview */}
            <div className="border-border/50 bg-card/60 mx-auto mt-16 max-w-sm rounded-2xl border p-6 text-left shadow-xl backdrop-blur-sm">
              <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
                Profile Score
              </p>
              <div className="mb-4 flex items-end gap-2">
                <span className="text-primary text-5xl font-bold">84</span>
                <span className="text-muted-foreground mb-1">/100</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Positioning', score: 82 },
                  { label: 'Overview', score: 78 },
                  { label: 'Keywords', score: 91 },
                  { label: 'Social Proof', score: 85 },
                ].map(({ label, score }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-muted-foreground w-24 text-xs">{label}</span>
                    <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs font-medium">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section className="border-border/40 bg-muted/20 border-y py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { value: '500+', label: 'Freelancers in beta' },
                { value: '4,200+', label: 'Analyses run' },
                { value: '+23pts', label: 'Average score lift' },
                { value: '<60s', label: 'Analysis time' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-primary text-3xl font-bold">{value}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">
                Your Upwork profile is losing you clients
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl">
                Most freelancers never discover why they get passed over. The algorithm punishes
                invisible problems you can&apos;t see.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: '🔍',
                  title: 'No visibility',
                  body: "You don't know which keywords clients search for — or whether your profile ranks for any of them.",
                },
                {
                  icon: '📉',
                  title: 'Vague feedback',
                  body: "Generic advice like 'improve your overview' gives you nothing actionable to work with.",
                },
                {
                  icon: '⏱️',
                  title: 'Slow iteration',
                  body: 'Trial and error takes months. You need data-driven decisions, not gut feelings.',
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="border-border/50 bg-card/50 rounded-xl border p-6">
                  <div className="mb-3 text-3xl">{icon}</div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-muted-foreground text-sm">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">
                Everything you need to grow on Upwork
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl">
                One analysis gives you a complete picture of your profile&apos;s strengths and
                exactly where to improve.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '🧠',
                  title: 'Intelligence Report',
                  body: 'A scored breakdown of every dimension that drives Upwork success — positioning, keywords, social proof, and more.',
                },
                {
                  icon: '🎯',
                  title: 'Recommendation Engine',
                  body: 'Prioritized, specific actions ranked by potential impact. Check them off as you complete them.',
                },
                {
                  icon: '✍️',
                  title: 'AI Career Summary',
                  body: 'A ready-to-paste overview rewrite crafted by AI from your profile data and market positioning.',
                },
                {
                  icon: '📈',
                  title: 'Improvement Timeline',
                  body: 'Track your score history across analyses and see how your optimizations move the needle over time.',
                },
                {
                  icon: '🔑',
                  title: 'Keyword Intelligence',
                  body: 'Discover which high-value keywords your profile is missing and which ones you should lead with.',
                },
                {
                  icon: '📊',
                  title: 'Score Tracking',
                  body: 'Save and revisit every analysis. Compare scores over time as you implement improvements.',
                },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="border-border/50 bg-card/60 hover:border-primary/30 rounded-xl border p-6 transition-colors"
                >
                  <div className="mb-3 text-2xl">{icon}</div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-muted-foreground text-sm">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">
                From profile to action plan in under a minute
              </h2>
            </div>
            <div className="relative">
              <div className="bg-border/50 absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px sm:block" />
              <div className="space-y-10">
                {[
                  {
                    step: '1',
                    title: 'Paste your profile',
                    body: "Copy your Upwork profile overview and paste it into UpIQ. No API access or OAuth needed — it's instant.",
                  },
                  {
                    step: '2',
                    title: 'Get your intelligence report',
                    body: 'Our AI analyzes your positioning, keywords, social proof, completeness, and niche alignment in seconds.',
                  },
                  {
                    step: '3',
                    title: 'Execute the action plan',
                    body: 'Follow your prioritized recommendation list, track progress, and re-analyze to confirm improvements.',
                  },
                ].map(({ step, title, body }) => (
                  <div key={step} className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="border-primary/40 bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold">
                        {step}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="mb-1 font-semibold">{title}</h3>
                      <p className="text-muted-foreground text-sm">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo preview */}
        <section className="bg-muted/20 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="border-primary/20 bg-card/60 rounded-2xl border p-8 sm:p-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                    See a real intelligence report
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Explore a sample report for a full-stack developer profile — complete with
                    scores, recommendations, keyword gaps, and an AI career summary.
                  </p>
                  <ul className="mb-8 space-y-2">
                    {[
                      'Scored breakdown across 6 dimensions',
                      '12 prioritized recommendations',
                      'Keyword gap analysis',
                      'AI-generated career summary',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild>
                    <Link href="/demo">View Sample Report →</Link>
                  </Button>
                </div>
                <div className="hidden w-48 sm:block">
                  <div className="border-border/40 bg-background/80 rounded-xl border p-4 text-center">
                    <div className="text-primary text-5xl font-bold">84</div>
                    <div className="text-muted-foreground mt-1 text-xs">Profile Score</div>
                    <div className="mt-3 space-y-1.5 text-left">
                      {['Excellent', 'Good', 'Strong', 'Very Good'].map((l, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="bg-muted h-1 flex-1 overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${[82, 78, 91, 85][i]}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">
                Freelancers who leveled up with UpIQ
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  name: 'Sarah K.',
                  role: 'UX Designer',
                  quote:
                    'My profile score jumped from 61 to 88 in two weeks after following the recommendations. Invitations started coming in.',
                  stars: 5,
                },
                {
                  name: 'Marcus T.',
                  role: 'Full-Stack Developer',
                  quote:
                    'The keyword gap analysis was eye-opening. I had no idea I was missing terms clients actually search for.',
                  stars: 5,
                },
                {
                  name: 'Priya M.',
                  role: 'Content Strategist',
                  quote:
                    'The AI career summary saved me hours. I pasted it straight in and my response rate doubled within a month.',
                  stars: 5,
                },
              ].map(({ name, role, quote, stars }) => (
                <div key={name} className="border-border/50 bg-card/60 rounded-xl border p-6">
                  <div className="mb-3 flex">
                    {Array.from({ length: stars }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">&ldquo;{quote}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-muted-foreground text-xs">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/20 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">
                Frequently asked questions
              </h2>
            </div>
            <div className="divide-border/50 divide-y">
              {[
                {
                  q: 'Is UpIQ free?',
                  a: 'Yes — UpIQ is completely free during the beta period. No credit card required.',
                },
                {
                  q: 'Do you need access to my Upwork account?',
                  a: 'No. Just paste your profile overview text. We never ask for your Upwork credentials or OAuth access.',
                },
                {
                  q: 'How long does an analysis take?',
                  a: 'Most analyses complete in under 60 seconds. Our AI processes your profile and returns a full scored report.',
                },
                {
                  q: 'How many times can I analyze my profile?',
                  a: 'You can run up to 5 analyses every 10 minutes. Re-analyze anytime after making profile changes.',
                },
                {
                  q: 'Is my data private?',
                  a: 'Yes. Your profile text is used only to generate your report and is never shared or sold. See our Privacy Policy for details.',
                },
                {
                  q: 'What makes UpIQ different from generic AI tools?',
                  a: 'UpIQ is purpose-built for Upwork. Our scoring model is calibrated to what actually drives Upwork profile visibility and client conversions.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    {q}
                    <span className="text-muted-foreground ml-4 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 text-sm">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/faq" className="text-primary text-sm hover:underline">
                View all FAQs →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/10 relative overflow-hidden rounded-2xl p-10 text-center sm:p-16">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="bg-primary/20 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
              </div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to take your Upwork profile seriously?
              </h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
                Join 500+ freelancers who are already using UpIQ to grow their careers with
                data-driven precision.
              </p>
              <Button asChild size="lg" className="text-base">
                <Link href="/signup">Get Your Free Analysis</Link>
              </Button>
              <p className="text-muted-foreground mt-4 text-xs">
                Free during beta &middot; No card required &middot; Results in under 60 seconds
              </p>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  )
}
