import { dashboardAgencesServices } from '@/services/dashboard.services'
import { formatNumber } from '@/helpers/numbers'

/**
 * KPIs Agent : filtrés automatiquement par le back-end via JWT (agence de l'agent)
 */
export function useAgentKpis(_agencyId?: string | null) {
  const { data, isLoading } = dashboardAgencesServices.useKpis()

  return {
    isLoading,
    nbPromoteurs: data?.nombre_promoteurs ?? 0,
    nbProjets: data?.nombre_projets ?? 0,
    montantDecaisse: data?.montant_décaissé ?? 0,
    montantFinance: formatNumber(data?.montant_financé) || '0',
    nbDecaissements: 0, // non fourni par cet endpoint
    tauxRemboursement: 0, // non fourni par cet endpoint
    emploisCreés: data?.emplois_créés ?? 0,
  }
}
