import { useState, useCallback, useMemo, useEffect } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { projetsServices } from '@/services/projets.services'
import { dispositifServices } from '@/services/dispositifs.services'
import { lotsTransmissionServices } from '@/services/lotsTransmission.services'
import { useAdvanceWorkflow } from '@/pages/Projets/hooks/useAdvanceWorkflow'

const route = getRouteApi('/_authenticated/_agent/transmission')

export function useTransmission() {
  const [activeTab, setActiveTab] = useState<'composer' | 'lots'>('composer')
  const [selectedGuichet, setSelectedGuichet] = useState(search.guichet_id || '')
  
  // Si on a un projet en search param, on le pré-coche
  const [selectedDossiers, setSelectedDossiers] = useState<Set<string>>(
    new Set(search.projet_id ? [search.projet_id] : [])
  )

  // Nettoyer les search params après le premier montage
  useState(() => {
    if (search.guichet_id || search.projet_id) {
      navigate({
        to: '/transmission',
        replace: true,
      })
    }
  })

  // Récupérer les vrais dispositifs (guichets)
  const { data: dispositifs = [], isLoading: isLoadingDispositifs } = dispositifServices.useGetAll()

  // Auto-sélectionner le premier dispositif si aucun n'est sélectionné et que la liste est chargée
  useEffect(() => {
    if (!selectedGuichet && dispositifs.length > 0) {
      setSelectedGuichet(dispositifs[0].id.toString())
    }
  }, [selectedGuichet, dispositifs])

  // Récupérer les vrais projets pour ce guichet
  const { data: projetsRes, isLoading: isLoadingProjets } = projetsServices.useGetAll(1, 100, {
    dispositif_id: selectedGuichet,
  })

  // Filtrer uniquement les projets éligibles à la transmission
  const projetsEligibles = useMemo(() => {
    return (projetsRes?.data || []).filter(p => !!p.workflow_instance)
  }, [projetsRes])

  const handleSelectAll = useCallback(() => {
    setSelectedDossiers(new Set(projetsEligibles.map((p) => p.id.toString())))
  }, [projetsEligibles])

  const toggleDossier = useCallback((id: string) => {
    setSelectedDossiers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return {
    activeTab,
    setActiveTab,
    selectedGuichet,
    setSelectedGuichet,
    selectedDossiers,
    projetsEligibles,
    isLoadingProjets,
    dispositifs,
    isLoadingDispositifs,
    handleSelectAll,
    toggleDossier,
    handleSubmit,
    isSubmitting: createLotMutation.isPending || isAdvancing,
  }
}
