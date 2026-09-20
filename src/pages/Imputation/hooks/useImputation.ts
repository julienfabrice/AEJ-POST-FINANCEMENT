import { useMemo, useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { projetsServices } from '@/services/projets.services'
import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useImputation() {
  const search = useSearch({ from: '/_authenticated/_agent/imputation' }) as { projetId?: number }
  const projetIdInitial = search.projetId

  const { data: projetsRes, isLoading: isLoadingProjets, isFetching } = projetsServices.useGetAll(1, 100, { statut: 'APPROUVE' })
  const { data: agences = [], isLoading: isLoadingAgences } = agenceRegionaleServices.useGetAll()
  
  const { mutate: imputerMutation, isPending: isImputing } = projetsServices.useImputer()
  const { mutate: bulkImputerMutation, isPending: isBulkImputing } = projetsServices.useBulkImputer()

  const projets: MICRO_PROJET_T[] = useMemo(() => projetsRes?.data ?? [], [projetsRes])

  const attente = useMemo(() => {
    return projets.filter((d) => !d.agence_id && !d.agence)
  }, [projets])

  const faits = useMemo(() => {
    return projets.filter((d) => Boolean(d.agence_id || d.agence))
  }, [projets])

  // Mass selection state
  const [selectedIds, setSelectedIds] = useState<number[]>(projetIdInitial ? [projetIdInitial] : [])

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleAllSelection = (checked: boolean) => {
    if (checked) {
      setSelectedIds(attente.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleBulkImputation = (agenceId: number | null) => {
    if (selectedIds.length === 0) return
    bulkImputerMutation(
      { ids: selectedIds, agence_id: agenceId },
      { onSuccess: () => setSelectedIds([]) } // clear selection after success
    )
  }

  const totalApprouves = projets.length

  const nbAgences = useMemo(() => {
    const ids = new Set(faits.map((d) => d.agence_id).filter(Boolean))
    return ids.size
  }, [faits])

  function handleImputer(id: number, agId: number) {
    imputerMutation({ id, agence_id: agId })
  }

  function handleDirection(id: number) {
    // Conservation à la direction ou sans agence locale
    imputerMutation({ id, agence_id: null })
  }

  return {
    attente,
    faits,
    agences,
    totalApprouves,
    nbAgences,
    isLoading: isLoadingProjets || isLoadingAgences,
    isFetching,
    isImputing,
    isBulkImputing,
    handleImputer,
    handleDirection,
    selectedIds,
    toggleSelection,
    toggleAllSelection,
    handleBulkImputation
  }
}

