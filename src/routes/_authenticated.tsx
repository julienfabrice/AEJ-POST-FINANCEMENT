import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AUTH_DISABLED } from '@/constants/devFlags'
import { ROUTES } from '@/constants/routes'
import { AUTH_ME_KEY } from '@/hooks/auth.hooks'
import { authServices } from '@/services/auth.services'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Auth gate for every authenticated screen.
 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location, context }) => {
  
    if (AUTH_DISABLED) return

    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: ROUTES.LOGIN, search: { redirect: location.href } })
    }

    const me = await context.queryClient.ensureQueryData({
      queryKey: AUTH_ME_KEY,
      queryFn: authServices.me,
    })

    // Le profil frais fait foi : on resynchronise le store au passage.
    useAuthStore.getState().setSession(me)
  },
  component: AppLayout,
})
