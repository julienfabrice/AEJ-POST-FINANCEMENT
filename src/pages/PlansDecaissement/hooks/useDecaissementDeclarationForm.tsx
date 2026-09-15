import { decaissementDeclarationServices } from '@/services/decaissementsDeclarations.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { decaissementDeclarationSchema, type DecaissementDeclarationFormValues } from '@/schema/decaissements-declarations/decaissementDeclarationSchema'
import type { DECAISSEMENT_DECLARATION_T } from '@/types'

const DEFAULT_VALUES: DecaissementDeclarationFormValues = {
  plan_decaissement_id: 0,
  promoteur_id: 0,
  montant_declare: 0,
  date_declaree: '',
  reference_banque: '',
  justificatif_path: '',
  observations: '',
  statut: 'BROUILLON',
}

export function useDecaissementDeclarationForm(
  initialData: DECAISSEMENT_DECLARATION_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = decaissementDeclarationServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = decaissementDeclarationServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<DecaissementDeclarationFormValues>({
    resolver: zodResolver(decaissementDeclarationSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          plan_decaissement_id: initialData.plan_decaissement_id,
          promoteur_id: initialData.promoteur_id,
          montant_declare: Number(initialData.montant_declare),
          date_declaree: initialData.date_declaree ?? '',
          reference_banque: initialData.reference_banque ?? '',
          justificatif_path: initialData.justificatif_path ?? '',
          observations: initialData.observations ?? '',
          statut: initialData.statut,
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: DecaissementDeclarationFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
