import { useEffect } from 'react'
import { useForm, type UseFormReturn, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { guichetServices } from '@/services/guichets.services'
import { guichetSchema, type GuichetFormValues } from '@/schema/guichets/guichetSchema'
import type { GUICHET_T } from '@/types'

interface UseProcedureGuichetFormProps {
  guichetToEdit?: GUICHET_T | null
  onClose: () => void
}

interface UseProcedureGuichetFormReturn {
  form: UseFormReturn<GuichetFormValues>
  onSubmit: SubmitHandler<GuichetFormValues>
  isSubmitting: boolean
}

export function useProcedureGuichetForm({ guichetToEdit, onClose }: UseProcedureGuichetFormProps): UseProcedureGuichetFormReturn {
  const { mutate: createGuichet, isPending: isCreating } = guichetServices.useCreate()
  const { mutate: updateGuichet, isPending: isUpdating } = guichetServices.useUpdate()

  const form = useForm<GuichetFormValues>({
    resolver: zodResolver(guichetSchema),
    defaultValues: {
      code: '',
      libelle: '',
      description: '',
      couleur: '#3498db',
      montant_min: 0,
      montant_max: 0,
      is_active: true,
      is_form_active: true,
    }
  })

  useEffect(() => {
    if (guichetToEdit) {
      form.reset({
        code: guichetToEdit.code,
        libelle: guichetToEdit.libelle,
        description: guichetToEdit.description || '',
        couleur: guichetToEdit.couleur || '#3498db',
        montant_min: guichetToEdit.montant_min,
        montant_max: guichetToEdit.montant_max,
        is_active: guichetToEdit.is_active,
        is_form_active: guichetToEdit.is_form_active,
      })
    } else {
      form.reset({
        code: '',
        libelle: '',
        description: '',
        couleur: '#3498db',
        montant_min: 0,
        montant_max: 0,
        is_active: true,
        is_form_active: true,
      })
    }
  }, [guichetToEdit, form])

  const onSubmit: SubmitHandler<GuichetFormValues> = (data) => {
    if (guichetToEdit) {
      updateGuichet({ id: guichetToEdit.id, data }, {
        onSuccess: () => {
          onClose()
        }
      })
    } else {
      createGuichet(data, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: isCreating || isUpdating
  }
}
