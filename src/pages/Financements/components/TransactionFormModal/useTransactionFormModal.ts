import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormValues } from '@/schema/transactions/transactionSchema'
import { transactionServices } from '@/services/transactions.services'
import type { TRANSACTION_T } from '@/types'

const DEFAULT_VALUES: TransactionFormValues = {
  micro_projet_id: 0,
  categorie_id: undefined,
  libelle: '',
  type: 'DEPENSE',
  montant: 0,
  statut: 'VALIDE',
  mode_paiement: '',
  reference: '',
  observations: '',
  date: '',
}

interface UseTransactionFormModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: TRANSACTION_T | null
}

export function useTransactionFormModal({
  open: controlledOpen,
  onOpenChange,
  initialData,
}: UseTransactionFormModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [portal, setPortal] = useState<HTMLElement | null>(null)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) setInternalOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange],
  )

  const { mutate: createTransaction, isPending: isCreating } = transactionServices.useCreate()
  const { mutate: updateTransaction, isPending: isUpdating } = transactionServices.useUpdate()
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          micro_projet_id: initialData.micro_projet_id,
          categorie_id: initialData.categorie_id ?? undefined,
          libelle: initialData.libelle,
          type: initialData.type,
          montant: Number(initialData.montant),
          statut: initialData.statut,
          mode_paiement: initialData.mode_paiement ?? '',
          reference: initialData.reference ?? '',
          observations: initialData.observations ?? '',
          date: initialData.date ?? '',
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: TransactionFormValues) => {
    if (isEdit && initialData) {
      updateTransaction(
        { id: initialData.id, data: values },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      createTransaction(values, { onSuccess: () => setOpen(false) })
    }
  }

  return {
    open,
    setOpen,
    portal,
    setPortal,
    form,
    onSubmit,
    isPending,
    isEdit,
  }
}
