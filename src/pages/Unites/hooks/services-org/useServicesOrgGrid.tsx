import { serviceOrgServices } from '@/services/services-org.services'
import { directionServices } from '@/services/directions.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { ServiceOrgFormModal } from '../../components/ServiceOrgFormModal'
import type { SERVICE_ORG_T } from '@/types'

export function useServicesOrgGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = serviceOrgServices.useGetAll()
  const { data: directions = [] } = directionServices.useGetAll()
  const { mutate: deleteMutation } = serviceOrgServices.useDelete()
  const [editingItem, setEditingItem] = useState<SERVICE_ORG_T | null>(null)

  const directionLabel = useMemo(() => {
    const map = new Map(directions.map((d) => [d.id, d.nom]))
    return (id: number) => map.get(id) ?? '—'
  }, [directions])

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 110, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Service', flex: 1, cellRenderer: PrimaryTextCellRenderer },
    {
      field: 'direction_id', headerName: 'Direction', width: 220,
      valueFormatter: (p) => directionLabel(p.value),
      cellRenderer: (p: any) => <BadgeCellRenderer {...p} value={directionLabel(p.value)} />,
    },
    {
      headerName: 'Actions', width: 120, minWidth: 120, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: SERVICE_ORG_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation, directionLabel])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['nom', 'code'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <ServiceOrgFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
