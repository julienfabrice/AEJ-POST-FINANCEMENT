import { MoreHorizontal, Eye, History, Pencil, Trash2 } from 'lucide-react'
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

  const hasWriteActions = can(MODULES.JEUNES, 'e') || can(MODULES.JEUNES, 'd')

  return (
    <div className="flex items-center justify-end h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Actions de consultation : le simple accès au module suffit. */}
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4 text-slate-500" />
            Voir le profil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4 text-slate-500" />
            Antécédents
          </DropdownMenuItem>

          {hasWriteActions && <DropdownMenuSeparator />}

          <PermissionGate module={MODULES.JEUNES} action="e">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
              Modifier
            </DropdownMenuItem>
          </PermissionGate>

          <PermissionGate module={MODULES.JEUNES} action="d">
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
