import { typeOrganismeServices } from '@/services/type-organismes.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { TypeOrganismeFormModal } from '../../components/TypeOrganismeFormModal'
import type { TYPE_ORGANISME_T } from '@/types'

export function useTypeOrganismesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = typeOrganismeServices.useGetAll()
  const { mutate: deleteMutation } = typeOrganismeServices.useDelete()
  const [editingItem, setEditingItem] = useState<TYPE_ORGANISME_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 140, cellRenderer: BadgeCellRenderer },
    { field: 'libelle', headerName: 'Type de partenaire', flex: 1, cellRenderer: PrimaryTextCellRenderer },
    {
      headerName: 'Actions', width: 120, minWidth: 120, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: TYPE_ORGANISME_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['libelle', 'code'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <TypeOrganismeFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
