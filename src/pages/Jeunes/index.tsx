import { useMemo } from 'react'

import {
  Search,
  UserPlus,
  Download,
  MoreHorizontal,
  Eye,
  History,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DataGrid } from '@/components/ui/DataGrid'

import { MOCK_JEUNES } from '@/mock'
import type { JEUNE_T } from '@/types'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

const AVATAR_COLORS = [
  '#E7722B',
  '#20A83A',
  '#2D6BD4',
  '#E0A106',
  '#D6453B',
  '#8B5CF6',
]

// Composants de rendu personnalisés pour AG Grid
const ProfileCellRenderer = (params: ICellRendererParams<JEUNE_T>) => {
  if (!params.data) return null
  const { prenoms, nom } = params.data
  // On utilise l'index de la ligne pour la couleur (node.rowIndex)
  const colorIndex = (params.node?.rowIndex ?? 0) % AVATAR_COLORS.length
  const color = AVATAR_COLORS[colorIndex]
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

export function JeunesPage() {
  // Définition des colonnes pour AG Grid
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

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Promoteurs (porteurs)</h1>
          <p className="text-sm text-[#5A6B80] mt-1">Gestion des jeunes promoteurs enregistrés</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouveau promoteur
          </Button>
        </div>
      </div>

      {/* Barre de filtres */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-white">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, téléphone, matricule..."
            className="pl-9 bg-[#F3F5F8] border-none"
          />
        </div>
        <Select defaultValue="tous">
          <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
            <SelectValue placeholder="Dispositif" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les dispositifs</SelectItem>
            <SelectItem value="agr">AGR Classique</SelectItem>
            <SelectItem value="meps">MEPS</SelectItem>
            <SelectItem value="mpe">MPE</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="toutes">
          <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les régions</SelectItem>
            <SelectItem value="abidjan">Abidjan</SelectItem>
            <SelectItem value="bouake">Bouaké</SelectItem>
            <SelectItem value="korhogo">Korhogo</SelectItem>
            <SelectItem value="daloa">Daloa</SelectItem>
            <SelectItem value="san-pedro">San-Pedro</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Tableau AG Grid */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <DataGrid 
          rowData={MOCK_JEUNES} 
          columnDefs={columnDefs} 
          height="calc(100vh - 300px)"
          rowHeight={60}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </Card>
    </div>
  )
}
