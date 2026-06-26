import Link from 'next/link'

const PRODUCT = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Demo Report', href: '/demo' },
  { label: 'Release Notes', href: '/releases' },
]

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function MarketingFooter() {
  return (
    <footer className="border-border/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-foreground text-xl font-bold tracking-tight">
              Up<span className="text-primary">IQ</span>
            </Link>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">
              AI Career Intelligence for Upwork Freelancers. Optimize your profile, win more
              clients, grow faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-foreground mb-4 text-xs font-semibold uppercase tracking-wider">
              Product
            </p>
            <ul className="space-y-2">
              {PRODUCT.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-foreground mb-4 text-xs font-semibold uppercase tracking-wider">
              Company
            </p>
            <ul className="space-y-2">
              {COMPANY.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-foreground mb-4 text-xs font-semibold uppercase tracking-wider">
              Legal
            </p>
            <ul className="space-y-2">
              {LEGAL.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border/40 mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground/60 text-xs">
            © {new Date().getFullYear()} UpIQ. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs">
            Built for freelancers who take their career seriously.
          </p>
        </div>
      </div>
    </footer>
  )
}
