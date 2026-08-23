import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { indicateurs, indicateurs_suivi } from '@/mock'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

dayjs.locale('fr')

const actionsCol: ColDef = {
  headerName: 'Actions',
  width: 120,
  minWidth: 120,
  sortable: false,
  filter: false,
  cellRenderer: ActionsCellRenderer,
  cellRendererParams: {
    onEdit: () => console.log('Edit action clicked'),
    onDelete: () => console.log('Delete action clicked')
  },
}

export function useRelevesGrid(searchQuery: string) {
  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { 
        field: 'periode', 
        headerName: 'Période', 
        flex: 1, 
        cellRenderer: (params: any) => {
          if (!params.data.periode) return null
          const formatted = dayjs(params.data.periode).format('MMMM YYYY')
          return <span className="font-medium capitalize text-slate-700">{formatted}</span>
        } 
      },
      { field: 'indicateur', headerName: 'Indicateur', flex: 2, cellRenderer: (params: any) => {
          const ind = indicateurs.find(i => i.id === params.data.indicateur_id)
          return ind ? <span className="font-semibold">{ind.code} - {ind.nom}</span> : params.data.indicateur_id
      } },
      { field: 'jeune_id', headerName: 'Bénéficiaire', flex: 1, cellRenderer: (params: any) => <Badge variant="secondary">{params.data.jeune_id}</Badge> },
      { field: 'valeur', headerName: 'Valeur', flex: 1, cellRenderer: (params: any) => <span className="font-bold text-[#E7722B]">{params.data.valeur}</span> },
      { 
        field: 'created', 
        headerName: 'Date', 
        flex: 1,
        cellRenderer: (params: any) => {
          if (!params.data.created) return null
          return <span>{dayjs(params.data.created).format('DD/MM/YYYY')}</span>
        }
      },
      actionsCol
    ]
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return indicateurs_suivi

    const fuse = new Fuse(indicateurs_suivi, {
      keys: ['periode', 'jeune_id', 'valeur'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery])

  return { columnDefs, data: filteredData, isLoading: false }
}
