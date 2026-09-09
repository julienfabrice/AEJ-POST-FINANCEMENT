import { planDecaissementServices } from '@/services/planDecaissements.services'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  planDecaissementSchema,
  type PlanDecaissementFormValues,
} from '@/schema/plan-decaissements/planDecaissementSchema'
import type { PLAN_DECAISSEMENT_T } from '@/types'

const EMPTY_LIGNE = {
  numero_ligne: 1,
  object_ligne: '',
  montant_ligne: 0,
  mode_decaisse: 'VIREMENT' as const,
  date_prevue: '',
  intitule_prestataire: '',
  numero_compte: '',
  contact: '',
  statut: 'NON_VALIDE' as const,
  observations: '',
}

const DEFAULT_VALUES: PlanDecaissementFormValues = {
  micro_projet_id: 0,
  budget_id: undefined,
  compte_financement_id: undefined,
  montant_planifie: 0,
  date_prevue: '',
  lignes: [EMPTY_LIGNE],
}

export function usePlanDecaissementForm(
  initialData: PLAN_DECAISSEMENT_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = planDecaissementServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = planDecaissementServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<PlanDecaissementFormValues>({
    resolver: zodResolver(planDecaissementSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lignes' })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          micro_projet_id: initialData.micro_projet_id,
          budget_id: initialData.budget_id ?? undefined,
          compte_financement_id: initialData.compte_financement_id ?? undefined,
          montant_planifie: initialData.montant_planifie,
          date_prevue: initialData.date_prevue ?? '',
          lignes: initialData.lignes?.length
            ? initialData.lignes.map((l) => ({
                numero_ligne: l.numero_ligne,
                object_ligne: l.object_ligne ?? '',
                montant_ligne: l.montant_ligne,
                mode_decaisse: l.mode_decaisse,
                date_prevue: l.date_prevue ?? '',
                intitule_prestataire: l.intitule_prestataire,
                numero_compte: l.numero_compte ?? '',
                contact: l.contact ?? '',
                statut: l.statut,
                observations: l.observations ?? '',
              }))
            : [EMPTY_LIGNE],
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const addLigne = () => append({ ...EMPTY_LIGNE, numero_ligne: fields.length + 1 })

  const onSubmit = (values: PlanDecaissementFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, fields, addLigne, removeLigne: remove, onSubmit, isPending, isEdit, open, setOpen }
}
