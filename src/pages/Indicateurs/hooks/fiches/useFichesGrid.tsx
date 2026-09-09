import {useMemo, useState} from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import {formulairesServices} from "@/services/indicateurs/formulaires.services.ts";
import type {FORMULAIRE_T} from "@/types";
import {FormulaireFormModal} from "@/pages/Indicateurs/components/FormulaireFormModal.tsx";

export function useFichesGrid(searchQuery: string) {
    const { data=[], isLoading } = formulairesServices.useGetAll()
    const { mutate: deleteMutation } = formulairesServices.useDelete()
    const [editingItem, setEditingItem] = useState<FORMULAIRE_T | null>(null)


  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
      { field: 'libelle', headerName: 'Libellé', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.libelle}</span> },
      { field: 'public_cible', headerName: 'Public Cible', flex: 1 },
      { field: 'actif', headerName: 'Actif', flex: 1, cellRenderer: (params: any) => (
        <Badge variant={params.data.actif ? 'default' : 'secondary'} className={params.data.actif ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
          {params.data.actif ? 'Oui' : 'Non'}
        </Badge>
      ) },
        {
            headerName: 'Actions',
            width: 120,
            minWidth: 120,
            sortable: false,
            filter: false,
            cellRenderer: ActionsCellRenderer,
            cellRendererParams: {
                onEdit: (row: FORMULAIRE_T) => setEditingItem(row),
                onDelete: (id: number) => deleteMutation(id)
            },
        }
    ]
  }, [deleteMutation])


  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const fuse = new Fuse(data, {
      keys: ['code', 'libelle', 'public_cible'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery, data])

    const modalNode = (
        <FormulaireFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} editData={editingItem} />
    )

  return { columnDefs, data: filteredData, isLoading: isLoading, modalNode: modalNode }
}
