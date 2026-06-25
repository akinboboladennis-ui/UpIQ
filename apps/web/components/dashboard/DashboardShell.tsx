'use client'

import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { MobileNav } from './MobileNav'

interface DashboardShellProps {
  displayName: string | null
  firstName: string | null
  email: string
  children: React.ReactNode
}

export function DashboardShell({ displayName, firstName, email, children }: DashboardShellProps) {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar displayName={displayName} email={email} />

      {/* Mobile drawer */}
      <MobileNav displayName={displayName} email={email} />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNav displayName={displayName} firstName={firstName} email={email} />
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
