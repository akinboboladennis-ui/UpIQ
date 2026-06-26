'use client'

import { useRouter } from 'next/navigation'
import { Bell, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar } from '@/components/ui/avatar'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useUiStore } from '@/stores/uiStore'
import { createClient } from '@/lib/supabase/client'

interface TopNavProps {
  displayName: string | null
  firstName: string | null
  email: string
}

export function TopNav({ displayName, firstName, email }: TopNavProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { setMobileMenuOpen } = useUiStore()

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
    <header className="border-border bg-background/80 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-sm">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile logo */}
      <div className="text-foreground text-base font-bold tracking-tight lg:hidden">
        Up<span className="text-primary">IQ</span>
      </div>

      {/* Search */}
      <div className="hidden max-w-sm flex-1 sm:flex">
        <label htmlFor="global-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <Search
            className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            id="global-search"
            type="search"
            placeholder="Search…"
            disabled
            className={cn(
              'border-border bg-muted/50 text-foreground placeholder:text-muted-foreground',
              'h-8 w-full rounded-md border pl-9 pr-3 text-sm',
              'focus:ring-ring focus:border-ring focus:outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Search icon on mobile */}
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search" disabled>
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
          disabled
        >
          <Bell className="h-4 w-4" />
          {/* Future: unread badge */}
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="focus-visible:ring-ring ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2"
              aria-label="User menu"
            >
              <Avatar name={displayName ?? firstName} size="sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground text-sm font-semibold">
                  {displayName ?? firstName ?? 'Freelancer'}
                </p>
                <p className="text-muted-foreground text-xs">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push('/settings/profile')}
              className="cursor-pointer"
            >
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
