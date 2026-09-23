import { useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdvanceWorkflow } from '../../useAdvanceWorkflow'
import { useWorkflowVersionsMap, getEtapeActuelle, getActionsForRole } from '../../useWorkflowVersionsMap'
import { WORKFLOW_ADVANCE_DISABLED } from '@/constants/devFlags'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { useUploadDocumentMutation } from '@/services/documents.services'
import type { ExecutionLigneDecaissementPayload } from '@/schema/plan-decaissements/executionSchema'

export function useExecuterModal(projet: MICRO_PROJET_T | null) {
  const [isOpen, setIsOpen] = useState(false)
  const [numeroToExec, setNumeroToExec] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { advance } = useAdvanceWorkflow()
  const { versionsMap } = useWorkflowVersionsMap()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const roleCode = import.meta.env.VITE_MOCK_USER_ROLE || user?.role?.code || ''
  const uploadMutation = useUploadDocumentMutation()

  const executerMutation = useMutation({
    mutationFn: async (payload: ExecutionLigneDecaissementPayload) => {
      const response = await axiosInstance.post(`/execution-ligne-decaissements`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] })
      queryClient.invalidateQueries({ queryKey: ['plan-decaissements'] })
    }
  })

  const openExecuterModal = (numero: number) => {
    setNumeroToExec(numero)
    setIsOpen(true)
  }

  const closeExecuterModal = () => {
    setIsOpen(false)
    setNumeroToExec(null)
  }

  const submitExecution = async ({
    date,
    file,
    mode_decaisse,
    observations
  }: {
    date: string
    file: File
    mode_decaisse: 'CHEQUE' | 'VIREMENT'
    observations: string
  }) => {
    if (!projet || numeroToExec === null) return
    const plan = projet.plan_decaissement
    if (!plan) return
    const lignesToExec = (plan.lignes || []).filter(l => l.numero_ligne === numeroToExec)
    if (!lignesToExec.length) return

    setIsSubmitting(true)
    try {
      let justificatif_path = ''

      try {
        const docResult = await uploadMutation.mutateAsync({
          file,
          folder: 'Decaissements',
          micro_projet_id: projet.id.toString()
        })
        justificatif_path = docResult.path
      } catch (err) {
        console.error(err)
        toast.error("Erreur lors de l'upload du justificatif.")
        setIsSubmitting(false)
        return
      }

      if (WORKFLOW_ADVANCE_DISABLED) {
        console.log(`[useExecuterNumero] Simulation d'exécution du N°${numeroToExec}`)
        toast.info(`Lignes du N°${numeroToExec} exécutées (Simulation)`)
      } else {
        await Promise.all(
          lignesToExec.map(ligne =>
            executerMutation.mutateAsync({
              ligne_decaissement_id: ligne.id!,
              statut: 'VALIDE',
              mode_decaisse,
              date_decaisse: date,
              justificatif_path,
              observations: observations || undefined
            })
          )
        )
        toast.success(`Le décaissement (N°${numeroToExec}) a été exécuté.`)
      }

      // Vérifier si c'est la toute dernière exécution sur ce plan
      // Si oui, on fait avancer le workflow (vers le SUIVI, l'AMORTISSEMENT ou la FIN selon le workflow)
      const lignes = plan.lignes || []
      const isLastExecution = Math.max(...lignes.map(l => l.numero_ligne)) === numeroToExec
      
      if (isLastExecution) {
        const etapeActuelle = getEtapeActuelle(projet.workflow_instance?.workflow_version, projet.workflow_instance?.current_etape_code, versionsMap)
        const actionCodes = getActionsForRole(etapeActuelle, roleCode)
        const actionCode = actionCodes.length > 0 ? actionCodes[0] : 'EXECUTER'

        await advance({ 
          projet, 
          action: actionCode, 
          comment: `Exécution de la dernière ligne de décaissement (N°${numeroToExec})`
        })
      }

      closeExecuterModal()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'exécution du décaissement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    numeroToExec,
    isSubmitting,
    openExecuterModal,
    closeExecuterModal,
    submitExecution
  }
}
