import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { indicateurCadreResultatServices } from '@/services/cadreResultat.services'
import {
  INDICATEUR_CADRE_FORM_DEFAULTS,
  indicateurCadreSchema,
  type IndicateurCadreFormValues,
} from '@/schema/cadre-resultat/indicateurCadreSchema'
import type { INDICATEUR_CADRE_RESULTAT_T } from '@/types'

/**
 * Formulaire « Indicateur du cadre de résultat »
 * (table `indicateurs_cadre_resultat`).
 *
 * Même contrat que `useNiveauForm`. `IndicateurCadreFormValues` est directement
 * assignable à `INDICATEUR_CADRE_RESULTAT_PAYLOAD_T` — tous les champs du
 * schéma sont des colonnes de la table, sans champ technique à retirer
 * (contrairement à `useCadreForm` et son `id_cs`) — donc pas d'adaptateur ici.
 *
 * ⚠️ À NE PAS CONFONDRE avec le formulaire de `/indicateurs` (module
 * « Indicateurs & suivi », `src/schema/indicateurs/`) : deux tables distinctes,
 * aux colonnes disjointes.
 */
export function useIndicateurCadreForm(
  initialData: INDICATEUR_CADRE_RESULTAT_T | null,
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

  const { mutate: createMutation, isPending: isCreating } =
    indicateurCadreResultatServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } =
    indicateurCadreResultatServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<IndicateurCadreFormValues>({
    resolver: zodResolver(indicateurCadreSchema),
    defaultValues: INDICATEUR_CADRE_FORM_DEFAULTS,
  })

  useEffect(() => {
    if (!open) return

    if (initialData) {
      form.reset({
        code_indicateur_istr: initialData.code_indicateur_istr,
        intitule_indicateur_istr: initialData.intitule_indicateur_istr,
        // Les colonnes TEXT/VARCHAR nullables reviennent en `null` de l'API,
        // mais un `<input>` contrôlé sur `null` bascule en NON contrôlé et
        // React s'en plaint à chaque frappe : on retombe donc sur la chaîne
        // vide, que le service reconvertira en `null` à l'envoi.
        description_istr: initialData.description_istr ?? '',
        code_istr: initialData.code_istr,
        niveau_istr: initialData.niveau_istr,
        programme_istr: initialData.programme_istr,
        structure_istr: initialData.structure_istr,
        periodicite_iop: initialData.periodicite_iop ?? '',
        responsable_istr: initialData.responsable_istr ?? '',
        source_istr: initialData.source_istr ?? '',
      })
    } else {
      form.reset(INDICATEUR_CADRE_FORM_DEFAULTS)
    }
  }, [open, initialData, form])

  const onSubmit = (values: IndicateurCadreFormValues) => {
    if (isEdit && initialData) {
      updateMutation(
        { id: initialData.id_indicateur_str, data: values },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
