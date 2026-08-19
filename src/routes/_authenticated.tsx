import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { ROUTES } from '@/constants/routes'
import { AUTH_ME_KEY } from '@/hooks/auth.hooks'
import { authServices } from '@/services/auth.services'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Auth gate for every authenticated screen.
 *
 * Deux étages :
 *  1. le flag persisté ferme la porte immédiatement (synchrone, sans réseau) ;
 *  2. `ensureQueryData` valide réellement le cookie contre `/personnel/me` — ce
 *     qui fait office de vérification de session au chargement de l'app.
 *
 * Un cookie expiré remonte un 401 : l'intercepteur axios vide la session et
 * renvoie vers `/login`.
 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location, context }) => {
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
