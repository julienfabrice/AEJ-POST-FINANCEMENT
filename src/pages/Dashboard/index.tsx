import { useAuthStore } from '@/store/useAuthStore'
import { AgentDashboard } from './AgentDashboard'
import { BenefDashboard } from './BenefDashboard'
import { GuichetsDashboard } from './GuichetsDashboard'

export function DashboardController() {
  const { user } = useAuthStore()

  if (user?.kind === 'benef') {
    return <BenefDashboard />
  }

  // Si agent, vérifier la permission pour les guichets.
  // Pour le moment on suppose qu'un admin va sur les guichets par défaut.
  // Vous pourrez ajuster cette logique selon les rôles.
  if (user?.roleCode === 'ADMIN' || user?.roleLibelle === 'Administrateur') {
    return <GuichetsDashboard />
  }

  // Par défaut, le tableau de bord agent
  return <AgentDashboard />
}
