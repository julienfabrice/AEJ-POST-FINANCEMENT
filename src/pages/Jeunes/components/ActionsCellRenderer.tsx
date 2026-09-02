import type { ICellRendererParams } from 'ag-grid-community'
import { MoreHorizontal, Pencil, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PermissionGate } from '@/components/PermissionGate'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
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
  const can = useCan()
  const promoteur = params.data

  const hasWriteActions = can(MODULES.JEUNES, 'e') || can(MODULES.JEUNES, 'd')

  return (
    <div className="flex items-center justify-end h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Actions de consultation : le simple accès au module suffit. */}
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={!promoteur}
            onClick={() => promoteur && params.context.onShowDetail(promoteur)}
          >
            <Info className="mr-2 h-4 w-4 text-slate-500" />
            À propos
          </DropdownMenuItem>

          {hasWriteActions && <DropdownMenuSeparator />}

          <PermissionGate module={MODULES.JEUNES} action="e">
            <DropdownMenuItem disabled title="Les données de cette table proviennent directement du système de l'AEJ.">
              <Pencil className="mr-2 h-4 w-4 text-slate-400" />
              Modifier
            </DropdownMenuItem>
          </PermissionGate>

          <PermissionGate module={MODULES.JEUNES} action="d">
            <DropdownMenuItem disabled title="Les données de cette table proviennent directement du système de l'AEJ.">
              <Trash2 className="mr-2 h-4 w-4 text-slate-400" />
              Supprimer
            </DropdownMenuItem>
          </PermissionGate>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
