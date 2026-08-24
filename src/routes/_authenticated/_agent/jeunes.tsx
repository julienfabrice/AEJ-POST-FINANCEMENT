import { createFileRoute } from '@tanstack/react-router'
import { DEFAULT_PER_PAGE } from '@/constants/promoteurs.filters'
import { JeunesPage } from '@/pages/Jeunes'
import type { PROMOTEUR_SEARCH_T } from '@/types/promoteurs.types'

/** `?x=` absent ou vide ⇒ `undefined`, pour que le filtre ne parte pas du tout. */
const str = (v: unknown) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? undefined : s
}

/**
 * L'URL est l'UNIQUE source de vérité des filtres et de la pagination.
 * `validateSearch` déclare et convertit chaque paramètre : le reste de l'écran
 * reçoit un objet typé, jamais des chaînes brutes.
 *
 * Toute clé de `PROMOTEUR_FILTERS` doit figurer ici, sinon elle ne survivrait
 * pas à un rechargement ni au partage d'un lien.
 */
export const Route = createFileRoute('/_authenticated/_agent/jeunes')({
  validateSearch: (s: Record<string, unknown>): PROMOTEUR_SEARCH_T => ({
    page: Number(s.page) || 1,
    perPage: Number(s.perPage) || DEFAULT_PER_PAGE,
    search: str(s.search),

    // Promoteur — référentiels
    sexe_id: str(s.sexe_id),
    paysnationalite_id: str(s.paysnationalite_id),
    niveauetude_id: str(s.niveauetude_id),
    situationmatrimoniale_id: str(s.situationmatrimoniale_id),
    typepieceidentite_id: str(s.typepieceidentite_id),
    typesituationhandicap_id: str(s.typesituationhandicap_id),
    agenceregionale_id: str(s.agenceregionale_id),
    secteuractivite_id: str(s.secteuractivite_id),
    soussecteuractivite_id: str(s.soussecteuractivite_id),

    // Promoteur — énumération
    tranche_age: str(s.tranche_age),

    // Projet — énumérations
    statut: str(s.statut),
    stade_projet: str(s.stade_projet),
    type_projet: str(s.type_projet),
  }),
  // TODO(perms) : garde désactivé temporairement.
  // Rétablir avec `beforeLoad: requireModule(MODULES.JEUNES)` — la matrice de
  // permissions ne reconnaît pas encore le module côté backend (leftover #13).
  component: JeunesPage,
})
