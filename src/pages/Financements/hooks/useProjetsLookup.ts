import { useMemo } from 'react'
import { projetsServices } from '@/services/projets.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

/**
 * Charge une page large de /projets une seule fois et expose une table de
 * correspondance id → micro-projet (avec relations guichet/organisme/agence
 * déjà embarquées côté API), pour joindre les tables Budgets/Remboursements
 * qui ne référencent qu'un micro_projet_id / budget_id.
 */
export function useProjetsLookup() {
  const { data, isLoading } = projetsServices.useGetAll(1, 200)

  const projetById = useMemo(() => {
    const map = new Map<number, MICRO_PROJET_T>()
    data?.data.forEach((p) => map.set(p.id, p))
    return map
  }, [data])

  return { projetById, isLoading }
}
