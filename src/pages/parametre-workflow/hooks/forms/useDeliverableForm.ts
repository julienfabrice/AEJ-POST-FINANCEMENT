import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workflowServices } from '@/services/workflow'
import { etapeDeliverableSchema, type EtapeDeliverableFormValues } from '@/schema/workflow'

export function useDeliverableForm(etapeCode: string, onSuccessCallback?: () => void) {
  const createDeliverableMutation = workflowServices.useCreateEtapeDeliverable()

  const form = useForm<EtapeDeliverableFormValues>({
    resolver: zodResolver(etapeDeliverableSchema),
    defaultValues: {
      etape_code: etapeCode,
      deliverable_code: '',
      is_required: true
    }
  })

  const onSubmit = (data: EtapeDeliverableFormValues) => {
    createDeliverableMutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        onSuccessCallback?.()
      }
    })
  }

  return {
    form,
    onSubmit,
    isSubmitting: createDeliverableMutation.isPending
  }
}
