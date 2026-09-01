import { dashboardAgencesServices } from '@/services/dashboard.services'

function fmt(v: string | number | null | undefined): string {
  if (v == null) return '0'
  const n = typeof v === 'string' ? parseFloat(v) : v
  return isNaN(n) ? String(v) : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

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
    montantFinance: fmt(data?.montant_financé),
    nbDecaissements: 0, // non fourni par cet endpoint
    tauxRemboursement: 0, // non fourni par cet endpoint
    emploisCreés: data?.emplois_créés ?? 0,
  }
}
