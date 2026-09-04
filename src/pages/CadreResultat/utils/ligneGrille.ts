/**
 * CADRE DE RÉSULTAT — adaptation des entités aux conventions du renderer
 * d'actions PARTAGÉ.
 *
 * ── Pourquoi cet adaptateur existe ──
 * `ActionsCellRenderer` (`src/pages/Referentiels/components/`) est le renderer
 * d'actions COMMUN à tout le dépôt, et la consigne est de le RÉUTILISER, pas
 * de le recopier. Or il lit deux propriétés en dur sur la ligne :
 *
 *   • `params.data.id`      → l'identifiant passé à `onDelete` ;
 *   • `params.data.libelle` (ou `.nom`) → le nom cité dans le toast de
 *     confirmation « Suppression de "…" programmée ».
 *
 * Les cinq tables du cadre de résultat n'ont NI l'un NI l'autre : leurs clés
 * primaires s'appellent `id_nsc`, `id_cs`, `id_indicateur_str`,
 * `id_cible_indicateur_istr`, `id_suivi_indicateur_istr`, et aucune ne porte de
 * colonne `libelle`. Branchées telles quelles, les grilles supprimeraient
 * `undefined` et le toast afficherait « Élément #undefined ».
 *
 * Deux mauvaises réponses écartées :
 *  • modifier `ActionsCellRenderer` pour qu'il accepte un champ d'identifiant
 *    paramétrable — il est utilisé par une quinzaine d'écrans livrés, et le
 *    module « cadre de résultat » n'a pas à faire porter son cas particulier à
 *    tout le dépôt ;
 *  • recopier le renderer dans ce module — la consigne l'interdit, et une
 *    copie divergerait dès la première évolution du confirmateur de
 *    suppression.
 *
 * La réponse retenue : une LIGNE DE GRILLE, c'est-à-dire l'entité augmentée des
 * deux propriétés d'affichage attendues. L'entité d'origine reste intacte et
 * intégralement accessible (`onEdit` reçoit la ligne, et le formulaire y relit
 * les vrais champs) ; on n'ajoute aucune DONNÉE, seulement deux projections de
 * champs déjà présents.
 *
 * ⚠️ `id` et `libelle` sont des champs d'AFFICHAGE : ils ne doivent jamais être
 * envoyés à l'API. Les charges utiles sont construites champ par champ par les
 * formulaires et les `toApiPayload` des services, jamais par étalement de la
 * ligne — c'est ce qui garantit qu'ils n'y arrivent pas.
 */

/** Entité du module augmentée des deux champs attendus par le renderer partagé. */
export type LIGNE_GRILLE_T<T> = T & {
  /** Clé primaire de l'entité, sous le nom générique lu par `ActionsCellRenderer`. */
  id: number
  /** Nom lisible de la ligne, cité dans le toast de confirmation de suppression. */
  libelle: string
}

/**
 * Entités → lignes de grille.
 *
 * Les deux extracteurs sont fournis par l'appelant : chaque table nomme sa clé
 * primaire différemment, et le « nom lisible » d'une ligne dépend du métier
 * (l'intitulé d'un élément du cadre, le code d'un indicateur, l'année d'une
 * cible…). Les centraliser ici obligerait ce fichier à connaître les cinq
 * tables ; les laisser à l'appelant garde une seule règle générique.
 */
export function versLignesGrille<T extends object>(
  entites: T[],
  identifiant: (entite: T) => number,
  libelle: (entite: T) => string,
): LIGNE_GRILLE_T<T>[] {
  return entites.map((entite) => ({
    ...entite,
    id: identifiant(entite),
    libelle: libelle(entite),
  }))
}
