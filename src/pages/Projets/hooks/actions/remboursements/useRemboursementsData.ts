import { useMemo } from 'react'
import { planRemboursementServices } from '@/services/planRemboursements.services'
import { tableauAmortissementServices } from '@/services/tableauAmortissements.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useRemboursementsData(projet: MICRO_PROJET_T | null) {
  // 1. Récupérer le plan de remboursement (l'entête du crédit)
  const { 
    data: plans = [], 
    isLoading: isLoadingPlan 
  } = planRemboursementServices.useGetAll(projet?.id)

  const planRemboursement = plans.length > 0 ? plans[0] : null

  // 2. Récupérer le tableau d'amortissement (les échéances) lié à ce plan
  const { 
    data: echeances = [], 
    isLoading: isLoadingEcheances 
  } = tableauAmortissementServices.useGetAll(planRemboursement?.id)

  const isLoading = isLoadingPlan || (!!planRemboursement && isLoadingEcheances)

  // 3. Calculer les statistiques du crédit
  const stats = useMemo(() => {
    if (!planRemboursement) return null

    const mtCredit = planRemboursement.montant_credit
    
    const totalDu = echeances.reduce((acc, curr) => acc + Number(curr.montant_echeance), 0)
    
    // Simplification de "Payé" : dans la maquette, paye c'est montant_echeance si PAYE.
    const totalPaye = echeances
      .filter(e => e.statut === 'PAYE')
      .reduce((acc, curr) => acc + Number(curr.montant_echeance), 0)
      
    // Si PARTIEL, ce serait un peu plus complexe (il faudrait un champ `montant_paye` sur la table), 
    // mais dans l'API actuelle TABLEAU_AMORTISSEMENT_T, on n'a que `statut` ou `capital_rembourse`. 
    // On s'en tient à l'existant.

    const resteDu = Math.max(0, totalDu - totalPaye)

    return {
      montantCredit: mtCredit,
      tauxInteret: planRemboursement.interets,
      duree: planRemboursement.duree_remboursement,
      totalDu,
      totalPaye,
      resteDu,
      mensualiteCalculee: echeances.length > 0 ? Number(echeances[0].montant_echeance) : 0,
    }
  }, [planRemboursement, echeances])

  return {
    planRemboursement,
    echeances,
    stats,
    isLoading
  }
}
