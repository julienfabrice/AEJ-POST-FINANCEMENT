import { rolesServices, type ROLE_T } from '@/services/roles.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { RoleFormModal } from '../components/RoleFormModal'

export function useRolesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = rolesServices.useGetAll()
  const { mutate: deleteMutation } = rolesServices.useDelete()
  const [editingItem, setEditingItem] = useState<ROLE_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 160 },
    { field: 'libelle', headerName: 'Libellé', flex: 1, valueGetter: (p) => p.data?.libelle ?? p.data?.name },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: ROLE_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['code', 'libelle', 'name', 'description'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <RoleFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
