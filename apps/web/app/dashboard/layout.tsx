import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const meta = user.user_metadata
  const displayName = (meta?.['display_name'] as string | null) ?? null
  const firstName = (meta?.['first_name'] as string | null) ?? null

  return (
    <DashboardShell displayName={displayName} firstName={firstName} email={user.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
