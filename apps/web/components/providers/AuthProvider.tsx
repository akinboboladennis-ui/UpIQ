'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  return <>{children}</>
}
