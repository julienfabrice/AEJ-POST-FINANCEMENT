import { z } from 'zod'

/**
 * Formulaire « Réalisation » — table `suivis_indicateur_cadre_resultat`.
 *
 * ⚠️ TABLE LA PLUS ABÎMÉE DU SCHÉMA (détail complet dans
 * `SUIVI_INDICATEUR_T`). Ce que cela change ICI, concrètement :
 *
 *  • `code_programme` est OPTIONNEL et non requis, alors que la contrainte
 *    UNIQUE de la table le suppose : la colonne n'est PAS déclarée. L'exiger
 *    bloquerait la saisie sur un champ qui n'existe peut-être pas.
 *  • `periode_suivi`, citée par la même contrainte et par un index, n'a AUCUN
 *    champ ici : elle n'est pas davantage déclarée, et `Date_suivi` remplit
 *    déjà ce rôle. En ajouter un inventerait une colonne.
 *  • `Date_suivi` garde sa majuscule initiale, seule de tout le schéma.
 */

/**
 * Plus grande valeur représentable par un NUMERIC(15,2) — même borne et même
 * raison que dans `cibleSchema.ts` : au-delà, PostgreSQL rejette l'INSERT avec
 * un message qui ne nomme pas le champ fautif.
 */
const NUMERIC_15_2_MAX = 9_999_999_999_999.99

/** Format d'un `<input type="date">` : « AAAA-MM-JJ ». */
const DATE_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const suiviIndicateurSchema = z.object({
  /**
   * FK NUMÉRIQUE → `indicateurs_cadre_resultat(id_indicateur_str)`, NOT NULL.
   */
  code_indicateur_istr: z
    .number({ message: "L'indicateur est requis." })
    .int()
    .positive("L'indicateur est requis."),
  /**
   * DATE NOT NULL — date de la mesure.
   * ⚠️ Majuscule initiale du schéma conservée (cf. en-tête).
   *
   * Le format est contrôlé plutôt que la seule présence : un champ date vidé
   * puis ressaisi peut produire une chaîne partielle, que le serveur refuserait
   * avec un message générique.
   */
  Date_suivi: z
    .string()
    .trim()
    .min(1, 'La date de suivi est requise.')
    .regex(DATE_ISO_REGEX, 'La date de suivi est invalide.'),
  /**
   * FK → `unites_gestion(code_ug)`, NULLABLE.
   * ⚠️ Référentiel INCONNU : sélecteur désactivé, valeur `null`.
   */
  code_ug: z.number().int().nullable(),
  /**
   * NUMERIC(15,2) NOT NULL — valeur réalisée.
   *
   * Négatif AUTORISÉ, pour la même raison que la valeur cible : la colonne est
   * signée et une réalisation peut mesurer une variation.
   */
  valeur_realisee_istr: z
    .number({ message: 'La valeur réalisée doit être un nombre.' })
    .min(-NUMERIC_15_2_MAX, 'La valeur réalisée dépasse la capacité du champ (15 chiffres).')
    .max(NUMERIC_15_2_MAX, 'La valeur réalisée dépasse la capacité du champ (15 chiffres).'),
  /** TEXT NULL — pas de longueur maximale en base, donc aucune ici. */
  commentaire_suivi_istr: z.string().trim().optional(),
  /**
   * VARCHAR(100) NULL — texte libre.
   *
   * ⚠️ Ce n'est PAS une FK vers `personnels` : la colonne stocke un nom, pas un
   * identifiant. On ne branche donc aucun sélecteur d'agent dessus, ce qui
   * enregistrerait un nombre là où la base attend une chaîne.
   */
  modifier_par: z
    .string()
    .trim()
    .max(100, 'Le nom ne peut pas dépasser 100 caractères.')
    .optional(),
  /**
   * ⚠️ COLONNE NON DÉCLARÉE dans la table, mais exigée par sa contrainte UNIQUE
   * et par l'un de ses index.
   *
   * Nullable et FACULTATIVE tant que le backend n'a pas tranché entre
   * « ajouter la colonne » et « corriger la contrainte ». Le service ne
   * l'envoie même pas quand elle est vide : envoyer `null` sur une colonne
   * absente ferait échouer la requête pour une raison incompréhensible.
   */
  code_programme: z.number().int().nullable(),
})

export type SuiviIndicateurFormValues = z.infer<typeof suiviIndicateurSchema>

/**
 * Valeurs initiales — cf. `NIVEAU_FORM_DEFAULTS` pour le choix de la forme.
 *
 * `Date_suivi` est laissée VIDE plutôt que préremplie à la date du jour : une
 * réalisation se rattache à la période mesurée, pas au moment de la saisie, et
 * un préremplissage silencieux produirait des mesures mal datées.
 */
export const SUIVI_INDICATEUR_FORM_DEFAULTS: SuiviIndicateurFormValues = {
  code_indicateur_istr: 0,
  Date_suivi: '',
  code_ug: null,
  valeur_realisee_istr: 0,
  commentaire_suivi_istr: '',
  modifier_par: '',
  code_programme: null,
}
