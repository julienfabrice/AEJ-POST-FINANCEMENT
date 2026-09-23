import { useProjetsStore } from '@/store/useProjetsStore'
import { useAdvanceWorkflow } from '@/pages/Projets/hooks/useAdvanceWorkflow'
import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import { refLabel } from '@/types/referentials.types'

export function useImputerAlertModal() {
  const projet = useProjetsStore(s => s.imputerAlertModalProjet)
  const setProjet = useProjetsStore(s => s.setImputerAlertModalProjet)
  const { advance, isAdvancing } = useAdvanceWorkflow()
  const { data: agences = [] } = agenceRegionaleServices.useGetAll()

  const isOpen = projet !== null

  let agenceName = 'Direction'
  if (projet?.agence) {
    agenceName = refLabel(projet.agence)
  } else if (projet?.agence_id) {
    const found = agences.find(a => a.id === projet.agence_id)
    agenceName = found ? found.nom : `Agence #${projet.agence_id}`
  }

  const handleClose = () => {
    if (!isAdvancing) {
      setProjet(null)
    }
  }

  const handleAdvance = async () => {
    if (!projet) return
    await advance({ projet, action: 'IMPUTER' })
    handleClose()
  }

  return {
    projet,
    isOpen,
    isAdvancing,
    agenceName,
    handleClose,
    handleAdvance
  }
}
