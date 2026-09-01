import { projetsServices } from '@/services/projets.services'
import { decaissementServices } from '@/services/decaissements.services'
import { remboursementServices } from '@/services/remboursements.services'
import { useAuthStore } from '@/store/useAuthStore'

export function usePartnerKpis() {
  const organismeScope = useAuthStore(s => s.organismeScope())

  const { data: projetsData, isLoading: loadingProjets } = projetsServices.useGetAll(1, 1, { organisme_id: organismeScope || undefined })
  const { data: decaissementsData, isLoading: loadingDecaissements } = decaissementServices.useGetAll()
  const { data: remboursementsData, isLoading: loadingRemboursements } = remboursementServices.useGetAll()

  const nbLots = projetsData?.pagination?.total || 0 
  
  const decaissementsValides = decaissementsData?.filter(d => d.statut === 'VALIDE') || []
  const montantEngage = decaissementsValides.reduce((sum, d) => sum + Number(d.montant_decaisse || 0), 0)

  const montantEchu = remboursementsData?.reduce((sum, r) => sum + Number(r.montant_echu || 0), 0) || 0
  const montantPaye = remboursementsData?.reduce((sum, r) => sum + Number(r.montant_paye || 0), 0) || 0
  const tauxRemboursement = montantEchu > 0 ? Math.round((montantPaye / montantEchu) * 100) : 0

  return {
    nbLots,
    montantEngage,
    tauxRemboursement,
    isLoading: loadingProjets || loadingDecaissements || loadingRemboursements
  }
}
