import { dashboardAgencesServices, dashboardPartenairesServices, dashboardEntreprisesServices } from '@/services/dashboard.services'

function fmt(v: string | number | null | undefined): string {
  if (v == null) return '0'
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (isNaN(n)) return String(v)
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

/**
 * KPIs Admin = combinaison des 3 endpoints Dashboard:
 *  - /dashboard/agences/kpis       → projets, promoteurs, montant financé
 *  - /dashboard/partenaires/kpis   → taux recouvrement, montant décaissé
 *  - /dashboard/entreprises/kpis   → emplois créés
 */
export function useAdminKpis() {
  const { data: agenceData, isLoading: l1 } = dashboardAgencesServices.useKpis()
  const { data: partenaireData, isLoading: l2 } = dashboardPartenairesServices.useKpis()
  const { data: entrepriseData, isLoading: l3 } = dashboardEntreprisesServices.useKpis()

  return {
    isLoading: l1 || l2 || l3,

    // Agences
    nbPromoteurs: agenceData?.nombre_promoteurs ?? 0,
    nbProjets: agenceData?.nombre_projets ?? 0,
    nbAgences: agenceData?.nombre_agences ?? 0,
    montantFinance: fmt(agenceData?.montant_financé),
    montantDecaisse: partenaireData?.montant_decaisse ?? 0,

    // Partenaires
    tauxRemboursement: partenaireData?.taux_recouvrement ?? 0,
    projetsFinances: partenaireData?.projets_finances ?? 0,
    montantAccorde: fmt(partenaireData?.montant_accorde),

    // Entreprises
    emploisCreés: entrepriseData?.emplois_crees ?? 0,
    nbEntreprises: entrepriseData?.nombre_entreprises ?? 0,
  }
}
