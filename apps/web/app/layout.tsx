import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://upiq.io'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'UpIQ — AI Career Intelligence for Freelancers',
    template: '%s | UpIQ',
  },
  description:
    'Optimize your Upwork profile, proposals, and positioning with AI-powered career intelligence. Get a scored report in under 60 seconds.',
  keywords: [
    'freelance',
    'upwork',
    'AI',
    'career',
    'profile optimization',
    'proposals',
    'freelancer',
  ],
  authors: [{ name: 'UpIQ' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'UpIQ',
    title: 'UpIQ — AI Career Intelligence for Upwork Freelancers',
    description:
      'Get a scored AI analysis of your Upwork profile with prioritized recommendations, keyword gaps, and an AI career summary. Free during beta.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UpIQ — AI Career Intelligence for Upwork Freelancers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpIQ — AI Career Intelligence for Upwork Freelancers',
    description:
      'Get a scored AI analysis of your Upwork profile with prioritized recommendations. Free during beta.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('dark', inter.variable)} suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
