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
    // DÉSACTIVATION AUTHENTIFICATION
    // Si l'utilisateur n'est pas "connecté" ou s'il n'a pas de profil, on lui en injecte un faux.
    if (!useAuthStore.getState().user) {
      useAuthStore.getState().setSession({
        id: 9999,
        nom: 'Dev',
        prenom: 'Local',
        email: 'dev@local.aej',
        telephone: '',
        adresse: '',
        role_id: 1,
        fonction_id: null,
        organisme_id: null,
        agence_regionale_id: null,
        is_active: 1,
        mot_de_passe_change: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: { id: 1, code: 'ADMIN-1', libelle: 'Admin', description: '', is_active: 1, created_at: '', updated_at: '' },
        fonction: null,
        agence: null,
        organisme: null,
        permissions: []
      })
    }
    
    // On bypass l'appel /me du backend
    return;

    // if (!useAuthStore.getState().isAuthenticated) {
    //   throw redirect({ to: ROUTES.LOGIN, search: { redirect: location.href } })
    // }

    // const me = await context.queryClient.ensureQueryData({
    //   queryKey: AUTH_ME_KEY,
    //   queryFn: authServices.me,
    // })

    // // Le profil frais fait foi : on resynchronise le store au passage.
    // useAuthStore.getState().setSession(me)
  },
  component: AppLayout,
})
