import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  cadreResultatServices,
  type CADRE_RESULTAT_PAYLOAD_T,
} from '@/services/cadreResultat.services'
import {
  CADRE_FORM_DEFAULTS,
  cadreSchema,
  type CadreFormValues,
} from '@/schema/cadre-resultat/cadreSchema'
import type { CADRE_RESULTAT_T } from '@/types'

/**
 * Formulaire « Élément du cadre de résultat » (table `cadres_resultat`).
 *
 * Même contrat que `useNiveauForm` : Dialog contrôlée (édition depuis la
 * grille) ou non contrôlée (création via `DialogTrigger`), `form.reset()` dans
 * un `useEffect` sur `open`.
 *
 * ⚠️ CE FORMULAIRE A UNE PARTICULARITÉ : `id_cs`.
 * `cadreSchema` porte un champ `id_cs` qui n'est PAS une donnée de la table
 * mais l'identifiant de la ligne en cours d'édition. Il existe uniquement pour
 * que le `.superRefine` du schéma puisse refuser l'auto-parentage (un élément
 * ne peut pas être son propre parent) — sans lui, la règle n'aurait aucun moyen
 * de savoir quel élément on modifie. Il est donc renseigné à l'ouverture en
 * édition, et RETIRÉ de la charge utile envoyée à l'API : `versPayload`
 * ci-dessous construit le corps champ par champ plutôt que par étalement de
 * `values`, ce qui garantit qu'`id_cs` ne franchit jamais la frontière.
 */

/**
 * Valeurs du formulaire → charge utile d'écriture.
 *
 * Construction EXPLICITE, champ par champ. Un `{ ...values }` serait plus
 * court mais embarquerait `id_cs`, que `CADRE_RESULTAT_PAYLOAD_T` ne déclare
 * pas et que l'API refuserait (ou pire : accepterait en écrasant une clé
 * primaire). Les conversions restantes — élagage, `0` → `null` sur les clés
 * étrangères, date tronquée — appartiennent au `toApiPayload` du service.
 */
function versPayload(values: CadreFormValues): CADRE_RESULTAT_PAYLOAD_T {
  return {
    abgrege_cs: values.abgrege_cs,
    code_cs: values.code_cs,
    intutile_cs: values.intutile_cs,
    date_enregistrement: values.date_enregistrement,
    etat: values.etat,
    niveau_cs: values.niveau_cs,
    parent_cs: values.parent_cs,
    partenaire_cs: values.partenaire_cs,
  }
}

export function useCadreForm(
  initialData: CADRE_RESULTAT_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = cadreResultatServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = cadreResultatServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<CadreFormValues>({
    resolver: zodResolver(cadreSchema),
    defaultValues: CADRE_FORM_DEFAULTS,
  })

  // Réinitialisation à l'OUVERTURE (cf. `useNiveauForm`) : la Dialog d'édition
  // est montée une fois puis réutilisée d'une ligne à l'autre.
  useEffect(() => {
    if (!open) return

    if (initialData) {
      form.reset({
        id_cs: initialData.id_cs,
        abgrege_cs: initialData.abgrege_cs,
        code_cs: initialData.code_cs,
        intutile_cs: initialData.intutile_cs,
        // `<input type="date">` n'accepte que « AAAA-MM-JJ » : une date ISO
        // complète venue de l'API laisserait le champ VIDE sans le moindre
        // message, et l'utilisateur croirait la date absente.
        date_enregistrement: initialData.date_enregistrement?.slice(0, 10) ?? '',
        etat: initialData.etat ?? '',
        niveau_cs: initialData.niveau_cs,
        parent_cs: initialData.parent_cs,
        partenaire_cs: initialData.partenaire_cs,
      })
    } else {
      form.reset(CADRE_FORM_DEFAULTS)
    }
  }, [open, initialData, form])

  const onSubmit = (values: CadreFormValues) => {
    if (isEdit && initialData) {
      updateMutation(
        { id: initialData.id_cs, data: versPayload(values) },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      createMutation(versPayload(values), { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
