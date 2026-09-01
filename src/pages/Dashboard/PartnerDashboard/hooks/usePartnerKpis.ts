import { dashboardPartenairesServices } from '@/services/dashboard.services'

function fmt(v: string | number | null | undefined): string {
  if (v == null) return '0'
  const n = typeof v === 'string' ? parseFloat(v) : v
  return isNaN(n) ? String(v) : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

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
    montantAccorde: fmt(data?.montant_accorde),
    montantDecaisse: data?.montant_decaisse ?? 0,
    tauxRemboursement: data?.taux_recouvrement ?? 0,
  }
}
