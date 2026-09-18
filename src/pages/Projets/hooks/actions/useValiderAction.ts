import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useAdvanceWorkflow } from '../useAdvanceWorkflow'
import { validerSchema, type ValiderFormValues } from '@/schema/workflowActions/validerSchema'

export function useValiderAction() {
  const { validerModalProjet: projet, setValiderModalProjet } = useProjetsStore()
  const { advance, isAdvancing } = useAdvanceWorkflow()

  const form = useForm<ValiderFormValues>({
    resolver: zodResolver(validerSchema),
    defaultValues: {
      observation: '',
    },
  })

  const execute = async (projetToOpen: MICRO_PROJET_T) => {
    setValiderModalProjet(projetToOpen)
  }

  const handleClose = () => {
    setValiderModalProjet(null)
    form.reset()
  }

  const onSubmit = form.handleSubmit(async (data: ValiderFormValues) => {
    if (!projet) return

    try {
      await advance({
        projet,
        action: 'VALIDER',
        comment: data.observation || undefined,
      })
      handleClose()
    } catch (error) {
      // L'erreur est déjà gérée par la mutation advance
    }
  })

  return { 
    execute,
    projet,
    isOpen: !!projet,
    handleClose,
    onSubmit,
    form,
    isSubmitting: isAdvancing,
  }
}
