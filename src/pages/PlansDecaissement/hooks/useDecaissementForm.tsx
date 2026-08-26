import { decaissementServices } from '@/services/decaissements.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { decaissementSchema, type DecaissementFormValues } from '@/schema/decaissements/decaissementSchema'
import type { DECAISSEMENT_T } from '@/types'

const DEFAULT_VALUES: DecaissementFormValues = {
  plan_decaissement_id: 0,
  ligne_decaissement_id: undefined,
  agence_id: undefined,
  montant_decaisse: 0,
  date_decaissement: '',
  reference_banque: '',
  statut: 'EN_ATTENTE',
  observations: '',
}

export function useDecaissementForm(
  initialData: DECAISSEMENT_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = decaissementServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = decaissementServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<DecaissementFormValues>({
    resolver: zodResolver(decaissementSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          plan_decaissement_id: initialData.plan_decaissement_id,
          ligne_decaissement_id: initialData.ligne_decaissement_id ?? undefined,
          agence_id: initialData.agence_id ?? undefined,
          montant_decaisse: initialData.montant_decaisse,
          date_decaissement: initialData.date_decaissement ?? '',
          reference_banque: initialData.reference_banque ?? '',
          statut: initialData.statut,
          observations: initialData.observations ?? '',
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: DecaissementFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
