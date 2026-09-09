import { Building2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { DashboardPageHeader } from '../../shared/components/DashboardPageHeader'

export function PartnerDashboardHeader() {
  const user = useAuthStore(s => s.user)

  return (
    <DashboardPageHeader
      title={user?.organisme?.libelle || 'Partenaire Financier'}
      subtitle="Vue de votre portefeuille de financement AEJ"
      icon={Building2}
    />
  )
}
