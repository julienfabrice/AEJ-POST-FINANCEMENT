import { budgetServices } from '@/services/budgets.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { budgetSchema, type BudgetFormValues } from '@/schema/budgets/budgetSchema'
import type { BUDGET_T } from '@/types'

const DEFAULT_VALUES: BudgetFormValues = {
  micro_projet_id: 0,
  intitule: '',
  montant_accorde: 0,
  date_accord: '',
  source: '',
  statut: 'EN_ATTENTE',
  devise: 'FCFA',
  deblocage: 'NON',
  date_deblocage: '',
  signature_convention: 'NON_SIGNEE',
  date_signature: '',
  reception_acte_credit: 'NON',
  date_reception: '',
  observations: '',
}

export function useBudgetForm(
  initialData: BUDGET_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = budgetServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = budgetServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          micro_projet_id: initialData.micro_projet_id,
          intitule: initialData.intitule,
          montant_accorde: initialData.montant_accorde,
          date_accord: initialData.date_accord ?? '',
          source: initialData.source ?? '',
          statut: initialData.statut,
          devise: initialData.devise,
          deblocage: initialData.deblocage,
          date_deblocage: initialData.date_deblocage ?? '',
          signature_convention: initialData.signature_convention,
          date_signature: initialData.date_signature ?? '',
          reception_acte_credit: initialData.reception_acte_credit,
          date_reception: initialData.date_reception ?? '',
          observations: initialData.observations ?? '',
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: BudgetFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
