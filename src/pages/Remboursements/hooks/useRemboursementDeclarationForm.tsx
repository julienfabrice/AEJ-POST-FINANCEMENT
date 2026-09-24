import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { remboursementDeclarationServices } from '@/services/remboursementsDeclarations.services'
import { budgetServices } from '@/services/budgets.services'
import { remboursementDeclarationSchema, type RemboursementDeclarationFormValues } from '@/schema/remboursements-declarations/remboursementDeclarationSchema'
import type { BUDGET_T, REMBOURSEMENT_DECLARATION_T } from '@/types'

const DEFAULT_VALUES: RemboursementDeclarationFormValues = {
  promoteur_id: 0,
  budget_id: 0,
  montant_declare: 10000,
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

  const [portal, setPortal] = useState<HTMLElement | null>(null)

  const { mutate: createMutation, isPending: isCreating } = remboursementDeclarationServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = remboursementDeclarationServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<RemboursementDeclarationFormValues>({
    resolver: zodResolver(remboursementDeclarationSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const promoteurId = form.watch('promoteur_id')
  const budgetId = form.watch('budget_id')

  const { data: rawBudgets } = budgetServices.useGetAll()
  const selectedBudget = useMemo(() => {
    if (!budgetId) return initialData?.budget ?? null
    const list = Array.isArray(rawBudgets)
      ? rawBudgets
      : Array.isArray((rawBudgets as any)?.data)
        ? (rawBudgets as any).data
        : []
    return list.find((b: any) => b.id === budgetId) ?? initialData?.budget ?? null
  }, [budgetId, rawBudgets, initialData])

  const microProjetId = selectedBudget?.micro_projet_id ?? selectedBudget?.micro_projet?.id ?? 0

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

  const handleBudgetChange = (
    bId: number,
    budget?: BUDGET_T | null,
    onChangeField?: (val: number) => void
  ) => {
    if (onChangeField) {
      onChangeField(bId)
    } else {
      form.setValue('budget_id', bId, { shouldValidate: true })
    }

    if (budget?.micro_projet?.promoteur_id && !form.getValues('promoteur_id')) {
      form.setValue('promoteur_id', budget.micro_projet.promoteur_id, { shouldValidate: true })
    }
  }

  const onSubmit = (values: RemboursementDeclarationFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return {
    form,
    onSubmit,
    isPending,
    isEdit,
    open,
    setOpen,
    portal,
    setPortal,
    promoteurId,
    budgetId,
    microProjetId,
    selectedBudget,
    handleBudgetChange,
  }
}

