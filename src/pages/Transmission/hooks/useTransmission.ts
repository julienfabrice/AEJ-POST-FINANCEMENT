import { useState, useCallback, useMemo, useEffect } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { projetsServices } from '@/services/projets.services'
import { dispositifServices } from '@/services/dispositifs.services'
import { lotsTransmissionServices } from '@/services/lotsTransmission.services'
import { useAdvanceWorkflow } from '@/pages/Projets/hooks/useAdvanceWorkflow'

const route = getRouteApi('/_authenticated/_agent/transmission')

export function useTransmission() {
  const search = route.useSearch() as { guichet_id?: string; projet_id?: string }
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'composer' | 'lots'>('composer')
  const [selectedGuichet, setSelectedGuichet] = useState(search.guichet_id || '')
  
  // Si on a un projet en search param, on le pré-coche
  const [selectedDossiers, setSelectedDossiers] = useState<Set<string>>(
    new Set(search.projet_id ? [search.projet_id] : [])
  )

  // Nettoyer les search params après le premier montage
  useEffect(() => {
    if (search.guichet_id || search.projet_id) {
      navigate({
        to: '/transmission',
        replace: true,
      })
    }
  }, [search.guichet_id, search.projet_id, navigate])

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

  const createLotMutation = lotsTransmissionServices.useCreate()
  const { advance, isAdvancing } = useAdvanceWorkflow()

  const handleSubmit = async (values: any) => {
    try {
      await createLotMutation.mutateAsync({
        ...values,
        guichet_id: Number(selectedGuichet),
        organisme_id: 1, // À ajuster selon l'utilisateur
        statut: 'EN_ATTENTE',
      })

      // Avancer le workflow pour tous les projets sélectionnés
      await Promise.all(
        Array.from(selectedDossiers).map(async (id) => {
          const projet = projetsEligibles.find((p) => p.id.toString() === id)
          if (projet?.workflow_instance) {
            await advance({
              projet,
              action: 'TRANSMISSION',
            })
          }
        })
      )

      toast.success('Lot créé et projets transmis avec succès')
      setSelectedDossiers(new Set())
      setActiveTab('lots')
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la transmission')
    }
  }

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
