import type { ICellRendererParams } from 'ag-grid-community'

/** Paramètres additionnels passés via `cellRendererParams`. */
export interface MutedTextCellRendererParams extends ICellRendererParams {
  /**
   * Tronque le texte sur UNE ligne, largeur maximale 280 px — c'est le rendu
   * de la colonne « Observations » de la maquette (`max-width:280px` +
   * `text-overflow:ellipsis`). Le texte complet reste lisible en infobulle.
   */
  truncate?: boolean
}

/**
 * Texte ATTÉNUÉ (`.tmuted` de la maquette : gris ardoise, 12,5 px), avec le
 * repli « — » systématique attendu par le brief pour toute valeur issue d'une
 * relation optionnelle.
 *
 * Un seul composant pour les colonnes Agent, Entreprise, Bénéficiaire et
 * Observations : elles ne diffèrent que par la troncature.
 */
export const MutedTextCellRenderer = (params: MutedTextCellRendererParams) => {
  const texte = typeof params.value === 'string' ? params.value.trim() : params.value

  if (texte === null || texte === undefined || texte === '') {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  if (params.truncate) {
    return (
      <span
        className="block max-w-[280px] truncate text-[12.5px] text-slate-500"
        title={String(texte)}
      >
        {texte}
      </span>
    )
  }

  return <span className="text-[12.5px] text-slate-500">{texte}</span>
}
