import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workflowServices } from '@/services/workflow'
import { etapeSlaSchema, type EtapeSlaFormValues } from '@/schema/workflow'
import type { WORKFLOW_ETAPE_SLA_T } from '@/types'

export function useSlaForm(etapeCode: string, initialData?: WORKFLOW_ETAPE_SLA_T, onSuccessCallback?: () => void) {
  const isEditMode = !!initialData
  
  const createSlaMutation = workflowServices.useCreateEtapeSla()
  const updateSlaMutation = workflowServices.useUpdateEtapeSla()

  const form = useForm<EtapeSlaFormValues>({
    resolver: zodResolver(etapeSlaSchema),
    defaultValues: {
      etape_code: etapeCode,
      description: initialData?.description || '',
      duration_value: initialData?.duration_value || 1,
      duration_unit: initialData?.duration_unit || 'JOURS',
      delay_type: initialData?.delay_type || 'MAXIMUM'
    }
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        etape_code: etapeCode,
        description: initialData.description || '',
        duration_value: initialData.duration_value,
        duration_unit: initialData.duration_unit,
        delay_type: initialData.delay_type || 'MAXIMUM'
      })
    } else {
      form.reset({
        etape_code: etapeCode,
        description: '',
        duration_value: 1,
        duration_unit: 'JOURS',
        delay_type: 'MAXIMUM'
      })
    }
  }, [initialData, form, etapeCode])

  const onSubmit = (data: EtapeSlaFormValues) => {
    if (isEditMode && initialData) {
      updateSlaMutation.mutate(
        { id: initialData.id, ...data },
        {
          onSuccess: () => {
            onSuccessCallback?.()
          }
        }
      )
    } else {
      createSlaMutation.mutate(
        { ...data },
        {
          onSuccess: () => {
            form.reset()
            onSuccessCallback?.()
          }
        }
      )
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: isEditMode ? updateSlaMutation.isPending : createSlaMutation.isPending,
    isEditMode
  }
}
