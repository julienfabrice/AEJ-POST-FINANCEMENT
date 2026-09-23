import { useNavigate } from '@tanstack/react-router'
import { useProjetsStore } from '@/store/useProjetsStore'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useImputerAction() {
  const navigate = useNavigate()
  const setImputerAlertModalProjet = useProjetsStore(s => s.setImputerAlertModalProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    // Si le dossier a déjà une agence (donc déjà imputé)
    if (projet.agence_id !== null && projet.agence_id !== undefined) {
      setImputerAlertModalProjet(projet)
      return
    }

    // Sinon on l'envoie sur la page d'imputation
    navigate({
      to: '/imputation',
      search: { projetId: projet.id }
    })
  }

  return { execute }
}
