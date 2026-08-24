import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workflowServices } from '@/services/workflow'
import { etapeSchema, type EtapeFormValues } from '@/schema/workflow'
import type { WORKFLOW_ETAPE_T } from '@/types'

export function useEtapeForm(etape: WORKFLOW_ETAPE_T, onSuccessCallback?: () => void) {
  const updateEtapeMutation = workflowServices.useUpdateEtape()

  const form = useForm<EtapeFormValues>({
    resolver: zodResolver(etapeSchema),
    defaultValues: {
      code: etape.code,
      name: etape.name,
      order: etape.order,
      description: etape.description || ''
    }
  })

  useEffect(() => {
    form.reset({
      code: etape.code,
      name: etape.name,
      order: etape.order,
      description: etape.description || ''
    })
  }, [etape, form])

  const onSubmit = (data: EtapeFormValues) => {
    updateEtapeMutation.mutate(
      {
        id: etape.id,
        code: data.code,
        name: data.name,
        order: data.order,
        description: data.description || undefined
      },
      {
        onSuccess: () => {
          onSuccessCallback?.()
        }
      }
    )
  }

  return {
    form,
    onSubmit,
    isSubmitting: updateEtapeMutation.isPending
  }
}
