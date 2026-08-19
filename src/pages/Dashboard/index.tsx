import { MODULES } from '@/constants/modules'
import { useAuthStore } from '@/store/useAuthStore'
import { AgentDashboard } from './AgentDashboard'
import { BenefDashboard } from './BenefDashboard'
import { AdminDashboard } from './AdminDashboard'

export function DashboardController() {
  const space = useAuthStore((s) => s.space())
  // Droit, pas rôle : le tableau de bord guichets s'affiche pour quiconque a
  // accès au module, quel que soit son profil.
  const canSeeGuichets = useAuthStore((s) => s.can(MODULES.GUICHETS))

  if (space === 'entreprise') {
    return <BenefDashboard />
  }

  if (canSeeGuichets) {
    return <AdminDashboard />
  }

  return <AgentDashboard />
}
