import type { ColDef } from 'ag-grid-community'

import { CADRE_RESULTAT_ONGLET_KEYS, type CadreResultatOngletKey } from '../constants'
import { useCadresGrid } from './cadres/useCadresGrid'
import { useCiblesGrid } from './cibles/useCiblesGrid'
import { useIndicateursCadreGrid } from './indicateurs/useIndicateursCadreGrid'
import { useNiveauxGrid } from './niveaux/useNiveauxGrid'
import { useSuivisIndicateurGrid } from './suivis/useSuivisIndicateurGrid'

/**
 * CADRE DE RÉSULTAT — agrégateur des cinq onglets de grille.
 *
 * Même rôle que `useSuiviGrid` / `usePartenairesGrid` : la page n'a affaire
 * qu'à UN contrat de retour, quel que soit l'onglet affiché.
 *
 * ── Pourquoi les CINQ hooks sont appelés à chaque rendu ──
 * Ce sont des hooks : ils ne peuvent pas être conditionnels. C'est sans
 * conséquence ici, et même moins qu'ailleurs — tant que
 * `CADRE_RESULTAT_API_PRETE` vaut `false`, les cinq `useGetAll` sont
 * `enabled: false` et n'émettent AUCUNE requête. Une fois l'API branchée, ce
 * seront cinq ressources non paginées dont TanStack Query mutualise déjà les
 * requêtes, y compris celles que les grilles partagent pour résoudre leurs
 * clés étrangères (les niveaux, les éléments du cadre et les indicateurs sont
 * lus par plusieurs onglets, mais chargés une seule fois).
 *
 * Pas de `useMemo` sur la sélection : l'objet d'aiguillage serait recréé à
 * chaque rendu de toute façon, la mémoïsation ne stabiliserait rien et
 * masquerait juste la dépendance (même arbitrage que `useSuiviGrid`).
 *
 * ══════════════════════════════════════════════════════════════════════
 *  `fermerEdition` — l'édition ne survit pas au changement d'onglet
 * ══════════════════════════════════════════════════════════════════════
 * Correction déjà appliquée au lot `/suivi`, reprise ici pour la même raison.
 *
 * Seul le `modalNode` de l'onglet AFFICHÉ est rendu par la page. Basculer
 * d'onglet démonte donc la Dialog d'édition SANS remettre à `null`
 * l'`editingItem` de l'onglet quitté : revenir dessus ROUVRIRAIT la modale tout
 * seul, sur une ligne que l'utilisateur avait quittée. La page appelle donc
 * `fermerEdition()` au changement d'onglet, exactement là où elle vide déjà la
 * recherche.
 *
 * Deux corrections écartées, et pourquoi :
 * • `key={activeTab}` sur le conteneur du `modalNode` ne changerait rien —
 *   `editingItem` vit dans le hook, appelé à chaque rendu de la page, et non
 *   dans l'élément remonté : la Dialog serait recréée avec `open` toujours à
 *   `true`.
 * • un `useEffect` sur un drapeau « onglet actif » serait un setState
 *   synchrone dans un effet — cascade de rendus, et refus de la règle
 *   `react-hooks/set-state-in-effect`. Purger dans l'ÉVÉNEMENT qui provoque le
 *   changement est la forme idiomatique, et la seule source possible de ce
 *   changement est le `onValueChange` des onglets.
 *
 * ⚠️ Cinq onglets ici contre deux dans `/suivi` : le risque est d'autant plus
 * réel qu'il y a de modales susceptibles de rester armées en arrière-plan.
 */
export function useCadreResultatGrid(
  activeTab: CadreResultatOngletKey,
  searchQuery: string,
) {
  const cadres = useCadresGrid(searchQuery)
  const indicateurs = useIndicateursCadreGrid(searchQuery)
  const cibles = useCiblesGrid(searchQuery)
  const suivis = useSuivisIndicateurGrid(searchQuery)
  const niveaux = useNiveauxGrid(searchQuery)

  // Chaîne de ternaires plutôt qu'une table d'aiguillage : les cinq valeurs de
  // `CadreResultatOngletKey` sont couvertes, la dernière servant de branche par
  // défaut. Une `Record<CadreResultatOngletKey, …>` aurait la même exhaustivité
  // mais construirait un objet à chaque rendu pour n'en lire qu'une entrée.
  const onglet =
    activeTab === CADRE_RESULTAT_ONGLET_KEYS.CADRE
      ? cadres
      : activeTab === CADRE_RESULTAT_ONGLET_KEYS.INDICATEURS
        ? indicateurs
        : activeTab === CADRE_RESULTAT_ONGLET_KEYS.CIBLES
          ? cibles
          : activeTab === CADRE_RESULTAT_ONGLET_KEYS.SUIVIS
            ? suivis
            : niveaux

  // Les cinq colonnes sont typées sur des lignes DIFFÉRENTES ; la page, elle,
  // n'en connaît aucune. `ColDef[]` (soit `ColDef<any>[]`, le défaut d'AG Grid)
  // est le seul type commun, et c'est celui qu'attend `DataGrid` — même
  // aplatissement que dans `useSuiviGrid`.
  const columnDefs: ColDef[] = onglet.columnDefs

  // Les CINQ onglets sont purgés, sans se demander lequel détenait l'édition :
  // remettre à `null` un état déjà `null` ne provoque aucun rendu.
  const fermerEdition = () => {
    cadres.fermerEdition()
    indicateurs.fermerEdition()
    cibles.fermerEdition()
    suivis.fermerEdition()
    niveaux.fermerEdition()
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
