import { useMemo, useState } from 'react'
import { Loader2, SearchX, TriangleAlert, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { DataPagination } from '@/components/generics/data-pagination'
import { EmptyState } from '@/components/generics/emptyState'
import { PER_PAGE_OPTIONS } from '@/constants/promoteurs.filters'
import { promoteursServices } from '@/services/promoteurs.services'
import { cn } from '@/lib/utils'

import { JeunesHeader } from './UI/JeunesHeader'
import { PromoteursFilters } from './UI/PromoteursFilters'
import { PromoteurDetailSheet } from './UI/PromoteurSheet'
import type { PromoteurGridContext } from './components/ActionsCellRenderer'
import { usePromoteursSearch } from './hooks/usePromoteursSearch'
import { useTableData } from './hooks/useTableData'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'

const ITEM_LABEL = { singular: 'promoteur', plural: 'promoteurs' }

export function JeunesPage() {
  const { search, setPage, setPerPage, resetFilters } = usePromoteursSearch()
  const { columnDefs } = useTableData()

  /**
   * Promoteur affiché dans la fiche latérale. La ligne complète est conservée
   * — pas seulement son id : tout ce qu'affiche la fiche est déjà présent sur
   * la ligne, aucun appel supplémentaire n'est nécessaire.
   */
  const [selected, setSelected] = useState<PROMOTEUR_T | null>(null)

  // `context` est lu par les cellules via `params.context` : c'est ainsi que
  // l'action « À propos » d'une ligne remonte jusqu'ici.
  const gridContext = useMemo<PromoteurGridContext>(
    () => ({ onShowDetail: setSelected }),
    [],
  )

  // La clé de cache contient tout le `search` : filtrer ou changer de page
  // suffit à relancer la requête, sans effet ni état supplémentaire.
  const { data, isLoading, isFetching, isError } = promoteursServices.useGetPromoteurs(search)

  const rows = data?.rows ?? []
  const total = data?.total ?? 0

  /**
   * `isLoading` n'est vrai qu'au TOUT PREMIER chargement : avec
   * `keepPreviousData`, changer de page ou de filtre passe par `isFetching`.
   * Distinguer les deux permet de garder la page précédente à l'écran pendant
   * le rechargement, au lieu de vider la grille.
   */
  const isRefetching = isFetching && !isLoading

  // Des filtres sont-ils en cause dans une liste vide ? La réponse change le
  // message ET l'action proposée.
  const hasFilters = Boolean(
    search.search ||
      search.statut ||
      search.stade_projet ||
      search.type_projet ||
      search.tranche_age ||
      search.sexe_id ||
      search.paysnationalite_id ||
      search.niveauetude_id ||
      search.situationmatrimoniale_id ||
      search.typepieceidentite_id ||
      search.typesituationhandicap_id ||
      search.agenceregionale_id ||
      search.secteuractivite_id ||
      search.soussecteuractivite_id,
  )

  const isEmpty = !isLoading && !isError && rows.length === 0

  return (
    <div className="space-y-6">
      <JeunesHeader />

      <PromoteursFilters />

      <Card className="overflow-hidden border-slate-200 p-0">
        <div className="relative">
          {isError ? (
            <EmptyState
              variant="bare"
              icon={TriangleAlert}
              title="Impossible de charger les promoteurs"
              description="La liste n'a pas pu être récupérée. Vérifiez votre connexion, puis réessayez."
            />
          ) : isEmpty ? (
            <EmptyState
              variant="bare"
              icon={hasFilters ? SearchX : Users}
              title={hasFilters ? 'Aucun résultat' : 'Aucun promoteur enregistré'}
              description={
                hasFilters
                  ? 'Aucun promoteur ne correspond à ces critères. Élargissez ou réinitialisez les filtres.'
                  : "Les promoteurs apparaîtront ici dès qu'ils seront enregistrés."
              }
            >
              {/* Une liste vide sans issue laisse l'utilisateur bloqué : quand
                  ce sont les filtres qui excluent tout, on offre la sortie. */}
              {hasFilters && (
                <Button variant="outline" onClick={resetFilters} className="cursor-pointer">
                  Réinitialiser les filtres
                </Button>
              )}
            </EmptyState>
          ) : (
            <div
              className={cn(
                'transition-opacity duration-200',
                // Rechargement : on estompe SANS démonter, pour que
                // l'utilisateur garde ses repères et ne voie pas la grille
                // clignoter.
                isRefetching && 'pointer-events-none opacity-50',
              )}
            >
              <DataGrid
                rowData={rows}
                columnDefs={columnDefs}
                height="calc(100vh - 360px)"
                rowHeight={60}
                // Premier chargement uniquement : il n'y a encore rien à préserver.
                loading={isLoading}
                /**
                 * Grille en mode AFFICHAGE SEUL : tri, filtres de colonne et
                 * pagination interne sont désactivés. Le serveur ne renvoie
                 * qu'une page à la fois — laisser ag-grid trier ou filtrer ne
                 * porterait que sur ces quelques lignes et mentirait sur
                 * l'ensemble.
                 */
                pagination={false}
                context={gridContext}
                defaultColDef={{
                  sortable: false,
                  filter: false,
                  resizable: true,
                }}
              />
            </div>
          )}

          {isRefetching && (
            <div
              className="pointer-events-none absolute top-3 right-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E7722B]" />
              Actualisation…
            </div>
          )}
        </div>

        <DataPagination
          page={search.page}
          perPage={search.perPage}
          total={total}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          perPageOptions={PER_PAGE_OPTIONS}
          itemLabel={ITEM_LABEL}
          isFetching={isFetching}
        />
      </Card>

      {/* `promoteur === null` ferme la fiche : un seul état pilote l'ouverture
          ET le contenu, ils ne peuvent donc pas se contredire. */}
      <PromoteurDetailSheet
        promoteur={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  )
}
