import { useState } from 'react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useUploadDocumentMutation } from '@/services/documents.services'
import { toast } from 'sonner'

export function useJoindrePlanAction() {
  const { joindrePlanModalProjet: projet, setJoindrePlanModalProjet } = useProjetsStore()
  const uploadMutation = useUploadDocumentMutation()

  const [file, setFile] = useState<File | null>(null)
  const [observation, setObservation] = useState('')

  const execute = async (projetToOpen: MICRO_PROJET_T) => {
    setJoindrePlanModalProjet(projetToOpen)
  }

  const handleClose = () => {
    setJoindrePlanModalProjet(null)
    setFile(null)
    setObservation('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast.error("Le fichier du plan d'affaires est requis")
      return
    }
    
    if (!projet) return

    try {
      await uploadMutation.mutateAsync({
        file,
        folder: 'Mega',
        micro_projet_id: projet.id.toString()
      })
      handleClose()
    } catch (error) {
      // L'erreur est déjà gérée dans la mutation
    }
  }

  return { 
    execute,
    projet,
    isOpen: !!projet,
    handleClose,
    handleSubmit,
    file,
    setFile,
    observation,
    setObservation,
    isSubmitting: uploadMutation.isPending 
  }
}
