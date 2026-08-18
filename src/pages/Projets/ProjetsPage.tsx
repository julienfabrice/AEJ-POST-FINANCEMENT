import { useMemo } from 'react'

import {
  Search,
  Plus,
  Download,
  FolderOpen,
  ClipboardList,
  Banknote,
  TrendingUp,
  MoreHorizontal,
  Eye,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
import { DataGrid } from '@/components/ui/DataGrid'

import { MOCK_PROJETS } from '@/mock'
import type { PROJET_T } from '@/types'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

const STATS = [
  { label: 'Total dossiers', value: '1 256', change: '+12 cette semaine', icon: FolderOpen, color: '#E7722B' },
  { label: 'En instruction', value: '127', change: '42 à certifier', icon: ClipboardList, color: '#2D6BD4' },
  { label: 'Financés', value: '874', change: '+8 ce mois', icon: Banknote, color: '#20A83A' },
  { label: 'Taux de couverture', value: '78%', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]

const STATUS_STYLES: Record<string, string> = {
  SOUMISSION: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0',
  ANALYSE: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0',
  CERTIFICATION: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  FINANCEMENT: 'bg-[#FBEADE] text-[#C85E18] hover:bg-[#FBEADE] border-0',
  DECAISSEMENT: 'bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0',
  SUIVI: 'bg-blue-50 text-blue-600 hover:bg-blue-50 border-0',
  REMBOURSEMENT: 'bg-green-50 text-green-700 hover:bg-green-50 border-0',
}

const ProjectTitleCellRenderer = (params: ICellRendererParams<PROJET_T>) => {
  if (!params.data) return null
  return (
    <div className="flex flex-col justify-center h-full">
      <span className="font-semibold text-[#131C29] truncate">{params.data.titre}</span>
      <span className="text-[11px] text-slate-500 font-medium leading-none">{params.data.dispositif}</span>
    </div>
  )
}

const AmountCellRenderer = (params: ICellRendererParams<PROJET_T>) => (
  <div className="flex items-center justify-end h-full font-mono font-semibold">
    {params.value} <span className="text-slate-400 font-normal ml-1 text-[11px]">FCFA</span>
  </div>
)

const StatusCellRenderer = (params: ICellRendererParams<PROJET_T>) => {
  if (!params.value) return null
  const badgeClass = STATUS_STYLES[params.value] || STATUS_STYLES.SOUMISSION
  return (
    <div className="flex items-center h-full">
      <Badge className={badgeClass}>{params.value}</Badge>
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

export function ProjetsPage() {
  const columnDefs = useMemo<ColDef<PROJET_T>[]>(() => [
    { 
      field: 'ref', 
      headerName: 'Référence', 
      width: 130,
      cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500">{p.value}</span>
    },
    { 
      field: 'titre', 
      headerName: 'Titre du projet', 
      flex: 1, 
      minWidth: 200,
      cellRenderer: ProjectTitleCellRenderer 
    },
    { field: 'promoteur', headerName: 'Promoteur', width: 180 },
    { field: 'agence', headerName: 'Agence', width: 130 },
    { 
      field: 'montant', 
      headerName: 'Montant', 
      width: 140,
      cellRenderer: AmountCellRenderer,
      headerClass: 'ag-right-aligned-header',
    },
    { 
      field: 'statut', 
      headerName: 'Statut', 
      width: 140,
      cellRenderer: StatusCellRenderer 
    },
    { field: 'date', headerName: 'Date', width: 110 },
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
          <h1 className="text-2xl font-extrabold text-[#131C29]">Micro-projets</h1>
          <p className="text-sm text-[#5A6B80] mt-1">Suivi des dossiers de financement des jeunes promoteurs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-slate-100 shadow-sm">
              <CardContent className="p-5 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5A6B80] mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-[#131C29]">{stat.value}</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: stat.color }}>
                    {stat.change}
                  </p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Barre de filtres */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-white shadow-sm border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Référence, titre du projet ou nom du promoteur..."
            className="pl-9 bg-[#F3F5F8] border-none"
          />
        </div>
        <Select defaultValue="tous_disp">
          <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
            <SelectValue placeholder="Dispositif" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous_disp">Tous les dispositifs</SelectItem>
            <SelectItem value="agr">AGR Classique</SelectItem>
            <SelectItem value="meps">MEPS</SelectItem>
            <SelectItem value="mpe">MPE</SelectItem>
            <SelectItem value="struct">Projets structurants</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="tous_statut">
          <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous_statut">Tous les statuts</SelectItem>
            <SelectItem value="SOUMISSION">Soumission</SelectItem>
            <SelectItem value="ANALYSE">Analyse</SelectItem>
            <SelectItem value="CERTIFICATION">Certification</SelectItem>
            <SelectItem value="FINANCEMENT">Financement</SelectItem>
            <SelectItem value="DECAISSEMENT">Décaissement</SelectItem>
            <SelectItem value="SUIVI">Suivi</SelectItem>
            <SelectItem value="REMBOURSEMENT">Remboursement</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="toutes_agences">
          <SelectTrigger className="w-full sm:w-[160px] bg-[#F3F5F8] border-none">
            <SelectValue placeholder="Agence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes_agences">Toutes les agences</SelectItem>
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
          rowData={MOCK_PROJETS} 
          columnDefs={columnDefs} 
          height="calc(100vh - 400px)"
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
