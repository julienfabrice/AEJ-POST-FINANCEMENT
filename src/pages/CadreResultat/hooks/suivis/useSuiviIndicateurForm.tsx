import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { suiviIndicateurServices } from '@/services/cadreResultat.services'
import {
  SUIVI_INDICATEUR_FORM_DEFAULTS,
  suiviIndicateurSchema,
  type SuiviIndicateurFormValues,
} from '@/schema/cadre-resultat/suiviIndicateurSchema'
import { versNombre } from '@/pages/CadreResultat/utils/format'
import type { SUIVI_INDICATEUR_T } from '@/types'

/**
 * Formulaire « Réalisation »
 * (table `suivis_indicateur_cadre_resultat`).
 *
 * ⚠️ TROIS CHAMPS PORTENT LES DÉFAUTS DU SCHÉMA (détail complet dans
 * `SUIVI_INDICATEUR_T` et `suiviIndicateurSchema.ts`) :
 *
 *  • `Date_suivi` garde sa MAJUSCULE initiale, seule de tout le schéma. Elle
 *    est reprise telle quelle jusque dans le nom du champ de formulaire : le
 *    jour du branchement, c'est le premier point à vérifier, et un renommage
 *    silencieux ici le rendrait introuvable.
 *  • `code_programme` est FACULTATIF alors que la contrainte UNIQUE de la table
 *    le suppose : la colonne n'est pas déclarée. Le service l'OMET du corps de
 *    la requête quand il est vide, plutôt que d'envoyer `null` sur une colonne
 *    peut-être inexistante.
 *  • `periode_suivi`, citée par la même contrainte, n'a AUCUN champ : elle
 *    n'est pas davantage déclarée et `Date_suivi` remplit déjà ce rôle.
 *
 * `SuiviIndicateurFormValues` est directement assignable à
 * `SUIVI_INDICATEUR_PAYLOAD_T` : aucun adaptateur n'est nécessaire.
 */
export function useSuiviIndicateurForm(
  initialData: SUIVI_INDICATEUR_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = suiviIndicateurServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = suiviIndicateurServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<SuiviIndicateurFormValues>({
    resolver: zodResolver(suiviIndicateurSchema),
    defaultValues: SUIVI_INDICATEUR_FORM_DEFAULTS,
  })

  useEffect(() => {
    if (!open) return

    if (initialData) {
      form.reset({
        code_indicateur_istr: initialData.code_indicateur_istr,
        // `<input type="date">` n'accepte que « AAAA-MM-JJ » : une date ISO
        // complète venue de l'API laisserait le champ vide sans message.
        Date_suivi: initialData.Date_suivi?.slice(0, 10) ?? '',
        code_ug: initialData.code_ug,
        // NUMERIC sérialisé en chaîne, virgule décimale possible (cf.
        // `useCibleForm`).
        valeur_realisee_istr: versNombre(initialData.valeur_realisee_istr),
        commentaire_suivi_istr: initialData.commentaire_suivi_istr ?? '',
        modifier_par: initialData.modifier_par ?? '',
        // `?? null` et non `?? 0` : la colonne n'existe peut-être pas, et `0`
        // serait une valeur SAISIE, que le service transmettrait.
        code_programme: initialData.code_programme ?? null,
      })
    } else {
      form.reset(SUIVI_INDICATEUR_FORM_DEFAULTS)
    }
  }, [open, initialData, form])

  const onSubmit = (values: SuiviIndicateurFormValues) => {
    if (isEdit && initialData) {
      updateMutation(
        { id: initialData.id_suivi_indicateur_istr, data: values },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
