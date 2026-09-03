import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import {indicateursSuivisServices} from "@/services/indicateurs/indicateurs-suivis.services.ts";
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";

dayjs.locale('fr')



export function useRelevesGrid(searchQuery: string, onEdit: (data: any) => void) {
    const { data: indicateurs = [] } = indicateurServices.useGetAll()
    const { data: indicateurs_suivis = [], isLoading } = indicateursSuivisServices.useGetAll()



    const columnDefs = useMemo<ColDef[]>(() => {
    const actionsCol: ColDef = {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
            onEdit:  (data: any) => onEdit(data),
            onDelete: () => console.log('Delete action clicked')
        },
    }

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
          return ind ? <span className="font-semibold"> {ind.code} - {ind.nom}</span> : params.data.indicateur_id
      } },
      { field: 'jeune_id', headerName: 'Bénéficiaire', flex: 1, cellRenderer: (params: any) => <Badge variant="secondary"> {params.data.jeune_id}</Badge> },
      { field: 'valeur', headerName: 'Valeur', flex: 1, cellRenderer: (params: any) => <span className="font-bold text-[#E7722B]">{params.data.valeur}</span> },
      { 
        field: 'created', 
        headerName: 'Date', 
        flex: 1,
        cellRenderer: (params: any) => {
          if (!params.data.created_at) return null
          return <span>{dayjs(params.data.created_at).format('DD/MM/YYYY')}</span>
        }
      },
      actionsCol
    ]
  }, [onEdit])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return indicateurs_suivis

    const fuse = new Fuse(indicateurs_suivis, {
      keys: ['periode', 'jeune_id', 'valeur'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery, indicateurs_suivis])

  return { columnDefs, data: filteredData, isLoading: isLoading}
}
