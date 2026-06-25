'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  Compass,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/proposals', label: 'Proposals', icon: BookOpen },
  { href: '/market', label: 'Market', icon: TrendingUp },
  { href: '/growth', label: 'Growth', icon: Compass },
] as const

const BOTTOM_ITEMS = [{ href: '/settings', label: 'Settings', icon: Settings }] as const

interface SidebarProps {
  displayName: string | null
  email: string
}

export function Sidebar({ displayName, email }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

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
    <aside className="border-border bg-bg-surface flex h-full w-[240px] flex-shrink-0 flex-col border-r">
      {/* Logo */}
      <div className="border-border flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-foreground text-xl font-bold tracking-tight">
            Up<span className="text-primary">IQ</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-border space-y-1 border-t p-3">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {/* User info + sign out */}
        <div className="border-border mt-2 rounded-md border p-3">
          <div className="mb-2">
            <p className="text-foreground truncate text-sm font-medium">
              {displayName ?? 'Freelancer'}
            </p>
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  )
}
