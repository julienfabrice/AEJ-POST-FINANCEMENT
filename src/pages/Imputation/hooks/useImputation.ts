import { useState, useMemo } from 'react'
import {
  MOCK_A_IMPUTER,
  MOCK_IMPUTES,
  type DossierAImputer,
  type DossierImpute,
} from '@/mock/imputation.mock'

export function useImputation() {
  const [attente, setAttente] = useState<DossierAImputer[]>(MOCK_A_IMPUTER)
  const [faits, setFaits] = useState<DossierImpute[]>(MOCK_IMPUTES)

  const totalApprouves = attente.length + faits.length

  const nbAgences = useMemo(() => {
    const ids = new Set(faits.filter((d) => d.gere_par === 'AGENCE').map((d) => d.agence_id))
    return ids.size
  }, [faits])

  function handleImputer(id: string, agId: string) {
    const d = attente.find((x) => x.id === id)
    if (!d) return
    setAttente((prev) => prev.filter((x) => x.id !== id))
    setFaits((prev) => [
      ...prev,
      {
        id: d.id,
        code: d.code,
        titre: d.titre,
        gere_par: 'AGENCE',
        agence_id: agId,
        plan_label: 'non saisi',
      },
    ])
  }

  function handleDirection(id: string) {
    const d = attente.find((x) => x.id === id)
    if (!d) return
    setAttente((prev) => prev.filter((x) => x.id !== id))
    setFaits((prev) => [
      ...prev,
      {
        id: d.id,
        code: d.code,
        titre: d.titre,
        gere_par: 'DIRECTION',
        plan_label: 'non saisi',
      },
    ])
  }

  return {
    attente,
    faits,
    totalApprouves,
    nbAgences,
    handleImputer,
    handleDirection,
  }
}
