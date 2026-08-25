import { remboursementServices } from '@/services/remboursements.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { remboursementSchema, type RemboursementFormValues } from '@/schema/remboursements/remboursementSchema'
import type { REMBOURSEMENT_T } from '@/types'

const DEFAULT_VALUES: RemboursementFormValues = {
  promoteur_id: 0,
  budget_id: undefined,
  montant_echu: 0,
  montant_paye: 0,
  montant_impaye: 0,
  penalites: 0,
  date_paiement: '',
  observations: '',
  statut: 'EN_ATTENTE',
}

export function useRemboursementForm(
  initialData: REMBOURSEMENT_T | null,
  controlledOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = remboursementServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = remboursementServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<RemboursementFormValues>({
    resolver: zodResolver(remboursementSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          promoteur_id: initialData.promoteur_id,
          budget_id: initialData.budget_id ?? undefined,
          montant_echu: initialData.montant_echu,
          montant_paye: initialData.montant_paye,
          montant_impaye: initialData.montant_impaye,
          penalites: initialData.penalites,
          date_paiement: initialData.date_paiement ?? '',
          observations: initialData.observations ?? '',
          statut: initialData.statut,
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: RemboursementFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
