import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { budgetSchema, type BudgetFormValues } from '@/schema/budgets/budgetSchema'
import { budgetServices } from '@/services/budgets.services'
import type { BUDGET_T } from '@/types'

const DEFAULT_VALUES: BudgetFormValues = {
  micro_projet_id: 0,
  intitule: '',
  montant_accorde: 0,
  date_accord: '',
  source: '',
  statut: 'EN_ATTENTE',
  devise: 'FCFA',
  deblocage: false,
  signature_convention: 'NON_SIGNEE',
  reception_acte_credit: 'NON',
  observations: '',
}

export function useBudgetForm(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  initialData?: BUDGET_T | null,
  lockedMicroProjetId?: number
) {
  const { mutate: updateBudget, isPending: isUpdating } = budgetServices.useUpdate()
  const { mutate: createBudget, isPending: isCreating } = budgetServices.useCreate()
  const isPending = isUpdating || isCreating
  const isEdit = !!initialData

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { ...DEFAULT_VALUES, micro_projet_id: lockedMicroProjetId || 0 },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          micro_projet_id: lockedMicroProjetId || initialData.micro_projet_id,
          intitule: initialData.intitule,
          montant_accorde: Number(initialData.montant_accorde),
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
        form.reset({ ...DEFAULT_VALUES, micro_projet_id: lockedMicroProjetId || 0 })
      }
    }
  }, [open, initialData, form, lockedMicroProjetId])

  const onSubmit = (values: BudgetFormValues) => {
    if (isEdit && initialData) {
      updateBudget({ id: initialData.id, data: values }, { onSuccess: () => onOpenChange(false) })
    } else {
      createBudget(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit }
}
