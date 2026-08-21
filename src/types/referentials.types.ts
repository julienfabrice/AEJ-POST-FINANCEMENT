/**
 * Élément de référentiel, forme tolérante.
 *
 * Les endpoints `/aej/*` ne nomment pas tous leur libellé de la même façon
 * (`libelle`, `nom`, `intitule`…). Plutôt que d'écrire un type par référentiel,
 * on accepte les variantes et on résout l'étiquette avec `refLabel`.
 */
export interface REF_ITEM_T {
  id: number
  libelle?: string
  nom?: string
  intitule?: string
  code?: string
  code_iso?: string | null
}

/** Étiquette affichable : première clé renseignée, sinon repli sur l'id. */
export const refLabel = (item: REF_ITEM_T): string =>
  item.libelle ?? item.nom ?? item.intitule ?? item.code ?? `#${item.id}`
