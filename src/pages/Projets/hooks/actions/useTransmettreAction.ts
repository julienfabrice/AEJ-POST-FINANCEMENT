import { useNavigate } from '@tanstack/react-router'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useTransmettreAction() {
  const navigate = useNavigate()

  const execute = async (projet: MICRO_PROJET_T) => {
    navigate({
      to: '/transmission',
      search: {
        guichet_id: projet.dispositif_id ? projet.dispositif_id.toString() : undefined,
        projet_id: projet.id.toString(),
      },
    })
  }

  return { execute }
}
