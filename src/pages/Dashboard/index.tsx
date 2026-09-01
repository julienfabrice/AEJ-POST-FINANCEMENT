// import { MODULES } from '@/constants/modules'
import { useAuthStore } from '@/store/useAuthStore'
import { AgentDashboard } from './AgentDashboard'
import { BenefDashboard } from './BenefDashboard'
import { PartnerDashboard } from './PartnerDashboard'
import { AdminDashboard } from './AdminDashboard'


export function DashboardController() {
  const space = useAuthStore((s) => s.space())
  const agencyScope = useAuthStore((s) => s.agencyScope())

  if (space === 'entreprise') {
    return <BenefDashboard />
  }

  if (space === 'organisme') {
    return <PartnerDashboard />
  }

  // Espace 'agence' : même dashboard, scope différent selon le rôle
  // Cloisonnés à une agence (CIP, CAR, AC)
  if (agencyScope) {
    return <AgentDashboard agencyId={agencyScope} />
  }
  
  // Vue nationale (ADMIN, DPF, DAICG…)
  return <AdminDashboard />
}
