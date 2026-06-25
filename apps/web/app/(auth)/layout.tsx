import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand (hidden on mobile) */}
      <div className="border-border bg-bg-surface relative hidden w-[480px] flex-shrink-0 flex-col justify-between border-r p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-foreground text-2xl font-bold tracking-tight">
            Up<span className="text-primary">IQ</span>
          </span>
        </Link>

        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-foreground text-lg leading-relaxed">
              &ldquo;UpIQ showed me exactly why my proposal conversion rate was low and gave me a
              specific rewrite. My shortlist rate doubled in two weeks.&rdquo;
            </p>
            <footer className="text-muted-foreground text-sm">
              <strong className="text-foreground">Alex R.</strong> — Full-Stack Developer, $120/hr
            </footer>
          </blockquote>
        </div>

        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} UpIQ. All rights reserved.
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="text-foreground text-2xl font-bold tracking-tight">
            Up<span className="text-primary">IQ</span>
          </span>
        </Link>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
