import { MoreHorizontal, Eye, ArrowRight, Pencil, Trash2 } from 'lucide-react'
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

export const ActionsCellRenderer = () => {
  const can = useCan()
  // Le séparateur n'a de sens que s'il sépare réellement quelque chose.
  const hasWriteActions = can(MODULES.PROJETS, 'e') || can(MODULES.PROJETS, 'd')

  return (
    <div className="flex items-center justify-end h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Consultation : le simple accès au module suffit. */}
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4 text-slate-500" />
            Ouvrir le dossier
          </DropdownMenuItem>

          {/* Faire avancer un dossier modifie son état : droit d'édition. */}
          <PermissionGate module={MODULES.PROJETS} action="e">
            <DropdownMenuItem>
              <ArrowRight className="mr-2 h-4 w-4 text-slate-500" />
              Avancer l'étape
            </DropdownMenuItem>
          </PermissionGate>

          {hasWriteActions && <DropdownMenuSeparator />}

          <PermissionGate module={MODULES.PROJETS} action="e">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
              Modifier
            </DropdownMenuItem>
          </PermissionGate>

          <PermissionGate module={MODULES.PROJETS} action="d">
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </PermissionGate>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
