import { useState } from 'react'
import { toast } from 'sonner'
import { useAdvanceWorkflow } from '../../useAdvanceWorkflow'
import { WORKFLOW_ADVANCE_DISABLED } from '@/constants/devFlags'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export type DecisionType = 'VALIDE' | 'AJOURNE'

export function useDecision(projet: MICRO_PROJET_T | null) {
  const [isOpen, setIsOpen] = useState(false)
  const [decisionType, setDecisionType] = useState<DecisionType>('VALIDE')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { advance } = useAdvanceWorkflow()
  const setExaminerModalProjet = useProjetsStore(s => s.setExaminerModalProjet)

  const openDecisionModal = (type: DecisionType) => {
    setDecisionType(type)
    setIsOpen(true)
  }

  const closeDecisionModal = () => {
    setIsOpen(false)
  }

  const submitDecision = async (motif: string) => {
    if (!projet) return

    setIsSubmitting(true)

    try {
      if (decisionType === 'VALIDE') {
        await advance({ projet, action: 'VALIDE', comment: motif })
        if (!WORKFLOW_ADVANCE_DISABLED) {
          toast.success("Le dossier a été validé avec succès.")
        }
      } else {
        // Logique AJOURNE
        await advance({ projet, action: 'AJOURNE', comment: motif, goToFirst: true })
        if (!WORKFLOW_ADVANCE_DISABLED) {
          toast.success("Le dossier a été ajourné et retourné au stade initial.")
        }
      }

      closeDecisionModal()
      setExaminerModalProjet(null) // Ferme le modal d'examen principal

    } catch (err) {
      console.error(err)
      // toast.error is already handled by mutations for the most part, but we can have a fallback
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    decisionType,
    isSubmitting,
    openDecisionModal,
    closeDecisionModal,
    submitDecision
  }
}
