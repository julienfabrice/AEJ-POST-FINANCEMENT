import { recouvrementServices } from '@/services/recouvrements.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recouvrementSchema, type RecouvrementFormValues } from '@/schema/recouvrements/recouvrementSchema'
import type { RECOUVREMENT_T } from '@/types'

const DEFAULT_VALUES: RecouvrementFormValues = {
  micro_projet_id: 0,
  plan_remboursement_id: 0,
  agent_id: 0,
  montant_recouvre: 0,
  date_recouvrement: '',
  type_action: 'APPEL',
  justificatif_path: '',
  observations: '',
}

export function useRecouvrementForm(
  initialData: RECOUVREMENT_T | null,
  controlledOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
  prefill?: Partial<RecouvrementFormValues>,
) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = recouvrementServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = recouvrementServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<RecouvrementFormValues>({
    resolver: zodResolver(recouvrementSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          micro_projet_id: initialData.micro_projet_id,
          plan_remboursement_id: initialData.plan_remboursement_id ?? 0,
          agent_id: initialData.agent_id ?? 0,
          montant_recouvre: Number(initialData.montant_recouvre),
          date_recouvrement: initialData.date_recouvrement ?? '',
          type_action: initialData.type_action,
          justificatif_path: initialData.justificatif_path ?? '',
          observations: initialData.observations ?? '',
        })
      } else {
        form.reset({ ...DEFAULT_VALUES, ...prefill })
      }
    }
  }, [open, initialData, form, prefill])

  const onSubmit = (values: RecouvrementFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
