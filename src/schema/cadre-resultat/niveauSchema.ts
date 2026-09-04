import { z } from 'zod'

/**
 * Formulaire « Niveau du cadre de résultat » — table `niveaux_cadre_resultat`.
 *
 * Toutes les contraintes viennent du SQL et de lui seul (longueurs VARCHAR,
 * NOT NULL, UNIQUE) : l'API n'existe pas encore, il n'y a donc aucune règle de
 * validation serveur à reproduire. Ce schéma est la SEULE barrière avant
 * l'envoi ; quand le backend arrivera, ses messages viendront s'y superposer,
 * pas s'y substituer.
 */
export const niveauSchema = z.object({
  /**
   * VARCHAR(20) NOT NULL.
   *
   * ⚠️ UNIQUE conjointement avec `programme` : le même code peut donc exister
   * deux fois s'il appartient à deux programmes différents. Zod ne peut pas
   * vérifier une unicité (il ne voit qu'une ligne à la fois) — le message
   * ci-dessous SIGNALE la contrainte pour que l'utilisateur comprenne le refus
   * qui viendra du serveur, il ne la fait pas respecter.
   */
  code_number_nsc: z
    .string()
    .trim()
    .min(1, 'Le code du niveau est requis.')
    .max(20, 'Le code du niveau ne peut pas dépasser 20 caractères.'),
  /** VARCHAR(100) NOT NULL. Ex. « Axe », « Effet », « Produit ». */
  libelle_nsc: z
    .string()
    .trim()
    .min(1, 'Le libellé du niveau est requis.')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères.'),
  /**
   * INTEGER NOT NULL — ordre / profondeur du niveau.
   *
   * Borné à 0 minimum : la colonne est un entier signé, mais un ordre négatif
   * n'a pas de sens et produirait un tri incompréhensible. Pas de borne haute :
   * le schéma n'en pose aucune, et en inventer une interdirait une hiérarchie
   * profonde légitime.
   */
  nombre_nsc: z
    .number({ message: "L'ordre du niveau doit être un nombre." })
    .int("L'ordre du niveau doit être un entier.")
    .min(0, "L'ordre du niveau ne peut pas être négatif."),
  /**
   * FK → programmes, NULLABLE.
   *
   * ⚠️ Référentiel INCONNU (cf. `referentielsCadreResultat.services.ts`) : le
   * sélecteur est désactivé tant que la source n'est pas branchée, et le champ
   * reste donc à `null`. Nullable et non requis — c'est exactement ce que dit
   * le SQL, l'indisponibilité du référentiel ne bloque pas la saisie.
   */
  programme: z.number().int().nullable(),
  /**
   * VARCHAR(10) NOT NULL.
   *
   * Saisie TEXTE et non numérique : le schéma donne « 1 », « 2 », « 3 » en
   * exemples, mais la colonne est un VARCHAR — imposer un nombre interdirait
   * une valeur non numérique que la base accepte.
   */
  type_niveau: z
    .string()
    .trim()
    .min(1, 'Le type de niveau est requis.')
    .max(10, 'Le type de niveau ne peut pas dépasser 10 caractères.'),
})

export type NiveauFormValues = z.infer<typeof niveauSchema>

/**
 * Valeurs initiales du formulaire.
 *
 * Portées par une constante plutôt que par des `.default()` dans le schéma :
 * avec `.default()`, le type d'ENTRÉE de zod diverge de son type de SORTIE et
 * `useForm<NiveauFormValues>` — la forme employée partout dans le dépôt — ne
 * compile plus. Même raisonnement que `EXPLOITATION_FORM_DEFAULTS`.
 */
export const NIVEAU_FORM_DEFAULTS: NiveauFormValues = {
  code_number_nsc: '',
  libelle_nsc: '',
  nombre_nsc: 1,
  programme: null,
  type_niveau: '',
}
