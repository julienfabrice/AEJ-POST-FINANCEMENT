import { useEffect } from 'react'
import { useForm, type UseFormReturn, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dispositifServices } from '@/services/dispositifs.services'
import { dispositifSchema, type DispositifFormValues } from '@/schema/dispositifs/dispositifSchema'
import type { DISPOSITIF_T } from '@/types'

interface UseDispositifFormProps {
  dispositifToEdit?: DISPOSITIF_T | null
  onClose: () => void
}

interface UseDispositifFormReturn {
  form: UseFormReturn<DispositifFormValues>
  onSubmit: SubmitHandler<DispositifFormValues>
  isSubmitting: boolean
}

export function useDispositifForm({ dispositifToEdit, onClose }: UseDispositifFormProps): UseDispositifFormReturn {
  const { mutate: createDispositif, isPending: isCreating } = dispositifServices.useCreate()
  const { mutate: updateDispositif, isPending: isUpdating } = dispositifServices.useUpdate()

  const defaultValues = {
    code: '',
    projet_id: null,
    guichet_id: null,
    intitule: '',
    budget_alloue: 0,
    montant_min: 0,
    montant_max: 0,
    taux: 0,
    duree: 0,
    nbre_emplois_prevu: 0,
    nbre_beneficiaire_prevu: 0,
    nbre_micro_projet_prevu: 0,
  }

  const form = useForm<DispositifFormValues>({
    resolver: zodResolver(dispositifSchema),
    defaultValues
  })

  useEffect(() => {
    if (dispositifToEdit) {
      form.reset({
        code: dispositifToEdit.code,
        projet_id: dispositifToEdit.projet_id || null,
        guichet_id: dispositifToEdit.guichet_id || null,
        intitule: dispositifToEdit.intitule,
        budget_alloue: Number(dispositifToEdit.budget_alloue) || 0,
        montant_min: Number(dispositifToEdit.montant_min) || 0,
        montant_max: Number(dispositifToEdit.montant_max) || 0,
        taux: Number(dispositifToEdit.taux) || 0,
        duree: dispositifToEdit.duree || 0,
        nbre_emplois_prevu: dispositifToEdit.nbre_emplois_prevu || 0,
        nbre_beneficiaire_prevu: dispositifToEdit.nbre_beneficiaire_prevu || 0,
        nbre_micro_projet_prevu: dispositifToEdit.nbre_micro_projet_prevu || 0,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [dispositifToEdit, form])

  const onSubmit: SubmitHandler<DispositifFormValues> = (data) => {
    if (dispositifToEdit) {
      updateDispositif({ id: dispositifToEdit.id, ...data }, {
        onSuccess: () => {
          onClose()
        }
      })
    } else {
      createDispositif(data, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: isCreating || isUpdating
  }
}
