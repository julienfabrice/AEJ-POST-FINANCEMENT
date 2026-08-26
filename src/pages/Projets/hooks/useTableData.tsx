import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { configurationServices } from '@/services/configurations.services'

import { useProjetsStore } from '@/store/useProjetsStore'

export function useTableData() {
  const { setSelectedProjet } = useProjetsStore()
  const { data: configuration } = configurationServices.useGet()
  
  const columnDefs = useMemo<ColDef<MICRO_PROJET_T>[]>(() => [
    {
      field: 'code',
      headerName: 'Référence',
      width: 130,
      cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500">{p.value}</span>
    },
    {
      field: 'intitule',
      headerName: 'Titre du projet',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        return (
          <div className="py-2">
            <div className="font-medium text-slate-900 leading-tight mb-0.5">{params.value}</div>
            <div className="text-xs text-slate-500 truncate max-w-xs">{params.data.description?.substring(0, 60)}...</div>
          </div>
        )
      }
    },
    { 
      field: 'promoteur_id', 
      headerName: 'Promoteur', 
      width: 180,
      cellRenderer: (params: any) => {
        const p = params.data.promoteur
        return p ? (
          <div className="flex items-center gap-2 h-full">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
              {p.nom.charAt(0)}
            </div>
            <span className="truncate">{p.prenom} {p.nom}</span>
          </div>
        ) : '-'
      }
    },
    { 
      field: 'agence_id', 
      headerName: 'Agence', 
      width: 130,
      cellRenderer: (params: any) => params.data.agence?.libelle || '-'
    },
    {
      field: 'montant_total',
      headerName: 'Montant',
      width: 140,
      cellRenderer: (params: any) => {
        const val = parseFloat(params.value || '0')
        return <span className="font-medium">{new Intl.NumberFormat('fr-FR').format(val)} {configuration?.sigle_monnaie_pays || 'FCFA'}</span>
      },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center h-full">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-full truncate">
              {params.value ? params.value.replace(/_/g, ' ') : (params.data.stade_projet || '-')}
            </span>
          </div>
        )
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Date', 
      width: 110,
      cellRenderer: (params: any) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : '-'
    },
    {
      headerName: 'Actions',
      width: 70,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full">
            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900" onClick={() => setSelectedProjet(params.data)} title="Détails">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    }
  ], [setSelectedProjet, configuration])

  return { columnDefs }
}
