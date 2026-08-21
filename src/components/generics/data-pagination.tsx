import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/** Nom de l'entité paginée, pour le décompte (« 128 promoteurs »). */
export interface ItemLabel {
  singular: string
  plural: string
}

export interface DataPaginationProps {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  /** Omis ⇒ pas de sélecteur de taille de page. */
  onPerPageChange?: (perPage: number) => void
  perPageOptions?: readonly number[]
  /** Défaut : « élément » / « éléments ». */
  itemLabel?: ItemLabel
  isFetching?: boolean
  className?: string
}

const DEFAULT_PER_PAGE_OPTIONS = [15, 25, 50, 100] as const
const DEFAULT_ITEM_LABEL: ItemLabel = { singular: 'élément', plural: 'éléments' }

/**
 * Pagination EXTERNE, réutilisable par n'importe quelle liste.
 *
 * Elle ne connaît RIEN des lignes : uniquement `page`, `perPage` et `total`.
 * C'est pourquoi elle n'est pas générique sur le type de données — il n'y a
 * aucune donnée ici, seulement des compteurs. Le seul élément propre au domaine
 * est le nom de l'entité, passé via `itemLabel`.
 *
 * À utiliser quand la pagination est SERVEUR : celle d'ag-grid ne connaîtrait
 * que la page courante et afficherait donc un total faux.
 */
export function DataPagination({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  itemLabel = DEFAULT_ITEM_LABEL,
  isFetching,
  className,
}: DataPaginationProps) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  const isFirst = page <= 1
  const isLast = page >= pages

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-[#131C29]">{total.toLocaleString('fr-FR')}</span>{' '}
          {total > 1 ? itemLabel.plural : itemLabel.singular}
        </p>

        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Lignes</span>
            <Select
              value={String(perPage)}
              onValueChange={(v) => onPerPageChange(Number(v))}
              disabled={isFetching}
            >
              <SelectTrigger size="sm" className="w-[76px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((n) => (
                  <SelectItem key={n} value={String(n)} className="cursor-pointer">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst || isFetching}
          className="cursor-pointer"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Précédent
        </Button>

        {/* Le compteur porte aussi l'état de chargement : c'est le point que
            l'œil suit quand on pagine. */}
        <span
          className="flex min-w-[9rem] items-center justify-center gap-1.5 text-sm text-slate-600"
          role="status"
          aria-live="polite"
        >
          {isFetching ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E7722B]" />
              Chargement…
            </>
          ) : (
            <>
              Page <span className="font-semibold text-[#131C29]">{page}</span> / {pages}
            </>
          )}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast || isFetching}
          className="cursor-pointer"
        >
          Suivant
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
