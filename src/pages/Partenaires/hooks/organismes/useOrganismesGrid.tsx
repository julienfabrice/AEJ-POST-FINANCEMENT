import { organismeServices } from '@/services/organismes.services'
import { typeOrganismeServices } from '@/services/type-organismes.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { OrganismeFormModal } from '../../components/OrganismeFormModal'
import type { ORGANISME_FINANCEMENT_T } from '@/types'

export function useOrganismesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = organismeServices.useGetAll()
  const { data: types = [] } = typeOrganismeServices.useGetAll()
  const { mutate: deleteMutation } = organismeServices.useDelete()
  const [editingItem, setEditingItem] = useState<ORGANISME_FINANCEMENT_T | null>(null)

  const typeLabel = useMemo(() => {
    const map = new Map(types.map((t) => [t.id, t.libelle]))
    return (id: number) => map.get(id) ?? '—'
  }, [types])

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'sigle', headerName: 'Sigle', width: 130, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Partenaire', flex: 1, minWidth: 220, cellRenderer: PrimaryTextCellRenderer },
    {
      field: 'type', headerName: 'Type', width: 220,
      cellRenderer: (p: any) => <BadgeCellRenderer {...p} value={typeLabel(p.value)} />,
    },
    { field: 'telephone', headerName: 'Téléphone', width: 170, cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500">{p.value ?? '—'}</span> },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      headerName: 'Actions', width: 120, minWidth: 120, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: ORGANISME_FINANCEMENT_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation, typeLabel])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['nom', 'sigle'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <OrganismeFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
