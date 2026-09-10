import { remboursementDeclarationServices } from '@/services/remboursementsDeclarations.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { remboursementDeclarationSchema, type RemboursementDeclarationFormValues } from '@/schema/remboursements-declarations/remboursementDeclarationSchema'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

const DEFAULT_VALUES: RemboursementDeclarationFormValues = {
  promoteur_id: 0,
  budget_id: 0,
  montant_declare: 0,
  date_declaree: '',
  reference_banque: '',
  justificatif_path: '',
  observations: '',
  statut: 'BROUILLON',
}

export function useRemboursementDeclarationForm(
  initialData: REMBOURSEMENT_DECLARATION_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = remboursementDeclarationServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = remboursementDeclarationServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<RemboursementDeclarationFormValues>({
    resolver: zodResolver(remboursementDeclarationSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          promoteur_id: initialData.promoteur_id,
          budget_id: initialData.budget_id,
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

  const onSubmit = (values: RemboursementDeclarationFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
