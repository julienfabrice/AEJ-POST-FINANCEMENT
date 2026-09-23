import { useState } from 'react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useAdvanceWorkflow } from '../useAdvanceWorkflow'
import { useUploadDocumentMutation } from '@/services/documents.services'
import { toast } from 'sonner'

export function usePlanConventionAction() {
  const { planConventionModalProjet: projet, setPlanConventionModalProjet } = useProjetsStore()
  const { advance, isAdvancing } = useAdvanceWorkflow()
  const uploadMutation = useUploadDocumentMutation()

  const [referenceConvention, setReferenceConvention] = useState('')
  const [dateSignature, setDateSignature] = useState(new Date().toISOString().slice(0, 10))
  const [cvFile, setCvFile] = useState<File | null>(null)

  const execute = async (projetToOpen: MICRO_PROJET_T) => {
    setPlanConventionModalProjet(projetToOpen)
    setReferenceConvention('')
    setDateSignature(new Date().toISOString().slice(0, 10))
    setCvFile(null)
  }

  const handleClose = () => {
    setPlanConventionModalProjet(null)
    setReferenceConvention('')
    setCvFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projet) return

    if (!cvFile) {
      toast.error('Le fichier de la convention signée est requis')
      return
    }

    try {
      // 1. Upload the signed convention
      await uploadMutation.mutateAsync({
        file: cvFile,
        folder: 'Conventions',
        micro_projet_id: projet.id.toString(),
      })

      // 2. Format observation to include reference and date
      const observation = `Convention de prêt ajoutée.\nRéf: ${referenceConvention || 'N/A'}\nDate de signature: ${dateSignature}`

      // 3. Advance workflow
      await advance({
        projet,
        action: 'PLAN_CONVENTION',
        comment: observation,
      })

      handleClose()
      toast.success('Convention de prêt enregistrée avec succès')
    } catch (error) {
      console.error(error)
      // Note: toast.error is usually handled by mutations
    }
  }

  return {
    execute,
    projet,
    isOpen: !!projet,
    handleClose,
    handleSubmit,
    referenceConvention,
    setReferenceConvention,
    dateSignature,
    setDateSignature,
    cvFile,
    setCvFile,
    isSubmitting: isAdvancing || uploadMutation.isPending,
  }
}
