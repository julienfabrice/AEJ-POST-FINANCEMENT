import { z } from 'zod'

/**
 * Formulaire « Indicateur du cadre de résultat » — table
 * `indicateurs_cadre_resultat`.
 *
 * ⚠️ Cet indicateur n'a rien à voir avec la ressource `/indicateurs` du module
 * « Indicateurs & suivi » (schéma : `src/schema/indicateurs/`). Tables
 * différentes, colonnes disjointes, formulaires distincts.
 */
export const indicateurCadreSchema = z.object({
  /**
   * VARCHAR(30) NOT NULL UNIQUE. Ex. « R002 ».
   *
   * C'est un CODE MÉTIER TEXTUEL, pas un identifiant : dans les tables
   * « cibles » et « suivis », une colonne du même nom porte au contraire un
   * entier. Unicité SIGNALÉE dans le message, non vérifiable côté client.
   */
  code_indicateur_istr: z
    .string()
    .trim()
    .min(1, "Le code de l'indicateur est requis.")
    .max(30, 'Le code ne peut pas dépasser 30 caractères.'),
  /** TEXT NOT NULL — pas de longueur maximale en base, donc aucune ici. */
  intitule_indicateur_istr: z.string().trim().min(1, "L'intitulé de l'indicateur est requis."),
  /** TEXT NULL. */
  description_istr: z.string().trim().optional(),
  /**
   * FK → `cadres_resultat(id_cs)`, NOT NULL, ON DELETE CASCADE.
   *
   * ⚠️ Le CASCADE mérite d'être connu de qui remplit ce formulaire :
   * supprimer l'élément du cadre supprimera aussi tous ses indicateurs — et,
   * par cascade des tables 4 et 5, leurs cibles et leurs réalisations.
   */
  code_istr: z
    .number({ message: "L'élément du cadre est requis." })
    .int()
    .positive("L'élément du cadre est requis."),
  /**
   * INTEGER NULL.
   *
   * ⚠️ QUESTION OUVERTE du schéma : « FK vers niveaux_cadre_resultat ou simple
   * entier ? ». Saisie NUMÉRIQUE LIBRE et non sélecteur de niveaux : faire un
   * sélecteur préjugerait de la réponse, et rendrait impossible la saisie d'une
   * valeur légitime dans l'hypothèse « simple entier ». Aucune borne non plus,
   * pour la même raison — on ne sait pas ce que ce nombre représente.
   */
  niveau_istr: z.number().int().nullable(),
  /**
   * FK → programmes, NULLABLE.
   * ⚠️ Référentiel INCONNU : sélecteur désactivé, valeur `null`.
   */
  programme_istr: z.number().int().nullable(),
  /**
   * FK → structures, NULLABLE.
   * ⚠️ Référentiel INCONNU : sélecteur désactivé, valeur `null`.
   */
  structure_istr: z.number().int().nullable(),
  /**
   * VARCHAR(30) NULL. Ex. « Trimestriel ».
   *
   * Saisie TEXTE LIBRE, bornée à la longueur de la colonne. Aucune liste
   * d'options n'est proposée : le schéma ne documente aucune valeur, et un
   * `<Select>` « Mensuel / Trimestriel / Semestriel / Annuel » inventerait un
   * référentiel de périodicités que le backend n'a pas défini.
   */
  periodicite_iop: z
    .string()
    .trim()
    .max(30, 'La périodicité ne peut pas dépasser 30 caractères.')
    .optional(),
  /** VARCHAR(100) NULL — nom en texte libre, ce n'est pas une FK. */
  responsable_istr: z
    .string()
    .trim()
    .max(100, 'Le responsable ne peut pas dépasser 100 caractères.')
    .optional(),
  /** VARCHAR(150) NULL — source de la donnée, texte libre. */
  source_istr: z
    .string()
    .trim()
    .max(150, 'La source ne peut pas dépasser 150 caractères.')
    .optional(),
})

export type IndicateurCadreFormValues = z.infer<typeof indicateurCadreSchema>

/** Valeurs initiales — cf. `NIVEAU_FORM_DEFAULTS` pour le choix de la forme. */
export const INDICATEUR_CADRE_FORM_DEFAULTS: IndicateurCadreFormValues = {
  code_indicateur_istr: '',
  intitule_indicateur_istr: '',
  description_istr: '',
  code_istr: 0,
  niveau_istr: null,
  programme_istr: null,
  structure_istr: null,
  periodicite_iop: '',
  responsable_istr: '',
  source_istr: '',
}
