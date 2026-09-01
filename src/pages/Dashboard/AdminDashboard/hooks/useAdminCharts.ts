import { projetsServices } from '@/services/projets.services'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'
import { MOCK_REGIONS_HBARS, MOCK_AGENCES_HBARS, MOCK_SUIVI_TERRAIN } from '@/mock'

export function useAdminCharts() {
  // Optionnel: On pourrait filtrer ici si on voulait. Pour l'instant on compte tout.
  // L'idéal est que le backend renvoie les métriques, mais pour l'instant on compte côté client si on n'a pas de pagination, 
  // ou on fait au mieux avec les 500 premiers (limite max si pagination).
  // Attention: useGetAll(1, 1000) récupère un grand nombre de dossiers pour faire les stats client.
  const { data, isLoading } = projetsServices.useGetAll(1, 1000)
  
  const projects = data?.data || []

  // Calcul dynamique des étapes
  const etapeCounts = projects.reduce((acc, p) => {
    const status = p.statut || 'BROUILLON'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // On veut n'afficher que les étapes principales (ou toutes celles qui ont au moins 1)
  // Utilisons l'ordre de PROJECT_STATUSES pour rester cohérent
  const etapeItems = PROJECT_STATUSES
    .filter(s => etapeCounts[s.key] > 0 || ['EN_SOUMISSION', 'EN_ANALYSE', 'EN_FINANCEMENT'].includes(s.key))
    .map(s => ({
      label: s.label.toUpperCase(),
      value: etapeCounts[s.key] || 0,
      highlighted: ['EN_SUIVI', 'EN_REMBOURSEMENT', 'TERMINE'].includes(s.key),
    }))

  // Les régions, agences et suivi terrain sont toujours mockées car on n'a pas les points d'API complets pour ça
  const regionItems = MOCK_REGIONS_HBARS.map(s => ({
    label: s.label,
    value: s.nb,
    meta: `${s.nb} · ${s.montant}`,
  }))

  const agenceItems = MOCK_AGENCES_HBARS.map(s => ({
    label: s.label,
    value: s.nb,
    meta: `${s.nb} · ${s.montant}`,
  }))

  const suiviStats = [
    { label: "En bonne voie", value: MOCK_SUIVI_TERRAIN.bonneVoie, color: '#20A83A' },
    { label: "En difficulté", value: MOCK_SUIVI_TERRAIN.difficulte, color: '#D6453B' },
    { label: "Non visités", value: MOCK_SUIVI_TERRAIN.nonVisites, color: '#5A6B80' },
  ]

  return { etapeItems, regionItems, agenceItems, suiviStats, isLoading }
}
