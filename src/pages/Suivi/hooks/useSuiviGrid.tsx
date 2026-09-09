import type { ColDef } from 'ag-grid-community'

import { useExploitationsGrid } from './exploitations/useExploitationsGrid'
import { useEmbauchesGrid } from './embauches/useEmbauchesGrid'

/** Onglets de la page « Suivi & exploitation ». */
export type SuiviTab = 'exploitations' | 'embauches'

/**
 * Agrégateur d'onglets — même rôle que `usePartenairesGrid` /
 * `useLocalitesGrid`.
 *
 * Les DEUX hooks d'onglet sont appelés à chaque rendu : ce sont des hooks, ils
 * ne peuvent pas être conditionnels. C'est sans conséquence — `/exploitations`
 * et `/embauches` sont deux petites ressources non paginées, et TanStack Query
 * mutualise déjà leurs requêtes.
 *
 * Pas de `useMemo` sur la sélection : l'objet d'aiguillage serait recréé à
 * chaque rendu de toute façon, la mémoïsation ne stabiliserait rien et
 * masquerait juste la dépendance.
 *
 * ── `fermerEdition` : l'édition ne survit pas au changement d'onglet ──
 * Seul le `modalNode` de l'onglet AFFICHÉ est rendu par la page. Basculer
 * d'onglet démontait donc la Dialog d'édition SANS remettre l'`editingItem`
 * de l'onglet quitté à `null` : revenir dessus ROUVRAIT la modale tout seul,
 * sur une ligne que l'utilisateur avait quittée. La page appelle donc
 * `fermerEdition()` au changement d'onglet, exactement là où elle vide déjà
 * la recherche.
 *
 * Deux corrections écartées, et pourquoi :
 * • `key={activeTab}` sur le conteneur du `modalNode` ne changerait rien —
 *   `editingItem` vit dans le hook, appelé à chaque rendu de la page, et non
 *   dans l'élément remonté : la Dialog serait recréée avec `open` toujours à
 *   `true`.
 * • un `useEffect` sur un drapeau « onglet actif » serait un setState
 *   synchrone dans un effet — cascade de rendus, et refus de la règle
 *   `react-hooks/set-state-in-effect`. Purger dans l'ÉVÉNEMENT qui provoque
 *   le changement est la forme idiomatique, et la seule source possible de ce
 *   changement est le `onValueChange` des onglets.
 *
 * ⚠️ Défaut hérité du gabarit `usePartenairesGrid` : il n'est corrigé QUE
 * dans ce module, le gabarit d'origine est hors périmètre.
 */
export function useSuiviGrid(activeTab: SuiviTab, searchQuery: string) {
  const exploitations = useExploitationsGrid(searchQuery)
  const embauches = useEmbauchesGrid(searchQuery)

  const onglet = activeTab === 'exploitations' ? exploitations : embauches
  const columnDefs: ColDef[] = onglet.columnDefs

  // Les DEUX onglets sont purgés, sans se demander lequel détenait l'édition :
  // remettre à `null` un état déjà `null` ne provoque aucun rendu.
  const fermerEdition = () => {
    exploitations.fermerEdition()
    embauches.fermerEdition()
  }

  return {
    columnDefs,
    data: onglet.data,
    isLoading: onglet.isLoading,
    isError: onglet.isError,
    error: onglet.error,
    modalNode: onglet.modalNode,
    fermerEdition,
  }
}
