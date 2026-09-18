import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useAdvanceWorkflow } from '../useAdvanceWorkflow'
import { validerSchema, type ValiderFormValues } from '@/schema/workflowActions/validerSchema'
import { workflowInstancesServices } from '@/services/workflowInstances.services'
import { useDeliverableUploads } from '../useDeliverableUploads'

export function useValiderAction() {
  const { validerModalProjet: projet, setValiderModalProjet } = useProjetsStore()
  const { advance, isAdvancing } = useAdvanceWorkflow()

  // Livrables déjà déposés (lecture seule — pour affichage)
  const { data: existingDeliverables, isLoading: isLoadingExisting } =
    workflowInstancesServices.useGetDeliverables(projet?.workflow_instance?.id)

  const planAffairesDeliverable = existingDeliverables?.find(
    ({deliverable_code}) => deliverable_code === 'PLAN_AFFAIRES'
  )

  // Livrables à uploader pour cette étape
  const currentEtapeCode = projet?.workflow_instance?.current_etape_code
  const deliverableUploads = useDeliverableUploads(currentEtapeCode)

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
    deliverableUploads.reset()
  }

  const onSubmit = form.handleSubmit(async (data: ValiderFormValues) => {
    if (!projet) return

    try {
      // 1. Upload & enregistrement des livrables (bloque si requis manquant)
      await deliverableUploads.submitDeliverables(projet)

      // 2. Avancement du workflow
      await advance({
        projet,
        action: 'VALIDER',
        comment: data.observation || undefined,
      })

      handleClose()
    } catch (error) {
      // Erreurs gérées dans chaque mutation ou dans submitDeliverables
    }
  })

  return {
    execute,
    projet,
    isOpen: !!projet,
    handleClose,
    onSubmit,
    form,
    isSubmitting: isAdvancing || deliverableUploads.isSubmittingDeliverables,
    // Livrables existants (affichage)
    planAffairesDeliverable,
    isLoadingExisting,
    // Upload de livrables
    etapeDeliverables: deliverableUploads.etapeDeliverables,
    isLoadingConfig: deliverableUploads.isLoadingConfig,
    sources: deliverableUploads.sources,
    setFile: deliverableUploads.setFile,
    setExistingDocument: deliverableUploads.setExistingDocument,
    isReady: deliverableUploads.isReady,
  }
}
