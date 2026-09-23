import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useExaminerAction() {
  const setExaminerModalProjet = useProjetsStore(s => s.setExaminerModalProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    setExaminerModalProjet(projet)
  }

  return { execute }
}
