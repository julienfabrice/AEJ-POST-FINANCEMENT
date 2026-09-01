import { promoteursServices } from '@/services/promoteurs.services'
import { projetsServices } from '@/services/projets.services'
import { decaissementServices } from '@/services/decaissements.services'
import { remboursementServices } from '@/services/remboursements.services'

export function useAdminKpis() {
  const { data: promoteursData, isLoading: loadingPromoteurs } = promoteursServices.useGetPromoteurs({ page: 1, perPage: 1 })
  const { data: projetsData, isLoading: loadingProjets } = projetsServices.useGetAll(1, 1)
  const { data: decaissementsData, isLoading: loadingDecaissements } = decaissementServices.useGetAll()
  const { data: remboursementsData, isLoading: loadingRemboursements } = remboursementServices.useGetAll()

  const nbPromoteurs = promoteursData?.total || 0
  const nbProjets = projetsData?.pagination?.total || 0

  const valides = decaissementsData?.filter(d => d.statut === 'VALIDE') || []
  const montantDecaisse = valides.reduce((sum, d) => sum + Number(d.montant_decaisse || 0), 0)

  const montantEchu = remboursementsData?.reduce((sum, r) => sum + Number(r.montant_echu || 0), 0) || 0
  const montantPaye = remboursementsData?.reduce((sum, r) => sum + Number(r.montant_paye || 0), 0) || 0
  const tauxRemboursement = montantEchu > 0 ? Math.round((montantPaye / montantEchu) * 100) : 0

  return {
    nbPromoteurs,
    nbProjets,
    montantDecaisse,
    nbDecaissements: valides.length,
    tauxRemboursement,
    isLoading: loadingPromoteurs || loadingProjets || loadingDecaissements || loadingRemboursements
  }
}
