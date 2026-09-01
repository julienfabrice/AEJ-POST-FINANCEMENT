import { z } from 'zod'

/**
 * Formulaire « Emploi créé » — ressource `/embauches`.
 *
 * ── Deux arbitrages, tous deux en faveur de l'API ──
 * 1. `promoteur_id` est OBLIGATOIRE. La maquette le présentait comme un champ
 *    secondaire (« Bénéficiaire », non marqué requis), mais l'API le refuse
 *    absent : POST vide → « The promoteur id field is required. ». Un
 *    formulaire qui le laisserait vide échouerait systématiquement.
 * 2. `entreprise_id` et `type_emploi_id` restent facultatifs : l'API les
 *    accepte nuls, on ne durcit pas ce qu'elle n'exige pas.
 *
 * `micro_projet_id` est exigé côté formulaire bien que l'API l'accepte nul :
 * la maquette le marque requis (`req: 1`, l.6506) et un emploi créé sans
 * micro-projet de rattachement n'a pas de sens dans cet écran, qui liste les
 * emplois PAR projet financé. C'est un durcissement de la FORME, pas une
 * contradiction avec le fond.
 */
export const embaucheSchema = z.object({
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  promoteur_id: z.number().int().positive('Le bénéficiaire est requis.'),
  /** 0 = « aucune sélection » ; le service le convertit en `null` avant envoi. */
  entreprise_id: z.number().int().nullable(),
  type_emploi_id: z.number().int().nullable(),
  poste: z.string().trim().min(1, 'Le poste occupé est requis.'),
})

export type EmbaucheFormValues = z.infer<typeof embaucheSchema>

/** Valeurs initiales du formulaire (mêmes raisons que pour les exploitations). */
export const EMBAUCHE_FORM_DEFAULTS: EmbaucheFormValues = {
  micro_projet_id: 0,
  promoteur_id: 0,
  entreprise_id: null,
  type_emploi_id: null,
  poste: '',
}
