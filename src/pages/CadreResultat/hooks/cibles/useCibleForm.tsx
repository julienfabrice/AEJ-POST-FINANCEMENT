import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cibleIndicateurServices } from '@/services/cadreResultat.services'
import {
  CIBLE_FORM_DEFAULTS,
  cibleSchema,
  type CibleFormValues,
} from '@/schema/cadre-resultat/cibleSchema'
import { anneeDe, versNombre } from '@/pages/CadreResultat/utils/format'
import type { CIBLE_INDICATEUR_T } from '@/types'

/**
 * Formulaire « Cible annuelle »
 * (table `cibles_indicateur_cadre_resultat`).
 *
 * ⚠️ DEUX TRADUCTIONS ENTRE L'ÉCRAN ET LA BASE, et elles vont dans des
 * directions opposées :
 *
 *  • À LA LECTURE (ici) — la colonne `annee` est une DATE (« 2019-01-01 »)
 *    alors que le formulaire saisit une ANNÉE (2019). `anneeDe()` en extrait
 *    les quatre premiers caractères sans construire de `Date`, ce qui évite le
 *    décalage de fuseau qui ferait basculer « 2019-01-01T00:00:00Z » sur 2018.
 *
 *  • À L'ÉCRITURE (service) — `toAnnee()` de `cadreResultat.services.ts`
 *    reconstruit « AAAA-01-01 ».
 *
 * La traduction n'est donc écrite NULLE PART dans ce hook ni dans la modale :
 * chaque sens vit du côté qui connaît la forme attendue.
 *
 * ⚠️ `code_programme` est REQUIS par la colonne, mais son référentiel n'est pas
 * disponible (cf. `referentielsCadreResultat.services.ts`) : le sélecteur est
 * désactivé et la validation zod refusera le formulaire tant que la source des
 * programmes ne sera pas branchée. C'est assumé — une cible sans programme
 * n'existe pas en base, et faire passer la validation côté client pour échouer
 * côté serveur n'aiderait personne.
 */
export function useCibleForm(
  initialData: CIBLE_INDICATEUR_T | null,
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

  const { mutate: createMutation, isPending: isCreating } = cibleIndicateurServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = cibleIndicateurServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<CibleFormValues>({
    resolver: zodResolver(cibleSchema),
    defaultValues: CIBLE_FORM_DEFAULTS,
  })

  useEffect(() => {
    if (!open) return

    if (initialData) {
      form.reset({
        // Repli sur l'année par défaut si la date reçue est inexploitable :
        // un champ numérique piloté par `NaN` deviendrait non contrôlé.
        annee: anneeDe(initialData.annee) ?? CIBLE_FORM_DEFAULTS.annee,
        // `versNombre` et non `Number()` : la colonne est un NUMERIC que
        // Laravel sérialise en CHAÎNE, éventuellement avec une virgule
        // décimale. `Number('1250,50')` vaudrait `NaN`.
        valeur_cible_indcateur_istr: versNombre(initialData.valeur_cible_indcateur_istr),
        code_indicateur_istr: initialData.code_indicateur_istr,
        code_programme: initialData.code_programme,
        code_ug: initialData.code_ug,
      })
    } else {
      form.reset(CIBLE_FORM_DEFAULTS)
    }
  }, [open, initialData, form])

  const onSubmit = (values: CibleFormValues) => {
    if (isEdit && initialData) {
      updateMutation(
        { id: initialData.id_cible_indicateur_istr, data: values },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
