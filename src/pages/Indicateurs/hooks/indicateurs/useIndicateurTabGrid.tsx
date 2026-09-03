import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";

const fmt = (num: number) => new Intl.NumberFormat('fr-FR').format(num)


export function useIndicateurTabGrid(searchQuery: string, onEdit: (data: any) => void) {


    const columnDefs = useMemo<ColDef[]>(() => {
    const actionsCol: ColDef = {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
            onEdit: (data: any) => onEdit(data),
            onDelete: () => console.log('Delete action clicked')
        },
    }
    return [
      { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
      { field: 'nom', headerName: 'Nom', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.nom}</span> },
      { field: 'unite', headerName: 'Unité', flex: 1 },
      { field: 'type_valeur', headerName: 'Type de valeur', flex: 1 },
      { field: 'valeur_cible', headerName: 'Cible', flex: 1, cellRenderer: (params: any) => fmt(params.data.valeur_cible?params.data.valeur_cible: 0) },
      actionsCol
    ]
  }, [onEdit])

    const { data=[], isLoading } = indicateurServices.useGetAll()


    const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const fuse = new Fuse(data, {
        keys: ['code', 'nom'],
        threshold: 0.3,
        ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery, data])

  return { columnDefs, data: filteredData, isLoading: isLoading }
}
