import {useMemo, useState} from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";
import type {INDICATEUR_T} from "@/types";
import {IndicateurFormModal} from "@/pages/Indicateurs/components/IndicateurFormModal.tsx";

const fmt = (num: number) => new Intl.NumberFormat('fr-FR').format(num)


export function useIndicateurTabGrid(searchQuery: string) {
        const { data=[], isLoading } = indicateurServices.useGetAll()
        const { mutate: deleteMutation } = indicateurServices.useDelete()
        const [editingItem, setEditingItem] = useState<INDICATEUR_T | null>(null)

        const columnDefs = useMemo<ColDef[]>(() => {
        return [
          { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{ params.data.code? params.data.code: params.data.id }</Badge> },
          { field: 'libelle', headerName: 'Libellé', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.libelle}</span> },
          { field: 'unite', headerName: 'Unité', flex: 1, cellRenderer: (params: any) => params.data.unite  },
          // { field: 'type_valeur', headerName: 'Type de valeur', flex: 1, cellRenderer: (params: any) => params.data.type_valeur },
          { field: 'valeur_cible', headerName: 'Valeur cible', flex: 1, cellRenderer: (params: any) => params.data.valeur_cible?fmt(params.data.valeur_cible): '_' },
          {
                headerName: 'Actions',
                width: 120,
                minWidth: 120,
                sortable: false,
                filter: false,
                cellRenderer: ActionsCellRenderer,
                cellRendererParams: {
                    onEdit: (row: INDICATEUR_T) => setEditingItem(row),
                    onDelete: (id: number) => deleteMutation(id)
                },
            },
        ]
      }, [deleteMutation])




    const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const fuse = new Fuse(data, {
        keys: ['code', 'nom'],
        threshold: 0.3,
        ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery, data])

    const modalNode = (
        <IndicateurFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} editData={editingItem} />
    )

  return { columnDefs, data: filteredData, isLoading: isLoading, modalNode: modalNode }
}
