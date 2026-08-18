import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '@/pages/Login/Login'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/login')({
  // Preserve where the user was headed before the guard bounced them.
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Login,
})
