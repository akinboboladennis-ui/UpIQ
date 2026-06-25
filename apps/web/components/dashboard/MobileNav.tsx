'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  Settings,
  Target,
  TrendingUp,
  UserSearch,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useUiStore } from '@/stores/uiStore'

interface MobileNavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
}

const ALL_NAV: MobileNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile-analyzer', label: 'Profile Analyzer', icon: UserSearch },
  { href: '/history', label: 'Analysis History', icon: History, comingSoon: true },
  { href: '/market-insights', label: 'Market Insights', icon: TrendingUp, comingSoon: true },
  { href: '/proposals', label: 'Proposal Intelligence', icon: FileText, comingSoon: true },
  { href: '/job-match', label: 'Job Match', icon: Target, comingSoon: true },
  { href: '/learning', label: 'Learning Center', icon: GraduationCap, comingSoon: true },
  { href: '/settings', label: 'Settings', icon: Settings, comingSoon: true },
]

interface MobileNavProps {
  displayName: string | null
  email: string
}

export function MobileNav({ displayName, email }: MobileNavProps) {
  const pathname = usePathname()
  const { mobileMenuOpen, setMobileMenuOpen } = useUiStore()

  function close() {
    setMobileMenuOpen(false)
  }

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={close}
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="bg-bg-surface border-border fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r lg:hidden"
            aria-modal
            role="dialog"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="border-border flex h-14 items-center justify-between border-b px-4">
              <span className="text-foreground text-lg font-bold tracking-tight">
                Up<span className="text-primary">IQ</span>
              </span>
              <button
                onClick={close}
                className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav
              aria-label="Mobile navigation"
              className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3"
            >
              {ALL_NAV.map(({ href, label, icon: Icon, comingSoon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={comingSoon ? '#' : href}
                    onClick={(e) => {
                      if (comingSoon) {
                        e.preventDefault()
                        return
                      }
                      close()
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                      comingSoon && 'opacity-50'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1">{label}</span>
                    {comingSoon && (
                      <Badge variant="secondary" className="px-1 py-0 text-[9px] leading-4">
                        Soon
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User */}
            <div className="border-border border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar name={displayName} size="sm" />
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {displayName ?? 'Freelancer'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{email}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
