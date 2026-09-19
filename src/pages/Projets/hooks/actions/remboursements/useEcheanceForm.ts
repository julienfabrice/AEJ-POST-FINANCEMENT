import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tableauAmortissementServices } from '@/services/tableauAmortissements.services'
import { remboursementEcheanceSchema, type RemboursementEcheanceFormValues } from '@/schema/workflowActions/remboursementEcheanceSchema'
import type { TABLEAU_AMORTISSEMENT_T } from '@/types'
import { toast } from 'sonner'

export function useEcheanceForm(planRemboursementId: number, echeancesCount: number) {
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<TABLEAU_AMORTISSEMENT_T | null>(null)

  const { mutate: createMutation, isPending: isCreating } = tableauAmortissementServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = tableauAmortissementServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<RemboursementEcheanceFormValues>({
    resolver: zodResolver(remboursementEcheanceSchema),
    defaultValues: {
      plan_remboursement_id: planRemboursementId,
      periode: echeancesCount + 1,
      date_echeance: new Date().toISOString().slice(0, 10),
      montant_echeance: 0,
      capital_rembourse: 0,
      capital_restant: 0,
      interets: 0,
      amortissement_capital: 0,
      statut: 'NON_PAYE',
    },
  })

  const handleOpen = (echeance?: TABLEAU_AMORTISSEMENT_T) => {
    if (echeance) {
      setInitialData(echeance)
      form.reset({
        plan_remboursement_id: echeance.plan_remboursement_id,
        periode: echeance.periode,
        date_echeance: echeance.date_echeance,
        montant_echeance: Number(echeance.montant_echeance),
        capital_rembourse: Number(echeance.capital_rembourse),
        capital_restant: Number(echeance.capital_restant),
        interets: Number(echeance.interets),
        amortissement_capital: Number(echeance.amortissement_capital),
        statut: echeance.statut,
      })
    } else {
      setInitialData(null)
      form.reset({
        plan_remboursement_id: planRemboursementId,
        periode: echeancesCount + 1,
        date_echeance: new Date().toISOString().slice(0, 10),
        montant_echeance: 0,
        capital_rembourse: 0,
        capital_restant: 0,
        interets: 0,
        amortissement_capital: 0,
        statut: 'NON_PAYE',
      })
    }
    setOpen(true)
  }

  const onSubmit = (values: RemboursementEcheanceFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, {
        onSuccess: () => {
          toast.success("Échéance modifiée")
          setOpen(false)
        }
      })
    } else {
      createMutation(values, {
        onSuccess: () => {
          toast.success("Échéance ajoutée")
          setOpen(false)
        }
      })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen, handleOpen }
}
