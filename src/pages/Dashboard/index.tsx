import { useAuthStore } from '@/store/useAuthStore'
import { AgentDashboard } from './AgentDashboard'
import { BenefDashboard } from './BenefDashboard'
import { AdminDashboard } from './AdminDashboard'

export function DashboardController() {
  const { user } = useAuthStore()

  if (user?.kind === 'benef') {
    return <BenefDashboard />
  }

  if (user?.roleCode === 'ADMIN' || user?.roleLibelle === 'Administrateur') {
    return <AdminDashboard />
  }

  return <AgentDashboard />
}
