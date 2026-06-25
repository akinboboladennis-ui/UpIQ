'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Target,
  TrendingUp,
  UserSearch,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar } from '@/components/ui/avatar'
import { useUiStore } from '@/stores/uiStore'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile-analyzer', label: 'Profile Analyzer', icon: UserSearch },
  { href: '/history', label: 'Analysis History', icon: History },
  { href: '/market-insights', label: 'Market Insights', icon: TrendingUp, comingSoon: true },
  { href: '/proposals', label: 'Proposal Intelligence', icon: FileText, comingSoon: true },
  { href: '/job-match', label: 'Job Match', icon: Target, comingSoon: true },
  { href: '/learning', label: 'Learning Center', icon: GraduationCap, comingSoon: true },
]

const BOTTOM_NAV: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings, comingSoon: true },
]

interface SidebarProps {
  displayName: string | null
  email: string
}

export function Sidebar({ displayName, email }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()

  async function handleSignOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Failed to sign out.')
      return
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <TooltipProvider delayDuration={300}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="bg-bg-surface border-border relative hidden h-full shrink-0 flex-col border-r lg:flex"
      >
        {/* Logo */}
        <div className="border-border flex h-14 shrink-0 items-center border-b px-3">
          {sidebarCollapsed ? (
            <Link href="/dashboard" className="mx-auto" aria-label="UpIQ home">
              <span className="text-primary text-lg font-bold">IQ</span>
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-foreground text-lg font-bold tracking-tight">
                Up<span className="text-primary">IQ</span>
              </span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-2 pt-3"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-border shrink-0 space-y-0.5 border-t p-2">
          {BOTTOM_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} collapsed={sidebarCollapsed} />
          ))}

          {/* User identity */}
          <div className="mt-1.5">
            {sidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSignOut}
                    className="hover:bg-destructive/10 flex w-full items-center justify-center rounded-md p-2 transition-colors"
                    aria-label="Sign out"
                  >
                    <Avatar name={displayName} size="sm" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">{displayName ?? 'Freelancer'}</p>
                  <p className="text-muted-foreground text-xs">{email}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
                <Avatar name={displayName} size="sm" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-xs font-semibold">
                    {displayName ?? 'Freelancer'}
                  </p>
                  <p className="text-muted-foreground truncate text-[10px]">{email}</p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleSignOut}
                      className="text-muted-foreground hover:text-destructive shrink-0 rounded p-1 transition-colors"
                      aria-label="Sign out"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sign out</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="border-border bg-bg-surface text-muted-foreground hover:text-foreground hover:bg-accent absolute -right-3 top-[4.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-colors"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-3 w-3" />
              ) : (
                <PanelLeftClose className="h-3 w-3" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </TooltipContent>
        </Tooltip>
      </motion.aside>
    </TooltipProvider>
  )
}

function NavLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem
  pathname: string
  collapsed: boolean
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  const inner = (
    <Link
      href={item.comingSoon ? '#' : item.href}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={item.comingSoon}
      onClick={(e) => item.comingSoon && e.preventDefault()}
      className={cn(
        'group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
        collapsed && 'justify-center',
        isActive
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
        item.comingSoon && 'opacity-50 hover:opacity-60'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.comingSoon && (
            <Badge variant="secondary" className="px-1 py-0 text-[9px] leading-4">
              Soon
            </Badge>
          )}
        </>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right">
          {item.label}
          {item.comingSoon && ' (Coming Soon)'}
        </TooltipContent>
      </Tooltip>
    )
  }

  return inner
}
