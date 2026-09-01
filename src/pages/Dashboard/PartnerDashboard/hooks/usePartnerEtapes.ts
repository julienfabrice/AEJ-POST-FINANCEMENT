import { dashboardPartenairesServices } from '@/services/dashboard.services'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'

export function usePartnerEtapes() {
  const { data, isLoading } = dashboardPartenairesServices.useEtatFinancements()

  const statusMap = (data || []).reduce((acc, s) => {
    acc[s.statut] = s.count
    return acc
  }, {} as Record<string, number>)

  const etapeItems = PROJECT_STATUSES
    .filter(s => (statusMap[s.key] ?? 0) > 0)
    .map(s => ({
      label: s.label,
      value: statusMap[s.key] ?? 0,
      highlighted: ['EN_SUIVI', 'EN_REMBOURSEMENT'].includes(s.key),
    }))

  return { etapeItems, isLoading }
}
