import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '@/pages/Login/Login'
import { resolveHome } from '@/lib/resolveHome'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/login')({
  // Preserve where the user was headed before the guard bounced them.
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: resolveHome(user) })
    }
  },
  component: Login,
})
