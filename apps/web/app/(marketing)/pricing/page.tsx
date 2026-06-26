import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Pricing — UpIQ',
  description: 'UpIQ is free during beta. No credit card required.',
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Simple, honest pricing</h1>
        <p className="text-muted-foreground text-lg">
          UpIQ is completely free during the beta period.
        </p>
      </div>

      <div className="mx-auto max-w-sm">
        <div className="border-primary/30 bg-card/60 rounded-2xl border p-8 text-center">
          <div className="border-primary/30 bg-primary/10 text-primary mb-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            Beta
          </div>
          <h2 className="mt-4 text-2xl font-bold">Free</h2>
          <p className="mt-1 text-4xl font-bold">$0</p>
          <p className="text-muted-foreground mt-1 text-sm">forever, during beta</p>

          <ul className="my-8 space-y-3 text-left text-sm">
            {[
              'Unlimited profile analyses',
              'Full intelligence report with scores',
              'Prioritized recommendations',
              'Keyword gap analysis',
              'AI career summary',
              'Analysis history',
              'No credit card required',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button asChild className="w-full">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="mb-4 text-xl font-semibold">What happens after beta?</h2>
        <p className="text-muted-foreground mx-auto max-w-xl">
          We&apos;ll introduce paid plans with advanced features when we exit beta. Early beta users
          will receive a generous discount. We&apos;ll give you plenty of notice before anything
          changes.
        </p>
      </div>
    </div>
  )
}
