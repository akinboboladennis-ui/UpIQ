import { useAuthStore } from '@/stores/authStore'

/**
 * Convenience hook — returns the current user and loading state from the auth store.
 * Use in client components that need to react to auth state.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isAuthenticated = !!user

  return { user, isLoading, isAuthenticated }
}
