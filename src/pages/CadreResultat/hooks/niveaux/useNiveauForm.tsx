import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { niveauCadreResultatServices } from '@/services/cadreResultat.services'
import {
  NIVEAU_FORM_DEFAULTS,
  niveauSchema,
  type NiveauFormValues,
} from '@/schema/cadre-resultat/niveauSchema'
import type { NIVEAU_CADRE_RESULTAT_T } from '@/types'

/**
 * Formulaire « Niveau du cadre de résultat » (table `niveaux_cadre_resultat`).
 *
 * Même contrat que `useOrganismeForm` / `useExploitationForm` : la Dialog peut
 * être CONTRÔLÉE (édition depuis la grille, qui détient la ligne courante) ou
 * NON contrôlée (création via un `DialogTrigger` dans la barre d'onglet).
 *
 * ⚠️ Tant que `CADRE_RESULTAT_API_PRETE` est à `false`, `createMutation` et
 * `updateMutation` n'émettent aucune requête : elles affichent un toast
 * expliquant que l'enregistrement sera possible au branchement (dispositif
 * décrit dans `cadreResultat.services.ts`). Le `onSuccess` local est tout de
 * même exécuté — la modale se referme, comme après un enregistrement réussi.
 * C'est volontaire : l'utilisateur a été informé par le toast, et laisser la
 * modale ouverte sur un formulaire rempli l'inviterait à réessayer en boucle.
 */
export function useNiveauForm(
  initialData: NIVEAU_CADRE_RESULTAT_T | null,
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
    niveauCadreResultatServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } =
    niveauCadreResultatServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<NiveauFormValues>({
    resolver: zodResolver(niveauSchema),
    defaultValues: NIVEAU_FORM_DEFAULTS,
  })

  // Réinitialisation à l'OUVERTURE et non au montage : la Dialog d'édition est
  // montée une fois puis réutilisée d'une ligne à l'autre ; sans cet effet,
  // elle rouvrirait sur les valeurs de la ligne précédente.
  useEffect(() => {
    if (!open) return

    if (initialData) {
      form.reset({
        code_number_nsc: initialData.code_number_nsc,
        libelle_nsc: initialData.libelle_nsc,
        nombre_nsc: initialData.nombre_nsc,
        programme: initialData.programme,
        type_niveau: initialData.type_niveau,
      })
    } else {
      form.reset(NIVEAU_FORM_DEFAULTS)
    }
  }, [open, initialData, form])

  /**
   * `NiveauFormValues` est directement assignable à
   * `NIVEAU_CADRE_RESULTAT_PAYLOAD_T` : la normalisation (élagage, conversion
   * des clés à `null`) appartient au `toApiPayload` du service.
   */
  const onSubmit = (values: NiveauFormValues) => {
    if (isEdit && initialData) {
      updateMutation(
        { id: initialData.id_nsc, data: values },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
