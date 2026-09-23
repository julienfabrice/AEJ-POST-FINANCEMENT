import { useState } from 'react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useAdvanceWorkflow } from '../useAdvanceWorkflow'
import { useDeliverableUploads } from '../useDeliverableUploads'
import { useUploadDocumentMutation } from '@/services/documents.services'
import { toast } from 'sonner'

export function useJoindrePlanAction() {
  const { joindrePlanModalProjet: projet, setJoindrePlanModalProjet } = useProjetsStore()
  const { advance, isAdvancing } = useAdvanceWorkflow()
  const uploadMutation = useUploadDocumentMutation()

  const currentEtapeCode = projet?.workflow_instance?.current_etape_code
  const deliverableUploads = useDeliverableUploads(currentEtapeCode)

  const [paFile, setPaFile] = useState<File | null>(null)
  const [observation, setObservation] = useState('')

  const execute = async (projetToOpen: MICRO_PROJET_T) => {
    setJoindrePlanModalProjet(projetToOpen)
  }

  const handleClose = () => {
    setJoindrePlanModalProjet(null)
    setObservation('')
    setPaFile(null)
    deliverableUploads.reset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projet) return

    if (!paFile) {
      toast.error("Le fichier du plan d'affaires est requis")
      return
    }

    try {
      // 1. Upload manuel de paFile dans "Mega"
      await uploadMutation.mutateAsync({
        file: paFile,
        folder: 'Mega',
        micro_projet_id: projet.id.toString(),
      })

      // 2. Upload & enregistrement des livrables workflow
      await deliverableUploads.submitDeliverables(projet)

      // 3. Avancement du workflow (historique + patch instance)
      await advance({
        projet,
        action: 'JOINDRE_PLAN',
        comment: observation || undefined,
      })

      handleClose()
    } catch (error) {
      // Les erreurs sont gérées dans submitDeliverables, uploadMutation et advance
    }
  }

  return {
    execute,
    projet,
    isOpen: !!projet,
    handleClose,
    handleSubmit,
    observation,
    setObservation,
    paFile,
    setPaFile,
    isSubmitting: isAdvancing || deliverableUploads.isSubmittingDeliverables || uploadMutation.isPending,
    // Upload de livrables
    etapeDeliverables: deliverableUploads.etapeDeliverables,
    isLoadingConfig: deliverableUploads.isLoadingConfig,
    sources: deliverableUploads.sources,
    setFile: deliverableUploads.setFile,
    setExistingDocument: deliverableUploads.setExistingDocument,
  }
}

