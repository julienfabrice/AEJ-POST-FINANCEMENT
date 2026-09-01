import { projetsServices } from '@/services/projets.services'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'
import { useAuthStore } from '@/store/useAuthStore'

export function usePartnerEtapes() {
  const organismeScope = useAuthStore(s => s.organismeScope())
  const { data, isLoading } = projetsServices.useGetAll(1, 1000, {
    organisme_id: organismeScope || undefined
  })
  
  const projects = data?.data || []

  const etapeCounts = projects.reduce((acc, p) => {
    const status = p.statut || 'BROUILLON'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Pour le PF, on s'intéresse souvent aux étapes aval (FINANCEMENT, DECAISSEMENT, SUIVI, REMBOURSEMENT)
  const targetKeys = ['EN_DECAISSEMENT', 'EN_SUIVI', 'EN_REMBOURSEMENT']
  const etapeItems = PROJECT_STATUSES
    .filter(s => targetKeys.includes(s.key) || etapeCounts[s.key] > 0)
    .map(s => ({
      label: s.label.toUpperCase(),
      value: etapeCounts[s.key] || 0,
      highlighted: ['EN_SUIVI', 'EN_REMBOURSEMENT'].includes(s.key),
    }))

  return { etapeItems, isLoading }
}
