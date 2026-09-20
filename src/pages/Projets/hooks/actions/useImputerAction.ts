import { useNavigate } from '@tanstack/react-router'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useImputerAction() {
  const navigate = useNavigate()

  const execute = async (projet: MICRO_PROJET_T) => {
    navigate({
      to: '/imputation',
      search: { projetId: projet.id }
    })
  }

  return { execute }
}
