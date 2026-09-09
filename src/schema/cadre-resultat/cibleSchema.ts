import { z } from 'zod'

/**
 * Formulaire « Cible annuelle » — table `cibles_indicateur_cadre_resultat`.
 *
 * ⚠️ CONTRAINTE D'UNICITÉ : UNIQUE (code_indicateur_istr, code_programme,
 * code_ug, annee). Une seule cible par indicateur / programme / unité de
 * gestion / année. Zod ne peut pas la vérifier (il ne voit qu'une ligne) : elle
 * est SIGNALÉE dans le message du champ « année », qui est celui que
 * l'utilisateur modifie le plus souvent pour dupliquer une cible.
 */

/**
 * Plus grande valeur représentable par un NUMERIC(15,2) : 13 chiffres avant la
 * virgule, 2 après. Au-delà, PostgreSQL rejette l'INSERT — et le message
 * d'erreur serveur ne nomme pas le champ fautif. On borne donc ici, au plus
 * près de la saisie.
 */
const NUMERIC_15_2_MAX = 9_999_999_999_999.99

export const cibleSchema = z.object({
  /**
   * Colonne DATE portant une ANNÉE (le schéma donne « 2019-01-01 »).
   *
   * L'utilisateur saisit une ANNÉE, pas une date : c'est `toApiPayload` du
   * service qui la convertit en « AAAA-01-01 ». Ici on ne valide donc que la
   * FORME d'une année — quatre chiffres —, sans borne métier inventée sur le
   * passé ou le futur : une reprise d'historique peut légitimement saisir une
   * année ancienne, et une planification pluriannuelle une année lointaine.
   */
  annee: z
    .number({ message: "L'année est requise." })
    .int("L'année doit être un nombre entier.")
    .min(1000, "L'année doit comporter quatre chiffres.")
    .max(9999, "L'année doit comporter quatre chiffres."),
  /**
   * NUMERIC(15,2) NOT NULL.
   * ⚠️ Coquille du schéma conservée : « indcateur » pour « indicateur ».
   *
   * Négatif AUTORISÉ : la colonne est signée, et une cible de variation peut
   * légitimement être négative (baisse d'un taux d'échec, par exemple).
   * L'interdire inventerait une règle métier absente du schéma.
   */
  valeur_cible_indcateur_istr: z
    .number({ message: 'La valeur cible doit être un nombre.' })
    .min(-NUMERIC_15_2_MAX, 'La valeur cible dépasse la capacité du champ (15 chiffres).')
    .max(NUMERIC_15_2_MAX, 'La valeur cible dépasse la capacité du champ (15 chiffres).'),
  /**
   * FK NUMÉRIQUE → `indicateurs_cadre_resultat(id_indicateur_str)`, NOT NULL.
   * ⚠️ Entier ici, alors que la colonne du même nom de la table 3 est un
   * VARCHAR(30).
   */
  code_indicateur_istr: z
    .number({ message: "L'indicateur est requis." })
    .int()
    .positive("L'indicateur est requis."),
  /**
   * FK → programmes, NOT NULL.
   *
   * ⚠️ REQUIS parce que la colonne l'est — et non parce que le référentiel est
   * disponible : il ne l'est pas (cf. `referentielsCadreResultat.services.ts`).
   * Conséquence assumée : tant que la source des programmes n'est pas branchée,
   * le sélecteur est désactivé et le formulaire ne peut pas être validé. C'est
   * la traduction honnête de l'état du système — une cible sans programme
   * n'existe pas en base. Assouplir la règle ferait passer la validation côté
   * client pour échouer côté serveur, sans que l'utilisateur comprenne mieux.
   *
   * ⚠️ La colonne cible de la FK est ambiguë dans le schéma
   * (`programmes(code_programme)` ici, `programmes(id_programme)` table 1) :
   * seul le type — un entier — est certain.
   */
  code_programme: z
    .number({ message: 'Le programme est requis.' })
    .int()
    .positive('Le programme est requis.'),
  /**
   * FK → `unites_gestion(code_ug)`, NULLABLE.
   * ⚠️ Référentiel INCONNU : sélecteur désactivé, valeur `null`. Nullable en
   * base, donc l'indisponibilité du référentiel ne bloque pas la saisie.
   */
  code_ug: z.number().int().nullable(),
})

export type CibleFormValues = z.infer<typeof cibleSchema>

/**
 * Valeurs initiales — cf. `NIVEAU_FORM_DEFAULTS` pour le choix de la forme.
 *
 * L'année par défaut est l'année EN COURS : c'est le seul défaut qui ne soit
 * pas une invention (il est calculé, pas choisi) et c'est de très loin le cas
 * le plus fréquent à la saisie.
 */
export const CIBLE_FORM_DEFAULTS: CibleFormValues = {
  annee: new Date().getFullYear(),
  valeur_cible_indcateur_istr: 0,
  code_indicateur_istr: 0,
  code_programme: 0,
  code_ug: null,
}
