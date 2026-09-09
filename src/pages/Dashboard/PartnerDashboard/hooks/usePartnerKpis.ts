import { dashboardPartenairesServices } from '@/services/dashboard.services'
import { formatNumber } from '@/helpers/numbers'

/**
 * KPIs Partenaire : filtrés automatiquement par le back-end via JWT
 */
export function usePartnerKpis() {
  const { data, isLoading } = dashboardPartenairesServices.useKpis()

  return {
    isLoading,
    nbLots: data?.projets_finances ?? 0,
    nbPartenaires: data?.nombre_partenaires ?? 0,
    montantEngage: data?.encours ?? 0,
    montantAccorde: formatNumber(data?.montant_accorde) || '0',
    montantDecaisse: data?.montant_decaisse ?? 0,
    tauxRemboursement: data?.taux_recouvrement ?? 0,
  }
}
