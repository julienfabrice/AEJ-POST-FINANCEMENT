import { useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdvanceWorkflow } from '../../useAdvanceWorkflow'
import { useWorkflowVersionsMap, getEtapeActuelle, getActionsForRole } from '../../useWorkflowVersionsMap'
import { WORKFLOW_ADVANCE_DISABLED } from '@/constants/devFlags'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'

export function useAutoriserNumero(projet: MICRO_PROJET_T | null) {
  const [isOpen, setIsOpen] = useState(false)
  const [numeroToAuth, setNumeroToAuth] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { advance } = useAdvanceWorkflow()
  const { versionsMap } = useWorkflowVersionsMap()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const roleCode = import.meta.env.VITE_MOCK_USER_ROLE || user?.role?.code || ''

  // Mutation hypothétique vers un endpoint bulk pour autoriser les lignes d'un même numéro
  const autoriserMutation = useMutation({
    mutationFn: async ({ planId, numero, date, justif }: { planId: number, numero: number, date: string, justif: string }) => {
      // TODO: Ajuster l'URL selon l'implémentation backend exacte
      const response = await axiosInstance.patch(`/plan-decaissements/${planId}/autoriser-numero`, {
        numero_ligne: numero,
        date_autorisation: date,
        justif_autorisation: justif
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] })
      queryClient.invalidateQueries({ queryKey: ['plan-decaissements'] })
    }
  })

  const openAutoriserModal = (numero: number) => {
    setNumeroToAuth(numero)
    setIsOpen(true)
  }

  const closeAutoriserModal = () => {
    setIsOpen(false)
    setNumeroToAuth(null)
  }

  const submitAutorisation = async (date: string, justifId: string) => {
    if (!projet || numeroToAuth === null) return
    const plan = projet.plan_decaissement
    if (!plan) return

    setIsSubmitting(true)
    try {
      if (WORKFLOW_ADVANCE_DISABLED) {
        console.log(`[useAutoriserNumero] Simulation d'autorisation du N°${numeroToAuth}`)
        toast.info(`Lignes du N°${numeroToAuth} autorisées (Simulation VITE_WORKFLOW_ADVANCE_DISABLED)`)
      } else {
        await autoriserMutation.mutateAsync({
          planId: plan.id,
          numero: numeroToAuth,
          date,
          justif: justifId
        })
        toast.success(`Le décaissement (N°${numeroToAuth}) a été autorisé.`)
      }

      // Vérifier si c'est la toute première autorisation sur ce plan.
      // Si oui, on fait avancer le workflow dynamiquement.
      const lignes = plan.lignes || []
      const isFirstAuth = Math.min(...lignes.map(l => l.numero_ligne)) === numeroToAuth
      
      if (isFirstAuth) {
        const etapeActuelle = getEtapeActuelle(projet.workflow_instance?.workflow_version, projet.workflow_instance?.current_etape_code, versionsMap)
        const actionCodes = getActionsForRole(etapeActuelle, roleCode)
        const actionCode = actionCodes.length > 0 ? actionCodes[0] : 'AUTORISER'

        await advance({ 
          projet, 
          action: actionCode, 
          comment: `Autorisation de la première ligne de décaissement (N°${numeroToAuth})`
        })
      }

      closeAutoriserModal()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'autorisation du décaissement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    numeroToAuth,
    isSubmitting,
    openAutoriserModal,
    closeAutoriserModal,
    submitAutorisation
  }
}

