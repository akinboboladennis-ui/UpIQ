import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <span className="text-foreground text-4xl font-bold tracking-tight">
            Up<span className="text-primary">IQ</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          The career intelligence platform for{' '}
          <span className="text-primary">serious freelancers</span>
        </h1>

        <p className="text-muted-foreground mb-10 text-lg">
          UpIQ continuously learns from the Upwork marketplace to help you optimize your profile,
          write winning proposals, and grow your freelance career with precision.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Social proof hint */}
        <p className="text-muted-foreground mt-8 text-sm">
          No credit card required &middot; Free during beta
        </p>
      </div>
    </main>
  )
}
