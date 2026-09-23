import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useCorrigerAction() {
  const setCorrigerModalProjet = useProjetsStore(s => s.setCorrigerModalProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    setCorrigerModalProjet(projet)
  }

  return { execute }
}
