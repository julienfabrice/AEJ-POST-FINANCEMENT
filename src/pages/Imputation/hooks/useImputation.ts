import { useMemo, useState, useCallback } from 'react'
import { useSearch } from '@tanstack/react-router'
import { projetsServices } from '@/services/projets.services'
import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import { useAdvanceWorkflow } from '@/pages/Projets/hooks/useAdvanceWorkflow'
import { useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { WORKFLOW_ADVANCE_DISABLED } from '@/constants/devFlags'
import { toast } from 'sonner'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

/**
 * Détermine si un projet est en attente d'imputation.
 *
 * Règle de priorité :
 *  1. Si le projet a un workflow_instance, on se fie à current_etape_code.
 *     Le code configuré dans le paramétrage peut varier (ex. 'IMPUTATION', 'IMPUTER', etc.) ;
 *     on cherche donc une correspondance insensible à la casse avec le mot "IMPUTATION".
 *  2. Sinon (workflow non encore rattaché, env. de dev), on se rabat sur l'absence d'agence_id.
 */
function isEnAttenteImputation(p: MICRO_PROJET_T): boolean {
  const etape = p.workflow_instance?.current_etape_code
  if (etape !== undefined && etape !== null) {
    return etape.toUpperCase().includes('IMPUTATION') || etape.toUpperCase().includes('IMPUTER')
  }
  // Fallback : pas encore imputé
  return p.agence_id === null || p.agence_id === undefined
}

export function useImputation() {
  const search = useSearch({ from: '/_authenticated/_agent/imputation' }) as { projetId?: number }
  const projetIdInitial = search.projetId

  // Charger tous les projets sans filtre de statut pour ne pas rater ceux à imputer
  const { data: projetsRes, isLoading: isLoadingProjets, isFetching } = projetsServices.useGetAll(1, 200)
  const { data: agences = [], isLoading: isLoadingAgences } = agenceRegionaleServices.useGetAll()
  const { advance, isAdvancing } = useAdvanceWorkflow()
  const queryClient = useQueryClient()

  const projets: MICRO_PROJET_T[] = useMemo(() => projetsRes?.data ?? [], [projetsRes])

  /** Dossiers en attente = pas encore imputés, à l'étape IMPUTATION */
  const attente = useMemo(() => projets.filter(isEnAttenteImputation), [projets])

  /** Dossiers déjà imputés = agence_id défini et hors étape IMPUTATION */
  const faits = useMemo(() => projets.filter(p => !isEnAttenteImputation(p)), [projets])

  // ─── Sélection de masse ──────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<number[]>(
    projetIdInitial ? [projetIdInitial] : []
  )

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const toggleAllSelection = useCallback((checked: boolean) => {
    setSelectedIds(checked ? attente.map(p => p.id) : [])
  }, [attente])

  /**
   * Projets sélectionnés pour l'affichage dans le drawer.
   * On cherche dans TOUS les projets (pas seulement attente) pour que
   * le dossier cliqué depuis la page Projets apparaisse toujours dans la liste.
   */
  const selectedProjets = useMemo(
    () => projets.filter(p => selectedIds.includes(p.id)),
    [projets, selectedIds]
  )

  // ─── Imputation de masse ─────────────────────────────────────────────────
  const [isBulkImputing, setIsBulkImputing] = useState(false)

  const handleBulkImputation = useCallback(async (agenceId: number | null) => {
    if (selectedIds.length === 0) return

    // Seuls les projets effectivement dans "attente" sont imputable
    const projetsCibles = attente.filter(p => selectedIds.includes(p.id))
    if (projetsCibles.length === 0) {
      toast.warning("Aucun des dossiers sélectionnés n'est éligible à l'imputation.")
      return
    }

    setIsBulkImputing(true)
    try {
      await Promise.all(
        projetsCibles.map(async (projet) => {
          // Imputer à une agence → PATCH agence_id + avancer le workflow
          // Conserver à la Direction → avancer le workflow SEULEMENT (pas de PATCH)
          if (agenceId !== null && !WORKFLOW_ADVANCE_DISABLED) {
            try {
              await axiosInstance.patch(`/projets/${projet.id}`, { agence_id: agenceId })
            } catch {
              await axiosInstance.put(`/projets/${projet.id}`, { agence_id: agenceId })
            }
          }

          // Avancer le workflow dans tous les cas
          if (projet.workflow_instance) {
            await advance({ projet, action: 'IMPUTER' })
          }
        })
      )

      queryClient.invalidateQueries({ queryKey: ['projets'] })
      const label = agenceId !== null
        ? `${projetsCibles.length} dossier(s) imputé(s) à l'agence avec succès`
        : `${projetsCibles.length} dossier(s) conservé(s) par la Direction`
      toast.success(label)
      setSelectedIds([])
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'imputation des dossiers.")
    } finally {
      setIsBulkImputing(false)
    }
  }, [selectedIds, attente, advance, queryClient])

  const totalApprouves = projets.length

  const nbAgences = useMemo(() => {
    const ids = new Set(faits.map((d) => d.agence_id).filter(Boolean))
    return ids.size
  }, [faits])

  return {
    attente,
    faits,
    projets,
    agences,
    totalApprouves,
    nbAgences,
    isLoading: isLoadingProjets || isLoadingAgences,
    isFetching,
    isAdvancing,
    isBulkImputing,
    selectedIds,
    selectedProjets,
    toggleSelection,
    toggleAllSelection,
    handleBulkImputation,
  }
}
