import { dashboardAgencesServices, dashboardPartenairesServices, dashboardEntreprisesServices } from '@/services/dashboard.services'
import { formatNumber } from '@/helpers/numbers'

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
    montantFinance: formatNumber(agenceData?.montant_financé) || '0',
    montantDecaisse: partenaireData?.montant_decaisse ?? 0,

    // Partenaires
    tauxRemboursement: partenaireData?.taux_recouvrement ?? 0,
    projetsFinances: partenaireData?.projets_finances ?? 0,
    montantAccorde: formatNumber(partenaireData?.montant_accorde) || '0',

    // Entreprises
    emploisCreés: entrepriseData?.emplois_crees ?? 0,
    nbEntreprises: entrepriseData?.nombre_entreprises ?? 0,
  }
}
