import { useProjetsStore } from '@/store/useProjetsStore'
import { useRemboursementsData } from './useRemboursementsData'
import { useEcheanceForm } from './useEcheanceForm'
import { tableauAmortissementServices } from '@/services/tableauAmortissements.services'
import { toast } from 'sonner'
import type { TABLEAU_AMORTISSEMENT_T } from '@/types'

export function useRemboursementsModal() {
  const projet = useProjetsStore((s) => s.remboursementsModalProjet)
  const setProjet = useProjetsStore((s) => s.setRemboursementsModalProjet)

  const { planRemboursement, echeances, stats, isLoading } = useRemboursementsData(projet)
  const echeanceForm = useEcheanceForm(planRemboursement?.id || 0, echeances.length)
  const { mutate: updateMutation } = tableauAmortissementServices.useUpdate()

  const handleClose = () => {
    setProjet(null)
  }

  const toggleStatut = (echeance: TABLEAU_AMORTISSEMENT_T, checked: boolean) => {
    const newStatut = checked ? 'PAYE' : 'NON_PAYE'
    updateMutation(
      { id: echeance.id, data: { statut: newStatut } },
      {
        onSuccess: () => {
          toast.success(`Échéance ${echeance.periode} marquée comme ${checked ? 'payée' : 'non payée'}`)
        }
      }
    )
  }

  return {
    projet,
    planRemboursement,
    echeances,
    stats,
    isLoading,
    handleClose,
    toggleStatut,
    echeanceForm
  }
}
