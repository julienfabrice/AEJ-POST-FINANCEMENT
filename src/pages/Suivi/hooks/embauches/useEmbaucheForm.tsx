import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { embaucheServices } from '@/services/embauches.services'
import {
  EMBAUCHE_FORM_DEFAULTS,
  embaucheSchema,
  type EmbaucheFormValues,
} from '@/schema/embauches/embaucheSchema'
import type { EMBAUCHE_T } from '@/types'

/**
 * Formulaire « Emploi créé » (ressource `/embauches`).
 *
 * Même contrat de Dialog contrôlée / non contrôlée que `useOrganismeForm`.
 */
export function useEmbaucheForm(
  initialData: EMBAUCHE_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = embaucheServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = embaucheServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<EmbaucheFormValues>({
    resolver: zodResolver(embaucheSchema),
    defaultValues: EMBAUCHE_FORM_DEFAULTS,
  })

  useEffect(() => {
    if (!open) return

    if (initialData) {
      form.reset({
        // `micro_projet_id` est nullable côté API mais exigé par le formulaire
        // (cf. commentaire du schéma) : une ligne ancienne sans projet ouvre
        // donc le formulaire sur une sélection vide, que l'utilisateur devra
        // renseigner — c'est voulu, pas un contournement.
        micro_projet_id: initialData.micro_projet_id ?? 0,
        promoteur_id: initialData.promoteur_id,
        entreprise_id: initialData.entreprise_id,
        type_emploi_id: initialData.type_emploi_id,
        poste: initialData.poste ?? '',
      })
    } else {
      form.reset(EMBAUCHE_FORM_DEFAULTS)
    }
  }, [open, initialData, form])

  /** `EmbaucheFormValues` est directement assignable à `EMBAUCHE_PAYLOAD_T`. */
  const onSubmit = (values: EmbaucheFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
