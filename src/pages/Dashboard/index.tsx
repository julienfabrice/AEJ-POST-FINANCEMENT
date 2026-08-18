import { useAuthStore } from '@/store/useAuthStore'
import { AgentDashboard } from './AgentDashboard'
import { BenefDashboard } from './BenefDashboard'
import { GuichetsDashboard } from './GuichetsDashboard'

export function DashboardController() {
  const user = useAuthStore((s) => s.user)
  const space = useAuthStore((s) => s.space())

  if (space === 'entreprise') {
    return <BenefDashboard />
  }

  // Si agent, vérifier la permission pour les guichets.
  // Pour le moment on suppose qu'un admin va sur les guichets par défaut.
  // TODO: passer par `can('guichets')` plutôt qu'un code de rôle en dur.
  if (user?.role?.code === 'ADMIN-1') {
    return <GuichetsDashboard />
  }

  // Par défaut, le tableau de bord agent
  return <AgentDashboard />
}
