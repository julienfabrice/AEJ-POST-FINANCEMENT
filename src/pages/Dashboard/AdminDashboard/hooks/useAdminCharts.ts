import { dashboardAgencesServices } from '@/services/dashboard.services'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'
import { MOCK_REGIONS_HBARS, MOCK_SUIVI_TERRAIN } from '@/mock'
import { formatNumber } from '@/helpers/numbers'

export function useAdminCharts() {
  const { data: statutData, isLoading: l1 } = dashboardAgencesServices.useProjetsStatut()
  const { data: agenceData, isLoading: l2 } = dashboardAgencesServices.useProjetsAgence()
  const { data: financementData, isLoading: l3 } = dashboardAgencesServices.useFinancementAgence()

  // Statuts → BarChart : on respecte l'ordre de PROJECT_STATUSES
  const statutMap = (statutData || []).reduce((acc, s) => {
    acc[s.statut] = s.count
    return acc
  }, {} as Record<string, number>)

  const etapeItems = PROJECT_STATUSES
    .filter(s => (statutMap[s.key] ?? 0) > 0)
    .map(s => ({
      label: s.label,
      value: statutMap[s.key] ?? 0,
      highlighted: ['EN_SUIVI', 'EN_REMBOURSEMENT', 'TERMINE'].includes(s.key),
    }))

  // Agences → HBarChart
  const agenceItems = (agenceData || []).map(a => ({
    label: a.agence || 'Inconnue',
    value: typeof a.count === 'number' ? a.count : Number(a.count) || 0,
    meta: `${a.count} · ${formatNumber(a.montant) || '–'}${a.montant ? 'F' : ''}`,
  }))

  // Financement → tableau
  const financementRows = (financementData || []).map(f => ({
    annee: f.annee ?? '–',
    region: f.region ?? f.agence ?? '–',
    montant: (f.montant != null && f.montant !== '') ? formatNumber(f.montant) + ' F' : '–',
  }))

  // Régions → encore mockées (pas d'API région dans la doc)
  const regionItems = MOCK_REGIONS_HBARS.map(s => ({
    label: s.label,
    value: s.nb,
    meta: `${s.nb} · ${s.montant}`,
  }))

  const suiviStats = [
    { label: "En bonne voie", value: MOCK_SUIVI_TERRAIN.bonneVoie, color: '#20A83A' },
    { label: "En difficulté", value: MOCK_SUIVI_TERRAIN.difficulte, color: '#D6453B' },
    { label: "Non visités", value: MOCK_SUIVI_TERRAIN.nonVisites, color: '#5A6B80' },
  ]

  return {
    etapeItems,
    agenceItems,
    regionItems,
    financementRows,
    suiviStats,
    isLoading: l1 || l2 || l3,
  }
}
