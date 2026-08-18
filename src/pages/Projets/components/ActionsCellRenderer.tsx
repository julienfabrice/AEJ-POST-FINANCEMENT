import { MoreHorizontal, Eye, ArrowRight, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const ActionsCellRenderer = () => {
  return (
    <div className="flex items-center justify-end h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4 text-slate-500" />
            Ouvrir le dossier
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowRight className="mr-2 h-4 w-4 text-slate-500" />
            Avancer l'étape
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4 text-slate-500" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
