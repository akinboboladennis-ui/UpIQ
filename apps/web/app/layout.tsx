import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'UpIQ — AI Career Intelligence for Freelancers',
    template: '%s | UpIQ',
  },
  description:
    'Optimize your Upwork profile, proposals, and positioning with AI-powered career intelligence.',
  keywords: ['freelance', 'upwork', 'AI', 'career', 'profile optimization', 'proposals'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('dark', inter.variable)} suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
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
      </body>
    </html>
  )
}
