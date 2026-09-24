import type { ICellRendererParams } from 'ag-grid-community'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'

/**
 * ag-grid passe `context` (défini une fois sur la grille) à chaque cellule :
 * c'est le chemin le plus court pour qu'une action de ligne remonte à la page,
 * sans faire transiter un callback par `useTableData` et `cellRendererParams`.
 */
export interface PromoteurGridContext {
  onShowDetail: (promoteur: PROMOTEUR_T) => void
}

export const ActionsCellRenderer = (
  params: ICellRendererParams<PROMOTEUR_T, unknown, PromoteurGridContext>,
) => {
  const promoteur = params.data

  return (
    <div className="flex items-center justify-end h-full">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
        disabled={!promoteur}
        onClick={() => promoteur && params.context.onShowDetail(promoteur)}
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  )
}

