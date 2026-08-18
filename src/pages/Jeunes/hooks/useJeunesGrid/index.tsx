import { useMemo } from 'react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { MoreHorizontal, Eye, History, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { JEUNE_T } from '@/types'

import { getRandomAvatarColor } from '@/helpers/getRandomAvatarColor'

const ProfileCellRenderer = (params: ICellRendererParams<JEUNE_T>) => {
  if (!params.data) return null
  const { prenoms, nom } = params.data
  
  const color = getRandomAvatarColor()
  const initials = `${prenoms.charAt(0)}${nom.charAt(0)}`.toUpperCase()

  return (
    <div className="flex items-center gap-3 h-full">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: color }}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="font-semibold text-[#131C29]">
        {prenoms} {nom}
      </span>
    </div>
  )
}

const ProjectsCellRenderer = (params: ICellRendererParams<JEUNE_T>) => (
  <div className="flex items-center justify-center h-full">
    <Badge variant="secondary" className="font-mono">
      {params.value}
    </Badge>
  </div>
)

const StatusCellRenderer = (params: ICellRendererParams<JEUNE_T>) => {
  const actif = params.value
  return (
    <div className="flex items-center h-full">
      {actif ? (
        <Badge className="bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0">Actif</Badge>
      ) : (
        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0">Inactif</Badge>
      )}
    </div>
  )
}

const ActionsCellRenderer = () => {
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
            Voir le profil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4 text-slate-500" />
            Antécédents
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

export function useJeunesGrid() {
  const columnDefs = useMemo<ColDef<JEUNE_T>[]>(() => [
    { 
      field: 'matricule', 
      headerName: 'Matricule',
      width: 130,
      cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500 font-medium">{p.value}</span>
    },
    { 
      headerName: 'Nom complet', 
      flex: 1,
      minWidth: 200,
      valueGetter: p => `${p.data?.prenoms} ${p.data?.nom}`,
      cellRenderer: ProfileCellRenderer 
    },
    { 
      field: 'telephone', 
      headerName: 'Téléphone', 
      width: 150,
      cellRenderer: (p: any) => <span className="font-mono text-sm text-slate-600">{p.value}</span>
    },
    { field: 'ville', headerName: 'Localité', width: 130 },
    { field: 'secteur', headerName: "Secteur d'activité", width: 150 },
    { 
      field: 'nb_projets', 
      headerName: 'Projets', 
      width: 100,
      cellRenderer: ProjectsCellRenderer,
      headerClass: 'ag-right-aligned-header',
      cellClass: 'text-center'
    },
    { 
      field: 'actif', 
      headerName: 'Statut', 
      width: 120,
      cellRenderer: StatusCellRenderer 
    },
    {
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
    }
  ], [])

  return { columnDefs }
}
